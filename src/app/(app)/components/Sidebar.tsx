"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import {
  BookOpen,
  MessageSquare,
  Plus,
  Trash2,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  CircleUser,
  Settings,
  ChevronDown,
  Search,
  Bookmark,
  GraduationCap,
  X,
} from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { useChatContext } from "./ChatContext";
import {
  useBibleContext,
  BIBLE_BOOKS,
} from "./BibleContext";
import styles from "../app.module.css";

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

export default function Sidebar({
  open,
  onToggle,
  onNavigate,
}: {
  open: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isBiblePage = pathname === "/bible";
  const isSavedPage = pathname === "/saved";
  const { signOut } = useAuthActions();
  const chats = useQuery(api.chats.listChats) ?? [];
  const deleteChat = useMutation(api.chats.deleteChat);
  const savedVerses = useQuery(api.savedVerses.list) ?? [];
  const removeSavedVerse = useMutation(api.savedVerses.removeById);
  const studyPlans = useQuery(api.studyPlans.listPlans) ?? [];
  const { activeChatId, setActiveChatId } = useChatContext();
  const bible = useBibleContext();
  const {
    location,
    testament,
    expandedBook,
    searchQuery,
    selectBook,
    selectChapter,
    setTestament,
    setSearchQuery,
  } = bible;
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const bookListRef = useRef<HTMLDivElement>(null);
  const activeBookRef = useRef<HTMLDivElement>(null);

  const filteredBooks = BIBLE_BOOKS.filter((b) => {
    if (searchQuery) {
      return b.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return b.testament === testament;
  });

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [profileOpen]);

  // Scroll active book into view only when the reading location changes
  useEffect(() => {
    if (activeBookRef.current && bookListRef.current) {
      const container = bookListRef.current;
      const el = activeBookRef.current;
      const containerRect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      if (elRect.top < containerRect.top || elRect.bottom > containerRect.bottom) {
        el.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [location?.book.name, location?.chapter]);

  return (
    <aside className={`${styles.sidebar} ${!open ? styles.sidebarCollapsed : ""}`}>
      {/* Header */}
      <div className={styles.sidebarHeader}>
        <h2 className={styles.sidebarTitle}>Studium Verbi</h2>
        <button
          className={styles.sidebarToggleBtn}
          onClick={onToggle}
          title={open ? "Minimize sidebar" : "Expand sidebar"}
        >
          {open ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
        </button>
      </div>

      {/* Main content area */}
      <div className={styles.sidebarContent}>
        {/* Navigation */}
        <nav className={styles.navSection}>
          <Link
            href="/"
            className={`${styles.navLink} ${pathname === "/" ? styles.navLinkActive : ""}`}
            title="Ask"
            onClick={onNavigate}
          >
            <MessageSquare size={16} />
            <span className={styles.navLinkLabel}>Ask</span>
          </Link>
          <Link
            href="/study"
            className={`${styles.navLink} ${pathname === "/study" ? styles.navLinkActive : ""}`}
            title="Study Plans"
            onClick={onNavigate}
          >
            <GraduationCap size={16} />
            <span className={styles.navLinkLabel}>Study</span>
          </Link>
          <Link
            href="/bible"
            className={`${styles.navLink} ${isBiblePage ? styles.navLinkActive : ""}`}
            title="Bible"
            onClick={onNavigate}
          >
            <BookOpen size={16} />
            <span className={styles.navLinkLabel}>Bible</span>
          </Link>
          <Link
            href="/saved"
            className={`${styles.navLink} ${isSavedPage ? styles.navLinkActive : ""}`}
            title="Saved Verses"
            onClick={onNavigate}
          >
            <Bookmark size={16} />
            <span className={styles.navLinkLabel}>Saved</span>
          </Link>
        </nav>

        {/* ── Study page: Chat list ── */}
        {pathname === "/" && (
          <>
            <button
              className={styles.newChatBtn}
              onClick={() => { setActiveChatId(null); onNavigate?.(); }}
              title="New Chat"
            >
              <Plus size={15} />
              <span className={styles.newChatLabel}>New Chat</span>
            </button>

            <div className={styles.chatList}>
              {open && chats.length === 0 && (
                <p className={styles.emptyStateText}>
                  No conversations yet. Start a new chat to begin.
                </p>
              )}
              {open &&
                chats.map((chat) => (
                  <div
                    key={chat._id}
                    className={`${styles.chatListItem} ${activeChatId === chat._id ? styles.chatListItemActive : ""}`}
                    onClick={() => { setActiveChatId(chat._id); onNavigate?.(); }}
                  >
                    <div className={styles.chatListItemInfo}>
                      <span className={styles.chatListItemTitle}>
                        {chat.title}
                      </span>
                      <span className={styles.chatListItemTime}>
                        {formatRelativeTime(chat.updatedAt)}
                      </span>
                    </div>
                    <button
                      className={styles.deleteBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat({ chatId: chat._id });
                        if (activeChatId === chat._id) {
                          setActiveChatId(null);
                        }
                      }}
                      title="Delete chat"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
            </div>
          </>
        )}

        {/* ── Bible page: Book/chapter navigation ── */}
        {isBiblePage && open && (
          <>
            {/* Search */}
            <div className={styles.bibleSearchBox}>
              <Search size={13} className={styles.bibleSearchIcon} />
              <input
                type="text"
                className={styles.bibleSearchInput}
                placeholder="Find a book..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Testament tabs */}
            {!searchQuery && (
              <div className={styles.bibleTestamentTabs}>
                <button
                  className={`${styles.bibleTestamentTab} ${testament === "OT" ? styles.bibleTestamentTabActive : ""}`}
                  onClick={() => setTestament("OT")}
                >
                  Old Testament
                </button>
                <button
                  className={`${styles.bibleTestamentTab} ${testament === "NT" ? styles.bibleTestamentTabActive : ""}`}
                  onClick={() => setTestament("NT")}
                >
                  New Testament
                </button>
              </div>
            )}

            {/* Book list */}
            <div className={styles.bibleBookList} ref={bookListRef}>
              {filteredBooks.map((book) => {
                const isExpanded = expandedBook === book.name;
                const isActive = location?.book.name === book.name;

                return (
                  <div
                    key={book.name}
                    ref={isActive ? activeBookRef : undefined}
                    className={styles.bibleBookGroup}
                  >
                    <button
                      className={`${styles.bibleBookItem} ${isActive ? styles.bibleBookItemActive : ""}`}
                      onClick={() => selectBook(book)}
                    >
                      <span className={styles.bibleBookName}>{book.name}</span>
                      <span className={styles.bibleBookMeta}>
                        <span className={styles.bibleBookChapterCount}>
                          {book.chapters}
                        </span>
                        <ChevronDown
                          size={12}
                          className={`${styles.bibleBookChevron} ${isExpanded ? styles.bibleBookChevronOpen : ""}`}
                        />
                      </span>
                    </button>

                    {isExpanded && (
                      <div className={styles.bibleChapterGrid}>
                        {Array.from(
                          { length: book.chapters },
                          (_, i) => i + 1
                        ).map((ch) => (
                          <button
                            key={ch}
                            className={`${styles.bibleChapterBtn} ${location?.book.name === book.name && location?.chapter === ch ? styles.bibleChapterBtnActive : ""}`}
                            onClick={() => { selectChapter(book, ch); onNavigate?.(); }}
                          >
                            {ch}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── Study page: Plan list ── */}
        {pathname === "/study" && open && (
          <>
            <Link
              href="/study"
              className={styles.newChatBtn}
              title="New Study Plan"
            >
              <Plus size={15} />
              <span className={styles.newChatLabel}>New Plan</span>
            </Link>

            <div className={styles.chatList}>
              {studyPlans.length === 0 && (
                <p className={styles.emptyStateText}>
                  No study plans yet. Create one to get started.
                </p>
              )}
              {studyPlans.map((plan) => (
                <Link
                  key={plan._id}
                  href={`/study?plan=${plan._id}`}
                  className={styles.chatListItem}
                >
                  <div className={styles.chatListItemInfo}>
                    <span className={styles.chatListItemTitle}>
                      {plan.title}
                    </span>
                    <span className={styles.chatListItemTime}>
                      {plan.completedSessions}/{plan.totalSessions} sessions
                      {plan.status === "completed" ? " · Done" : ""}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* ── Saved Verses (all pages) ── */}
        {open && savedVerses.length > 0 && (
          <div className={styles.savedVersesSection}>
            <div className={styles.sectionHeader}>
              <Bookmark size={11} />
              Saved Verses
            </div>
            <div className={styles.savedVersesList}>
              {savedVerses.slice(0, 3).map((sv) => (
                <div
                  key={sv._id}
                  className={styles.savedVerseCard}
                  onClick={() => {
                    const book = BIBLE_BOOKS.find((b) => b.name === sv.book);
                    if (book) {
                      bible.navigate({ book, chapter: sv.chapter });
                      if (!isBiblePage) {
                        router.push("/bible");
                      }
                    }
                    onNavigate?.();
                  }}
                >
                  <div className={styles.savedVerseInfo}>
                    <span className={styles.savedVerseHeader}>
                      {sv.book} {sv.chapter}:{sv.verse}
                    </span>
                    <span className={styles.savedVerseBody}>
                      {sv.text}
                    </span>
                  </div>
                  <button
                    className={styles.deleteBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSavedVerse({ id: sv._id }).catch(() => {});
                    }}
                    title="Remove bookmark"
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}
            </div>
            {savedVerses.length > 3 && (
              <Link href="/saved" className={styles.viewAllLink}>
                View all {savedVerses.length} saved verses
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Profile footer */}
      <div className={styles.sidebarFooter} ref={profileRef}>
        {profileOpen && (
          <div className={styles.profileDropdown}>
            <Link
              href="/settings"
              className={styles.profileDropdownItem}
              onClick={() => { setProfileOpen(false); onNavigate?.(); }}
            >
              <Settings size={14} />
              <span>Settings</span>
            </Link>
            <div className={styles.profileDropdownDivider} />
            <button
              className={styles.profileDropdownItem}
              onClick={() => {
                setProfileOpen(false);
                signOut();
              }}
            >
              <LogOut size={14} />
              <span>Sign out</span>
            </button>
          </div>
        )}
        <button
          className={styles.profileBtn}
          onClick={() => setProfileOpen(!profileOpen)}
          title="Profile"
        >
          <CircleUser size={20} />
          <span className={styles.profileLabel}>Account</span>
        </button>
      </div>
    </aside>
  );
}
