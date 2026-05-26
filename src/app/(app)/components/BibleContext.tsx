"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export interface BibleBook {
  name: string;
  chapters: number;
  testament: "OT" | "NT";
}

export const BIBLE_BOOKS: BibleBook[] = [
  { name: "Genesis", chapters: 50, testament: "OT" },
  { name: "Exodus", chapters: 40, testament: "OT" },
  { name: "Leviticus", chapters: 27, testament: "OT" },
  { name: "Numbers", chapters: 36, testament: "OT" },
  { name: "Deuteronomy", chapters: 34, testament: "OT" },
  { name: "Joshua", chapters: 24, testament: "OT" },
  { name: "Judges", chapters: 21, testament: "OT" },
  { name: "Ruth", chapters: 4, testament: "OT" },
  { name: "1 Samuel", chapters: 31, testament: "OT" },
  { name: "2 Samuel", chapters: 24, testament: "OT" },
  { name: "1 Kings", chapters: 22, testament: "OT" },
  { name: "2 Kings", chapters: 25, testament: "OT" },
  { name: "1 Chronicles", chapters: 29, testament: "OT" },
  { name: "2 Chronicles", chapters: 36, testament: "OT" },
  { name: "Ezra", chapters: 10, testament: "OT" },
  { name: "Nehemiah", chapters: 13, testament: "OT" },
  { name: "Esther", chapters: 10, testament: "OT" },
  { name: "Job", chapters: 42, testament: "OT" },
  { name: "Psalms", chapters: 150, testament: "OT" },
  { name: "Proverbs", chapters: 31, testament: "OT" },
  { name: "Ecclesiastes", chapters: 12, testament: "OT" },
  { name: "Song of Solomon", chapters: 8, testament: "OT" },
  { name: "Isaiah", chapters: 66, testament: "OT" },
  { name: "Jeremiah", chapters: 52, testament: "OT" },
  { name: "Lamentations", chapters: 5, testament: "OT" },
  { name: "Ezekiel", chapters: 48, testament: "OT" },
  { name: "Daniel", chapters: 12, testament: "OT" },
  { name: "Hosea", chapters: 14, testament: "OT" },
  { name: "Joel", chapters: 3, testament: "OT" },
  { name: "Amos", chapters: 9, testament: "OT" },
  { name: "Obadiah", chapters: 1, testament: "OT" },
  { name: "Jonah", chapters: 4, testament: "OT" },
  { name: "Micah", chapters: 7, testament: "OT" },
  { name: "Nahum", chapters: 3, testament: "OT" },
  { name: "Habakkuk", chapters: 3, testament: "OT" },
  { name: "Zephaniah", chapters: 3, testament: "OT" },
  { name: "Haggai", chapters: 2, testament: "OT" },
  { name: "Zechariah", chapters: 14, testament: "OT" },
  { name: "Malachi", chapters: 4, testament: "OT" },
  { name: "Matthew", chapters: 28, testament: "NT" },
  { name: "Mark", chapters: 16, testament: "NT" },
  { name: "Luke", chapters: 24, testament: "NT" },
  { name: "John", chapters: 21, testament: "NT" },
  { name: "Acts", chapters: 28, testament: "NT" },
  { name: "Romans", chapters: 16, testament: "NT" },
  { name: "1 Corinthians", chapters: 16, testament: "NT" },
  { name: "2 Corinthians", chapters: 13, testament: "NT" },
  { name: "Galatians", chapters: 6, testament: "NT" },
  { name: "Ephesians", chapters: 6, testament: "NT" },
  { name: "Philippians", chapters: 4, testament: "NT" },
  { name: "Colossians", chapters: 4, testament: "NT" },
  { name: "1 Thessalonians", chapters: 5, testament: "NT" },
  { name: "2 Thessalonians", chapters: 3, testament: "NT" },
  { name: "1 Timothy", chapters: 6, testament: "NT" },
  { name: "2 Timothy", chapters: 4, testament: "NT" },
  { name: "Titus", chapters: 3, testament: "NT" },
  { name: "Philemon", chapters: 1, testament: "NT" },
  { name: "Hebrews", chapters: 13, testament: "NT" },
  { name: "James", chapters: 5, testament: "NT" },
  { name: "1 Peter", chapters: 5, testament: "NT" },
  { name: "2 Peter", chapters: 3, testament: "NT" },
  { name: "1 John", chapters: 5, testament: "NT" },
  { name: "2 John", chapters: 1, testament: "NT" },
  { name: "3 John", chapters: 1, testament: "NT" },
  { name: "Jude", chapters: 1, testament: "NT" },
  { name: "Revelation", chapters: 22, testament: "NT" },
];

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

  return (
    <BibleContext.Provider
      value={{
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
      }}
    >
      {children}
    </BibleContext.Provider>
  );
}
