"use client";

import { useState, useEffect, useRef } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { BookOpen, Eye, EyeOff, ArrowLeft } from "lucide-react";
import styles from "./auth.module.css";

type Flow = "signIn" | "signUp" | "reset" | "reset-verification";

export default function AuthPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [flow, setFlow] = useState<Flow>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [codeDigits, setCodeDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);
  const code = codeDigits.join("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirmNew, setShowConfirmNew] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  async function resendCode() {
    if (resendCooldown > 0 || !email) return;
    try {
      await signIn("password", { email, flow: "reset" });
      setSuccess("A new code has been sent to your email.");
      setResendCooldown(60);
    } catch {
      setError("Failed to resend code. Please try again.");
    }
  }

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  const resetFormState = () => {
    setError("");
    setSuccess("");
    setShowPassword(false);
    setShowConfirm(false);
    setShowNew(false);
    setShowConfirmNew(false);
  };

  const switchFlow = (next: Flow) => {
    setFlow(next);
    resetFormState();
    setPassword("");
    setConfirmPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setCodeDigits(["", "", "", "", "", ""]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (flow === "signUp" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (flow === "reset-verification" && newPassword !== confirmNewPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      if (flow === "signIn" || flow === "signUp") {
        await signIn("password", { email, password, flow });
      } else if (flow === "reset") {
        await signIn("password", { email, flow: "reset" });
        setSuccess("Check your email for a reset code.");
        setFlow("reset-verification");
      } else if (flow === "reset-verification") {
        await signIn("password", {
          email,
          code,
          newPassword,
          flow: "reset-verification",
        });
      }
    } catch {
      if (flow === "signUp") {
        setError("Could not create account. The email may already be in use.");
      } else if (flow === "signIn") {
        setError("Invalid email or password.");
      } else if (flow === "reset") {
        setError("Could not send reset email. Check that the account exists.");
      } else {
        setError("Invalid code or the code has expired.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingPulse} />
      </div>
    );
  }

  const title = {
    signIn: "Welcome back",
    signUp: "Create your account",
    reset: "Reset your password",
    "reset-verification": "Enter reset code",
  }[flow];

  const subtitle = {
    signIn: "Sign in to continue your study",
    signUp: "Join and begin your theological journey",
    reset: "We'll send a verification code to your email",
    "reset-verification": "Enter the code from your email and choose a new password",
  }[flow];

  const submitLabel = {
    signIn: "Sign In",
    signUp: "Create Account",
    reset: "Send Reset Code",
    "reset-verification": "Reset Password",
  }[flow];

  return (
    <div className={styles.splitLayout}>
      {/* Left — Branding Panel */}
      <div className={styles.brandPanel}>
        <div className={styles.brandContent}>
          <div className={styles.brandIcon}>
            <BookOpen size={36} />
          </div>
          <h1 className={styles.brandTitle}>Studium Verbi</h1>
          <div className={styles.brandDivider} />
          <p className={styles.brandMotto}>
            Search the scriptures, for in them you find eternal life.
          </p>
          <p className={styles.brandDesc}>
            A theological study companion for exploring covenant theology,
            messianic prophecy, and the wisdom of the Church Fathers.
          </p>
        </div>
        <p className={styles.brandFooter}>
          Scripture &middot; Commentary &middot; Exegesis
        </p>
      </div>

      {/* Right — Form Panel */}
      <div className={styles.formPanel}>
        <div className={styles.formWrapper}>
          {/* Back button for reset flows */}
          {(flow === "reset" || flow === "reset-verification") && (
            <button
              className={styles.backBtn}
              onClick={() => switchFlow("signIn")}
              type="button"
            >
              <ArrowLeft size={14} />
              Back to sign in
            </button>
          )}

          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>{title}</h2>
            <p className={styles.formSubtitle}>{subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Email — shown on all flows */}
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder="your@email.com"
                required
                autoComplete="email"
                readOnly={flow === "reset-verification"}
              />
            </div>

            {/* Password — signIn and signUp only */}
            {(flow === "signIn" || flow === "signUp") && (
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="password">
                  Password
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                    placeholder={
                      flow === "signUp"
                        ? "At least 8 characters"
                        : "Enter your password"
                    }
                    required
                    minLength={8}
                    autoComplete={
                      flow === "signUp" ? "new-password" : "current-password"
                    }
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Confirm Password — signUp only */}
            {flow === "signUp" && (
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={styles.input}
                    placeholder="Re-enter your password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onClick={() => setShowConfirm(!showConfirm)}
                    tabIndex={-1}
                    aria-label={
                      showConfirm ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirm ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Code — reset-verification only */}
            {flow === "reset-verification" && (
              <>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>
                    Verification Code
                  </label>
                  <div className={styles.otpRow}>
                    {codeDigits.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { codeRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        className={styles.otpBox}
                        autoFocus={i === 0}
                        autoComplete={i === 0 ? "one-time-code" : "off"}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          if (!val && !digit) return;
                          const next = [...codeDigits];
                          next[i] = val.slice(-1);
                          setCodeDigits(next);
                          if (val && i < 5) {
                            codeRefs.current[i + 1]?.focus();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace" && !digit && i > 0) {
                            codeRefs.current[i - 1]?.focus();
                          }
                        }}
                        onPaste={(e) => {
                          e.preventDefault();
                          const pasted = e.clipboardData
                            .getData("text")
                            .replace(/\D/g, "")
                            .slice(0, 6);
                          if (!pasted) return;
                          const next = [...codeDigits];
                          for (let j = 0; j < 6; j++) {
                            next[j] = pasted[j] ?? "";
                          }
                          setCodeDigits(next);
                          const focusIdx = Math.min(pasted.length, 5);
                          codeRefs.current[focusIdx]?.focus();
                        }}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    className={styles.resendBtn}
                    onClick={resendCode}
                    disabled={resendCooldown > 0}
                  >
                    {resendCooldown > 0
                      ? `Resend code in ${resendCooldown}s`
                      : "Resend code"}
                  </button>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor="newPassword">
                    New Password
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      id="newPassword"
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={styles.input}
                      placeholder="At least 8 characters"
                      required
                      minLength={8}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className={styles.eyeBtn}
                      onClick={() => setShowNew(!showNew)}
                      tabIndex={-1}
                      aria-label={showNew ? "Hide password" : "Show password"}
                    >
                      {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor="confirmNewPassword">
                    Confirm New Password
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      id="confirmNewPassword"
                      type={showConfirmNew ? "text" : "password"}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className={styles.input}
                      placeholder="Re-enter your new password"
                      required
                      minLength={8}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className={styles.eyeBtn}
                      onClick={() => setShowConfirmNew(!showConfirmNew)}
                      tabIndex={-1}
                      aria-label={
                        showConfirmNew ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmNew ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}

            {success && <p className={styles.success}>{success}</p>}
            {error && <p className={styles.error}>{error}</p>}

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={submitting}
            >
              {submitting ? (
                <span className={styles.spinner} />
              ) : (
                submitLabel
              )}
            </button>
          </form>

          {/* Forgot password link — signIn only */}
          {flow === "signIn" && (
            <button
              className={styles.forgotBtn}
              onClick={() => switchFlow("reset")}
              type="button"
            >
              Forgot your password?
            </button>
          )}

          {/* Toggle between signIn / signUp */}
          {(flow === "signIn" || flow === "signUp") && (
            <div className={styles.toggleArea}>
              <span className={styles.toggleText}>
                {flow === "signIn"
                  ? "No account yet?"
                  : "Already have an account?"}
              </span>
              <button
                className={styles.toggleBtn}
                onClick={() =>
                  switchFlow(flow === "signIn" ? "signUp" : "signIn")
                }
              >
                {flow === "signIn" ? "Create one" : "Sign in"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
