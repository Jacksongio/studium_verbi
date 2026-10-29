import type { Metadata } from "next";
import { connection } from "next/server";
import LiturgicalCalendar from "./liturgical-calendar";

export const metadata: Metadata = {
  title: "Catholic Calendar | Studium Verbi",
  description: "A U.S. Catholic calendar of solemnities, feasts, memorials, holy days of obligation, fasting, and abstinence for 2026–2028.",
};

export default async function CalendarPage() {
  await connection();
  return <LiturgicalCalendar initialDate={new Date().toISOString().slice(0, 10)} />;
}
