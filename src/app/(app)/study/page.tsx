"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation, useAction } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { useBibleContext, BIBLE_BOOKS } from "../components/BibleContext";
import type { Id } from "../../../../convex/_generated/dataModel";
import {
  GraduationCap,
  Plus,
  ArrowLeft,
  ChevronDown,
  BookOpen,
  CheckCircle2,
  Circle,
  Trash2,
  Loader2,
} from "lucide-react";
import styles from "./study.module.css";

type View = "list" | "create" | "viewer";

export default function StudyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bible = useBibleContext();

  const plans = useQuery(api.studyPlans.listPlans) ?? [];
  const generatePlan = useAction(api.studyPlanActions.generatePlan);
  const deletePlan = useMutation(api.studyPlans.deletePlan);
  const toggleSession = useMutation(api.studyPlans.toggleSession);
  const toggleReading = useMutation(api.studyPlans.toggleReading);
  const savePromptResponse = useMutation(api.studyPlans.savePromptResponse);

  const [view, setView] = useState<View>("list");
  const [activePlanId, setActivePlanId] = useState<Id<"studyPlans"> | null>(
    null
  );
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState(7);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [editingPrompt, setEditingPrompt] = useState<{
    sessionId: string;
    promptIndex: number;
  } | null>(null);
  const [promptDraft, setPromptDraft] = useState("");

  const activePlan = useQuery(
    api.studyPlans.getPlan,
    activePlanId ? { planId: activePlanId } : "skip"
  );
  const sessions = useQuery(
    api.studyPlans.listSessions,
    activePlanId ? { planId: activePlanId } : "skip"
  );

  // Read plan ID from URL search params
  useEffect(() => {
    const planParam = searchParams.get("plan");
    if (planParam) {
      setActivePlanId(planParam as Id<"studyPlans">);
      setView("viewer");
    }
  }, [searchParams]);

  async function handleGenerate() {
    if (!topic.trim() || isGenerating) return;
    setError("");
    setIsGenerating(true);
    try {
      const planId = await generatePlan({ topic: topic.trim(), durationDays: duration });
      setActivePlanId(planId as Id<"studyPlans">);
      setView("viewer");
      setTopic("");
      router.replace(`/study?plan=${planId}`);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to generate plan."
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function openPlan(planId: Id<"studyPlans">) {
    setActivePlanId(planId);
    setView("viewer");
    router.replace(`/study?plan=${planId}`);
  }

  function backToList() {
    setActivePlanId(null);
    setView("list");
    setExpandedSession(null);
    router.replace("/study");
  }

  function navigateToReading(book: string, startChapter: number) {
    const bookData = BIBLE_BOOKS.find((b) => b.name === book);
    if (bookData) {
      bible.navigate({ book: bookData, chapter: startChapter });
      router.push("/bible");
    }
  }

  const progressPercent =
    activePlan && activePlan.totalSessions > 0
      ? (activePlan.completedSessions / activePlan.totalSessions) * 100
      : 0;

  return (
    <section className={styles.container}>
      <div className={styles.scrollArea}>
        <div className={styles.content}>
          {/* ── Plan List ── */}
          {view === "list" && (
            <>
              <div className={styles.header}>
                <GraduationCap size={28} className={styles.headerIcon} />
                <h1 className={styles.title}>Study Plans</h1>
                <p className={styles.subtitle}>
                  AI-generated Bible reading plans tailored to your interests.
                </p>
              </div>

              <button
                className={styles.createBtn}
                onClick={() => setView("create")}
              >
                <Plus size={16} />
                Create New Plan
              </button>

              {plans.length === 0 ? (
                <div className={styles.emptyState}>
                  <BookOpen size={36} className={styles.emptyIcon} />
                  <h3 className={styles.emptyTitle}>No study plans yet</h3>
                  <p className={styles.emptyText}>
                    Create a plan to get a structured Bible reading schedule
                    with daily sessions, readings, and reflection prompts.
                  </p>
                </div>
              ) : (
                <div className={styles.planList}>
                  {plans.map((plan) => {
                    const pct =
                      plan.totalSessions > 0
                        ? (plan.completedSessions / plan.totalSessions) * 100
                        : 0;
                    return (
                      <div
                        key={plan._id}
                        className={styles.planCard}
                        onClick={() => openPlan(plan._id)}
                      >
                        <div className={styles.planCardHeader}>
                          <h3 className={styles.planCardTitle}>{plan.title}</h3>
                          <button
                            className={styles.planDeleteBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              deletePlan({ planId: plan._id }).catch(() => {});
                              if (activePlanId === plan._id) backToList();
                            }}
                            title="Delete plan"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <p className={styles.planCardDesc}>
                          {plan.description}
                        </p>
                        <div className={styles.planCardFooter}>
                          <div className={styles.progressTrack}>
                            <div
                              className={styles.progressFill}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className={styles.progressLabel}>
                            {plan.completedSessions}/{plan.totalSessions}
                            {plan.status === "completed" && " · Complete"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* ── Create Form ── */}
          {view === "create" && (
            <>
              <button className={styles.backBtn} onClick={backToList}>
                <ArrowLeft size={14} />
                Back to plans
              </button>

              <div className={styles.header}>
                <h1 className={styles.title}>Create a Study Plan</h1>
                <p className={styles.subtitle}>
                  Enter a topic or theme and we'll generate a structured reading
                  plan with daily sessions and reflection prompts.
                </p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Topic or Theme
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="e.g., The Gospel of John, Salvation, Prayer, Sermon on the Mount"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={isGenerating}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleGenerate();
                  }}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Duration
                </label>
                <div className={styles.durationGrid}>
                  {[7, 14, 21, 30].map((d) => (
                    <button
                      key={d}
                      className={`${styles.durationBtn} ${duration === d ? styles.durationBtnActive : ""}`}
                      onClick={() => setDuration(d)}
                      disabled={isGenerating}
                    >
                      {d} days
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className={styles.errorText}>{error}</p>}

              <button
                className={styles.generateBtn}
                onClick={handleGenerate}
                disabled={!topic.trim() || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={16} className={styles.spinner} />
                    Generating your plan...
                  </>
                ) : (
                  <>
                    <GraduationCap size={16} />
                    Generate Plan
                  </>
                )}
              </button>
            </>
          )}

          {/* ── Plan Viewer ── */}
          {view === "viewer" && activePlan && (
            <>
              <button className={styles.backBtn} onClick={backToList}>
                <ArrowLeft size={14} />
                All plans
              </button>

              <div className={styles.viewerHeader}>
                <h1 className={styles.viewerTitle}>{activePlan.title}</h1>
                <p className={styles.viewerDesc}>{activePlan.description}</p>
                <div className={styles.viewerProgress}>
                  <div className={styles.progressTrack}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className={styles.progressLabel}>
                    {activePlan.completedSessions}/{activePlan.totalSessions}{" "}
                    sessions complete
                  </span>
                </div>
              </div>

              <div className={styles.sessionList}>
                {(sessions ?? []).map((session) => {
                  const isExpanded = expandedSession === session._id;
                  return (
                    <div
                      key={session._id}
                      className={`${styles.sessionCard} ${session.completed ? styles.sessionCompleted : ""}`}
                    >
                      <div
                        className={styles.sessionHeader}
                        onClick={() =>
                          setExpandedSession(isExpanded ? null : session._id)
                        }
                      >
                        <button
                          className={styles.sessionCheck}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSession({
                              planId: activePlan._id,
                              sessionId: session._id,
                            }).catch(() => {});
                          }}
                          title={
                            session.completed
                              ? "Mark incomplete"
                              : "Mark complete"
                          }
                        >
                          {session.completed ? (
                            <CheckCircle2 size={20} />
                          ) : (
                            <Circle size={20} />
                          )}
                        </button>
                        <div className={styles.sessionInfo}>
                          <span className={styles.sessionNumber}>
                            Day {session.sessionNumber}
                          </span>
                          <span className={styles.sessionTitle}>
                            {session.title}
                          </span>
                        </div>
                        <ChevronDown
                          size={14}
                          className={`${styles.sessionChevron} ${isExpanded ? styles.sessionChevronOpen : ""}`}
                        />
                      </div>

                      {isExpanded && (
                        <div className={styles.sessionBody}>
                          {/* Readings */}
                          <div className={styles.readingsSection}>
                            <h4 className={styles.sectionLabel}>Readings</h4>
                            <div className={styles.readingsList}>
                              {session.readings.map((r, i) => {
                                const isDone = (
                                  session.completedReadings ?? []
                                ).includes(i);
                                return (
                                  <div
                                    key={i}
                                    className={styles.readingRow}
                                  >
                                    <button
                                      className={styles.readingCheck}
                                      onClick={() =>
                                        toggleReading({
                                          planId: activePlan._id,
                                          sessionId: session._id,
                                          readingIndex: i,
                                        }).catch(() => {})
                                      }
                                      title={
                                        isDone
                                          ? "Mark unread"
                                          : "Mark as read"
                                      }
                                    >
                                      {isDone ? (
                                        <CheckCircle2 size={15} />
                                      ) : (
                                        <Circle size={15} />
                                      )}
                                    </button>
                                    <button
                                      className={`${styles.readingChip} ${isDone ? styles.readingChipDone : ""}`}
                                      onClick={() =>
                                        navigateToReading(
                                          r.book,
                                          r.startChapter
                                        )
                                      }
                                      title="Open in Bible reader"
                                    >
                                      <BookOpen size={12} />
                                      {r.book}{" "}
                                      {r.startChapter === r.endChapter
                                        ? r.startChapter
                                        : `${r.startChapter}–${r.endChapter}`}
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Prompts */}
                          {session.prompts.length > 0 && (
                            <div className={styles.promptsSection}>
                              <h4 className={styles.sectionLabel}>
                                Reflection Prompts
                              </h4>
                              <div className={styles.promptList}>
                                {session.prompts.map((p, i) => {
                                  const response =
                                    (session.promptResponses ?? [])[i] ?? "";
                                  const isEditing =
                                    editingPrompt?.sessionId ===
                                      session._id &&
                                    editingPrompt?.promptIndex === i;

                                  return (
                                    <div
                                      key={i}
                                      className={styles.promptCard}
                                    >
                                      <p className={styles.promptQuestion}>
                                        <span
                                          className={styles.promptNumber}
                                        >
                                          {i + 1}.
                                        </span>
                                        {p}
                                      </p>

                                      {isEditing ? (
                                        <div
                                          className={
                                            styles.promptResponseEditor
                                          }
                                        >
                                          <textarea
                                            className={
                                              styles.promptTextarea
                                            }
                                            value={promptDraft}
                                            onChange={(e) =>
                                              setPromptDraft(e.target.value)
                                            }
                                            placeholder="Write your reflection..."
                                            rows={3}
                                            autoFocus
                                          />
                                          <div
                                            className={
                                              styles.promptEditorActions
                                            }
                                          >
                                            <button
                                              className={
                                                styles.promptSaveBtn
                                              }
                                              onClick={() => {
                                                savePromptResponse({
                                                  planId: activePlan._id,
                                                  sessionId: session._id,
                                                  promptIndex: i,
                                                  response: promptDraft,
                                                }).catch(() => {});
                                                setEditingPrompt(null);
                                                setPromptDraft("");
                                              }}
                                            >
                                              Save
                                            </button>
                                            <button
                                              className={
                                                styles.promptCancelBtn
                                              }
                                              onClick={() => {
                                                setEditingPrompt(null);
                                                setPromptDraft("");
                                              }}
                                            >
                                              Cancel
                                            </button>
                                          </div>
                                        </div>
                                      ) : response ? (
                                        <div
                                          className={
                                            styles.promptResponseDisplay
                                          }
                                          onClick={() => {
                                            setEditingPrompt({
                                              sessionId: session._id,
                                              promptIndex: i,
                                            });
                                            setPromptDraft(response);
                                          }}
                                        >
                                          <p
                                            className={
                                              styles.promptResponseText
                                            }
                                          >
                                            {response}
                                          </p>
                                        </div>
                                      ) : (
                                        <button
                                          className={
                                            styles.promptAnswerBtn
                                          }
                                          onClick={() => {
                                            setEditingPrompt({
                                              sessionId: session._id,
                                              promptIndex: i,
                                            });
                                            setPromptDraft("");
                                          }}
                                        >
                                          Write your reflection...
                                        </button>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Loading state when plan is being fetched */}
          {view === "viewer" && !activePlan && activePlanId && (
            <div className={styles.emptyState}>
              <Loader2 size={24} className={styles.spinner} />
              <p className={styles.emptyText}>Loading plan...</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
