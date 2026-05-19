import React, { useState } from "react";
import { clsx } from "clsx";
import { Activity, Mail, Lock, UserRound } from "lucide-react";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { useAuth } from "../../contexts/AuthContext";
import { loginAccount, registerAccount } from "../../services/authApi";

type Mode = "signin" | "signup";

export const AuthScreen: React.FC = () => {
  const { setAuthenticatedUser } = useAuth();
  const [mode, setMode] = useState<Mode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (mode === "signup") {
      if (password !== confirm) {
        setFormError("Passwords do not match.");
        return;
      }
      if (password.length < 8) {
        setFormError("Password must be at least 8 characters.");
        return;
      }
    }
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const res = await registerAccount({
          email: email.trim(),
          password,
          displayName: displayName.trim() || undefined,
        });
        setAuthenticatedUser(res.user);
      } else {
        const res = await loginAccount({
          email: email.trim(),
          password,
        });
        setAuthenticatedUser(res.user);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-background-main px-4 py-12">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-calm-500 to-primary-600 shadow-soft ring-1 ring-white/10">
          <Activity className="h-8 w-8 text-white" strokeWidth={2} aria-hidden />
        </div>
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
          Performance Doctor
        </h1>
        <p className="mt-2 max-w-md text-sm text-text-secondary">
          Sign in to save analysis history and sync preferences. Accounts are stored on this API server.
        </p>
      </div>

      <Card className="w-full max-w-md border-background-border shadow-card ring-1 ring-white/5 p-6 sm:p-8">
        <div className="flex rounded-xl border border-background-border bg-background-soft/50 p-1 mb-6">
          {(["signup", "signin"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setFormError(null);
              }}
              className={clsx(
                "flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors",
                mode === m
                  ? "bg-calm-500 text-white shadow-md"
                  : "text-text-muted hover:text-text-primary",
              )}
            >
              {m === "signup" ? "Create account" : "Sign in"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5">
                Display name <span className="font-normal lowercase">(optional)</span>
              </label>
              <div className="relative">
                <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" aria-hidden />
                <input
                  type="text"
                  autoComplete="name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full rounded-xl border border-background-border bg-background-card py-3 pl-10 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-calm-500/40"
                  placeholder="Alex"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" aria-hidden />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-background-border bg-background-card py-3 pl-10 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-calm-500/40"
                placeholder="you@company.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" aria-hidden />
              <input
                type="password"
                required
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-background-border bg-background-card py-3 pl-10 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-calm-500/40"
                placeholder="••••••••"
              />
            </div>
          </div>

          {mode === "signup" && (
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5">
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" aria-hidden />
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full rounded-xl border border-background-border bg-background-card py-3 pl-10 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-calm-500/40"
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}

          {formError && (
            <p className="text-sm text-critical-400 bg-critical-500/10 border border-critical-500/25 rounded-lg px-3 py-2">
              {formError}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={submitting}
            isLoading={submitting}
          >
            {mode === "signup" ? "Create account & continue" : "Sign in to dashboard"}
          </Button>
        </form>
      </Card>
    </div>
  );
};
