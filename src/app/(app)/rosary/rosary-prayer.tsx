"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { ArrowLeft } from "lucide-react";
import {
  MYSTERY_SETS,
  buildSteps,
  getMysterySet,
  isMysterySetId,
  mysterySetForWeekday,
  type MysterySetId,
  type RosaryStep,
} from "./rosary-data";
import styles from "./rosary.module.css";

const STORAGE_KEY = "studium-verbi-rosary";
const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

type Mode = "home" | "howto" | "mysteries" | "pray" | "done";

interface Progress {
  setId: MysterySetId;
  stepIndex: number;
}

interface Clock {
  todayId: MysterySetId;
  weekday: string;
}

function subscribeNoop() {
  return () => {};
}

function readDay() {
  return String(new Date().getDay());
}

function readStoredProgress() {
  return sessionStorage.getItem(STORAGE_KEY);
}

function serverDay() {
  return "";
}

function serverProgress() {
  return null;
}

function parseProgress(raw: string | null): Progress | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const record = parsed as { setId?: unknown; stepIndex?: unknown };
    if (!isMysterySetId(record.setId) || typeof record.stepIndex !== "number") {
      return null;
    }
    const steps = buildSteps(record.setId);
    if (
      !Number.isInteger(record.stepIndex) ||
      record.stepIndex <= 0 ||
      record.stepIndex >= steps.length
    ) {
      return null;
    }
    return { setId: record.setId, stepIndex: record.stepIndex };
  } catch {
    return null;
  }
}

function RosaryGlyph({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="7" r="4.25" />
      <path d="M12 11.25v9.25" />
      <path d="M10.15 16.6h3.7" />
    </svg>
  );
}

function StepMarker({ marker }: { marker: RosaryStep["marker"] }) {
  if (marker.type === "crucifix") {
    return (
      <div className={styles.markerRow} aria-hidden="true">
        <span className={styles.crucifix} />
      </div>
    );
  }
  if (marker.type === "chain") {
    return (
      <div className={styles.markerRow} aria-hidden="true">
        <span className={styles.chain} />
      </div>
    );
  }
  return (
    <div className={styles.beads} aria-hidden="true">
      {Array.from({ length: marker.count }, (_, index) => (
        <span
          key={index}
          className={[
            styles.bead,
            marker.size === "large" ? styles.beadLarge : "",
            index < marker.index ? styles.beadDone : "",
            index === marker.index ? styles.beadActive : "",
          ]
            .filter(Boolean)
            .join(" ")}
        />
      ))}
    </div>
  );
}

