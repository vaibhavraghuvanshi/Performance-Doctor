import type { AnalysisResult } from "../types/analysis";

const trimmedEnv = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

function isBareLocalViteUrl(url: string): boolean {
  if (!import.meta.env.DEV) return false;
  try {
    const u = new URL(url);
    if (u.hostname !== "localhost" && u.hostname !== "127.0.0.1") return false;
    const port = u.port || (u.protocol === "https:" ? "443" : "80");
    if (port !== "3000") return false;
    const path = u.pathname.replace(/\/$/, "") || "/";
    return path === "/";
  } catch {
    return false;
  }
}

/** Base URL for API (no trailing slash). In dev without env, use same-origin `/api` proxy. */
export function getApiBase(): string {
  if (trimmedEnv) {
    if (isBareLocalViteUrl(trimmedEnv)) {
      console.warn(
        "[api] VITE_API_URL points at the Vite dev server without /api. Using same-origin /api/... so requests hit the Express proxy.",
      );
      return "";
    }
    return trimmedEnv;
  }
  if (import.meta.env.DEV) return "";
  return "http://localhost:4000";
}

/** Build absolute or proxied URL for an API path (path must start with `/`). */
export function apiUrl(path: string): string {
  const base = getApiBase();
  const p = path.startsWith("/") ? path : `/${path}`;
  if (base === "") return `/api${p}`;
  return `${base}${p}`;
}

export const AUTH_TOKEN_KEY = "pd_auth_token";

export function getStoredAuthToken(): string | null {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredAuthToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
    else localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {
    /* ignore private mode */
  }
}

export function authBearerHeaders(): Record<string, string> {
  const t = getStoredAuthToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export function analyzeExtraHeaders(): Record<string, string> {
  const raw = import.meta.env.VITE_ANALYZE_API_KEY;
  const key = typeof raw === "string" ? raw.trim() : "";
  if (!key) return {};
  return { "x-analyze-api-key": key };
}

export async function readJsonError(response: Response): Promise<string> {
  const body = await response.json().catch(() => ({}));
  if (body && typeof body === "object") {
    const o = body as Record<string, unknown>;
    if (typeof o.error === "string" && o.error) return o.error;
    if (typeof o.message === "string" && o.message) return o.message;
  }
  return `Request failed (${response.status})`;
}

export type HistoryListItem = {
  id: string;
  createdAt: string;
  title: string;
  platform: string;
  overallScore: number;
  optimizedScore: number;
  issueCount: number;
  topBottleneck: string | null;
  analyzedAt: string;
};

export type HistoryDetail = {
  id: string;
  userId: string;
  createdAt: string;
  title: string;
  platform: string;
  code: string;
  result: AnalysisResult;
};
