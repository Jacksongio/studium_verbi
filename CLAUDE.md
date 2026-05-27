# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project Overview

Studium Verbi is a KJV Bible study web app with a RAG-powered theological assistant. Users can read scripture, chat with an AI study companion, save verses, and follow AI-generated study plans. The app uses a Gutenberg-inspired design with Cinzel, Lora, and Inter fonts.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4, CSS Modules
- **Backend**: Convex (real-time database, serverless functions)
- **Auth**: `@convex-dev/auth` with email/password (Resend for password reset emails)
- **AI**: OpenAI API (gpt-4o-mini for chat/plan generation, text-embedding-3-small for verse embeddings)
- **Path alias**: `@/*` maps to `./src/*`

## Commands

```bash
npm run dev          # Start Next.js dev server (http://localhost:3000)
npx convex dev       # Start Convex dev server (run alongside Next.js)
npm run build        # Production build
npm run lint         # ESLint (eslint-config-next core-web-vitals + typescript)
```

Seed the Bible database (one-time):
```bash
OPENAI_API_KEY=sk-... SEED_SECRET=xxx npx tsx scripts/seed-bible.ts
```

## Architecture

### Routing (Next.js App Router)

- `src/app/layout.tsx` — Root layout, wraps everything in `ConvexClientProvider`
- `src/app/auth/page.tsx` — Login/signup page (public)
- `src/app/(app)/layout.tsx` — Authenticated app shell with sidebar, redirects to `/auth` if unauthenticated. Wraps children in `ChatProvider` and `BibleProvider` contexts
- `src/app/(app)/page.tsx` — Chat/home page
- `src/app/(app)/bible/` — Bible reader
- `src/app/(app)/study/` — Study plans
- `src/app/(app)/saved/` — Saved verses
- `src/app/(app)/settings/` — User settings

### Client-Side Context Providers

- `ChatProvider` (`src/app/(app)/components/ChatContext.tsx`) — Manages active chat ID, persists last chat via Convex user preferences
- `BibleProvider` (`src/app/(app)/components/BibleContext.tsx`) — Manages current Bible location (book/chapter), navigation, testament selection, restores last reading position. Contains the canonical `BIBLE_BOOKS` array (66 books with chapter counts)

### Convex Backend (`convex/`)

All Convex functions use `getAuthUserId` from `@convex-dev/auth/server` for auth. Every query/mutation checks ownership before returning or modifying data.

Key modules:
- `schema.ts` — Tables: chats, messages, savedVerses, studyPlans, studySessions, userPreferences, bibleVerses (with vector + search indexes)
- `search.ts` — RAG pipeline: embeds user query via OpenAI, runs hybrid retrieval (vector search + full-text search), applies Reciprocal Rank Fusion, selects diverse results via MMR, synthesizes answer with GPT-4o-mini
- `studyPlanActions.ts` — `"use node"` action that calls OpenAI to generate multi-day Bible study plans. Uses `internal.studyPlans.createPlanWithSessions` for atomic insert
- `seed.ts` — Batch insert action for Bible seeding (protected by `SEED_SECRET` env var)
- `bibleVerses.ts` — Internal queries/mutations for verse lookup and batch insert
- `http.ts` — HTTP router, only has auth routes

### Local Fallback Data

`src/app/lib/bible-database.ts` contains a curated subset of KJV verses, patristic commentaries, and a keyword-based theology knowledge base. This serves as client-side fallback search when the Convex RAG pipeline isn't available.

### Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_CONVEX_URL` — Convex deployment URL
- `OPENAI_API_KEY` — Used by Convex actions (search, study plan generation, seeding)
- `AUTH_RESEND_KEY` — Resend API key for password reset emails
- `SEED_SECRET` — Secret for authorizing the Bible seeding script

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->
