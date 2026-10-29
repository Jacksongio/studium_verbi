/** Prepare (never directly import) a validated Douay–Rheims Bible replacement. */
import { createHash } from "node:crypto";
import { mkdir, open, readFile, writeFile, rename } from "node:fs/promises";
import { resolve } from "node:path";
import * as dotenv from "dotenv";
import { BIBLE_BOOKS } from "../src/app/lib/bible-books";

dotenv.config({ path: resolve(".env.local"), quiet: true });

interface Verse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}
interface EmbeddedVerse extends Verse { embedding: number[] }

const SOURCE_SHA256 = "96282bfa7c89a74680cea66fe873aafa5e7cd446407f0ff2531a723e19eee2c2";
const BATCH_SIZE = 256;
const MODEL = "text-embedding-3-small";
const cacheDirectory = resolve(".cache/bible");

function validEmbedding(value: unknown): value is number[] {
  return Array.isArray(value) && value.length === 1536 && value.every(Number.isFinite);
}

async function loadVerses(): Promise<Verse[]> {
  const source = await readFile(resolve("data/douay-rheims-1899.txt"));
  if (createHash("sha256").update(source).digest("hex") !== SOURCE_SHA256) {
    throw new Error("Bible source checksum mismatch; verify the source before importing.");
  }
  const books = new Map(BIBLE_BOOKS.map((book) => [book.sourceCode, book]));
  const seen = new Set<string>();
  const chapters = new Set<string>();
  const verses: Verse[] = [];
  for (const line of source.toString("utf8").replace(/^\uFEFF/, "").trim().split(/\r?\n/)) {
    const match = /^(\w+) (\d+):(\d+) (.+)$/.exec(line);
    if (!match) throw new Error(`Malformed source line: ${line.slice(0, 60)}`);
    const [, code, chapterRaw, verseRaw, text] = match;
    const book = books.get(code);
    const chapter = Number(chapterRaw);
    const verse = Number(verseRaw);
    if (!book || chapter < 1 || chapter > book.chapters || verse < 1 || !text.trim()) {
      throw new Error(`Invalid reference: ${code} ${chapter}:${verse}`);
    }
    const key = `${code}:${chapter}:${verse}`;
    if (seen.has(key)) throw new Error(`Duplicate reference: ${key}`);
    seen.add(key);
    chapters.add(`${code}:${chapter}`);
    verses.push({ book: book.name, chapter, verse, text });
  }
  for (const book of BIBLE_BOOKS) {
    for (let chapter = 1; chapter <= book.chapters; chapter++) {
      if (!chapters.has(`${book.sourceCode}:${chapter}`)) {
        throw new Error(`Missing chapter: ${book.name} ${chapter}`);
      }
    }
  }
  if (verses.length !== 35811 || books.size !== 73) throw new Error("Incomplete Catholic canon");
  console.log(`Validated ${verses.length} verses, ${chapters.size} chapters, 73 books, and source checksum.`);
  return verses;
}

async function embedBatch(batch: Verse[], index: number, apiKey: string): Promise<EmbeddedVerse[]> {
  const input = batch.map((v) => `${v.book} ${v.chapter}:${v.verse} - ${v.text}`);
  const digest = createHash("sha256").update(JSON.stringify({ model: MODEL, input })).digest("hex");
  const cachePath = resolve(cacheDirectory, `${digest}.json`);
  try {
    const cached: unknown = JSON.parse(await readFile(cachePath, "utf8"));
    if (Array.isArray(cached) && cached.length === batch.length && cached.every(validEmbedding)) {
      return batch.map((verse, i) => ({ ...verse, embedding: cached[i] }));
    }
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    // A missing or interrupted cache entry can be regenerated safely.
  }
  if (!apiKey) throw new Error("Set OPENAI_API_KEY to generate uncached search embeddings.");
  for (let attempt = 0; attempt < 6; attempt++) {
    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: MODEL, input }),
      signal: AbortSignal.timeout(120_000),
    });
    if (!response.ok) {
      if ((response.status === 429 || response.status >= 500) && attempt < 5) {
        await new Promise((done) => setTimeout(done, Math.min(2000 * 2 ** attempt, 30000)));
        continue;
      }
      throw new Error(`Embedding batch ${index + 1} failed (HTTP ${response.status}). No import performed.`);
    }
    const data = await response.json() as { data: { index: number; embedding: number[] }[] };
    const ordered = [...data.data].sort((a, b) => a.index - b.index);
    if (ordered.length !== batch.length || ordered.some((row, i) => row.index !== i || !validEmbedding(row.embedding))) {
      throw new Error(`Invalid embedding response for batch ${index + 1}`);
    }
    const embeddings = ordered.map((row) => row.embedding);
    await writeFile(`${cachePath}.tmp`, JSON.stringify(embeddings));
    await rename(`${cachePath}.tmp`, cachePath);
    console.log(`Prepared embedding batch ${index + 1}`);
    return batch.map((verse, i) => ({ ...verse, embedding: embeddings[i] }));
  }
  throw new Error("Embedding retries exhausted");
}

async function main() {
  const verses = await loadVerses();
  if (process.argv.includes("--validate-only")) return;
  const apiKey = process.env.OPENAI_API_KEY ?? "";
  await mkdir(cacheDirectory, { recursive: true });
  const batches = Array.from({ length: Math.ceil(verses.length / BATCH_SIZE) }, (_, i) =>
    verses.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE));
  const results: EmbeddedVerse[][] = new Array(batches.length);
  let nextBatch = 0;
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (nextBatch < batches.length) {
      const index = nextBatch++;
      results[index] = await embedBatch(batches[index], index, apiKey);
    }
  }));
  const outputPath = resolve(cacheDirectory, "douay-rheims.jsonl");
  // Publish the import file only after every batch succeeded. Never skip failed batches.
  const output = await open(`${outputPath}.tmp`, "w");
  try {
    for (const batch of results) {
      await output.writeFile(batch.map((v) => JSON.stringify(v)).join("\n") + "\n");
    }
    await output.sync();
  } finally {
    await output.close();
  }
  await rename(`${outputPath}.tmp`, outputPath);
  console.log(`Complete import ready: ${outputPath}`);
  console.log("Back up the target deployment, then replace only its Bible table:");
  console.log("npx convex import --table bibleVerses --replace .cache/bible/douay-rheims.jsonl");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Bible preparation failed");
  process.exitCode = 1;
});
