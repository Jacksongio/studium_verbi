import snapshots from "../../../data/liturgical-calendar/2026-2028.json";

export const CALENDAR_YEARS = [2026, 2027, 2028] as const;
export type Observance = "us-sunday" | "us-thursday" | "hawaii";
export type CalendarFilter = "all" | "feasts" | "obligation" | "obligatory-fast" | "fast";
export interface Celebration {
  id: string;
  date: string;
  name: string;
  grade: number;
  color: string;
  season: string;
}
export interface CalendarDay {
  date: string;
  celebrations: Celebration[];
  massObligation: boolean;
  discipline: "fast-abstain" | "abstain" | "penance" | "paschal" | "none";
}

export function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}
export function parseDate(date: string): Date {
  return new Date(`${date}T00:00:00Z`);
}
export function shiftDate(date: string, offset: number): string {
  const result = parseDate(date);
  result.setUTCDate(result.getUTCDate() + offset);
  return dateKey(result);
}
export function formatDate(date: string, options: Intl.DateTimeFormatOptions = {}): string {
  return new Intl.DateTimeFormat("en-US", { timeZone: "UTC", ...options }).format(parseDate(date));
}

export function getCalendarDays(year: number, observance: Observance = "us-sunday"): CalendarDay[] {
  const source = (snapshots as Record<string, Celebration[]>)[String(year)];
  if (!source) throw new Error(`Calendar not available for ${year}`);
  let celebrations = source.map((event) => ({ ...event }));
  // The source identifies Holy Saturday by its evening Easter Vigil. Include
  // the daytime observance explicitly, without treating the whole day as Easter.
  const vigil = celebrations.find((event) => event.id === "EasterVigil");
  if (vigil) {
    vigil.name = "Easter Vigil (in the evening)";
    celebrations.push({ ...vigil, id: "HolySat", name: "Holy Saturday" });
  }
  if (observance === "us-thursday") {
    const ascension = celebrations.find((event) => event.id === "Ascension");
    if (!ascension) throw new Error("Ascension missing from calendar source");
    const sunday = ascension.date;
    const thursday = shiftDate(sunday, -3);
    // Ascension takes precedence over every Thursday celebration; the seventh
    // Sunday of Easter is restored. Other transfers are already in the snapshot.
    celebrations = celebrations.filter((event) => event.date !== sunday && event.date !== thursday);
    celebrations.push({ ...ascension, date: thursday });
    celebrations.push({ id: "Easter7", date: sunday, name: "Seventh Sunday of Easter", grade: 7, color: "white", season: "EASTER" });
  }
  const grouped = new Map<string, Celebration[]>();
  for (const celebration of celebrations) {
    const events = grouped.get(celebration.date) ?? [];
    events.push(celebration);
    grouped.set(celebration.date, events);
  }
  return [...grouped.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, events]) => {
    events.sort((a, b) => b.grade - a.grade || (a.id === "HolySat" ? -1 : b.id === "HolySat" ? 1 : a.name.localeCompare(b.name)));
    const weekday = parseDate(date).getUTCDay();
    const ids = new Set(events.map((event) => event.id));
    const solemnity = events.some((event) => event.grade >= 6);
    const isSunday = weekday === 0;
    const unconditional = ids.has("Christmas") || ids.has("ImmaculateConception");
    const movableObligation = ["MaryMotherOfGod", "Assumption", "AllSaints"].some((id) => ids.has(id)) && weekday !== 1 && weekday !== 6;
    const massObligation = isSunday || unconditional || (observance !== "hawaii" && (movableObligation || ids.has("Ascension")));
    let discipline: CalendarDay["discipline"] = "none";
    if (ids.has("AshWednesday") || ids.has("GoodFri")) discipline = "fast-abstain";
    else if (ids.has("HolySat")) discipline = "paschal";
    else if (weekday === 5 && !solemnity) {
      discipline = events.some((event) => event.season === "LENT") ? "abstain" : "penance";
    }
    return { date, celebrations: events, massObligation, discipline };
  });
}

export function matchesFilter(day: CalendarDay, filter: CalendarFilter): boolean {
  if (filter === "obligatory-fast") return day.discipline === "fast-abstain";
  if (filter === "feasts") return day.celebrations.some((event) => event.grade >= 1);
  if (filter === "obligation") return day.massObligation;
  if (filter === "fast") return day.discipline !== "none";
  return true;
}
export function rankLabel(event: Celebration): string {
  if (event.id === "AshWednesday" || event.id === "GoodFri" || event.id === "HolySat" || event.id === "HolyThurs") return "Principal celebration";
  if (event.id === "Ascension") return "Solemnity";
  if (event.grade === 7 && event.id.includes("OctaveEaster")) return "Easter octave";
  if (event.grade === 7 && parseDate(event.date).getUTCDay() !== 0) return "Principal celebration";
  if (event.grade >= 6) return parseDate(event.date).getUTCDay() === 0 ? "Sunday / solemnity" : "Solemnity";
  if (event.grade === 5) return parseDate(event.date).getUTCDay() === 0 ? "Sunday" : "Feast of the Lord";
  return ["Weekday", "Commemoration", "Optional memorial", "Memorial", "Feast"][event.grade] ?? "Celebration";
}
export function disciplineLabel(discipline: CalendarDay["discipline"]): string {
  return { "fast-abstain": "Fast & abstinence", abstain: "Abstinence from meat", penance: "Friday penance", paschal: "Paschal fast encouraged", none: "" }[discipline];
}
export function disciplineDescription(discipline: CalendarDay["discipline"]): string {
  return {
    "fast-abstain": "Fasting and abstinence from meat are obligatory. Fasting: ages 18–59, one full meal and two smaller meals that together do not equal a full meal. Abstinence: age 14 onward. Health and other legitimate exemptions apply.",
    abstain: "Abstinence from meat is obligatory from age 14. This is a Friday of Lent; fasting is not obligatory today. Health and other legitimate exemptions apply.",
    penance: "A day of penitential observance. Outside Lent, U.S. Catholics may choose another penitential practice in place of abstaining from meat. This is not an obligatory fasting day.",
    paschal: "Continuing the Good Friday fast until the Easter Vigil is encouraged when possible; it is not an additional obligatory fasting day.",
    none: "No general U.S. obligation to fast or abstain from meat today. Personal Lenten practices and local rules may still apply.",
  }[discipline];
}
export function monthCells(year: number, month: number): string[] {
  const first = dateKey(new Date(Date.UTC(year, month, 1)));
  const start = shiftDate(first, -parseDate(first).getUTCDay());
  return Array.from({ length: 42 }, (_, index) => shiftDate(start, index));
}
