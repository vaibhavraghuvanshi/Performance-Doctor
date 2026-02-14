import React from "react";
import { PerformanceScore } from "./PerformanceScore";
import { IssueCard } from "./IssueCard";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";
import type { AnalysisResult } from "../../types/analysis";
import type { Severity } from "../../types/issue";

interface DiagnosisReportProps {
  result: AnalysisResult;
  onViewComparison: () => void;
  errorMessage?: string;
  rawLLM?: string;
  onRetry?: () => void;
}

export const DiagnosisReport: React.FC<DiagnosisReportProps> = ({
  result,
  onViewComparison,
  errorMessage,
  rawLLM,
  onRetry,
}) => {
  /* -------------------------------------------------- */
  /* Group issues by severity */
  /* -------------------------------------------------- */

  const issuesBySeverity: Record<Severity, typeof result.issues> = {
    critical: result.issues.filter((i) => i.severity === "critical"),
    high: result.issues.filter((i) => i.severity === "high"),
    medium: result.issues.filter((i) => i.severity === "medium"),
    low: result.issues.filter((i) => i.severity === "low"),
  };

  /* -------------------------------------------------- */
  /* Error / fallback UI */
  /* -------------------------------------------------- */

  if (errorMessage) {
    return (
      <Card className="text-center py-12 bg-red-100 border border-red-300">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-2xl font-bold mb-2 text-red-600">Analysis Error</h3>

        <p className="text-red-500">{errorMessage}</p>

        {rawLLM && (
          <pre className="mt-4 text-xs text-red-700 bg-red-50 p-2 rounded max-h-64 overflow-auto">
            {rawLLM}
          </pre>
        )}

        {onRetry && (
          <button
            className="mt-6 px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600"
            onClick={onRetry}
          >
            Try Again
          </button>
        )}
      </Card>
    );
  }

  /* -------------------------------------------------- */
  /* Severity metadata */
  /* -------------------------------------------------- */

  const severityConfig: Record<
    Severity,
    { label: string; emoji: string; color: string }
  > = {
    critical: { label: "Critical", emoji: "🔴", color: "text-critical-500" },
    high: { label: "High Impact", emoji: "🟠", color: "text-warning-500" },
    medium: { label: "Medium Impact", emoji: "🟡", color: "text-caution-500" },
    low: { label: "Low Impact", emoji: "🟢", color: "text-success-500" },
  };

  /* -------------------------------------------------- */
  /* Main UI */
  /* -------------------------------------------------- */

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Performance Score */}
      <PerformanceScore
        currentScore={result.overallScore}
        optimizedScore={result.optimizedScore}
        topBottleneck={result.topBottleneck}
      />

      {/* Issues by Severity */}
      {(Object.keys(issuesBySeverity) as Severity[]).map((severity) => {
        const issues = issuesBySeverity[severity];
        if (issues.length === 0) return null;

        const config = severityConfig[severity];

        return (
          <div key={severity} className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-ai-100">
              <Badge severity={severity}>
                {config.emoji} {config.label}
              </Badge>

              <span className="text-ai-400 text-sm">
                {issues.length} {issues.length === 1 ? "issue" : "issues"}{" "}
                detected
              </span>
            </div>

            <div className="space-y-4">
              {issues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  onViewFix={onViewComparison}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* No issues */}
      {result.issues.length === 0 && (
        <Card className="text-center py-12 bg-white/60 border border-ai-100">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold mb-2 gradient-text">
            Perfect Code!
          </h3>
          <p className="text-ai-400">
            No performance issues detected. Your code is already optimized!
          </p>
        </Card>
      )}
    </div>
  );
};
