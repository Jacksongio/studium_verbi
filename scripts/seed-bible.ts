/**
 * Seed the WEB (World English Bible) into the Convex bibleVerses table with OpenAI embeddings.
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

// The 66 books in canonical order — filenames in the TehShrike/world-english-bible repo
const BOOKS = [
  "genesis", "exodus", "leviticus", "numbers", "deuteronomy",
  "joshua", "judges", "ruth", "1samuel", "2samuel",
  "1kings", "2kings", "1chronicles", "2chronicles", "ezra",
  "nehemiah", "esther", "job", "psalms", "proverbs",
  "ecclesiastes", "songofsolomon", "isaiah", "jeremiah", "lamentations",
  "ezekiel", "daniel", "hosea", "joel", "amos",
  "obadiah", "jonah", "micah", "nahum", "habakkuk",
  "zephaniah", "haggai", "zechariah", "malachi",
  "matthew", "mark", "luke", "john", "acts",
  "romans", "1corinthians", "2corinthians", "galatians", "ephesians",
  "philippians", "colossians", "1thessalonians", "2thessalonians",
  "1timothy", "2timothy", "titus", "philemon", "hebrews",
  "james", "1peter", "2peter", "1john", "2john", "3john",
  "jude", "revelation",
];

// Map lowercase filenames to display names for DB storage
const DISPLAY_NAMES: Record<string, string> = {
  "genesis": "Genesis", "exodus": "Exodus", "leviticus": "Leviticus",
  "numbers": "Numbers", "deuteronomy": "Deuteronomy", "joshua": "Joshua",
  "judges": "Judges", "ruth": "Ruth",
  "1samuel": "1 Samuel", "2samuel": "2 Samuel",
  "1kings": "1 Kings", "2kings": "2 Kings",
  "1chronicles": "1 Chronicles", "2chronicles": "2 Chronicles",
  "ezra": "Ezra", "nehemiah": "Nehemiah", "esther": "Esther",
  "job": "Job", "psalms": "Psalms", "proverbs": "Proverbs",
  "ecclesiastes": "Ecclesiastes", "songofsolomon": "Song of Solomon",
  "isaiah": "Isaiah", "jeremiah": "Jeremiah", "lamentations": "Lamentations",
  "ezekiel": "Ezekiel", "daniel": "Daniel", "hosea": "Hosea",
  "joel": "Joel", "amos": "Amos", "obadiah": "Obadiah",
  "jonah": "Jonah", "micah": "Micah", "nahum": "Nahum",
  "habakkuk": "Habakkuk", "zephaniah": "Zephaniah", "haggai": "Haggai",
  "zechariah": "Zechariah", "malachi": "Malachi",
  "matthew": "Matthew", "mark": "Mark", "luke": "Luke", "john": "John",
  "acts": "Acts", "romans": "Romans",
  "1corinthians": "1 Corinthians", "2corinthians": "2 Corinthians",
  "galatians": "Galatians", "ephesians": "Ephesians",
  "philippians": "Philippians", "colossians": "Colossians",
  "1thessalonians": "1 Thessalonians", "2thessalonians": "2 Thessalonians",
  "1timothy": "1 Timothy", "2timothy": "2 Timothy",
  "titus": "Titus", "philemon": "Philemon", "hebrews": "Hebrews",
  "james": "James",
  "1peter": "1 Peter", "2peter": "2 Peter",
  "1john": "1 John", "2john": "2 John", "3john": "3 John",
  "jude": "Jude", "revelation": "Revelation",
};

interface RawVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

async function fetchBookJson(bookFileName: string): Promise<any> {
  const url = `https://raw.githubusercontent.com/TehShrike/world-english-bible/master/json/${bookFileName}.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${bookFileName}: ${res.status}`);
  return res.json();
}

/**
 * Parse the WEB JSON format into a flat list of verses.
 * The WEB repo stores each book as a flat array of items with types like
 * "paragraph text", "line text", etc. Poetry books (Psalms, Proverbs, etc.)
 * split a single verse across multiple "line text" entries, so we concatenate
 * entries that share the same chapter+verse number.
 */
function parseWebBook(items: any[], displayName: string): RawVerse[] {
  const verseMap = new Map<string, RawVerse>();

  for (const item of items) {
    if (!("verseNumber" in item) || !("value" in item)) continue;

    const ch = Number(item.chapterNumber);
    const vs = Number(item.verseNumber);
    const key = `${ch}:${vs}`;
    const text = String(item.value).trim();
    if (!text) continue;

    const existing = verseMap.get(key);
    if (existing) {
      existing.text += " " + text;
    } else {
      verseMap.set(key, { book: displayName, chapter: ch, verse: vs, text });
    }
  }

  // Return in canonical order
  return Array.from(verseMap.values()).sort(
    (a, b) => a.chapter - b.chapter || a.verse - b.verse
  );
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
  // Sort by index to ensure correct ordering
  return data.data
    .sort((a: any, b: any) => a.index - b.index)
    .map((d: any) => d.embedding);
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log("🔍 Starting WEB (World English Bible) seeding...\n");

  // Step 1: Download all books and collect verses
  const allVerses: RawVerse[] = [];

  for (const bookFile of BOOKS) {
    const displayName = DISPLAY_NAMES[bookFile] || bookFile;
    process.stdout.write(`📖 Downloading ${displayName}...`);

    try {
      const bookData = await fetchBookJson(bookFile);
      const verses = parseWebBook(bookData, displayName);
      allVerses.push(...verses);

      const chapterCount = new Set(verses.map((v) => v.chapter)).size;
      console.log(` ✓ (${chapterCount} chapters, ${verses.length} verses)`);
    } catch (err: any) {
      console.log(` ✗ ${err.message}`);
    }
  }

  console.log(`\n📊 Total verses collected: ${allVerses.length}\n`);

  // Step 2: Generate embeddings in batches of 2000
  // Using contextual enrichment (Approach #2): embed "Book Chapter:Verse - text"
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
      `🧠 Embedding batch ${batchNum}/${totalBatches} (${batch.length} verses)...`
    );

    const embeddings = await generateEmbeddings(texts);
    allEmbeddings.push(...embeddings);
    console.log(" ✓");

    // Rate limit buffer
    if (i + EMBED_BATCH_SIZE < allVerses.length) {
      await sleep(500);
    }
  }

  console.log(`\n✅ Generated ${allEmbeddings.length} embeddings\n`);

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
          `💾 Inserted ${inserted}/${allVerses.length} verses (${((inserted / allVerses.length) * 100).toFixed(1)}%)`
        );
      }
    } catch (err: any) {
      console.error(
        `\n❌ Error inserting batch at index ${i}: ${err.message}`
      );
      console.log("   Retrying in 2 seconds...");
      await sleep(2000);
      // Retry once
      try {
        await convex.action(api.seed.seedBatch, {
          secret: SEED_SECRET!,
          verses: batchWithEmbeddings,
        });
        inserted += batch.length;
        console.log("   ✓ Retry succeeded");
      } catch (retryErr: any) {
        console.error(`   ✗ Retry failed: ${retryErr.message}`);
        console.error("   Skipping batch and continuing...");
      }
    }

    // Small delay between inserts
    if (i + INSERT_BATCH_SIZE < allVerses.length) {
      await sleep(50);
    }
  }

  console.log(`\n🎉 Seeding complete! Inserted ${inserted} verses.`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
