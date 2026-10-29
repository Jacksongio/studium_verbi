"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  BookText,
  BookOpen,
  ArrowLeft,
  Tablets,
  Cross,
  HandHeart,
  Droplets,
  Star,
  ScrollText,
  Sunrise,
  Church,
  Flame,
  HeartHandshake,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CATECHISM_SECTIONS } from "./catechism-data";
import styles from "./catechism.module.css";

const SECTION_ICONS: Record<string, LucideIcon> = {
  "profession-of-faith": Cross,
  "seven-sacraments": Droplets,
  "ten-commandments": Tablets,
  "lords-prayer": HandHeart,
  "prayers-and-mass": Flame,
  "holy-rosary": HeartHandshake,
  "blessed-virgin-mary": Star,
  "moral-life": ScrollText,
  "grace-and-justification": Sunrise,
  "last-things": Church,
};

const ROLE_PATTERN = /^(PRIEST(?: \(OR DEACON\))?|PEOPLE|ALL|OR):\s*/;

function renderLiturgicalText(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const match = line.match(ROLE_PATTERN);
    if (match) {
      const role = match[1];
      const rest = line.slice(match[0].length);
      return (
        <span key={i} className={styles.dialogueLine}>
          <span className={styles.role}>{role}</span>
          <span>{rest}</span>
        </span>
      );
    }
    if (line === "") return <span key={i} className={styles.dialogueBreak} />;
    return (
      <span key={i} className={styles.dialogueLine}>
        {line}
      </span>
    );
  });
}

export default function CatechismPage() {
  const searchParams = useSearchParams();
  const sectionParam = searchParams.get("section");
  const scrollRef = useRef<HTMLDivElement>(null);

  const [activeSectionId, setActiveSectionId] = useState<string | null>(
    sectionParam &&
      CATECHISM_SECTIONS.some((s) => s.id === sectionParam)
      ? sectionParam
      : null
  );

  // Sync with URL query param changes (sidebar navigation)
  useEffect(() => {
    if (
      sectionParam &&
      CATECHISM_SECTIONS.some((s) => s.id === sectionParam)
    ) {
      setActiveSectionId(sectionParam);
    }
  }, [sectionParam]);

  // Scroll to top when entering a section
  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [activeSectionId]);

  const activeSection = activeSectionId
    ? CATECHISM_SECTIONS.find((s) => s.id === activeSectionId)
    : null;

  // ── Section detail view ──
  if (activeSection) {
    return (
      <section className={styles.container}>
        <div className={styles.scrollArea} ref={scrollRef}>
          <div className={styles.content}>
            {/* Back button */}
            <button
              className={styles.backBtn}
              onClick={() => setActiveSectionId(null)}
            >
              <ArrowLeft size={14} />
              All Sections
            </button>

            {/* Section header */}
            <div className={styles.header}>
              <div className={styles.headerIcon}>
                <BookText size={24} />
              </div>
              <h1 className={styles.title}>{activeSection.title}</h1>
              {activeSection.subtitle && (
                <p className={styles.subtitle}>{activeSection.subtitle}</p>
              )}
              {activeSection.id === "holy-rosary" && (
                <Link href="/rosary" className={styles.prayLink}>
                  Pray the Rosary, one bead at a time
                </Link>
              )}
            </div>

            {/* Section introduction (e.g., full Lord's Prayer text) */}
            {activeSection.introduction && (
              <p className={styles.sectionIntro}>
                {activeSection.introduction}
              </p>
            )}

            {/* Item cards */}
            {activeSection.items.map((item, idx) => (
              <div key={idx} className={styles.itemCard}>
                <h3 className={styles.itemTitle}>{item.title}</h3>

                {item.text && (
                  ROLE_PATTERN.test(item.text) || item.text.includes("\n") ? (
                    <div className={styles.itemTextBlock}>
                      {renderLiturgicalText(item.text)}
                    </div>
                  ) : (
                    <p className={styles.itemText}>{item.text}</p>
                  )
                )}

                {item.explanation && (
                  <div>
                    <span className={styles.itemExplanationLabel}>
                      The Church teaches
                    </span>
                    <p className={styles.itemExplanation}>
                      {item.explanation}
                    </p>
                  </div>
                )}

                {item.scripture && (
                  <div className={styles.itemScripture}>
                    <BookOpen size={11} className={styles.scriptureIcon} />
                    {item.scripture}
                  </div>
                )}
              </div>
            ))}

            {/* Source attribution */}
            <div className={styles.attribution}>
              Catechism of the Catholic Church (1992) &middot;{" "}
              <a
                href="https://www.vatican.va/archive/ENG0015/_INDEX.HTM"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.attributionLink}
              >
                vatican.va
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── Landing page: 8 section boxes ──
  return (
    <section className={styles.container}>
      <div className={styles.scrollArea} ref={scrollRef}>
        <div className={styles.content}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerIcon}>
              <BookText size={24} />
            </div>
            <h1 className={styles.title}>Catechism of the Catholic Church</h1>
            <p className={styles.subtitle}>
              The four pillars of Catholic faith: the Creed, the Sacraments,
              the Moral Life, and Prayer.
            </p>
          </div>

          {/* Section grid */}
          <div className={styles.sectionGrid}>
            {CATECHISM_SECTIONS.map((section) => {
              const Icon = SECTION_ICONS[section.id] ?? BookText;
              return (
                <button
                  key={section.id}
                  className={styles.sectionBox}
                  onClick={() => setActiveSectionId(section.id)}
                >
                  <div className={styles.sectionBoxIcon}>
                    <Icon size={28} />
                  </div>
                  <h2 className={styles.sectionBoxTitle}>{section.title}</h2>
                </button>
              );
            })}
          </div>

          {/* Source attribution */}
          <div className={styles.attribution}>
            Catechism of the Catholic Church (1992) &middot;{" "}
            <a
              href="https://www.vatican.va/archive/ENG0015/_INDEX.HTM"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.attributionLink}
            >
              vatican.va
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
