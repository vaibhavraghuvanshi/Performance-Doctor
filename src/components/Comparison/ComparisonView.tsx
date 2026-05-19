import React, { useState } from "react";
import { DiffEditor } from "@monaco-editor/react";
import { clsx } from "clsx";
import { ClipboardCopy, LayoutDashboard } from "lucide-react";
import { CodePanel } from "./CodePanel";
import { Button } from "../common/Button";
import { copyToClipboard } from "../../utils/clipboard";

interface ComparisonStats {
  issues: number;
  fps: number;
  renderTime: string;
}

interface ComparisonViewProps {
  original: string;
  optimized: string;
  onViewSummary: () => void;
  originalStats?: ComparisonStats;
  optimizedStats?: ComparisonStats;
}

type CompareMode = "split" | "diff";

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  original,
  optimized,
  onViewSummary,
  originalStats,
  optimizedStats,
}) => {
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [mode, setMode] = useState<CompareMode>("split");

  const modified = optimized || "// No optimized code returned by AI";

  const handleCopyOptimized = async () => {
    const ok = await copyToClipboard(modified);
    setCopyStatus(
      ok
        ? "Optimized code copied to clipboard."
        : "Copy failed — select the code and copy manually.",
    );
    window.setTimeout(() => setCopyStatus(null), 3200);
  };

  const modeBtn = (id: CompareMode, label: string) => (
    <button
      key={id}
      type="button"
      onClick={() => setMode(id)}
      className={clsx(
        "px-4 py-2 rounded-lg text-sm font-semibold border transition-colors",
        mode === id
          ? "bg-calm-500 text-white border-calm-400"
          : "bg-background-elevated text-text-secondary border-background-border hover:border-calm-500/40",
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2 text-text-primary">
          Before & After Comparison
        </h2>
        <p className="text-text-secondary mb-4">
          Side-by-side panels or a unified diff view of suggested changes
        </p>
        <div className="flex justify-center gap-2 flex-wrap" role="tablist" aria-label="Comparison layout">
          {modeBtn("split", "Side by side")}
          {modeBtn("diff", "Diff view")}
        </div>
      </div>

      {mode === "split" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CodePanel
            title="Before (Current)"
            code={original}
            status="warning"
            stats={originalStats}
          />
          <CodePanel
            title="After (Optimized)"
            code={modified}
            status="success"
            stats={optimizedStats}
          />
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden border border-background-border ring-1 ring-white/5 bg-[#0d1117]">
          <DiffEditor
            height="560px"
            theme="vs-dark"
            language="typescript"
            original={original}
            modified={modified}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              renderSideBySide: true,
              fontSize: 14,
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>
      )}

      {copyStatus && (
        <p className="text-center text-sm text-text-muted" role="status">
          {copyStatus}
        </p>
      )}

      <div className="flex justify-center gap-4 flex-wrap">
        <Button
          variant="secondary"
          size="lg"
          icon={<ClipboardCopy className="h-5 w-5 shrink-0" aria-hidden strokeWidth={2} />}
          onClick={handleCopyOptimized}
        >
          Copy Optimized Code
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={onViewSummary}
          icon={<LayoutDashboard className="h-5 w-5 shrink-0" aria-hidden strokeWidth={2} />}
        >
          View Performance Summary
        </Button>
      </div>
    </div>
  );
};
