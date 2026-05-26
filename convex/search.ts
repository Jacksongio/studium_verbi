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
- Cite specific verses by reference (e.g., "Romans 8:28") when you reference them.
- Prioritize theologically substantive passages in your analysis. Ignore formulaic greetings or salutations (e.g., "Grace be to you and peace") unless they are directly relevant to the question.
- If a retrieved verse is not relevant to the question, do not cite it.
- Write in a scholarly but accessible tone with clear paragraphs separated by blank lines.
- Ground every claim in the retrieved scripture passages.`;

    const userPrompt = `The scholar asks: "${args.query}"

Here are relevant KJV passages retrieved for context:
${verseCitations}

Provide a thorough theological analysis of the scholar's question. Cite only the passages that are directly relevant — you do not need to use all of them.`;

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

    // ── Step 7: Filter to only verses actually cited in the analysis ──
    const citedVerses = finalVerses.filter((v: any) => {
      const ref = `${v.book} ${v.chapter}:${v.verse}`;
      return analysis.includes(ref);
    });

    // Fall back to all verses if the LLM didn't use standard citation format
    const returnVerses = citedVerses.length > 0 ? citedVerses : finalVerses;

    return {
      analysis,
      verses: returnVerses.map((v: any) => ({
        book: v.book,
        chapter: v.chapter,
        verse: v.verse,
        text: v.text,
      })),
    };
  },
});
