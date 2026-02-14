import React from "react";
import { CodePanel } from "./CodePanel";
import { Button } from "../common/Button";

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

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  original,
  optimized,
  onViewSummary,
  originalStats,
  optimizedStats,
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2">Before & After Comparison</h2>
        <p className="text-slate-400">
          See the exact changes needed to optimize your code
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CodePanel
          title="Before (Current)"
          code={original}
          status="warning"
          stats={originalStats}
        />
        <CodePanel
          title="After (Optimized)"
          code={optimized || "// No optimized code returned by AI"}
          status="success"
          stats={optimizedStats}
        />
      </div>

      <div className="flex justify-center gap-4">
        <Button
          variant="secondary"
          size="lg"
          icon={<span>📥</span>}
          onClick={() => {
            // Copy optimized code to clipboard
            navigator.clipboard.writeText(optimized);
            alert("Optimized code copied to clipboard!");
          }}
        >
          Copy Optimized Code
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={onViewSummary}
          icon={<span>📊</span>}
        >
          View Performance Summary
        </Button>
      </div>
    </div>
  );
};
