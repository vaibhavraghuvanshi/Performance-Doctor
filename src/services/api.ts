import type { AnalysisResult } from "../types/analysis";
import {
  apiUrl,
  authBearerHeaders,
  analyzeExtraHeaders,
  readJsonError,
} from "./apiBase";

/** Client-side cap so the UI cannot stay on “Analyzing…” forever (Groq + hybrid AST can be slow). */
const ANALYZE_FETCH_TIMEOUT_MS = 180_000;

function analyzeRequestHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    ...authBearerHeaders(),
    ...analyzeExtraHeaders(),
  };
}

export async function analyzeCode(
  code: string,
  platform: string,
): Promise<AnalysisResult> {
  const controller = new AbortController();
  const timeoutId = globalThis.setTimeout(() => {
    controller.abort();
  }, ANALYZE_FETCH_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(apiUrl("/analyze?ai=1"), {
      method: "POST",
      signal: controller.signal,
      headers: analyzeRequestHeaders(),
      body: JSON.stringify({ code, platform }),
    });
  } catch (err: unknown) {
    const aborted =
      (err instanceof DOMException && err.name === "AbortError") ||
      (err instanceof Error && err.name === "AbortError");
    if (aborted) {
      throw new Error(
        `Analysis timed out after ${Math.round(ANALYZE_FETCH_TIMEOUT_MS / 1000)}s. The AI service may be slow or unreachable; check the API server, GROQ_API_KEY, and your network.`,
      );
    }
    throw err;
  } finally {
    globalThis.clearTimeout(timeoutId);
  }

  if (!response.ok) {
    let message = await readJsonError(response);
    if (response.status === 401) {
      message +=
        " Add VITE_ANALYZE_API_KEY to the frontend env (same value as server ANALYZE_API_KEY) and restart `vite`.";
    }
    throw new Error(message);
  }

  const contentType = (response.headers.get("content-type") || "").toLowerCase();
  if (contentType.includes("text/html")) {
    throw new Error(
      "Received HTML instead of JSON (the request likely missed the /api proxy). Remove VITE_API_URL in dev or set it to your API base including /api, e.g. http://localhost:3000/api",
    );
  }

  return response.json() as Promise<AnalysisResult>;
}
