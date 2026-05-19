import React, { useCallback, useEffect, useState } from "react";
import { History, Trash2, FolderOpen } from "lucide-react";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import type { AnalysisResult } from "../../types/analysis";
import {
  deleteHistoryEntry,
  getHistoryEntry,
  listHistory,
} from "../../services/historyApi";
import type { HistoryListItem } from "../../services/apiBase";

interface HistoryScreenProps {
  onOpenEntry: (code: string, result: AnalysisResult) => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ onOpenEntry }) => {
  const [items, setItems] = useState<HistoryListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await listHistory();
      setItems(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load history.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleOpen = async (id: string) => {
    setBusyId(id);
    try {
      const row = await getHistoryEntry(id);
      onOpenEntry(row.code, row.result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not open entry.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Remove this saved analysis?")) return;
    setBusyId(id);
    try {
      await deleteHistoryEntry(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="flex-1 p-5 lg:p-10 max-w-4xl mx-auto w-full animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-calm-500/15 border border-calm-500/30">
          <History className="h-6 w-6 text-calm-400" aria-hidden />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Analysis history</h2>
          <p className="text-sm text-text-muted">
            Successful runs are saved automatically. Open one to continue from results.
          </p>
        </div>
      </div>

      {error && (
        <p className="mb-4 text-sm text-critical-400 border border-critical-500/30 rounded-lg px-3 py-2 bg-critical-500/10">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-text-muted text-sm">Loading…</p>
      ) : items.length === 0 ? (
        <Card className="text-center py-12 border-background-border">
          <p className="text-text-secondary">No saved analyses yet.</p>
          <p className="text-sm text-text-muted mt-2">
            Run an analysis from the code editor; it will appear here when it completes.
          </p>
        </Card>
      ) : (
        <ul className="space-y-3">
          {items.map((row) => (
            <li key={row.id}>
              <Card
                hoverable
                className="border-background-border ring-1 ring-white/5 cursor-pointer"
                onClick={() => void handleOpen(row.id)}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-text-primary truncate">{row.title}</h3>
                    <p className="text-xs text-text-muted mt-1 font-mono">
                      {new Date(row.createdAt).toLocaleString()} · {row.platform} ·{" "}
                      {row.issueCount} issues · score {row.overallScore}
                      {row.topBottleneck ? ` · ${row.topBottleneck}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={busyId === row.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        void handleOpen(row.id);
                      }}
                      icon={<FolderOpen className="h-4 w-4" aria-hidden />}
                    >
                      Open
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={busyId === row.id}
                      onClick={(e) => void handleDelete(row.id, e)}
                      icon={<Trash2 className="h-4 w-4 text-critical-400" aria-hidden />}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
