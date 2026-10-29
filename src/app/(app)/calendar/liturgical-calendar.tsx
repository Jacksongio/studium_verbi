"use client";

import { useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, X, ArrowUpRight, ChevronDown } from "lucide-react";
import {
  CALENDAR_YEARS, disciplineDescription, disciplineLabel, formatDate,
  getCalendarDays, monthCells, parseDate, rankLabel, shiftDate,
  type CalendarDay, type Observance,
} from "../../lib/liturgical-calendar";
import styles from "./calendar.module.css";

const MONTHS = Array.from({ length: 12 }, (_, month) => new Intl.DateTimeFormat("en-US", { month: "long", timeZone: "UTC" }).format(new Date(Date.UTC(2026, month, 1))));
const SEASONS: Record<string, string> = { ORDINARY_TIME: "Ordinary Time", CHRISTMAS: "Christmas", EASTER: "Easter", EASTER_TRIDUUM: "The Sacred Paschal Triduum", LENT: "Lent", ADVENT: "Advent" };

function Badges({ day }: { day: CalendarDay }) {
  return <div className={styles.badges}>
    {day.massObligation && <span className={styles.obligation}>Mass obligation</span>}
    {day.discipline !== "none" && <span className={day.discipline === "fast-abstain" || day.discipline === "abstain" ? styles.fast : styles.penance}>{disciplineLabel(day.discipline)}</span>}
  </div>;
}

function DayInformation({ day, headingId }: { day: CalendarDay; headingId: string }) {
  return <>
        <div className={styles.dayDetail}>
          <p className={styles.eyebrow}>{SEASONS[day.celebrations[0].season]}</p>
          <h2 id={headingId}>{formatDate(day.date, { weekday: "long", month: "long", day: "numeric" })}</h2>
          <Badges day={day} />
          <ul className={styles.observances}>{day.celebrations.map((event) => <li key={event.id}><span className={styles.swatch} data-color={event.color} /><div><h3>{event.name}</h3><p>{rankLabel(event)} · {event.color.charAt(0).toUpperCase() + event.color.slice(1)} vestments</p></div></li>)}</ul>
          <p className={styles.obligationNote}>{day.massObligation ? "Mass attendance is obligatory today, subject to the usual legitimate excuses and local dispensations." : "No general holy-day Mass obligation today under the selected U.S. observance."}</p>
          {day.celebrations.some((event) => event.id === "HolySat") && <p className={styles.obligationNote}>The Easter Vigil is celebrated after nightfall and fulfills the Easter Sunday Mass obligation.</p>}
          <a className={styles.sourceLink} href={`https://bible.usccb.org/bible/readings/${day.date.slice(5, 7)}${day.date.slice(8)}${day.date.slice(2, 4)}.cfm`} target="_blank" rel="noreferrer">Readings of the day at USCCB ↗</a>
        </div>
        <div className={styles.disciplineDetail}><p className={styles.eyebrow}>Fasting & penance</p><h3>{disciplineLabel(day.discipline) || "No obligatory fast today"}</h3><p>{disciplineDescription(day.discipline)}</p><p className={styles.optionalNote}>Optional memorials are choices, not additional required celebrations. A Sunday or higher-ranking day can take precedence over a saint’s usual date.</p></div>
  </>;
}

