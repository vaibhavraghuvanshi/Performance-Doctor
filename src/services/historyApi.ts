import type { AnalysisResult } from "../types/analysis";
import {
  apiUrl,
  authBearerHeaders,
  readJsonError,
  type HistoryDetail,
  type HistoryListItem,
} from "./apiBase";

export async function listHistory(): Promise<HistoryListItem[]> {
  const response = await fetch(apiUrl("/history"), {
    headers: { ...authBearerHeaders() },
  });
  if (!response.ok) throw new Error(await readJsonError(response));
  const data = (await response.json()) as { items?: HistoryListItem[] };
  return Array.isArray(data.items) ? data.items : [];
}

export async function getHistoryEntry(id: string): Promise<HistoryDetail> {
  const response = await fetch(apiUrl(`/history/${encodeURIComponent(id)}`), {
    headers: { ...authBearerHeaders() },
  });
  if (!response.ok) throw new Error(await readJsonError(response));
  return response.json() as Promise<HistoryDetail>;
}

export async function saveHistoryEntry(input: {
  title?: string;
  code: string;
  platform: string;
  result: AnalysisResult;
}): Promise<{ id: string }> {
  const response = await fetch(apiUrl("/history"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authBearerHeaders(),
    },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error(await readJsonError(response));
  return response.json() as Promise<{ id: string }>;
}

export async function deleteHistoryEntry(id: string): Promise<void> {
  const response = await fetch(apiUrl(`/history/${encodeURIComponent(id)}`), {
    method: "DELETE",
    headers: { ...authBearerHeaders() },
  });
  if (!response.ok && response.status !== 204) {
    throw new Error(await readJsonError(response));
  }
}
