"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import {
  Settings,
  User,
  Mail,
  Shield,
  Trash2,
  Check,
  AlertTriangle,
} from "lucide-react";
import styles from "./settings.module.css";

export default function SettingsPage() {
  const router = useRouter();
  const { signIn, signOut } = useAuthActions();
  const profile = useQuery(api.profile.get);
  const updateName = useMutation(api.profile.updateName);
  const deleteAccount = useMutation(api.profile.deleteAccount);

  const [name, setName] = useState("");
  const [nameSaved, setNameSaved] = useState(false);

  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // Delete account
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Populate name from profile
  useEffect(() => {
    if (profile?.name && !name) {
      setName(profile.name);
    }
  }, [profile, name]);

  async function saveName() {
    if (!name.trim()) return;
    await updateName({ name: name.trim() });
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 2000);
  }

  async function changePassword() {
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    if (!profile?.email) {
      setPasswordError("No email associated with this account.");
      return;
    }

    setChangingPassword(true);
    try {
      // Verify current password by signing in, then update
      await signIn("password", {
        email: profile.email,
        password: currentPassword,
        flow: "signIn",
      });
      // If sign-in succeeded, the password is correct
      // Use reset flow to change password
      await signIn("password", {
        email: profile.email,
        flow: "reset",
      });
      setPasswordSuccess(
        "A password reset code has been sent to your email. Use it to set your new password."
      );
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setPasswordError("Current password is incorrect.");
    } finally {
      setChangingPassword(false);
    }
  }

  async function handleDeleteAccount() {
    if (deleteText !== "DELETE") return;
    setDeleting(true);
    try {
      await deleteAccount();
      await signOut();
      router.push("/auth");
    } catch {
      setDeleting(false);
    }
  }

  if (!profile) {
    return (
      <section className={styles.container}>
        <div className={styles.scrollArea}>
          <div className={styles.content}>
            <p className={styles.loadingText}>Loading profile...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <div className={styles.scrollArea}>
        <div className={styles.content}>
          {/* Header */}
          <div className={styles.header}>
            <Settings size={24} className={styles.headerIcon} />
            <h1 className={styles.title}>Settings</h1>
            <p className={styles.subtitle}>
              Manage your profile and account preferences.
            </p>
          </div>

          {/* Profile Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <User size={16} />
              <h2 className={styles.sectionTitle}>Profile</h2>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Display Name</label>
              <div className={styles.fieldRow}>
                <input
                  type="text"
                  className={styles.fieldInput}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveName();
                  }}
                />
                {(name.trim() !== (profile?.name ?? "") || nameSaved) && (
                  <button
                    className={styles.fieldSaveBtn}
                    onClick={saveName}
                    disabled={!name.trim()}
                  >
                    {nameSaved ? <Check size={14} /> : "Save"}
                  </button>
                )}
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Email</label>
              <div className={styles.fieldStatic}>
                <Mail size={14} className={styles.fieldStaticIcon} />
                <span>{profile.email ?? "No email set"}</span>
              </div>
              <p className={styles.fieldHint}>
                Email is managed through your sign-in credentials and cannot be
                changed here.
              </p>
            </div>
          </div>

          {/* Security Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <Shield size={16} />
              <h2 className={styles.sectionTitle}>Security</h2>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Change Password</label>
              <p className={styles.fieldHint}>
                To change your password, we&apos;ll send a reset code to your
                email.
              </p>
              <div className={styles.passwordFields}>
                <input
                  type="password"
                  className={styles.fieldInput}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Current password"
                  autoComplete="current-password"
                />
                <input
                  type="password"
                  className={styles.fieldInput}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password (min 8 characters)"
                  autoComplete="new-password"
                />
                <input
                  type="password"
                  className={styles.fieldInput}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                />
              </div>

              {passwordError && (
                <p className={styles.errorText}>{passwordError}</p>
              )}
              {passwordSuccess && (
                <p className={styles.successText}>{passwordSuccess}</p>
              )}

              <button
                className={styles.changePasswordBtn}
                onClick={changePassword}
                disabled={
                  changingPassword || !currentPassword || !newPassword
                }
              >
                {changingPassword ? "Verifying..." : "Send Reset Code"}
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className={styles.dangerSection}>
            <div className={styles.sectionHeader}>
              <AlertTriangle size={16} />
              <h2 className={styles.sectionTitle}>Danger Zone</h2>
            </div>

            <div className={styles.dangerCard}>
              <div className={styles.dangerInfo}>
                <h3 className={styles.dangerTitle}>Delete Account</h3>
                <p className={styles.dangerDesc}>
                  Permanently delete your account and all associated data
                  including chats, saved verses, study plans, and preferences.
                  This action cannot be undone.
                </p>
              </div>

              {!showDeleteConfirm ? (
                <button
                  className={styles.dangerBtn}
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 size={14} />
                  Delete Account
                </button>
              ) : (
                <div className={styles.deleteConfirm}>
                  <p className={styles.deleteConfirmText}>
                    Type <strong>DELETE</strong> to confirm:
                  </p>
                  <input
                    type="text"
                    className={styles.deleteConfirmInput}
                    value={deleteText}
                    onChange={(e) => setDeleteText(e.target.value)}
                    placeholder="DELETE"
                    autoFocus
                  />
                  <div className={styles.deleteConfirmActions}>
                    <button
                      className={styles.deleteConfirmBtn}
                      onClick={handleDeleteAccount}
                      disabled={deleteText !== "DELETE" || deleting}
                    >
                      {deleting
                        ? "Deleting..."
                        : "Permanently Delete Account"}
                    </button>
                    <button
                      className={styles.deleteConfirmCancel}
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteText("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
