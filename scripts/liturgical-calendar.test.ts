import assert from "node:assert/strict";
import test from "node:test";
import { getCalendarDays, matchesFilter, monthCells, rankLabel, shiftDate } from "../src/app/lib/liturgical-calendar";

for (const year of [2026, 2027, 2028]) {
  test(`${year}: complete civil year, unique celebrations, exactly two obligatory fasts`, () => {
    const days = getCalendarDays(year);
    assert.equal(days.length, year === 2028 ? 366 : 365);
    assert.equal(days[0].date, `${year}-01-01`);
    assert.equal(days.at(-1)?.date, `${year}-12-31`);
    assert.equal(days.filter((day) => day.discipline === "fast-abstain").length, 2);
    for (let i = 0; i < days.length; i++) {
      assert.equal(days[i].date, shiftDate(`${year}-01-01`, i));
      assert.equal(new Set(days[i].celebrations.map((event) => event.id)).size, days[i].celebrations.length);
    }
  });
}
const day = (date: string, observance: "us-sunday" | "us-thursday" | "hawaii" = "us-sunday") => {
  const result = getCalendarDays(Number(date.slice(0, 4)), observance).find((value) => value.date === date);
  assert.ok(result);
  return result;
};
test("Principal dates agree with the USCCB's published 2026–2028 calendars", () => {
  for (const [year, ash, easter, pentecost, corpus, advent] of [
    [2026, "02-18", "04-05", "05-24", "06-07", "11-29"],
    [2027, "02-10", "03-28", "05-16", "05-30", "11-28"],
    [2028, "03-01", "04-16", "06-04", "06-18", "12-03"],
  ] as const) {
    for (const [suffix, id] of [[ash, "AshWednesday"], [easter, "Easter"], [pentecost, "Pentecost"], [corpus, "CorpusChristi"], [advent, "Advent1"]]) {
      assert.ok(day(`${year}-${suffix}`).celebrations.some((event) => event.id === id), `${year}-${suffix} ${id}`);
    }
  }
});
test("Ascension Thursday restores Easter Sunday VII and supersedes Matthias in 2026", () => {
  assert.ok(day("2026-05-17").celebrations.some((event) => event.id === "Ascension"));
  assert.deepEqual(day("2026-05-14", "us-thursday").celebrations.map((event) => event.id), ["Ascension"]);
  assert.ok(day("2026-05-14", "us-thursday").massObligation);
  assert.equal(rankLabel(day("2026-05-14", "us-thursday").celebrations[0]), "Solemnity");
  assert.deepEqual(day("2026-05-17", "us-thursday").celebrations.map((event) => event.id), ["Easter7"]);
});
test("U.S. Saturday/Monday exemptions do not waive Christmas or Immaculate Conception", () => {
  assert.equal(day("2026-08-15").massObligation, false);
  assert.equal(day("2027-11-01").massObligation, false);
  assert.equal(day("2028-01-01").massObligation, false);
  assert.equal(day("2027-12-25").massObligation, true);
  assert.equal(day("2026-12-08").massObligation, true);
  assert.equal(day("2026-11-01").massObligation, true);
});
test("Hawaii keeps Sunday obligations, Christmas, and Immaculate Conception", () => {
  assert.equal(day("2026-01-01", "hawaii").massObligation, false);
  assert.equal(day("2028-08-15", "hawaii").massObligation, false);
  assert.equal(day("2026-12-25", "hawaii").massObligation, true);
  assert.equal(day("2026-12-08", "hawaii").massObligation, true);
  assert.equal(day("2026-05-17", "hawaii").massObligation, true);
});
test("Solemnities override Friday abstinence; Good Friday remains an obligatory fast", () => {
  assert.equal(day("2027-03-19").discipline, "none");
  assert.equal(day("2027-03-12").discipline, "abstain");
  assert.equal(day("2026-04-03").discipline, "fast-abstain");
  assert.equal(day("2026-04-10").discipline, "none");
  assert.equal(day("2026-10-09").discipline, "penance");
  assert.equal(day("2026-04-04").discipline, "paschal");
});
test("Calendar includes transferred solemnities and the newly added Newman memorial", () => {
  assert.ok(day("2027-04-05").celebrations.some((event) => event.id === "Annunciation"));
  assert.ok(day("2028-03-20").celebrations.some((event) => event.id === "StJoseph"));
  for (const year of [2026, 2027, 2028]) assert.ok(day(`${year}-10-09`).celebrations.some((event) => event.id === "StJohnHenryNewman"));
});
test("Month layout handles leap day and year boundaries without timezone shifts", () => {
  const cells = monthCells(2028, 1);
  assert.equal(cells.length, 42);
  assert.ok(cells.includes("2028-02-29"));
  assert.equal(shiftDate("2026-01-01", -1), "2025-12-31");
});

test("Obligatory-fast filter lists the whole year's two fasts and excludes abstinence-only and voluntary days", () => {
  const dates = new Map([
    [2026, ["2026-02-18", "2026-04-03"]],
    [2027, ["2027-02-10", "2027-03-26"]],
    [2028, ["2028-03-01", "2028-04-14"]],
  ]);
  for (const [year, expected] of dates) {
    assert.deepEqual(getCalendarDays(year).filter((value) => matchesFilter(value, "obligatory-fast")).map((value) => value.date), expected);
  }
  assert.equal(matchesFilter(day("2026-02-20"), "obligatory-fast"), false);
  assert.equal(matchesFilter(day("2026-04-04"), "obligatory-fast"), false);
});
