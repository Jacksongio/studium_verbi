"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { BookOpen, ChevronLeft, ChevronRight, NotebookPen } from "lucide-react";
import { useBibleContext } from "../components/BibleContext";
import styles from "./bible.module.css";

export default function BiblePage() {
  const { location, navigate, prev, next } = useBibleContext();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [notebookOpen, setNotebookOpen] = useState(false);
  const [localDraft, setLocalDraft] = useState<{
    key: string;
    content: string;
  } | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const verses = useQuery(
    api.bibleVerses.getChapterVerses,
    location ? { book: location.book.name, chapter: location.chapter } : "skip"
  );

  const savedVerses = useQuery(api.savedVerses.list) ?? [];
  const saveVerse = useMutation(api.savedVerses.save);
  const removeVerse = useMutation(api.savedVerses.remove);

  const note = useQuery(
    api.bibleNotes.get,
    location ? { book: location.book.name, chapter: location.chapter } : "skip"
  );
  const saveNote = useMutation(api.bibleNotes.save);

  const locationKey = location
    ? `${location.book.name}:${location.chapter}`
    : "";

  // Use local draft while user is typing for the current chapter;
  // fall back to the DB value otherwise.
  const draft =
    localDraft && localDraft.key === locationKey
      ? localDraft.content
      : (note?.content ?? "");

  // Auto-save with debounce
  const scheduleSave = useCallback(
    (content: string) => {
      if (!location) return;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        saveNote({
          book: location.book.name,
          chapter: location.chapter,
          content,
        }).catch(() => {});
      }, 800);
    },
    [location, saveNote]
  );

  const handleNoteChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;
      setLocalDraft({ key: locationKey, content: val });
      scheduleSave(val);
    },
    [locationKey, scheduleSave]
  );

  // Flush pending save on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  // Build a set of saved verse keys for fast lookup
  const savedSet = new Set(
    savedVerses.map((sv) => `${sv.book}:${sv.chapter}:${sv.verse}`)
  );

  const toggleVerse = useCallback(
    (book: string, chapter: number, verse: number, text: string) => {
      const key = `${book}:${chapter}:${verse}`;
      if (savedSet.has(key)) {
        removeVerse({ book, chapter, verse }).catch(() => {});
      } else {
        saveVerse({ book, chapter, verse, text }).catch(() => {});
      }
    },
    [savedSet, saveVerse, removeVerse]
  );

  // Scroll reading pane to top when location changes
  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [location?.book.name, location?.chapter]);

  return (
    <main className={styles.readingPane}>
      {location ? (
        <>
          <div className={styles.readingHeader}>
            <h1 className={styles.readingRef}>
              {location.book.name} {location.chapter}
            </h1>
            <div className={styles.headerActions}>
              <button
                className={`${styles.notebookToggle} ${notebookOpen ? styles.notebookToggleActive : ""}`}
                onClick={() => setNotebookOpen(!notebookOpen)}
                aria-label={notebookOpen ? "Close notebook" : "Open notebook"}
                title={notebookOpen ? "Close notebook" : "Open notebook"}
              >
                <NotebookPen size={16} />
              </button>
              <div className={styles.chapterNav}>
                <button
                  className={styles.chapterNavBtn}
                  onClick={() => prev && navigate(prev)}
                  disabled={!prev}
                  aria-label="Previous chapter"
                  title={
                    prev
                      ? `${prev.book.name} ${prev.chapter}`
                      : "Beginning of Bible"
                  }
                >
                  <ChevronLeft size={16} />
                </button>
                <span className={styles.chapterNavLabel}>
                  {location.chapter} / {location.book.chapters}
                </span>
                <button
                  className={styles.chapterNavBtn}
                  onClick={() => next && navigate(next)}
                  disabled={!next}
                  aria-label="Next chapter"
                  title={
                    next
                      ? `${next.book.name} ${next.chapter}`
                      : "End of Bible"
                  }
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
          <div className={styles.readingBody}>
          <div className={styles.readingScroll} ref={scrollRef}>
            {verses === undefined ? (
              <p className={styles.loadingText}>Loading...</p>
            ) : verses.length === 0 ? (
              <p className={styles.loadingText}>
                No verses found for this chapter.
              </p>
            ) : (
              <div className={styles.readingContent}>
                <p className={styles.verseText}>
                  {verses.map((v) => {
                    const isSaved = savedSet.has(
                      `${location.book.name}:${location.chapter}:${v.verse}`
                    );
                    return (
                      <span
                        key={v.verse}
                        className={`${styles.verseBlock} ${isSaved ? styles.verseSaved : ""}`}
                      >
                        <sup
                          className={`${styles.verseNumber} ${isSaved ? styles.verseNumberSaved : ""}`}
                          onClick={() =>
                            toggleVerse(
                              location.book.name,
                              location.chapter,
                              v.verse,
                              v.text
                            )
                          }
                          title={
                            isSaved
                              ? "Remove bookmark"
                              : "Bookmark this verse"
                          }
                        >
                          {v.verse}
                        </sup>
                        {v.text}{" "}
                      </span>
                    );
                  })}
                </p>

                {/* Bottom page navigation */}
                <div className={styles.pageNav}>
                  {prev && (
                    <button
                      className={styles.pageNavBtn}
                      onClick={() => navigate(prev)}
                    >
                      <ChevronLeft size={14} />
                      <span className={styles.pageNavText}>
                        {prev.book.name} {prev.chapter}
                      </span>
                    </button>
                  )}
                  <div className={styles.pageNavSpacer} />
                  {next && (
                    <button
                      className={styles.pageNavBtn}
                      onClick={() => navigate(next)}
                    >
                      <span className={styles.pageNavText}>
                        {next.book.name} {next.chapter}
                      </span>
                      <ChevronRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
          {notebookOpen && (
            <aside className={styles.notebookPanel}>
              <div className={styles.notebookHeader}>
                <h3 className={styles.notebookTitle}>Notes</h3>
                <span className={styles.notebookRef}>
                  {location.book.name} {location.chapter}
                </span>
              </div>
              <div className={styles.notebookBody}>
                <div className={styles.notebookMarginLine} />
                <textarea
                  className={styles.notebookTextarea}
                  value={draft}
                  onChange={handleNoteChange}
                  placeholder="Write your notes for this chapter..."
                  spellCheck
                />
              </div>
            </aside>
          )}
          </div>
        </>
      ) : (
        <div className={styles.emptyReading}>
          <BookOpen size={40} className={styles.emptyIcon} />
          <h2 className={styles.emptyTitle}>Bible Reader</h2>
          <p className={styles.emptySubtitle}>
            Select a book and chapter from the sidebar to begin reading.
          </p>
        </div>
      )}
    </main>
  );
}
