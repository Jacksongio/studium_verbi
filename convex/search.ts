import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

// ── Utility: cosine similarity between two vectors ──
function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// ── Utility: Maximal Marginal Relevance ──
// Selects `count` items that balance relevance to query AND diversity among selections.
// Lambda controls tradeoff: 1.0 = pure relevance, 0.0 = pure diversity.
function mmrSelect(
  candidates: { id: string; score: number; embedding: number[] }[],
  queryEmbedding: number[],
  count: number,
  lambda: number = 0.5
): string[] {
  const selected: string[] = [];
  const remaining = new Map(candidates.map((c) => [c.id, c]));

  for (let i = 0; i < count && remaining.size > 0; i++) {
    let bestId = "";
    let bestMmrScore = -Infinity;

    for (const [id, candidate] of remaining) {
      // Relevance: similarity to query (approximated by RRF score, normalized)
      const relevance = candidate.score;

      // Redundancy: max similarity to any already-selected item
      let maxSimilarity = 0;
      for (const selectedId of selected) {
        const selectedCandidate = candidates.find((c) => c.id === selectedId);
        if (selectedCandidate) {
          const sim = cosineSimilarity(
            candidate.embedding,
            selectedCandidate.embedding
          );
          maxSimilarity = Math.max(maxSimilarity, sim);
        }
      }

      const mmrScore = lambda * relevance - (1 - lambda) * maxSimilarity;

      if (mmrScore > bestMmrScore) {
        bestMmrScore = mmrScore;
        bestId = id;
      }
    }

    if (bestId) {
      selected.push(bestId);
      remaining.delete(bestId);
    }
  }

  return selected;
}

