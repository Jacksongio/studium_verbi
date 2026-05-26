import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return ctx.db
      .query("savedVerses")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .take(200);
  },
});

export const isVerseSaved = query({
  args: { book: v.string(), chapter: v.number(), verse: v.number() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;
    const existing = await ctx.db
      .query("savedVerses")
      .withIndex("by_userId_and_book_chapter_verse", (q) =>
        q
          .eq("userId", userId)
          .eq("book", args.book)
          .eq("chapter", args.chapter)
          .eq("verse", args.verse)
      )
      .unique();
    return existing !== null;
  },
});

export const save = mutation({
  args: {
    book: v.string(),
    chapter: v.number(),
    verse: v.number(),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if already saved
    const existing = await ctx.db
      .query("savedVerses")
      .withIndex("by_userId_and_book_chapter_verse", (q) =>
        q
          .eq("userId", userId)
          .eq("book", args.book)
          .eq("chapter", args.chapter)
          .eq("verse", args.verse)
      )
      .unique();

    if (existing) return existing._id;

    return ctx.db.insert("savedVerses", {
      userId,
      book: args.book,
      chapter: args.chapter,
      verse: args.verse,
      text: args.text,
    });
  },
});

export const remove = mutation({
  args: { book: v.string(), chapter: v.number(), verse: v.number() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("savedVerses")
      .withIndex("by_userId_and_book_chapter_verse", (q) =>
        q
          .eq("userId", userId)
          .eq("book", args.book)
          .eq("chapter", args.chapter)
          .eq("verse", args.verse)
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

export const updateNote = mutation({
  args: { id: v.id("savedVerses"), note: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const doc = await ctx.db.get(args.id);
    if (!doc || doc.userId !== userId) throw new Error("Not authorized");
    await ctx.db.patch(args.id, {
      note: args.note || undefined,
    });
  },
});

export const removeById = mutation({
  args: { id: v.id("savedVerses") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const doc = await ctx.db.get(args.id);
    if (!doc || doc.userId !== userId) throw new Error("Not authorized");
    await ctx.db.delete(args.id);
  },
});
