# U.S. liturgical calendar, 2026–2028

Civil-year celebration dates, names, ranks, colors and seasons were obtained from the [Liturgical Calendar Project](https://litcal.johnromanodorazio.com/) national `US` endpoint (`api/v5/calendar/nation/US/{year}?locale=en_US&year_type=CIVIL`) on October 29, 2026. Evening vigils are excluded from the daily list except the Easter Vigil; the application adds Holy Saturday explicitly.

These are factual calendar entries, not copies of the USCCB's introductory prose, prayers or Scripture texts. This is an independent calendar implementation, not an official USCCB publication.

The principal dates, U.S. obligation rules, and recent additions were checked against:

- https://www.usccb.org/resources/2026cal.pdf
- https://www.usccb.org/resources/2027cal.pdf
- https://www.usccb.org/resources/2028cal.pdf
- https://www.usccb.org/prayer-worship/liturgical-year/saint-john-henry-newman
- https://www.usccb.org/prayer-and-worship/liturgical-year-and-calendar/lent/catholic-information-on-lenten-fast-and-abstinence
- https://www.usccb.org/prayer-and-worship/liturgical-year-and-calendar/lent/us-bishops-pastoral-statement-on-penance-and-abstinence
- https://www.vatican.va/archive/cod-iuris-canonici/eng/documents/cic_lib4-cann1244-1253_en.html

The source currently omits the October 9 optional memorial of Saint John Henry Newman; that addition is included in these snapshots. Do not rely on the source's `holy_day_of_obligation` field: it does not implement the U.S. Saturday/Monday exceptions or Hawaii. Those rules, the local Ascension option, and fasting disciplines are applied explicitly in `src/app/lib/liturgical-calendar.ts`.

Coverage is the current General Roman Calendar plus the U.S. proper, not every local patron, religious-order calendar, saint in the Roman Martyrology, Eastern Catholic calendar, or 1962 calendar. Higher-ranking celebrations can suppress a saint's observance on its customary date. The frontend states this scope and links the annual official calendars. Future years should be added only after checking the corresponding published U.S. calendar.

Refresh: `node --import tsx scripts/update-liturgical-calendar.ts` (requires network). Verify: `node --import tsx --test scripts/liturgical-calendar.test.ts`.
