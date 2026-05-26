import type { Metadata } from "next";
import { Cinzel, Lora, Inter } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "./ConvexClientProvider";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Studium Verbi | Premium Patristic Bible Study & RAG Assistant",
  description: "An elegant, Gutenberg-styled Bible reader and advanced theological RAG study companion. Explore scriptures, view patristic commentaries, highlight verses, and seek wisdom with our AI study assistant.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${lora.variable} ${inter.variable}`}
      style={{ height: "100%" }}
    >
      <body style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
