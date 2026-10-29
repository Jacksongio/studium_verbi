"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  ReactNode,
} from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

import { BIBLE_BOOKS, type BibleBook } from "../../lib/bible-books";
export { BIBLE_BOOKS, type BibleBook } from "../../lib/bible-books";

export interface BibleLocation {
  book: BibleBook;
  chapter: number;
}

interface BibleContextValue {
  location: BibleLocation | null;
  testament: "OT" | "NT";
  expandedBook: string | null;
  searchQuery: string;
  navigate: (loc: BibleLocation) => void;
  selectBook: (book: BibleBook) => void;
  selectChapter: (book: BibleBook, chapter: number) => void;
  setTestament: (t: "OT" | "NT") => void;
  setSearchQuery: (q: string) => void;
  prev: BibleLocation | null;
  next: BibleLocation | null;
}

const BibleContext = createContext<BibleContextValue>({
  location: null,
  testament: "OT",
  expandedBook: null,
  searchQuery: "",
  navigate: () => {},
  selectBook: () => {},
  selectChapter: () => {},
  setTestament: () => {},
  setSearchQuery: () => {},
  prev: null,
  next: null,
});

export const useBibleContext = () => useContext(BibleContext);

function getAdjacentLocation(
  current: BibleLocation,
  delta: -1 | 1
): BibleLocation | null {
  const bookIndex = BIBLE_BOOKS.indexOf(current.book);
  const nextChapter = current.chapter + delta;
  if (nextChapter >= 1 && nextChapter <= current.book.chapters) {
    return { book: current.book, chapter: nextChapter };
  }
  const nextBookIndex = bookIndex + delta;
  if (nextBookIndex < 0 || nextBookIndex >= BIBLE_BOOKS.length) return null;
  const nextBook = BIBLE_BOOKS[nextBookIndex];
  return {
    book: nextBook,
    chapter: delta === 1 ? 1 : nextBook.chapters,
  };
}

export function BibleProvider({ children }: { children: ReactNode }) {
  const [testament, setTestament] = useState<"OT" | "NT">("OT");
  const [location, setLocation] = useState<BibleLocation | null>(null);
  const [expandedBook, setExpandedBook] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const hasRestored = useRef(false);

  const prefsResult = useQuery(api.userPreferences.get);
  const savePosition = useMutation(api.userPreferences.setLastBiblePosition);

  // Restore last reading position
  useEffect(() => {
    if (hasRestored.current) return;
    if (prefsResult === undefined || prefsResult === null) return;
    const prefs = prefsResult.prefs;
    if (prefs?.lastBibleBook && prefs?.lastBibleChapter) {
      const book = BIBLE_BOOKS.find((b) => b.name === prefs.lastBibleBook);
      if (book) {
        setLocation({ book, chapter: prefs.lastBibleChapter });
        setExpandedBook(book.name);
        setTestament(book.testament);
        hasRestored.current = true;
        return;
      }
    }
    hasRestored.current = true;
  }, [prefsResult]);

  const prev = location ? getAdjacentLocation(location, -1) : null;
  const next = location ? getAdjacentLocation(location, 1) : null;

  const navigate = useCallback(
    (loc: BibleLocation) => {
      setLocation(loc);
      setExpandedBook(loc.book.name);
      if (loc.book.testament !== testament && !searchQuery) {
        setTestament(loc.book.testament);
      }
      savePosition({ book: loc.book.name, chapter: loc.chapter }).catch(
        () => {}
      );
    },
    [testament, searchQuery, savePosition]
  );

  const selectBook = useCallback(
    (book: BibleBook) => {
      setExpandedBook(expandedBook === book.name ? null : book.name);
    },
    [expandedBook]
  );

  const selectChapter = useCallback(
    (book: BibleBook, chapter: number) => {
      navigate({ book, chapter });
    },
    [navigate]
  );

  const contextValue = useMemo(
    () => ({
      location,
      testament,
      expandedBook,
      searchQuery,
      navigate,
      selectBook,
      selectChapter,
      setTestament,
      setSearchQuery,
      prev,
      next,
    }),
    [
      location,
      testament,
      expandedBook,
      searchQuery,
      navigate,
      selectBook,
      selectChapter,
      prev,
      next,
    ]
  );

  return (
    <BibleContext.Provider value={contextValue}>
      {children}
    </BibleContext.Provider>
  );
}
