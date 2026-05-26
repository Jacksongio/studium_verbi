"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { useBibleContext, BIBLE_BOOKS } from "../components/BibleContext";
import {
  Bookmark,
  BookOpen,
  Trash2,
  StickyNote,
  Check,
  X,
} from "lucide-react";
import type { Id } from "../../../../convex/_generated/dataModel";
import styles from "./saved.module.css";

export default function SavedVersesPage() {
  const router = useRouter();
  const bible = useBibleContext();
  const savedVerses = useQuery(api.savedVerses.list) ?? [];
  const removeVerse = useMutation(api.savedVerses.removeById);
  const updateNote = useMutation(api.savedVerses.updateNote);
  const [editingId, setEditingId] = useState<Id<"savedVerses"> | null>(null);
  const [noteText, setNoteText] = useState("");
  const [filterBook, setFilterBook] = useState<string>("all");

  // Get unique books from saved verses for filtering
  const savedBooks = [...new Set(savedVerses.map((sv) => sv.book))];

  const filtered =
    filterBook === "all"
      ? savedVerses
      : savedVerses.filter((sv) => sv.book === filterBook);

  // Group by book
  const grouped = filtered.reduce(
    (acc, sv) => {
      if (!acc[sv.book]) acc[sv.book] = [];
      acc[sv.book].push(sv);
      return acc;
    },
    {} as Record<string, typeof filtered>
  );

  // Sort verses within each group
  for (const book of Object.keys(grouped)) {
    grouped[book].sort((a, b) =>
      a.chapter !== b.chapter ? a.chapter - b.chapter : a.verse - b.verse
    );
  }

  function startEditing(id: Id<"savedVerses">, currentNote: string) {
    setEditingId(id);
    setNoteText(currentNote);
  }

  function saveNote() {
    if (editingId) {
      updateNote({ id: editingId, note: noteText }).catch(() => {});
      setEditingId(null);
      setNoteText("");
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setNoteText("");
  }

  function navigateToVerse(book: string, chapter: number) {
    const bookData = BIBLE_BOOKS.find((b) => b.name === book);
    if (bookData) {
      bible.navigate({ book: bookData, chapter });
      router.push("/bible");
    }
  }

  return (
    <section className={styles.container}>
      <div className={styles.scrollArea}>
        <div className={styles.content}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerIcon}>
              <Bookmark size={24} />
            </div>
            <h1 className={styles.title}>Saved Verses</h1>
            <p className={styles.subtitle}>
              Your bookmarked scripture passages and personal notes.
            </p>
          </div>

          {savedVerses.length === 0 ? (
            <div className={styles.emptyState}>
              <BookOpen size={36} className={styles.emptyIcon} />
              <h3 className={styles.emptyTitle}>No saved verses yet</h3>
              <p className={styles.emptyText}>
                Open the Bible reader and click any verse number to bookmark it.
                Saved verses will appear here for study and reflection.
              </p>
            </div>
          ) : (
            <>
              {/* Filter bar */}
              {savedBooks.length > 1 && (
                <div className={styles.filterBar}>
                  <button
                    className={`${styles.filterChip} ${filterBook === "all" ? styles.filterChipActive : ""}`}
                    onClick={() => setFilterBook("all")}
                  >
                    All ({savedVerses.length})
                  </button>
                  {savedBooks.map((book) => (
                    <button
                      key={book}
                      className={`${styles.filterChip} ${filterBook === book ? styles.filterChipActive : ""}`}
                      onClick={() => setFilterBook(book)}
                    >
                      {book}
                    </button>
                  ))}
                </div>
              )}

              {/* Verse groups */}
              {Object.entries(grouped).map(([book, verses]) => (
                <div key={book} className={styles.bookGroup}>
                  <h2 className={styles.bookGroupTitle}>{book}</h2>
                  <div className={styles.verseList}>
                    {verses.map((sv) => (
                      <div key={sv._id} className={styles.verseCard}>
                        <div className={styles.verseCardHeader}>
                          <button
                            className={styles.verseRef}
                            onClick={() =>
                              navigateToVerse(sv.book, sv.chapter)
                            }
                            title="Open in Bible reader"
                          >
                            {sv.book} {sv.chapter}:{sv.verse}
                          </button>
                          <div className={styles.verseActions}>
                            <button
                              className={styles.actionBtn}
                              onClick={() =>
                                startEditing(sv._id, sv.note ?? "")
                              }
                              title="Add/edit note"
                            >
                              <StickyNote size={13} />
                            </button>
                            <button
                              className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                              onClick={() =>
                                removeVerse({ id: sv._id }).catch(() => {})
                              }
                              title="Remove bookmark"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        <p className={styles.verseQuote}>
                          &ldquo;{sv.text}&rdquo;
                        </p>

                        {/* Note display / edit */}
                        {editingId === sv._id ? (
                          <div className={styles.noteEditor}>
                            <textarea
                              className={styles.noteTextarea}
                              value={noteText}
                              onChange={(e) => setNoteText(e.target.value)}
                              placeholder="Write your thoughts on this verse..."
                              rows={3}
                              autoFocus
                            />
                            <div className={styles.noteEditorActions}>
                              <button
                                className={styles.noteSaveBtn}
                                onClick={saveNote}
                              >
                                <Check size={12} />
                                Save
                              </button>
                              <button
                                className={styles.noteCancelBtn}
                                onClick={cancelEdit}
                              >
                                <X size={12} />
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : sv.note ? (
                          <div
                            className={styles.noteDisplay}
                            onClick={() =>
                              startEditing(sv._id, sv.note ?? "")
                            }
                          >
                            <StickyNote
                              size={11}
                              className={styles.noteIcon}
                            />
                            <p className={styles.noteText}>{sv.note}</p>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Stats footer */}
              <div className={styles.stats}>
                {savedVerses.length} verse{savedVerses.length !== 1 ? "s" : ""}{" "}
                saved across {savedBooks.length} book
                {savedBooks.length !== 1 ? "s" : ""}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
