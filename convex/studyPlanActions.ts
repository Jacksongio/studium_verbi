"use node";

import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const generatePlan = action({
  args: { topic: v.string(), durationDays: v.number() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const systemPrompt = `You are a Bible study plan designer. Create structured reading plans for KJV Bible study.
Return ONLY valid JSON with no markdown formatting.

Output format:
{
  "title": "Short plan title",
  "description": "1-2 sentence description of the plan's focus and what the reader will learn",
  "sessions": [
    {
      "title": "Day N: Session title",
      "readings": [{"book": "Romans", "startChapter": 1, "endChapter": 2}],
      "prompts": ["Reflection question 1", "Reflection question 2"]
    }
  ]
}

Rules:
- Use exact KJV book names: Genesis, Exodus, Leviticus, Numbers, Deuteronomy, Joshua, Judges, Ruth, 1 Samuel, 2 Samuel, 1 Kings, 2 Kings, 1 Chronicles, 2 Chronicles, Ezra, Nehemiah, Esther, Job, Psalms, Proverbs, Ecclesiastes, Song of Solomon, Isaiah, Jeremiah, Lamentations, Ezekiel, Daniel, Hosea, Joel, Amos, Obadiah, Jonah, Micah, Nahum, Habakkuk, Zephaniah, Haggai, Zechariah, Malachi, Matthew, Mark, Luke, John, Acts, Romans, 1 Corinthians, 2 Corinthians, Galatians, Ephesians, Philippians, Colossians, 1 Thessalonians, 2 Thessalonians, 1 Timothy, 2 Timothy, Titus, Philemon, Hebrews, James, 1 Peter, 2 Peter, 1 John, 2 John, 3 John, Jude, Revelation
- Each session should have 1-3 readings totaling 2-4 chapters
- Each session should have 2-3 thoughtful study/reflection prompts
- Prompts should encourage theological reflection, application, and connection to other scripture
- The number of sessions must exactly equal ${args.durationDays}
- Organize readings in a logical progression that builds understanding of the topic`;

    const userPrompt = `Create a ${args.durationDays}-day Bible study plan on the topic: "${args.topic}"`;

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 3000,
          response_format: { type: "json_object" },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Failed to generate plan: ${err}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    let parsed: {
      title: string;
      description: string;
      sessions: {
        title: string;
        readings: {
          book: string;
          startChapter: number;
          endChapter: number;
        }[];
        prompts: string[];
      }[];
    };

    try {
      parsed = JSON.parse(content);
    } catch {
      throw new Error(
        "The AI returned an invalid response. Please try again."
      );
    }

    if (
      !parsed.title ||
      !parsed.description ||
      !Array.isArray(parsed.sessions) ||
      parsed.sessions.length === 0
    ) {
      throw new Error(
        "The AI returned an incomplete plan. Please try again."
      );
    }

    const planId: string = await ctx.runMutation(
      internal.studyPlans.createPlanWithSessions,
      {
        userId,
        title: parsed.title,
        description: parsed.description,
        topic: args.topic,
        sessions: parsed.sessions.map((s) => ({
          title: s.title || "Untitled Session",
          readings: (s.readings || []).map((r) => ({
            book: r.book || "Genesis",
            startChapter: r.startChapter || 1,
            endChapter: r.endChapter || r.startChapter || 1,
          })),
          prompts: s.prompts || [],
        })),
      }
    );

    return planId;
  },
});
