"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Send,
  MessageSquare,
  ChevronRight,
  Feather,
  Copy,
  Check,
  Pencil,
} from "lucide-react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Verse, Commentary } from "../lib/bible-database";
import { useChatContext } from "./components/ChatContext";
import styles from "./app.module.css";

export default function StudyPage() {
  const { activeChatId, setActiveChatId } = useChatContext();
  const createChat = useMutation(api.chats.createChat);
  const sendMessage = useMutation(api.messages.sendMessage);
  const updateMessage = useMutation(api.messages.updateMessage);
  const studyQuery = useAction(api.search.studyQuery);
  const messages =
    useQuery(
      api.messages.listMessages,
      activeChatId ? { chatId: activeChatId } : "skip"
    ) ?? [];

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [regeneratingMsgId, setRegeneratingMsgId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const creatingRef = useRef(false);

  function copyToClipboard(text: string, msgId: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(msgId);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(() => {});
  }

  function startEditing(msgId: string, text: string) {
    setEditingMsgId(msgId);
    setEditText(text);
  }

  function cancelEditing() {
    setEditingMsgId(null);
    setEditText("");
  }

  async function submitEdit() {
    if (!editText.trim() || isTyping || !editingMsgId || !activeChatId) return;
    const text = editText.trim();
    const msgId = editingMsgId;
    setEditingMsgId(null);
    setEditText("");
    setIsTyping(true);

    try {
      // Update the user message in place
      await updateMessage({ messageId: msgId as any, text });

      // Find the assistant response that follows this user message
      const msgIndex = messages.findIndex((m) => m._id === msgId);
      const nextMsg =
        msgIndex >= 0 && msgIndex + 1 < messages.length
          ? messages[msgIndex + 1]
          : null;

      // Hide the old assistant response while regenerating
      if (nextMsg && nextMsg.sender === "assistant") {
        setRegeneratingMsgId(nextMsg._id);
      }

      // Re-run RAG with the edited question
      const result = await studyQuery({ query: text });

      if (nextMsg && nextMsg.sender === "assistant") {
        await updateMessage({
          messageId: nextMsg._id,
          text: result.analysis,
          verses: result.verses,
        });
      } else {
        await sendMessage({
          chatId: activeChatId,
          sender: "assistant",
          text: result.analysis,
          verses: result.verses,
        });
      }
    } catch {
      // silently fail
    } finally {
      setIsTyping(false);
      setRegeneratingMsgId(null);
    }
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const submitChat = async (queryText: string) => {
    if (!queryText.trim() || isTyping || creatingRef.current) return;

    setInputText("");
    setIsTyping(true);

    try {
      let chatId = activeChatId;

      // Create chat on first message
      if (!chatId) {
        creatingRef.current = true;
        const title =
          queryText.length > 40
            ? queryText.slice(0, 40) + "..."
            : queryText;
        chatId = await createChat({ title });
        setActiveChatId(chatId);
        creatingRef.current = false;
      }

      // Send user message
      await sendMessage({ chatId, sender: "user", text: queryText });

      // Run real RAG: embed → vector search → GPT-4o-mini synthesis
      try {
        const result = await studyQuery({ query: queryText });
        await sendMessage({
          chatId: chatId!,
          sender: "assistant",
          text: result.analysis,
          verses: result.verses,
        });
      } finally {
        setIsTyping(false);
      }
    } catch {
      setIsTyping(false);
      creatingRef.current = false;
    }
  };

  const renderTextWithDropCap = (text: string) => {
    const paragraphs = text.split("\n\n");
    if (paragraphs.length === 0) return null;

    const firstParagraph = paragraphs[0];
    let firstChar = "";
    let restOfFirstParagraph = "";

    let charIndex = 0;
    while (charIndex < firstParagraph.length) {
      const char = firstParagraph.charAt(charIndex);
      if (/[a-zA-Z]/.test(char)) {
        firstChar = char;
        restOfFirstParagraph =
          firstParagraph.slice(0, charIndex) +
          firstParagraph.slice(charIndex + 1);
        break;
      }
      charIndex++;
    }

    if (!firstChar) {
      return (
        <div className={styles.theologyBody}>
          {paragraphs.map((para, i) => (
            <p key={i} className={styles.theologyParagraph}>
              {para}
            </p>
          ))}
        </div>
      );
    }

    return (
      <div className={styles.theologyBody}>
        <p className={styles.theologyParagraph}>
          <span className={styles.dropCapChar}>{firstChar}</span>
          {restOfFirstParagraph}
        </p>
        {paragraphs.slice(1).map((para, i) => (
          <p key={i} className={styles.theologyParagraph}>
            {para}
          </p>
        ))}
      </div>
    );
  };

  return (
    <section className={styles.chatWorkspace}>
      <div className={styles.chatScrollArea}>
        <div className={styles.chatContentWidth}>
          {messages.length === 0 && !isTyping ? (
            <div className={styles.welcomeCard}>
              <Image src="/sv_logo_transparent.png" alt="Studium Verbi" width={80} height={80} className={styles.welcomeFoil} />
              <h2 className={styles.welcomeTitle}>Studium Verbi</h2>
              <p className={styles.welcomeText}>
                Explore covenant theology, messianic prophecy, and patristic
                commentary. Ask a question and our theological assistant will
                synthesize insights from scripture and the Church Fathers.
              </p>
              <div className={styles.welcomeDivider} />

              <div className={styles.suggestedContainer}>
                <div
                  className={styles.suggestedCard}
                  onClick={() =>
                    submitChat(
                      "What is the theology of the Logos in John 1?"
                    )
                  }
                >
                  <MessageSquare
                    className={styles.suggestedIcon}
                    size={18}
                  />
                  <div>
                    <h4 className={styles.suggestedLabel}>Cosmology</h4>
                    <p className={styles.suggestedDesc}>
                      What is the theology of the Logos in John 1:1?
                    </p>
                  </div>
                </div>

                <div
                  className={styles.suggestedCard}
                  onClick={() =>
                    submitChat(
                      "Explain St. Paul's theology of grace in Romans 8"
                    )
                  }
                >
                  <MessageSquare
                    className={styles.suggestedIcon}
                    size={18}
                  />
                  <div>
                    <h4 className={styles.suggestedLabel}>Soteriology</h4>
                    <p className={styles.suggestedDesc}>
                      Explain St. Paul&apos;s theology of grace in Romans 8.
                    </p>
                  </div>
                </div>

                <div
                  className={styles.suggestedCard}
                  onClick={() =>
                    submitChat(
                      "What messianic titles are given in Isaiah 9:6?"
                    )
                  }
                >
                  <MessageSquare
                    className={styles.suggestedIcon}
                    size={18}
                  />
                  <div>
                    <h4 className={styles.suggestedLabel}>Christology</h4>
                    <p className={styles.suggestedDesc}>
                      What messianic titles are given in Isaiah 9:6?
                    </p>
                  </div>
                </div>

                <div
                  className={styles.suggestedCard}
                  onClick={() =>
                    submitChat(
                      "How does God provide comfort in trials in Psalm 23?"
                    )
                  }
                >
                  <MessageSquare
                    className={styles.suggestedIcon}
                    size={18}
                  />
                  <div>
                    <h4 className={styles.suggestedLabel}>Comfort</h4>
                    <p className={styles.suggestedDesc}>
                      The shepherdhood of God in times of trial (Psalm 23).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              if (msg._id === regeneratingMsgId) return null;
              const isUser = msg.sender === "user";
              return (
                <div
                  key={msg._id}
                  className={`${styles.msgContainer} ${isUser ? styles.scholarContainer : styles.theologianContainer}`}
                >
                  <div className={styles.msgHeader}>
                    {isUser ? (
                      <>
                        <Feather size={12} />
                        <span className={styles.scholarLabel}>Scholar</span>
                      </>
                    ) : (
                      <>
                        <Image src="/sv_logo_transparent.png" alt="" width={18} height={18} />
                        <span className={styles.theologianLabel}>
                          Theologian RAG
                        </span>
                      </>
                    )}
                  </div>

                  {isUser ? (
                    editingMsgId === msg._id ? (
                      <div className={styles.scholarEditWrap}>
                        <textarea
                          className={styles.scholarEditInput}
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              submitEdit();
                            }
                            if (e.key === "Escape") cancelEditing();
                          }}
                          rows={2}
                          autoFocus
                        />
                        <div className={styles.scholarEditActions}>
                          <button
                            className={styles.scholarEditSubmit}
                            onClick={submitEdit}
                            disabled={!editText.trim() || isTyping}
                          >
                            <Send size={12} />
                            Resubmit
                          </button>
                          <button
                            className={styles.scholarEditCancel}
                            onClick={cancelEditing}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className={styles.scholarMsg}>{msg.text}</div>
                        <div className={styles.msgActions}>
                          <button
                            className={styles.msgActionBtn}
                            onClick={() => startEditing(msg._id, msg.text)}
                            title="Edit and resubmit"
                          >
                            <Pencil size={12} />
                          </button>
                        </div>
                      </>
                    )
                  ) : (
                    <>
                    <div className={styles.theologianMsgCard}>
                      {renderTextWithDropCap(msg.text)}

                      {((msg.verses && msg.verses.length > 0) ||
                        (msg.commentaries &&
                          msg.commentaries.length > 0)) && (
                        <div className={styles.ragBibliotheca}>
                          <button
                            className={styles.accordionTrigger}
                            onClick={() =>
                              setActiveAccordion(
                                activeAccordion === msg._id
                                  ? null
                                  : msg._id
                              )
                            }
                          >
                            <span>
                              View sources — {msg.verses?.length || 0}{" "}
                              verses, {msg.commentaries?.length || 0}{" "}
                              commentaries
                            </span>
                            <ChevronRight
                              size={14}
                              className={`${styles.accordionIcon} ${activeAccordion === msg._id ? styles.accordionIconRotated : ""}`}
                            />
                          </button>

                          {activeAccordion === msg._id && (
                            <div className={styles.accordionPanel}>
                              {msg.verses && msg.verses.length > 0 && (
                                <div>
                                  <h4 className={styles.subSectionTitle}>
                                    Scriptural Context
                                  </h4>
                                  <div
                                    className={
                                      styles.retrievedVersesGrid
                                    }
                                  >
                                    {msg.verses.map(
                                      (v: Verse, vIdx: number) => (
                                        <div
                                          key={vIdx}
                                          className={
                                            styles.verseCitationCard
                                          }
                                        >
                                          <span
                                            className={
                                              styles.verseCitationRef
                                            }
                                          >
                                            {v.book} {v.chapter}:
                                            {v.verse}
                                          </span>
                                          <p
                                            className={
                                              styles.verseCitationText
                                            }
                                          >
                                            &ldquo;{v.text}&rdquo;
                                          </p>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}

                              {msg.commentaries &&
                                msg.commentaries.length > 0 && (
                                  <div style={{ marginTop: "0.25rem" }}>
                                    <h4 className={styles.subSectionTitle}>
                                      Patristic Commentary
                                    </h4>
                                    <div className={styles.patristicGrid}>
                                      {msg.commentaries.map(
                                        (
                                          com: Commentary,
                                          comIdx: number
                                        ) => (
                                          <div
                                            key={comIdx}
                                            className={
                                              styles.exegesisCard
                                            }
                                          >
                                            <p
                                              className={
                                                styles.exegesisQuote
                                              }
                                            >
                                              &ldquo;{com.content}&rdquo;
                                            </p>
                                            <p
                                              className={
                                                styles.exegesisSource
                                              }
                                            >
                                              — {com.author} ({com.era})
                                            </p>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className={styles.msgActions}>
                      <button
                        className={styles.msgActionBtn}
                        onClick={() => copyToClipboard(msg.text, msg._id)}
                        title={copiedId === msg._id ? "Copied!" : "Copy response"}
                      >
                        {copiedId === msg._id ? (
                          <Check size={12} />
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                    </div>
                    </>
                  )}
                </div>
              );
            })
          )}

          {isTyping && (
            <div
              className={`${styles.msgContainer} ${styles.theologianContainer}`}
            >
              <div className={styles.msgHeader}>
                <Image src="/sv_logo_transparent.png" alt="" width={18} height={18} />
                <span className={styles.theologianLabel}>Scribing...</span>
              </div>
              <div className={styles.theologianMsgCard}>
                <div className={styles.typingContainer}>
                  <div className={styles.dot} />
                  <div className={styles.dot} />
                  <div className={styles.dot} />
                  <span
                    style={{
                      fontSize: "0.82rem",
                      color: "var(--text-secondary)",
                      fontFamily: "var(--font-lora), serif",
                      fontStyle: "italic",
                      marginLeft: "8px",
                      opacity: 0.6,
                    }}
                  >
                    Searching scriptures...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      <footer className={styles.footerArea}>
        <form
          className={styles.inputRibbon}
          onSubmit={(e) => {
            e.preventDefault();
            submitChat(inputText);
          }}
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about scripture, theology, or the Church Fathers..."
            className={styles.textInput}
            disabled={isTyping}
          />
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isTyping}
            title="Send query"
          >
            <Send size={16} />
          </button>
        </form>
        <div className={styles.helperText}>
          Responses are generated from a local theological database.
        </div>
      </footer>
    </section>
  );
}
