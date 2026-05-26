import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const prefs = await ctx.db
      .query("userPreferences")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    return { prefs };
  },
});

export const setLastChat = mutation({
  args: { chatId: v.union(v.id("chats"), v.null()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("userPreferences")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (existing) {
      if (args.chatId) {
        await ctx.db.patch(existing._id, { lastChatId: args.chatId });
      }
    } else if (args.chatId) {
      await ctx.db.insert("userPreferences", {
        userId,
        lastChatId: args.chatId,
      });
    }
  },
});

export const setLastBiblePosition = mutation({
  args: { book: v.string(), chapter: v.number() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("userPreferences")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        lastBibleBook: args.book,
        lastBibleChapter: args.chapter,
      });
    } else {
      await ctx.db.insert("userPreferences", {
        userId,
        lastBibleBook: args.book,
        lastBibleChapter: args.chapter,
      });
    }
  },
});
