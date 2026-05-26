import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listMessages = query({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const chat = await ctx.db.get(args.chatId);
    if (!chat || chat.userId !== userId) return [];
    return ctx.db
      .query("messages")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .order("asc")
      .take(500);
  },
});

export const sendMessage = mutation({
  args: {
    chatId: v.id("chats"),
    sender: v.union(v.literal("user"), v.literal("assistant")),
    text: v.string(),
    verses: v.optional(
      v.array(
        v.object({
          book: v.string(),
          chapter: v.number(),
          verse: v.number(),
          text: v.string(),
          crossReferences: v.optional(v.array(v.string())),
        })
      )
    ),
    commentaries: v.optional(
      v.array(
        v.object({
          reference: v.string(),
          title: v.string(),
          author: v.string(),
          era: v.string(),
          content: v.string(),
          tags: v.array(v.string()),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const chat = await ctx.db.get(args.chatId);
    if (!chat || chat.userId !== userId) {
      throw new Error("Not authorized");
    }
    const messageId = await ctx.db.insert("messages", {
      chatId: args.chatId,
      sender: args.sender,
      text: args.text,
      verses: args.verses,
      commentaries: args.commentaries,
    });
    await ctx.db.patch(args.chatId, { updatedAt: Date.now() });
    return messageId;
  },
});

export const updateMessage = mutation({
  args: {
    messageId: v.id("messages"),
    text: v.string(),
    verses: v.optional(
      v.array(
        v.object({
          book: v.string(),
          chapter: v.number(),
          verse: v.number(),
          text: v.string(),
          crossReferences: v.optional(v.array(v.string())),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const msg = await ctx.db.get(args.messageId);
    if (!msg) throw new Error("Message not found");
    const chat = await ctx.db.get(msg.chatId);
    if (!chat || chat.userId !== userId) throw new Error("Not authorized");
    await ctx.db.patch(args.messageId, {
      text: args.text,
      verses: args.verses,
    });
    await ctx.db.patch(msg.chatId, { updatedAt: Date.now() });
  },
});
