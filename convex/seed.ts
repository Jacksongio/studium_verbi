import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

export const seedBatch = action({
  args: {
    secret: v.string(),
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
    if (args.secret !== process.env.SEED_SECRET) {
      throw new Error("Unauthorized");
    }
    await ctx.runMutation(internal.bibleVerses.insertVerseBatch, {
      verses: args.verses,
    });
    return { inserted: args.verses.length };
  },
});