export default function RosaryPrayer() {
  const dayRaw = useSyncExternalStore(subscribeNoop, readDay, serverDay);
  const storedRaw = useSyncExternalStore(subscribeNoop, readStoredProgress, serverProgress);
  const stored = useMemo(() => parseProgress(storedRaw), [storedRaw]);
  const [mode, setMode] = useState<Mode>("home");
  const [selectedOverride, setSelectedOverride] = useState<MysterySetId | null>(null);
  const [override, setOverride] = useState<Progress | null | undefined>(undefined);
  const [finishedName, setFinishedName] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const prayScrollRef = useRef<HTMLDivElement>(null);

  const clock: Clock | null =
    dayRaw === ""
      ? null
      : {
          todayId: mysterySetForWeekday(Number(dayRaw)),
          weekday: WEEKDAYS[Number(dayRaw)],
        };
  const progress = override === undefined ? stored : override;
  const selectedId = selectedOverride ?? progress?.setId ?? clock?.todayId ?? null;

  useEffect(() => {
    if (dayRaw === "" || override === undefined) return;
    if (override && override.stepIndex > 0) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(override));
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [dayRaw, override]);

  useEffect(() => {
    if (mode !== "pray") scrollRef.current?.scrollTo(0, 0);
  }, [mode]);

  const activeSetId = progress?.setId ?? selectedId;
  const steps = useMemo(
    () => (activeSetId ? buildSteps(activeSetId) : []),
    [activeSetId]
  );
  const stepIndex = progress?.stepIndex ?? 0;
  const step = steps[stepIndex];

  const begin = useCallback((setId: MysterySetId) => {
    setSelectedOverride(setId);
    setOverride({ setId, stepIndex: 0 });
    setMode("pray");
  }, []);

  const resume = useCallback(() => {
    if (!progress) return;
    setSelectedOverride(progress.setId);
    setMode("pray");
  }, [progress]);

  const goForward = useCallback(() => {
    if (!progress) return;
    const currentSteps = buildSteps(progress.setId);
    if (progress.stepIndex >= currentSteps.length - 1) {
      setFinishedName(getMysterySet(progress.setId).name);
      setOverride(null);
      setMode("done");
      return;
    }
    setOverride({ ...progress, stepIndex: progress.stepIndex + 1 });
  }, [progress]);

  const goBack = useCallback(() => {
    if (!progress || progress.stepIndex === 0) return;
    setOverride({ ...progress, stepIndex: progress.stepIndex - 1 });
  }, [progress]);

  const pause = useCallback(() => {
    setMode("home");
  }, []);

  useEffect(() => {
    if (mode !== "pray") return;
    prayScrollRef.current?.scrollTo(0, 0);
  }, [mode, stepIndex]);

  useEffect(() => {
    if (mode !== "pray") return;
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goForward();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goBack();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, goForward, goBack]);

  const selected = selectedId ? getMysterySet(selectedId) : null;
  const canResume =
    progress !== null &&
    selectedId !== null &&
    progress.setId === selectedId &&
    progress.stepIndex > 0;
  const pausedStep =
    progress && selectedId && progress.setId === selectedId && progress.stepIndex > 0
      ? buildSteps(progress.setId)[progress.stepIndex]
      : null;

  if (mode === "pray" && step && progress) {
    const fraction = ((stepIndex + 1) / steps.length) * 100;
    return (
      <section className={styles.container}>
        <div
          className={styles.progress}
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-valuenow={stepIndex + 1}
          aria-valuetext={`${step.phase}. ${step.bead}`}
        >
          <div className={styles.progressFill} style={{ width: `${fraction}%` }} />
        </div>
        <div className={styles.prayLayout}>
          <div className={styles.prayTop}>
            <button type="button" className={styles.pauseBtn} onClick={pause}>
              Pause
            </button>
            <p className={styles.phase}>{step.phase}</p>
          </div>
          <div className={styles.prayScroll} ref={prayScrollRef}>
            <div className={styles.step} aria-live="polite">
              {step.showMysteryBanner && step.mystery && (
                <div className={styles.banner}>
                  <p className={styles.bannerTitle}>{step.mystery.title}</p>
                  <p className={styles.bannerFruit}>
                    Grace to ask: {step.mystery.fruit}
                  </p>
                </div>
              )}
              <p className={styles.kicker}>{step.kicker}</p>
              <h2 className={styles.stepTitle}>{step.title}</h2>
              <p className={styles.beadLabel}>{step.bead}</p>
              {step.kicker === "Pray" && step.note && (
                <p className={styles.note}>{step.note}</p>
              )}
              <p className={styles.prayerText}>{step.text}</p>
              {step.kicker !== "Pray" && step.note && (
                <p className={styles.note}>{step.note}</p>
              )}
              {step.reference && (
                <p className={styles.reference}>{step.reference}</p>
              )}
              <StepMarker marker={step.marker} />
            </div>
          </div>
          <div className={styles.prayFooter}>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={goBack}
              disabled={stepIndex === 0}
            >
              Back
            </button>
            <button type="button" className={styles.primaryBtn} onClick={goForward}>
              {stepIndex === steps.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <div className={styles.scrollArea} ref={scrollRef}>
        <div className={styles.content}>
          {mode === "home" && (
            <Home
              ready={clock !== null}
              clock={clock}
              selected={selected}
              canResume={canResume}
              pausedStep={pausedStep}
              onSelect={setSelectedOverride}
              onBegin={() => selectedId && begin(selectedId)}
              onResume={resume}
              onHowTo={() => setMode("howto")}
              onMysteries={() => setMode("mysteries")}
            />
          )}
          {mode === "howto" && selectedId && (
            <HowTo
              onBack={() => setMode("home")}
              onBegin={canResume ? resume : () => begin(selectedId)}
              beginLabel={canResume ? "Continue" : "Begin the Rosary"}
            />
          )}
          {mode === "mysteries" && clock && (
            <Mysteries
              todayId={clock.todayId}
              pausedSetId={canResume && progress ? progress.setId : null}
              onBack={() => setMode("home")}
              onPray={begin}
              onResume={resume}
            />
          )}
          {mode === "done" && (
            <Done
              name={finishedName}
              onAgain={() => selectedId && begin(selectedId)}
              onHome={() => setMode("home")}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function Home({
  ready,
  clock,
  selected,
  canResume,
  pausedStep,
  onSelect,
  onBegin,
  onResume,
  onHowTo,
  onMysteries,
}: {
  ready: boolean;
  clock: Clock | null;
  selected: ReturnType<typeof getMysterySet> | null;
  canResume: boolean;
  pausedStep: RosaryStep | null;
  onSelect: (id: MysterySetId) => void;
  onBegin: () => void;
  onResume: () => void;
  onHowTo: () => void;
  onMysteries: () => void;
}) {
  const isToday = clock !== null && selected?.id === clock.todayId;
  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerIcon}>
          <RosaryGlyph size={28} />
        </div>
        <h1 className={styles.title}>The Holy Rosary</h1>
        <p className={styles.subtitle}>
          A step-by-step way to pray the mysteries with Mary.
        </p>
      </header>
      {ready && selected && (
        <>
          <p className={styles.dayLine}>
            {isToday && clock
              ? `${clock.weekday} · the set for today`
              : selected.days}
          </p>
          <h2 className={styles.setHeading}>{selected.name}</h2>
          <div className={styles.preview}>
            <ol className={styles.previewList}>
              {selected.mysteries.map((mystery, index) => (
                <li key={mystery.title} className={styles.previewItem}>
                  <span>
                    <span className={styles.previewIndex}>{index + 1}</span>
                    {mystery.title}
                  </span>
                  <span className={styles.previewFruit}>{mystery.fruit}</span>
                </li>
              ))}
            </ol>
          </div>
          {pausedStep && (
            <p className={styles.pausedNote}>
              Paused at {pausedStep.phase.toLowerCase()}, {pausedStep.bead.toLowerCase()}.
            </p>
          )}
          <div className={styles.actions}>
            {canResume && (
              <button type="button" className={styles.primaryBtn} onClick={onResume}>
                Continue
              </button>
            )}
            <button
              type="button"
              className={canResume ? styles.secondaryBtn : styles.primaryBtn}
              onClick={onBegin}
            >
              {canResume ? "Start from the beginning" : "Begin the Rosary"}
            </button>
          </div>
          <p className={styles.chooserLabel}>Or choose another set</p>
          <div className={styles.setPicker} role="group" aria-label="Mystery set">
            {MYSTERY_SETS.map((set) => (
              <button
                key={set.id}
                type="button"
                className={`${styles.setBtn} ${selected.id === set.id ? styles.setBtnActive : ""}`}
                aria-pressed={selected.id === set.id}
                onClick={() => onSelect(set.id)}
              >
                <span className={styles.setName}>{set.shortName}</span>
                <span className={styles.setDays}>
                  {set.days}
                  {clock?.todayId === set.id ? " · Today" : ""}
                </span>
              </button>
            ))}
          </div>
          <nav className={styles.homeLinks}>
            <button type="button" className={styles.textBtn} onClick={onHowTo}>
              How to pray
            </button>
            <button type="button" className={styles.textBtn} onClick={onMysteries}>
              The mysteries
            </button>
          </nav>
        </>
      )}
    </>
  );
}

function HowTo({
  onBack,
  onBegin,
  beginLabel,
}: {
  onBack: () => void;
  onBegin: () => void;
  beginLabel: string;
}) {
  return (
    <>
      <button type="button" className={styles.backBtn} onClick={onBack}>
        <ArrowLeft size={14} />
        The Rosary
      </button>
      <header className={styles.header}>
        <h1 className={styles.title}>How to pray</h1>
        <p className={styles.subtitle}>
          The beads keep count, so your mind can stay on the mystery.
        </p>
      </header>
      <div className={styles.prose}>
        <h2 className={styles.sectionTitle}>What you are doing</h2>
        <p className={styles.body}>
          With each Hail Mary you greet Mary and, with her, look at one scene
          from the life of her Son. A full Rosary is five scenes. Each scene is
          a decade: one Our Father and ten Hail Marys.
        </p>
        <h2 className={styles.sectionTitle}>On the beads</h2>
        <div className={styles.beadCard}>
          <ul className={styles.beadList}>
            <li>
              <span className={styles.beadMark}>✝</span>
              <span>Crucifix. The Sign of the Cross and the Apostles’ Creed.</span>
            </li>
            <li>
              <span className={styles.beadMark}>●</span>
              <span>One large bead. The Our Father.</span>
            </li>
            <li>
              <span className={styles.beadMark}>○○○</span>
              <span>Three small beads. Hail Marys for faith, hope, and charity.</span>
            </li>
            <li>
              <span className={styles.beadMark}>—</span>
              <span>The chain. The Glory Be.</span>
            </li>
            <li>
              <span className={styles.beadMark}>5×</span>
              <span>
                A large bead, then ten small beads, for each mystery. End the
                ten on the chain with the Glory Be and the Fatima prayer.
              </span>
            </li>
          </ul>
        </div>
        <h2 className={styles.sectionTitle}>The order</h2>
        <ol className={styles.orderList}>
          <li>Make the Sign of the Cross and pray the Apostles’ Creed on the crucifix.</li>
          <li>Pray the Our Father on the first large bead.</li>
          <li>Pray three Hail Marys, for faith, hope, and charity.</li>
          <li>Pray the Glory Be.</li>
          <li>
            Announce the mystery. Pray the Our Father, ten Hail Marys while you
            meditate on it, the Glory Be, and the Fatima prayer. Do this for
            all five mysteries.
          </li>
          <li>Pray the Hail, Holy Queen, the short verse, and the closing prayer.</li>
          <li>Close with the Sign of the Cross.</li>
        </ol>
        <h2 className={styles.sectionTitle}>Which mysteries</h2>
        <p className={styles.body}>
          Monday and Saturday are the Joyful Mysteries. Tuesday and Friday are
          the Sorrowful. Wednesday and Sunday are the Glorious. Thursday is the
          Luminous. This page opens on the set for today. You can choose
          another.
        </p>
        <p className={styles.seasonNote}>
          On Sundays of Advent and Christmas, the Joyful Mysteries are
          customary. On Sundays of Lent, the Sorrowful Mysteries.
        </p>
        <h2 className={styles.sectionTitle}>While you pray</h2>
        <p className={styles.body}>
          At the start of a decade, read the scene once. Through the ten Hail
          Marys, keep that scene in mind, or quietly ask for the grace named
          with it. When your attention wanders, return at the next bead. The
          words on the prayer screen are the ordinary form of each prayer. You
          may add a few words after the name of Jesus, such as “who was born
          in Bethlehem,” if that helps you remember the scene.
        </p>
        <p className={styles.body}>
          If you have no beads, count the ten Hail Marys on your fingers. A
          single decade is enough when time is short. Pause keeps your place
          until you close this tab. The right and left arrow keys also move
          between prayers.
        </p>
      </div>
      <button type="button" className={styles.primaryBtn} onClick={onBegin}>
        {beginLabel}
      </button>
    </>
  );
}

function Mysteries({
  todayId,
  pausedSetId,
  onBack,
  onPray,
  onResume,
}: {
  todayId: MysterySetId;
  pausedSetId: MysterySetId | null;
  onBack: () => void;
  onPray: (id: MysterySetId) => void;
  onResume: () => void;
}) {
  return (
    <>
      <button type="button" className={styles.backBtn} onClick={onBack}>
        <ArrowLeft size={14} />
        The Rosary
      </button>
      <header className={styles.header}>
        <h1 className={styles.title}>The mysteries</h1>
        <p className={styles.subtitle}>
          Twenty scenes from the life of Christ and his Mother. Pray five at a time.
        </p>
      </header>
      <p className={styles.seasonNote}>
        The Luminous Mysteries were commended by Saint John Paul II in 2002.
        On Sundays of Advent and Christmas, the Joyful Mysteries are customary.
        On Sundays of Lent, the Sorrowful Mysteries.
      </p>
      {MYSTERY_SETS.map((set) => (
        <article
          key={set.id}
          className={`${styles.setBlock} ${set.id === todayId ? styles.setBlockToday : ""}`}
        >
          <div className={styles.setBlockHeader}>
            <div>
              <h2 className={styles.setBlockTitle}>{set.name}</h2>
              <p className={styles.setBlockDays}>
                {set.days}
                {set.id === todayId ? " · Today" : ""}
              </p>
            </div>
            <button
              type="button"
              className={styles.inlineBtn}
              onClick={() => (pausedSetId === set.id ? onResume() : onPray(set.id))}
            >
              {pausedSetId === set.id ? "Continue" : "Pray this set"}
            </button>
          </div>
          {set.mysteries.map((mystery, index) => (
            <div key={mystery.title} className={styles.mystery}>
              <h3 className={styles.mysteryTitle}>
                <span className={styles.mysteryIndex}>{index + 1}</span>
                {mystery.title}
              </h3>
              <p className={styles.meditation}>{mystery.meditation}</p>
              <div className={styles.metaRow}>
                <span>{mystery.reference}</span>
                <span>Grace to ask: {mystery.fruit}</span>
              </div>
            </div>
          ))}
        </article>
      ))}
    </>
  );
}

function Done({
  name,
  onAgain,
  onHome,
}: {
  name: string;
  onAgain: () => void;
  onHome: () => void;
}) {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerIcon}>
          <RosaryGlyph size={28} />
        </div>
        <h1 className={styles.doneTitle}>The Rosary is complete</h1>
        <p className={styles.subtitle}>
          {name ? `${name}. ` : ""}
          May the scenes you kept company with take root.
        </p>
      </header>
      <div className={styles.actions}>
        <button type="button" className={styles.primaryBtn} onClick={onAgain}>
          Pray it again
        </button>
        <button type="button" className={styles.secondaryBtn} onClick={onHome}>
          Back to the start
        </button>
      </div>
    </>
  );
}
