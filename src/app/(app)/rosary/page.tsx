import type { Metadata } from "next";
import RosaryPrayer from "./rosary-prayer";

export const metadata: Metadata = {
  title: "The Holy Rosary | Studium Verbi",
  description:
    "Pray the Rosary one bead at a time, with the mysteries for today and the order of the prayers.",
};

export default function RosaryPage() {
  return <RosaryPrayer />;
}
