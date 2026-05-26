import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const schema = defineSchema({
  ...authTables,

  chats: defineTable({
    userId: v.string(),
    title: v.string(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_updatedAt", ["userId", "updatedAt"]),

  messages: defineTable({
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
  }).index("by_chatId", ["chatId"]),

  savedVerses: defineTable({
    userId: v.string(),
    book: v.string(),
    chapter: v.number(),
    verse: v.number(),
    text: v.string(),
    note: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_book_chapter_verse", [
      "userId",
      "book",
      "chapter",
      "verse",
    ]),

  studyPlans: defineTable({
    userId: v.string(),
    title: v.string(),
    description: v.string(),
    topic: v.string(),
    totalSessions: v.number(),
    completedSessions: v.number(),
    status: v.union(
      v.literal("active"),
      v.literal("completed"),
      v.literal("archived")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_status", ["userId", "status"]),

  studySessions: defineTable({
    planId: v.id("studyPlans"),
    sessionNumber: v.number(),
    title: v.string(),
    readings: v.array(
      v.object({
        book: v.string(),
        startChapter: v.number(),
        endChapter: v.number(),
      })
    ),
    prompts: v.array(v.string()),
    completedReadings: v.optional(v.array(v.number())),
    promptResponses: v.optional(v.array(v.string())),
    completed: v.boolean(),
    completedAt: v.optional(v.number()),
  }).index("by_planId", ["planId"]),

  userPreferences: defineTable({
    userId: v.string(),
    lastChatId: v.optional(v.id("chats")),
    lastBibleBook: v.optional(v.string()),
    lastBibleChapter: v.optional(v.number()),
  }).index("by_userId", ["userId"]),

  bibleVerses: defineTable({
    book: v.string(),
    chapter: v.number(),
    verse: v.number(),
    text: v.string(),
    embedding: v.array(v.float64()),
  })
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
      filterFields: ["book"],
    })
    .searchIndex("search_text", {
      searchField: "text",
      filterFields: ["book"],
    })
    .index("by_book_chapter_verse", ["book", "chapter", "verse"]),
});

export default schema;
