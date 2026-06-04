"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  BookText,
  BookOpen,
  ArrowLeft,
  Tablets,
  Cross,
  HandHeart,
  Droplets,
  HeartHandshake,
  Wine,
  Sunrise,
  ScrollText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CATECHISM_SECTIONS } from "./catechism-data";
import styles from "./catechism.module.css";

const SECTION_ICONS: Record<string, LucideIcon> = {
  "ten-commandments": Tablets,
  "apostles-creed": Cross,
  "lords-prayer": HandHeart,
  baptism: Droplets,
  confession: HeartHandshake,
  "sacrament-of-altar": Wine,
  "daily-prayers": Sunrise,
  "table-of-duties": ScrollText,
};

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

                {item.text && <p className={styles.itemText}>{item.text}</p>}

                {item.explanation && (
                  <div>
                    <span className={styles.itemExplanationLabel}>
                      What does this mean?
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
              Luther&rsquo;s Small Catechism (1529) &middot;{" "}
              <a
                href="https://catechism.cph.org/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.attributionLink}
              >
                catechism.cph.org
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
            <h1 className={styles.title}>Luther&rsquo;s Small Catechism</h1>
            <p className={styles.subtitle}>
              The six chief parts of Christian doctrine, as taught by Dr. Martin
              Luther for simple instruction in the faith.
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
            Luther&rsquo;s Small Catechism (1529) &middot;{" "}
            <a
              href="https://catechism.cph.org/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.attributionLink}
            >
              catechism.cph.org
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
