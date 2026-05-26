import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const user = await ctx.db.get(userId);
    if (!user) return null;
    return {
      id: user._id,
      name: user.name ?? null,
      email: user.email ?? null,
      image: user.image ?? null,
    };
  },
});

export const updateName = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    await ctx.db.patch(userId, { name: args.name || undefined });
  },
});

export const deleteAccount = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Delete user preferences
    const prefs = await ctx.db
      .query("userPreferences")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (prefs) await ctx.db.delete(prefs._id);

    // Delete saved verses
    const saved = await ctx.db
      .query("savedVerses")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .take(500);
    for (const sv of saved) await ctx.db.delete(sv._id);

    // Delete chats and messages
    const chats = await ctx.db
      .query("chats")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .take(500);
    for (const chat of chats) {
      const msgs = await ctx.db
        .query("messages")
        .withIndex("by_chatId", (q) => q.eq("chatId", chat._id))
        .take(500);
      for (const msg of msgs) await ctx.db.delete(msg._id);
      await ctx.db.delete(chat._id);
    }

    // Delete study plans and sessions
    const plans = await ctx.db
      .query("studyPlans")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .take(500);
    for (const plan of plans) {
      const sessions = await ctx.db
        .query("studySessions")
        .withIndex("by_planId", (q) => q.eq("planId", plan._id))
        .take(100);
      for (const s of sessions) await ctx.db.delete(s._id);
      await ctx.db.delete(plan._id);
    }

    // Delete auth sessions for this user
    const authSessions = await ctx.db
      .query("authSessions")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .take(100);
    for (const s of authSessions) await ctx.db.delete(s._id);

    // Delete auth accounts
    const accounts = await ctx.db
      .query("authAccounts")
      .withIndex("userIdAndProvider", (q) => q.eq("userId", userId))
      .take(100);
    for (const a of accounts) await ctx.db.delete(a._id);

    // Delete the user
    await ctx.db.delete(userId);
  },
});