export default function LiturgicalCalendar({ initialDate }: { initialDate: string }) {
  const initialYear = Math.min(2028, Math.max(2026, Number(initialDate.slice(0, 4))));
  const initial = Number(initialDate.slice(0, 4)) === initialYear ? initialDate : `${initialYear}-01-01`;
  const [selected, setSelected] = useState(initial);
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(Number(initial.slice(5, 7)) - 1);
  const [observance, setObservance] = useState<Observance>("us-sunday");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cellRefs = useRef(new Map<string, HTMLButtonElement>());
  const days = useMemo(() => getCalendarDays(year, observance), [year, observance]);
  const byDate = useMemo(() => new Map(days.map((day) => [day.date, day])), [days]);
  const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;
  const monthDays = days.filter((day) => day.date.startsWith(monthKey));
  const selectedDay = byDate.get(selected) ?? monthDays[0];
  const cells = monthCells(year, month);
  const weekCount = Math.ceil((parseDate(monthDays[0].date).getUTCDay() + monthDays.length) / 7);

  function selectDate(date: string, focus = false) {
    const target = parseDate(date);
    if (target.getUTCFullYear() < 2026 || target.getUTCFullYear() > 2028) return;
    setSelected(date);
    setYear(target.getUTCFullYear());
    setMonth(target.getUTCMonth());
    if (focus) requestAnimationFrame(() => cellRefs.current.get(date)?.focus());
  }
  function openDay(date: string) {
    selectDate(date);
    requestAnimationFrame(() => dialogRef.current?.showModal());
  }
  function changeMonth(delta: number) {
    const target = new Date(Date.UTC(year, month + delta, 1));
    selectDate(target.toISOString().slice(0, 10));
  }
  function goToday() {
    const now = new Date();
    const local = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    selectDate(local);
  }

  return <main className={styles.page}>
    <div className={styles.inner}>
      <header className={styles.header}>
        <div><p className={styles.eyebrow}><CalendarDays size={15} aria-hidden="true" /> The liturgical year</p>
          <h1>Feasts & fasts</h1>
          <p className={styles.subtitle}>Plan your year with the U.S. Catholic calendar.</p>
        </div>
        <div className={styles.headerNavigation}>
        <label className={styles.observancePicker}>Roman Rite · United States
          <select value={observance} onChange={(event) => setObservance(event.target.value as Observance)}>
            <option value="us-sunday">U.S. · Ascension on Sunday</option>
            <option value="us-thursday">U.S. · Ascension on Thursday</option>
            <option value="hawaii">Hawaii</option>
          </select>
        </label>
        <label className={styles.yearPicker}>Year
          <select id="calendar-year" value={year} onChange={(event) => selectDate(`${event.target.value}-${String(month + 1).padStart(2, "0")}-01`)}>{CALENDAR_YEARS.map((value) => <option key={value}>{value}</option>)}</select>
        </label>
      </div>

      </header>

      <div className={styles.settings}>
        <details className={styles.regionHelp}>
          <summary>Which observance applies to me? <ChevronDown size={13} aria-hidden="true" /></summary>
          <p>Choose Thursday for the ecclesiastical provinces of Boston, Hartford, New York, Omaha, and Philadelphia. Most other U.S. dioceses celebrate Ascension on Sunday. Hawaii has its own holy-day obligations.</p>
        </details>
      </div>


      <section className={styles.calendarPanel} aria-label="Liturgical calendar">
        <div className={styles.toolbar}>
          <div className={styles.monthNavigation}>
            <button type="button" className={styles.iconButton} onClick={() => changeMonth(-1)} disabled={year === 2026 && month === 0} aria-label="Previous month"><ChevronLeft size={18} /></button>
            <h2 aria-live="polite">{MONTHS[month]} {year}</h2>
            <button type="button" className={styles.iconButton} onClick={() => changeMonth(1)} disabled={year === 2028 && month === 11} aria-label="Next month"><ChevronRight size={18} /></button>
          </div>
          <div className={styles.toolbarActions}>
            <button type="button" className={styles.smallButton} onClick={goToday}>Today</button>
            <label className={styles.visuallyHidden} htmlFor="calendar-month">Month</label>
            <select id="calendar-month" value={month} onChange={(event) => selectDate(`${year}-${String(Number(event.target.value) + 1).padStart(2, "0")}-01`)}>{MONTHS.map((name, index) => <option value={index} key={name}>{name}</option>)}</select>
          </div>
        </div>
        <div className={styles.summary}><span>{monthDays.length} days · Click any date for its observances</span></div>
        <div className={styles.tableScroll}>
          <table className={styles.calendar}><caption className={styles.visuallyHidden}>{MONTHS[month]} {year}, U.S. Catholic liturgical calendar. Use arrow keys to move between dates.</caption>
            <thead><tr>{["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((name) => <th scope="col" key={name}><abbr title={name}>{name.slice(0, 3)}</abbr></th>)}</tr></thead>
            <tbody>{Array.from({ length: weekCount }, (_, week) => <tr key={week}>{cells.slice(week * 7, week * 7 + 7).map((date) => {
              const day = byDate.get(date); const inMonth = date.startsWith(monthKey); const event = day?.celebrations[0];
              return <td key={date} className={!inMonth ? styles.outside : undefined}>
                <button type="button" ref={(element) => { if (element) cellRefs.current.set(date, element); else cellRefs.current.delete(date); }} className={`${styles.dayButton} ${selected === date ? styles.selectedDay : ""}`} aria-pressed={selected === date} tabIndex={selected === date ? 0 : -1} disabled={!day} aria-haspopup="dialog" onClick={() => openDay(date)} onKeyDown={(keyEvent) => {
                  const offset: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
                  if (keyEvent.key in offset) { keyEvent.preventDefault(); selectDate(shiftDate(date, offset[keyEvent.key]), true); }
                }} aria-label={`${formatDate(date, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}${event ? `. ${event.name}. ${rankLabel(event)}` : ""}${day?.massObligation ? ". Mass obligation" : ""}${day?.discipline !== "none" && day ? `. ${disciplineLabel(day.discipline)}` : ""}`}>
                  <span className={styles.dayTop}><time dateTime={date} aria-current={date === initialDate ? "date" : undefined}>{Number(date.slice(8))}</time><span className={styles.dayMarks}>{day?.massObligation && <span className={styles.massDot} title="Mass obligation" />}{day && day.discipline !== "none" && <span className={styles.fastDot} title={disciplineLabel(day.discipline)} />}</span></span>
                  {event && inMonth && <><span className={styles.colorLine} data-color={event.color} /><span className={styles.eventName}>{event.name}</span><span className={styles.eventRank}>{rankLabel(event)}</span>{day.celebrations.length > 1 && <span className={styles.more}>+{day.celebrations.length - 1} {day.celebrations.length === 2 ? "observance" : "observances"}</span>}</>}
                </button>
              </td>;
            })}</tr>)}</tbody>
          </table>
        </div>
        <div className={styles.legend}><span><i className={styles.massDot} /> Mass obligation</span><span><i className={styles.fastDot} /> Fast, abstinence, or penance</span><span>Click a day to see every observance and its details.</span></div>
      </section>

      <button type="button" className={styles.selectedSummary} aria-haspopup="dialog" onClick={() => openDay(selectedDay.date)}>
        <span><span className={styles.eyebrow}>{formatDate(selectedDay.date, { month: "long", day: "numeric" })}</span><strong>{selectedDay.celebrations[0].name}</strong></span>
        <span className={styles.selectedAction}>View {selectedDay.celebrations.length > 1 ? `all ${selectedDay.celebrations.length} observances` : "day details"} <ArrowUpRight size={16} aria-hidden="true" /></span>
      </button>

      <dialog
        ref={dialogRef}
        className={styles.dayDialog}
        aria-labelledby="calendar-popup-heading"
        onClose={() => cellRefs.current.get(selected)?.focus({ preventScroll: true })}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
            event.currentTarget.close();
          }
        }}
      >
        <div className={styles.dialogHeader}>
          <p className={styles.eyebrow}>Day details</p>
          <button type="button" className={styles.iconButton} aria-label="Close day details" onClick={() => dialogRef.current?.close()} autoFocus><X size={18} aria-hidden="true" /></button>
        </div>
        <div className={styles.dialogContent}>
          <DayInformation day={selectedDay} headingId="calendar-popup-heading" />
        </div>
      </dialog>

      <details className={styles.sources}>
        <summary>Sources & calendar notes <ChevronDown size={15} aria-hidden="true" /></summary>
        <p>The current Roman Rite calendar for the United States, including solemnities, feasts, memorials, optional memorials, and every day’s liturgical observance. Published years: 2026–2028. Local patrons, parish dedications, and diocesan dispensations may differ. Eastern Catholic and 1962 calendars follow different rules.</p>
        <p>Celebration data: <a href="https://litcal.johnromanodorazio.com/">Liturgical Calendar Project</a>, with U.S. rules and recent additions checked against the <a href="https://www.usccb.org/committees/divine-worship/liturgical-calendar">USCCB calendars</a> ({CALENDAR_YEARS.map((value, index) => <span key={value}>{index > 0 ? ", " : ""}<a href={`https://www.usccb.org/resources/${value}cal.pdf`}>{value}</a></span>)}). Fasting: <a href="https://www.usccb.org/prayer-and-worship/liturgical-year-and-calendar/lent/catholic-information-on-lenten-fast-and-abstinence">USCCB fast and abstinence norms</a> and <a href="https://www.usccb.org/prayer-and-worship/liturgical-year-and-calendar/lent/us-bishops-pastoral-statement-on-penance-and-abstinence">Friday penance guidance</a>. New addition: <a href="https://www.usccb.org/prayer-worship/liturgical-year/saint-john-henry-newman">Saint John Henry Newman, October 9</a>.</p>
      </details>
    </div>
  </main>;
}
