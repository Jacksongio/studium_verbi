// Douay–Rheims 1899 chapter counts. Modern book names remain stable application keys.
export const BIBLE_TRANSLATION = "Douay–Rheims";
export const BIBLE_EDITION = "Douay–Rheims, Challoner revision, 1899 American Edition";
export const BIBLE_SOURCE_URL = "https://ebible.org/engDRA/";

export interface BibleBook {
  name: string;
  sourceCode: string;
  chapters: number;
  testament: "OT" | "NT";
}

export const BIBLE_BOOKS: BibleBook[] = [
  // ── Pentateuch ──
  { name: "Genesis", sourceCode: "GEN", chapters: 50, testament: "OT" },
  { name: "Exodus", sourceCode: "EXO", chapters: 40, testament: "OT" },
  { name: "Leviticus", sourceCode: "LEV", chapters: 27, testament: "OT" },
  { name: "Numbers", sourceCode: "NUM", chapters: 36, testament: "OT" },
  { name: "Deuteronomy", sourceCode: "DEU", chapters: 34, testament: "OT" },
  // ── Historical ──
  { name: "Joshua", sourceCode: "JOS", chapters: 24, testament: "OT" },
  { name: "Judges", sourceCode: "JDG", chapters: 21, testament: "OT" },
  { name: "Ruth", sourceCode: "RUT", chapters: 4, testament: "OT" },
  { name: "1 Samuel", sourceCode: "1SA", chapters: 31, testament: "OT" },
  { name: "2 Samuel", sourceCode: "2SA", chapters: 24, testament: "OT" },
  { name: "1 Kings", sourceCode: "1KI", chapters: 22, testament: "OT" },
  { name: "2 Kings", sourceCode: "2KI", chapters: 25, testament: "OT" },
  { name: "1 Chronicles", sourceCode: "1CH", chapters: 29, testament: "OT" },
  { name: "2 Chronicles", sourceCode: "2CH", chapters: 36, testament: "OT" },
  { name: "Ezra", sourceCode: "EZR", chapters: 10, testament: "OT" },
  { name: "Nehemiah", sourceCode: "NEH", chapters: 13, testament: "OT" },
  { name: "Tobit", sourceCode: "TOB", chapters: 14, testament: "OT" },
  { name: "Judith", sourceCode: "JDT", chapters: 16, testament: "OT" },
  { name: "Esther", sourceCode: "EST", chapters: 16, testament: "OT" },
  { name: "1 Maccabees", sourceCode: "1MA", chapters: 16, testament: "OT" },
  { name: "2 Maccabees", sourceCode: "2MA", chapters: 15, testament: "OT" },
  // ── Wisdom ──
  { name: "Job", sourceCode: "JOB", chapters: 42, testament: "OT" },
  { name: "Psalms", sourceCode: "PSA", chapters: 150, testament: "OT" },
  { name: "Proverbs", sourceCode: "PRO", chapters: 31, testament: "OT" },
  { name: "Ecclesiastes", sourceCode: "ECC", chapters: 12, testament: "OT" },
  { name: "Song of Solomon", sourceCode: "SOL", chapters: 8, testament: "OT" },
  { name: "Wisdom", sourceCode: "WIS", chapters: 19, testament: "OT" },
  { name: "Sirach", sourceCode: "SIR", chapters: 51, testament: "OT" },
  // ── Prophets ──
  { name: "Isaiah", sourceCode: "ISA", chapters: 66, testament: "OT" },
  { name: "Jeremiah", sourceCode: "JER", chapters: 52, testament: "OT" },
  { name: "Lamentations", sourceCode: "LAM", chapters: 5, testament: "OT" },
  { name: "Baruch", sourceCode: "BAR", chapters: 6, testament: "OT" },
  { name: "Ezekiel", sourceCode: "EZE", chapters: 48, testament: "OT" },
  { name: "Daniel", sourceCode: "DAN", chapters: 14, testament: "OT" },
  { name: "Hosea", sourceCode: "HOS", chapters: 14, testament: "OT" },
  { name: "Joel", sourceCode: "JOE", chapters: 3, testament: "OT" },
  { name: "Amos", sourceCode: "AMO", chapters: 9, testament: "OT" },
  { name: "Obadiah", sourceCode: "OBA", chapters: 1, testament: "OT" },
  { name: "Jonah", sourceCode: "JON", chapters: 4, testament: "OT" },
  { name: "Micah", sourceCode: "MIC", chapters: 7, testament: "OT" },
  { name: "Nahum", sourceCode: "NAH", chapters: 3, testament: "OT" },
  { name: "Habakkuk", sourceCode: "HAB", chapters: 3, testament: "OT" },
  { name: "Zephaniah", sourceCode: "ZEP", chapters: 3, testament: "OT" },
  { name: "Haggai", sourceCode: "HAG", chapters: 2, testament: "OT" },
  { name: "Zechariah", sourceCode: "ZEC", chapters: 14, testament: "OT" },
  { name: "Malachi", sourceCode: "MAL", chapters: 4, testament: "OT" },
  // ── New Testament ──
  { name: "Matthew", sourceCode: "MAT", chapters: 28, testament: "NT" },
  { name: "Mark", sourceCode: "MAR", chapters: 16, testament: "NT" },
  { name: "Luke", sourceCode: "LUK", chapters: 24, testament: "NT" },
  { name: "John", sourceCode: "JOH", chapters: 21, testament: "NT" },
  { name: "Acts", sourceCode: "ACT", chapters: 28, testament: "NT" },
  { name: "Romans", sourceCode: "ROM", chapters: 16, testament: "NT" },
  { name: "1 Corinthians", sourceCode: "1CO", chapters: 16, testament: "NT" },
  { name: "2 Corinthians", sourceCode: "2CO", chapters: 13, testament: "NT" },
  { name: "Galatians", sourceCode: "GAL", chapters: 6, testament: "NT" },
  { name: "Ephesians", sourceCode: "EPH", chapters: 6, testament: "NT" },
  { name: "Philippians", sourceCode: "PHI", chapters: 4, testament: "NT" },
  { name: "Colossians", sourceCode: "COL", chapters: 4, testament: "NT" },
  { name: "1 Thessalonians", sourceCode: "1TH", chapters: 5, testament: "NT" },
  { name: "2 Thessalonians", sourceCode: "2TH", chapters: 3, testament: "NT" },
  { name: "1 Timothy", sourceCode: "1TI", chapters: 6, testament: "NT" },
  { name: "2 Timothy", sourceCode: "2TI", chapters: 4, testament: "NT" },
  { name: "Titus", sourceCode: "TIT", chapters: 3, testament: "NT" },
  { name: "Philemon", sourceCode: "PHM", chapters: 1, testament: "NT" },
  { name: "Hebrews", sourceCode: "HEB", chapters: 13, testament: "NT" },
  { name: "James", sourceCode: "JAM", chapters: 5, testament: "NT" },
  { name: "1 Peter", sourceCode: "1PE", chapters: 5, testament: "NT" },
  { name: "2 Peter", sourceCode: "2PE", chapters: 3, testament: "NT" },
  { name: "1 John", sourceCode: "1JO", chapters: 5, testament: "NT" },
  { name: "2 John", sourceCode: "2JO", chapters: 1, testament: "NT" },
  { name: "3 John", sourceCode: "3JO", chapters: 1, testament: "NT" },
  { name: "Jude", sourceCode: "JUD", chapters: 1, testament: "NT" },
  { name: "Revelation", sourceCode: "REV", chapters: 22, testament: "NT" },
];

