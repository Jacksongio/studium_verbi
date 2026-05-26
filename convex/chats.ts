import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listChats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return ctx.db
      .query("chats")
      .withIndex("by_userId_and_updatedAt", (q) =>
        q.eq("userId", userId)
      )
      .order("desc")
      .take(50);
  },
});

export const createChat = mutation({
  args: { title: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return ctx.db.insert("chats", {
      userId,
      title: args.title,
      updatedAt: Date.now(),
    });
  },
});

export const deleteChat = mutation({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const chat = await ctx.db.get(args.chatId);
    if (!chat || chat.userId !== userId) {
      throw new Error("Not authorized");
    }
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .take(500);
    for (const msg of messages) {
      await ctx.db.delete(msg._id);
    }
    await ctx.db.delete(args.chatId);
  },
});
