# Douay–Rheims Bible source

`douay-rheims-1899.txt` contains the public-domain Douay–Rheims American Edition of 1899 (Challoner revision), downloaded from https://ebible.org/Scriptures/engDRA_vpl.zip.

Source and public-domain notice: https://ebible.org/engDRA/copyright.htm

The verse-per-line source is preserved without editorial changes. `src/app/lib/bible-books.ts` maps source codes to the existing modern book names used by the application. Psalm and verse numbering follows this edition, which can differ from modern translations. Previously saved verse text is retained as a historical snapshot.

Run `npx tsx scripts/seed-bible.ts --validate-only` to verify all 73 books and their chapters. Run `npx tsx scripts/seed-bible.ts` with `OPENAI_API_KEY` configured to prepare a complete Convex import file and fresh search embeddings. Preparation never changes the database. The script prints the import command only after all data validates.

Before importing, export a backup with `npx convex export --path /private/tmp/bible-backup.zip`. Import only the `bibleVerses` table with the printed command. This preserves user notes, saved passages, preferences, and other tables. Do not use `--replace-all`.