export const studyQuery = action({
  args: {
    query: v.string(),
    bookFilter: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // ── Step 1: Embed the user query ──
    const embeddingResponse = await fetch(
      "https://api.openai.com/v1/embeddings",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "text-embedding-3-small",
          input: args.query,
        }),
      }
    );

    if (!embeddingResponse.ok) {
      const err = await embeddingResponse.text();
      throw new Error(`OpenAI embedding error: ${err}`);
    }

    const embeddingData = await embeddingResponse.json();
    const queryEmbedding: number[] = embeddingData.data[0].embedding;

    // ── Step 2: Hybrid retrieval — vector + full-text in parallel ──
    const [vectorResults, textResults] = await Promise.all([
      ctx.vectorSearch("bibleVerses", "by_embedding", {
        vector: queryEmbedding,
        limit: 30,
        ...(args.bookFilter
          ? { filter: (q: any) => q.eq("book", args.bookFilter) }
          : {}),
      }),
      ctx.runQuery(internal.bibleVerses.internalSearchByText, {
        query: args.query,
        limit: 15,
      }),
    ]);

    // ── Step 3: Collect all unique candidate IDs ──
    const allIds = new Set<string>();
    for (const r of vectorResults) allIds.add(r._id as string);
    for (const r of textResults) allIds.add(r._id as string);

    // Fetch full documents for all candidates
    const allDocs: any[] = await ctx.runQuery(
      internal.bibleVerses.getVersesByIds,
      { ids: [...allIds] as any }
    );

    const docMap = new Map<string, any>();
    for (const doc of allDocs) {
      docMap.set(doc._id as string, doc);
    }

    // ── Step 4: Reciprocal Rank Fusion (RRF) ──
    // Combines rankings from both sources. k=60 is standard.
    // Vector search weighted 2x higher — it captures semantic meaning better,
    // while text search contributes exact keyword matches as a supplement.
    const k = 60;
    const vectorWeight = 2.0;
    const textWeight = 1.0;
    const rrfScores = new Map<string, number>();

    for (let rank = 0; rank < vectorResults.length; rank++) {
      const id = vectorResults[rank]._id as string;
      rrfScores.set(id, (rrfScores.get(id) ?? 0) + vectorWeight / (k + rank + 1));
    }

    for (let rank = 0; rank < textResults.length; rank++) {
      const id = textResults[rank]._id as string;
      rrfScores.set(id, (rrfScores.get(id) ?? 0) + textWeight / (k + rank + 1));
    }

    // ── Step 5: MMR diversity selection ──
    // Build candidate list with RRF scores and embeddings
    const candidates: { id: string; score: number; embedding: number[] }[] = [];

    for (const [id, score] of rrfScores) {
      const doc = docMap.get(id);
      if (doc && doc.embedding) {
        candidates.push({ id, score, embedding: doc.embedding });
      }
    }

    // Sort by RRF score descending so MMR starts from the best
    candidates.sort((a, b) => b.score - a.score);

    // Normalize scores to [0,1] for MMR balancing
    const maxScore = candidates[0]?.score ?? 1;
    for (const c of candidates) {
      c.score = c.score / maxScore;
    }

    // Select 12 diverse, relevant verses
    const selectedIds = mmrSelect(candidates, queryEmbedding, 12, 0.5);

    // Gather final verses in selection order
    const finalVerses = selectedIds
      .map((id) => docMap.get(id))
      .filter(Boolean);

    // ── Step 6: GPT-4o-mini synthesis with improved prompt ──
    const verseCitations = finalVerses
      .map((v: any) => `${v.book} ${v.chapter}:${v.verse} — "${v.text}"`)
      .join("\n");

    const systemPrompt = `You are a scholarly theological assistant specializing in KJV Bible study and systematic theology. Your role is to provide deep, reverent analysis grounded in scripture.

Guidelines:
- ONLY cite verses from the provided list below. Do NOT cite any verse that is not in the list, even if you know it from memory. If a verse you want to reference is not in the list, describe the concept without giving a specific reference.
- Cite specific verses by reference (e.g., "Romans 8:28") when you reference them.
- Prioritize theologically substantive passages in your analysis. Ignore formulaic greetings or salutations (e.g., "Grace be to you and peace") unless they are directly relevant to the question.
- If a retrieved verse is not relevant to the question, do not cite it.
- Write in a scholarly but accessible tone with clear paragraphs separated by blank lines.
- Ground every claim in the retrieved scripture passages.`;

    const userPrompt = `The scholar asks: "${args.query}"

Here are the ONLY KJV passages you may cite (do not cite any others):
${verseCitations}

Provide a thorough theological analysis of the scholar's question. Cite only the passages that are directly relevant — you do not need to use all of them. Do not reference any verse not listed above.`;

    const completionResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 1500,
        }),
      }
    );

    if (!completionResponse.ok) {
      const err = await completionResponse.text();
      throw new Error(`OpenAI completion error: ${err}`);
    }

    const completionData = await completionResponse.json();
    const analysis: string = completionData.choices[0].message.content;

    // ── Step 7: Filter retrieved verses to only those cited in the analysis ──
    function isVerseCited(
      book: string,
      ch: number,
      vs: number,
      text: string
    ): boolean {
      if (text.includes(`${book} ${ch}:${vs}`)) return true;

      const esc = book.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      // Chapter-only mention: "Book Ch" not followed by colon/digit
      if (new RegExp(`${esc}\\s+${ch}(?![:\\d])`).test(text)) return true;

      // Verse range: "Book Ch:A-B" where A <= vs <= B
      const rangeRe = new RegExp(`${esc}\\s+${ch}:(\\d+)[-–—](\\d+)`, "g");
      let m;
      while ((m = rangeRe.exec(text)) !== null) {
        if (vs >= parseInt(m[1], 10) && vs <= parseInt(m[2], 10)) return true;
      }
      return false;
    }

    const citedFromRetrieval = finalVerses.filter((v: any) =>
      isVerseCited(v.book, v.chapter, v.verse, analysis)
    );

    // ── Step 8: Extract any extra citations the LLM made beyond the retrieved set ──
    // Regex captures references like "Book Ch:V" or "Book Ch:A-B"
    const knownBooks = [
      "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
      "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
      "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra",
      "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
      "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah",
      "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
      "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah",
      "Haggai", "Zechariah", "Malachi", "Matthew", "Mark", "Luke",
      "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians",
      "Galatians", "Ephesians", "Philippians", "Colossians",
      "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy",
      "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter",
      "1 John", "2 John", "3 John", "Jude", "Revelation",
    ];
    const booksPattern = knownBooks
      .map((b) => b.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|");
    const citationRe = new RegExp(
      `(${booksPattern})\\s+(\\d+):(\\d+)(?:\\s*[-–—]\\s*(\\d+))?`,
      "g"
    );

    // Collect all (book, chapter, verse) tuples cited in the analysis
    const citedRefs: { book: string; chapter: number; verse: number }[] = [];
    let cm;
    while ((cm = citationRe.exec(analysis)) !== null) {
      const book = cm[1];
      const ch = parseInt(cm[2], 10);
      const startV = parseInt(cm[3], 10);
      const endV = cm[4] ? parseInt(cm[4], 10) : startV;
      for (let vs = startV; vs <= endV; vs++) {
        citedRefs.push({ book, chapter: ch, verse: vs });
      }
    }

    // Find refs that aren't already in citedFromRetrieval
    const retrievedKeys = new Set(
      citedFromRetrieval.map(
        (v: any) => `${v.book}:${v.chapter}:${v.verse}`
      )
    );
    const extraRefs = citedRefs.filter(
      (r) => !retrievedKeys.has(`${r.book}:${r.chapter}:${r.verse}`)
    );

    // Look up extra verses from DB (deduplicated)
    const extraKeys = new Set<string>();
    const extraLookups: { book: string; chapter: number; verse: number }[] = [];
    for (const r of extraRefs) {
      const key = `${r.book}:${r.chapter}:${r.verse}`;
      if (!extraKeys.has(key)) {
        extraKeys.add(key);
        extraLookups.push(r);
      }
    }

    const extraVerses: ({
      book: string;
      chapter: number;
      verse: number;
      text: string;
    } | null)[] = await Promise.all(
      extraLookups.map((r) =>
        ctx.runQuery(internal.bibleVerses.getVerseByRef, r)
      )
    );

    // Merge: retrieved cited verses first, then any extra DB lookups
    type VerseOut = { book: string; chapter: number; verse: number; text: string };
    const allCitedVerses: VerseOut[] = [
      ...citedFromRetrieval.map((v: any) => ({
        book: v.book as string,
        chapter: v.chapter as number,
        verse: v.verse as number,
        text: v.text as string,
      })),
      ...extraVerses
        .filter((v): v is NonNullable<typeof v> => v !== null)
        .map((v) => ({
          book: v.book,
          chapter: v.chapter,
          verse: v.verse,
          text: v.text,
        })),
    ];

    return {
      analysis,
      verses: allCitedVerses,
    };
  },
});
