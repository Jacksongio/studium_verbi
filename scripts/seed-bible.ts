/**
 * Seed the KJV Bible into the Convex bibleVerses table with OpenAI embeddings.
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

// The 66 books of the KJV in canonical order
const BOOKS = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
  "Joshua", "Judges", "Ruth", "1Samuel", "2Samuel",
  "1Kings", "2Kings", "1Chronicles", "2Chronicles", "Ezra",
  "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
  "Ecclesiastes", "SongofSolomon", "Isaiah", "Jeremiah", "Lamentations",
  "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
  "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk",
  "Zephaniah", "Haggai", "Zechariah", "Malachi",
  "Matthew", "Mark", "Luke", "John", "Acts",
  "Romans", "1Corinthians", "2Corinthians", "Galatians", "Ephesians",
  "Philippians", "Colossians", "1Thessalonians", "2Thessalonians",
  "1Timothy", "2Timothy", "Titus", "Philemon", "Hebrews",
  "James", "1Peter", "2Peter", "1John", "2John", "3John",
  "Jude", "Revelation",
];

// Friendly display names for books (for the embedding context and DB storage)
const DISPLAY_NAMES: Record<string, string> = {
  "1Samuel": "1 Samuel", "2Samuel": "2 Samuel",
  "1Kings": "1 Kings", "2Kings": "2 Kings",
  "1Chronicles": "1 Chronicles", "2Chronicles": "2 Chronicles",
  "SongofSolomon": "Song of Solomon",
  "1Corinthians": "1 Corinthians", "2Corinthians": "2 Corinthians",
  "1Thessalonians": "1 Thessalonians", "2Thessalonians": "2 Thessalonians",
  "1Timothy": "1 Timothy", "2Timothy": "2 Timothy",
  "1Peter": "1 Peter", "2Peter": "2 Peter",
  "1John": "1 John", "2John": "2 John", "3John": "3 John",
};

interface RawVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

async function fetchBookJson(bookFileName: string): Promise<any> {
  const url = `https://raw.githubusercontent.com/aruljohn/Bible-kjv/master/${bookFileName}.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${bookFileName}: ${res.status}`);
  return res.json();
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
  console.log("🔍 Starting KJV Bible seeding...\n");

  // Step 1: Download all books and collect verses
  const allVerses: RawVerse[] = [];

  for (const bookFile of BOOKS) {
    const displayName = DISPLAY_NAMES[bookFile] || bookFile;
    process.stdout.write(`📖 Downloading ${displayName}...`);

    try {
      const bookData = await fetchBookJson(bookFile);
      const chapters: any[] = bookData.chapters;

      for (const ch of chapters) {
        for (const v of ch.verses) {
          allVerses.push({
            book: displayName,
            chapter: Number(ch.chapter),
            verse: Number(v.verse),
            text: String(v.text),
          });
        }
      }

      console.log(` ✓ (${chapters.length} chapters)`);
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
