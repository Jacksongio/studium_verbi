/**
 * Seed the Douay-Rheims Bible (Catholic canon, 73 books) into the Convex
 * bibleVerses table with OpenAI embeddings.
 *
 * Data source: bolls.life free Bible API (DRA translation)
 *
 * Usage:
 *   OPENAI_API_KEY=sk-... SEED_SECRET=xxx npx tsx scripts/seed-bible.ts
 *
 * Or set them in .env.local and run:
 *   npx tsx scripts/seed-bible.ts
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import * as dotenv from "dotenv";
import { resolve } from "path";

// Load .env.local
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SEED_SECRET = process.env.SEED_SECRET;
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!OPENAI_API_KEY) throw new Error("Missing OPENAI_API_KEY");
if (!SEED_SECRET) throw new Error("Missing SEED_SECRET");
if (!CONVEX_URL) throw new Error("Missing NEXT_PUBLIC_CONVEX_URL");

const convex = new ConvexHttpClient(CONVEX_URL);

// The 73-book Catholic canon in order, with bolls.life book IDs and chapter counts
const BOOKS: { id: number; name: string; chapters: number }[] = [
  // ── Pentateuch ──
  { id: 1, name: "Genesis", chapters: 50 },
  { id: 2, name: "Exodus", chapters: 40 },
  { id: 3, name: "Leviticus", chapters: 27 },
  { id: 4, name: "Numbers", chapters: 36 },
  { id: 5, name: "Deuteronomy", chapters: 34 },
  // ── Historical ──
  { id: 6, name: "Joshua", chapters: 24 },
  { id: 7, name: "Judges", chapters: 21 },
  { id: 8, name: "Ruth", chapters: 4 },
  { id: 9, name: "1 Samuel", chapters: 31 },
  { id: 10, name: "2 Samuel", chapters: 24 },
  { id: 11, name: "1 Kings", chapters: 22 },
  { id: 12, name: "2 Kings", chapters: 25 },
  { id: 13, name: "1 Chronicles", chapters: 29 },
  { id: 14, name: "2 Chronicles", chapters: 36 },
  { id: 15, name: "Ezra", chapters: 10 },
  { id: 16, name: "Nehemiah", chapters: 13 },
  { id: 17, name: "Tobit", chapters: 14 },
  { id: 18, name: "Judith", chapters: 16 },
  { id: 19, name: "Esther", chapters: 16 },
  { id: 20, name: "1 Maccabees", chapters: 16 },
  { id: 21, name: "2 Maccabees", chapters: 15 },
  // ── Wisdom ──
  { id: 22, name: "Job", chapters: 42 },
  { id: 23, name: "Psalms", chapters: 150 },
  { id: 24, name: "Proverbs", chapters: 31 },
  { id: 25, name: "Ecclesiastes", chapters: 12 },
  { id: 26, name: "Song of Solomon", chapters: 8 },
  { id: 27, name: "Wisdom", chapters: 19 },
  { id: 28, name: "Sirach", chapters: 51 },
  // ── Prophets ──
  { id: 29, name: "Isaiah", chapters: 66 },
  { id: 30, name: "Jeremiah", chapters: 52 },
  { id: 31, name: "Lamentations", chapters: 5 },
  { id: 32, name: "Baruch", chapters: 6 },
  { id: 33, name: "Ezekiel", chapters: 48 },
  { id: 34, name: "Daniel", chapters: 14 },
  { id: 35, name: "Hosea", chapters: 14 },
  { id: 36, name: "Joel", chapters: 3 },
  { id: 37, name: "Amos", chapters: 9 },
  { id: 38, name: "Obadiah", chapters: 1 },
  { id: 39, name: "Jonah", chapters: 4 },
  { id: 40, name: "Micah", chapters: 7 },
  { id: 41, name: "Nahum", chapters: 3 },
  { id: 42, name: "Habakkuk", chapters: 3 },
  { id: 43, name: "Zephaniah", chapters: 3 },
  { id: 44, name: "Haggai", chapters: 2 },
  { id: 45, name: "Zechariah", chapters: 14 },
  { id: 46, name: "Malachi", chapters: 4 },
  // ── New Testament ──
  { id: 47, name: "Matthew", chapters: 28 },
  { id: 48, name: "Mark", chapters: 16 },
  { id: 49, name: "Luke", chapters: 24 },
  { id: 50, name: "John", chapters: 21 },
  { id: 51, name: "Acts", chapters: 28 },
  { id: 52, name: "Romans", chapters: 16 },
  { id: 53, name: "1 Corinthians", chapters: 16 },
  { id: 54, name: "2 Corinthians", chapters: 13 },
  { id: 55, name: "Galatians", chapters: 6 },
  { id: 56, name: "Ephesians", chapters: 6 },
  { id: 57, name: "Philippians", chapters: 4 },
  { id: 58, name: "Colossians", chapters: 4 },
  { id: 59, name: "1 Thessalonians", chapters: 5 },
  { id: 60, name: "2 Thessalonians", chapters: 3 },
  { id: 61, name: "1 Timothy", chapters: 6 },
  { id: 62, name: "2 Timothy", chapters: 4 },
  { id: 63, name: "Titus", chapters: 3 },
  { id: 64, name: "Philemon", chapters: 1 },
  { id: 65, name: "Hebrews", chapters: 13 },
  { id: 66, name: "James", chapters: 5 },
  { id: 67, name: "1 Peter", chapters: 5 },
  { id: 68, name: "2 Peter", chapters: 3 },
  { id: 69, name: "1 John", chapters: 5 },
  { id: 70, name: "2 John", chapters: 1 },
  { id: 71, name: "3 John", chapters: 1 },
  { id: 72, name: "Jude", chapters: 1 },
  { id: 73, name: "Revelation", chapters: 22 },
];

interface RawVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

async function fetchChapter(
  bookId: number,
  chapter: number
): Promise<{ verse: number; text: string }[]> {
  const url = `https://bolls.life/get-chapter/DRA/${bookId}/${chapter}/`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch book ${bookId} ch ${chapter}: ${res.status}`);
  const data = await res.json();
  return data.map((v: any) => ({
    verse: v.verse,
    text: String(v.text).trim(),
  }));
}

async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "text-embedding-3-small",
      input: texts,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI embedding error: ${err}`);
  }

  const data = await res.json();
  return data.data
    .sort((a: any, b: any) => a.index - b.index)
    .map((d: any) => d.embedding);
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log("Starting Douay-Rheims (Catholic canon) seeding...\n");

  // Step 1: Download all books chapter by chapter
  const allVerses: RawVerse[] = [];

  for (const book of BOOKS) {
    process.stdout.write(`Downloading ${book.name}...`);
    let bookVerseCount = 0;

    for (let ch = 1; ch <= book.chapters; ch++) {
      try {
        const verses = await fetchChapter(book.id, ch);
        for (const v of verses) {
          if (v.text) {
            allVerses.push({
              book: book.name,
              chapter: ch,
              verse: v.verse,
              text: v.text,
            });
            bookVerseCount++;
          }
        }
      } catch (err: any) {
        console.log(` (error ch ${ch}: ${err.message})`);
      }
      // Rate limit: small delay between chapter fetches
      await sleep(100);
    }

    console.log(` done (${book.chapters} chapters, ${bookVerseCount} verses)`);
  }

  console.log(`\nTotal verses collected: ${allVerses.length}\n`);

  // Step 2: Generate embeddings in batches of 2000
  const EMBED_BATCH_SIZE = 2000;
  const allEmbeddings: number[][] = [];

  for (let i = 0; i < allVerses.length; i += EMBED_BATCH_SIZE) {
    const batch = allVerses.slice(i, i + EMBED_BATCH_SIZE);
    const texts = batch.map(
      (v) => `${v.book} ${v.chapter}:${v.verse} - ${v.text}`
    );

    const batchNum = Math.floor(i / EMBED_BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(allVerses.length / EMBED_BATCH_SIZE);
    process.stdout.write(
      `Embedding batch ${batchNum}/${totalBatches} (${batch.length} verses)...`
    );

    const embeddings = await generateEmbeddings(texts);
    allEmbeddings.push(...embeddings);
    console.log(" done");

    if (i + EMBED_BATCH_SIZE < allVerses.length) {
      await sleep(500);
    }
  }

  console.log(`\nGenerated ${allEmbeddings.length} embeddings\n`);

  // Step 3: Insert into Convex in batches of 50
  const INSERT_BATCH_SIZE = 50;
  let inserted = 0;

  for (let i = 0; i < allVerses.length; i += INSERT_BATCH_SIZE) {
    const batch = allVerses.slice(i, i + INSERT_BATCH_SIZE);
    const batchWithEmbeddings = batch.map((v, idx) => ({
      ...v,
      embedding: allEmbeddings[i + idx],
    }));

    try {
      await convex.action(api.seed.seedBatch, {
        secret: SEED_SECRET!,
        verses: batchWithEmbeddings,
      });
      inserted += batch.length;

      if (inserted % 500 === 0 || inserted === allVerses.length) {
        console.log(
          `Inserted ${inserted}/${allVerses.length} verses (${((inserted / allVerses.length) * 100).toFixed(1)}%)`
        );
      }
    } catch (err: any) {
      console.error(
        `\nError inserting batch at index ${i}: ${err.message}`
      );
      console.log("   Retrying in 2 seconds...");
      await sleep(2000);
      try {
        await convex.action(api.seed.seedBatch, {
          secret: SEED_SECRET!,
          verses: batchWithEmbeddings,
        });
        inserted += batch.length;
        console.log("   Retry succeeded");
      } catch (retryErr: any) {
        console.error(`   Retry failed: ${retryErr.message}`);
        console.error("   Skipping batch and continuing...");
      }
    }

    if (i + INSERT_BATCH_SIZE < allVerses.length) {
      await sleep(50);
    }
  }

  console.log(`\nSeeding complete! Inserted ${inserted} verses.`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
