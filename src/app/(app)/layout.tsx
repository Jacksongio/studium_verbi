"use client";

import { useState, useEffect, ReactNode } from "react";
import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { ChatProvider } from "./components/ChatContext";
import { BibleProvider } from "./components/BibleContext";
import Sidebar from "./components/Sidebar";
import styles from "./app.module.css";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setSidebarOpen(window.innerWidth > 768);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div
        className={styles.appContainer}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-lora), serif",
            color: "var(--text-secondary)",
            fontStyle: "italic",
          }}
        >
          Loading...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <ChatProvider>
      <BibleProvider>
        <div className={styles.appContainer}>
          {/* Mobile header */}
          <div className={styles.mobileHeader}>
            <button
              className={styles.mobileMenuBtn}
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <span className={styles.hamburger} />
              <span className={styles.hamburger} />
              <span className={styles.hamburger} />
            </button>
            <h1 className={styles.mobileTitle}>Studium Verbi</h1>
          </div>

          <div className={styles.mainLayout}>
            {/* Mobile backdrop */}
            {sidebarOpen && (
              <div
                className={styles.mobileBackdrop}
                onClick={() => setSidebarOpen(false)}
              />
            )}
            <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} onNavigate={() => setSidebarOpen(false)} />
            {children}
          </div>
        </div>
      </BibleProvider>
    </ChatProvider>
  );
}
