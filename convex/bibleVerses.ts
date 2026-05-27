import { query, internalQuery, internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const insertVerseBatch = internalMutation({
  args: {
    verses: v.array(
      v.object({
        book: v.string(),
        chapter: v.number(),
        verse: v.number(),
        text: v.string(),
        embedding: v.array(v.float64()),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const verse of args.verses) {
      await ctx.db.insert("bibleVerses", verse);
    }
  },
});

export const getVersesByIds = internalQuery({
  args: { ids: v.array(v.id("bibleVerses")) },
  handler: async (ctx, args) => {
    const results = [];
    for (const id of args.ids) {
      const doc = await ctx.db.get(id);
      if (doc) results.push(doc);
    }
    return results;
  },
});

export const searchByText = query({
  args: { query: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return ctx.db
      .query("bibleVerses")
      .withSearchIndex("search_text", (q) => q.search("text", args.query))
      .take(args.limit ?? 10);
  },
});

export const internalSearchByText = internalQuery({
  args: { query: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return ctx.db
      .query("bibleVerses")
      .withSearchIndex("search_text", (q) => q.search("text", args.query))
      .take(args.limit ?? 15);
  },
});

export const hasVerses = internalQuery({
  args: {},
  handler: async (ctx) => {
    const sample = await ctx.db.query("bibleVerses").take(1);
    return sample.length > 0;
  },
});

export const getVerseByRef = internalQuery({
  args: { book: v.string(), chapter: v.number(), verse: v.number() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("bibleVerses")
      .withIndex("by_book_chapter_verse", (q) =>
        q
          .eq("book", args.book)
          .eq("chapter", args.chapter)
          .eq("verse", args.verse)
      )
      .unique();
  },
});

export const getChapterVerses = query({
  args: { book: v.string(), chapter: v.number() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("bibleVerses")
      .withIndex("by_book_chapter_verse", (q) =>
        q.eq("book", args.book).eq("chapter", args.chapter)
      )
      .take(200);
  },
});
