/** Refresh the three published civil-year snapshots. Review USCCB updates before committing. */
import { mkdir, writeFile } from "node:fs/promises";
import type { Celebration } from "../src/app/lib/liturgical-calendar";

interface SourceEvent {
  event_key: string; date: string; name: string; grade: number;
  color: string[]; liturgical_season: string; year: number; is_vigil_mass?: boolean;
}
async function main() {
  const snapshots: Record<string, Celebration[]> = {};
  for (const year of [2026, 2027, 2028]) {
    const response = await fetch(`https://litcal.johnromanodorazio.com/api/v5/calendar/nation/US/${year}?locale=en_US&year_type=CIVIL`);
    if (!response.ok) throw new Error(`Calendar download failed: ${year}, HTTP ${response.status}`);
    const source = await response.json() as { litcal: SourceEvent[] };
    const events: Celebration[] = source.litcal.filter((event) => event.year === year && !event.is_vigil_mass).map((event) => ({
      id: event.event_key, date: event.date.slice(0, 10), name: event.name.replace(/^\[\s*US\s*\]\s*/, ""),
      grade: event.grade, color: event.color[0] ?? "green", season: event.liturgical_season ?? "ORDINARY_TIME",
    }));
    // General Roman Calendar addition, decree of February 3, 2026:
    // https://www.usccb.org/prayer-worship/liturgical-year/saint-john-henry-newman
    if (!events.some((event) => event.name.includes("Newman"))) {
      events.push({ id: "StJohnHenryNewman", date: `${year}-10-09`, name: "Saint John Henry Newman, Priest and Doctor of the Church", grade: 2, color: "white", season: "ORDINARY_TIME" });
    }
    if (new Set(events.map((event) => event.date)).size !== (year === 2028 ? 366 : 365)) throw new Error(`Incomplete civil year: ${year}`);
    if (events.some((event) => !event.name || !/^\d{4}-\d{2}-\d{2}$/.test(event.date) || !Number.isInteger(event.grade) || event.grade < 0 || event.grade > 7)) throw new Error(`Invalid source data: ${year}`);
    snapshots[String(year)] = events;
    console.log(`Validated ${year}: ${events.length} celebrations`);
  }
  await mkdir("data/liturgical-calendar", { recursive: true });
  await writeFile("data/liturgical-calendar/2026-2028.json", JSON.stringify(snapshots, null, 2) + "\n");
}
main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : "Refresh failed"); process.exitCode = 1; });
