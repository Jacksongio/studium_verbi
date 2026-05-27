import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const get = query({
  args: { book: v.string(), chapter: v.number() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return ctx.db
      .query("bible_notes")
      .withIndex("by_userId_and_book_chapter", (q) =>
        q.eq("userId", userId).eq("book", args.book).eq("chapter", args.chapter)
      )
      .unique();
  },
});

export const save = mutation({
  args: { book: v.string(), chapter: v.number(), content: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("bible_notes")
      .withIndex("by_userId_and_book_chapter", (q) =>
        q.eq("userId", userId).eq("book", args.book).eq("chapter", args.chapter)
      )
      .unique();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        content: args.content,
        updatedAt: now,
      });
      return existing._id;
    }

    return ctx.db.insert("bible_notes", {
      userId,
      book: args.book,
      chapter: args.chapter,
      content: args.content,
      updatedAt: now,
    });
  },
});
