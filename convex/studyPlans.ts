import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// ── Queries ──

export const listPlans = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return ctx.db
      .query("studyPlans")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .take(50);
  },
});

export const getPlan = query({
  args: { planId: v.id("studyPlans") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const plan = await ctx.db.get(args.planId);
    if (!plan || plan.userId !== userId) return null;
    return plan;
  },
});

export const listSessions = query({
  args: { planId: v.id("studyPlans") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const plan = await ctx.db.get(args.planId);
    if (!plan || plan.userId !== userId) return [];
    const sessions = await ctx.db
      .query("studySessions")
      .withIndex("by_planId", (q) => q.eq("planId", args.planId))
      .take(100);
    return sessions.sort((a, b) => a.sessionNumber - b.sessionNumber);
  },
});

// ── Mutations ──

export const toggleSession = mutation({
  args: { planId: v.id("studyPlans"), sessionId: v.id("studySessions") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const plan = await ctx.db.get(args.planId);
    if (!plan || plan.userId !== userId) throw new Error("Not authorized");

    const session = await ctx.db.get(args.sessionId);
    if (!session || session.planId !== args.planId)
      throw new Error("Session not found");

    const nowCompleted = !session.completed;
    await ctx.db.patch(args.sessionId, {
      completed: nowCompleted,
      completedAt: nowCompleted ? Date.now() : undefined,
    });

    const newCount = plan.completedSessions + (nowCompleted ? 1 : -1);
    await ctx.db.patch(args.planId, {
      completedSessions: newCount,
      status: newCount >= plan.totalSessions ? "completed" : "active",
      updatedAt: Date.now(),
    });
  },
});

export const toggleReading = mutation({
  args: {
    planId: v.id("studyPlans"),
    sessionId: v.id("studySessions"),
    readingIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const plan = await ctx.db.get(args.planId);
    if (!plan || plan.userId !== userId) throw new Error("Not authorized");

    const session = await ctx.db.get(args.sessionId);
    if (!session || session.planId !== args.planId)
      throw new Error("Session not found");

    const current = session.completedReadings ?? [];
    const updated = current.includes(args.readingIndex)
      ? current.filter((i) => i !== args.readingIndex)
      : [...current, args.readingIndex];

    await ctx.db.patch(args.sessionId, { completedReadings: updated });
  },
});

export const savePromptResponse = mutation({
  args: {
    planId: v.id("studyPlans"),
    sessionId: v.id("studySessions"),
    promptIndex: v.number(),
    response: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const plan = await ctx.db.get(args.planId);
    if (!plan || plan.userId !== userId) throw new Error("Not authorized");

    const session = await ctx.db.get(args.sessionId);
    if (!session || session.planId !== args.planId)
      throw new Error("Session not found");

    // Initialize array with empty strings if needed
    const current = session.promptResponses ?? session.prompts.map(() => "");
    const updated = [...current];
    // Extend if needed
    while (updated.length <= args.promptIndex) {
      updated.push("");
    }
    updated[args.promptIndex] = args.response;

    await ctx.db.patch(args.sessionId, { promptResponses: updated });
  },
});

export const deletePlan = mutation({
  args: { planId: v.id("studyPlans") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const plan = await ctx.db.get(args.planId);
    if (!plan || plan.userId !== userId) throw new Error("Not authorized");

    const sessions = await ctx.db
      .query("studySessions")
      .withIndex("by_planId", (q) => q.eq("planId", args.planId))
      .take(100);
    for (const session of sessions) {
      await ctx.db.delete(session._id);
    }
    await ctx.db.delete(args.planId);
  },
});

// ── Internal mutation for atomic plan+sessions insert ──

export const createPlanWithSessions = internalMutation({
  args: {
    userId: v.string(),
    title: v.string(),
    description: v.string(),
    topic: v.string(),
    sessions: v.array(
      v.object({
        title: v.string(),
        readings: v.array(
          v.object({
            book: v.string(),
            startChapter: v.number(),
            endChapter: v.number(),
          })
        ),
        prompts: v.array(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const planId = await ctx.db.insert("studyPlans", {
      userId: args.userId,
      title: args.title,
      description: args.description,
      topic: args.topic,
      totalSessions: args.sessions.length,
      completedSessions: 0,
      status: "active",
      createdAt: now,
      updatedAt: now,
    });

    for (let i = 0; i < args.sessions.length; i++) {
      const s = args.sessions[i];
      await ctx.db.insert("studySessions", {
        planId,
        sessionNumber: i + 1,
        title: s.title,
        readings: s.readings,
        prompts: s.prompts,
        completed: false,
      });
    }

    return planId;
  },
});
