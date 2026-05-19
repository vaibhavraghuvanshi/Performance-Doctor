import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  CircleAlert,
  Info,
  PartyPopper,
  Filter,
} from "lucide-react";
import { PerformanceScore } from "./PerformanceScore";
import { IssueCard } from "./IssueCard";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";
import type { AnalysisResult } from "../../types/analysis";
import type { Severity } from "../../types/issue";
import { clsx } from "clsx";

interface DiagnosisReportProps {
  result?: AnalysisResult | null;
  onViewComparison: () => void;
  errorMessage?: string;
  rawLLM?: string;
  onRetry?: () => void;
}

const SEVERITY_ORDER: Severity[] = ["critical", "high", "medium", "low"];

type SeverityFilter = Severity | "all";

export const DiagnosisReport: React.FC<DiagnosisReportProps> = ({
  result,
  onViewComparison,
  errorMessage,
  rawLLM,
  onRetry,
}) => {
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");

  const filteredIssues = useMemo(() => {
    if (!result?.issues) return [];
    if (severityFilter === "all") return result.issues;
    return result.issues.filter((i) => i.severity === severityFilter);
  }, [result, severityFilter]);

  const issuesBySeverity: Record<Severity, NonNullable<AnalysisResult["issues"]>> =
    useMemo(
      () => ({
        critical: filteredIssues.filter((i) => i.severity === "critical"),
        high: filteredIssues.filter((i) => i.severity === "high"),
        medium: filteredIssues.filter((i) => i.severity === "medium"),
        low: filteredIssues.filter((i) => i.severity === "low"),
      }),
      [filteredIssues],
    );

  if (errorMessage) {
    return (
      <Card className="text-center py-12 border-critical-500/30 bg-critical-600/10">
        <div className="flex justify-center mb-4" aria-hidden>
          <CircleAlert className="h-16 w-16 text-critical-400" strokeWidth={1.25} />
        </div>
        <h3 className="text-2xl font-bold mb-2 text-critical-400">
          Analysis Error
        </h3>

        <p className="text-critical-400/90">{errorMessage}</p>

        {rawLLM && (
          <pre className="mt-4 text-xs text-text-secondary bg-background-main/80 border border-background-border p-3 rounded-lg max-h-64 overflow-auto text-left">
            {rawLLM}
          </pre>
        )}

        {onRetry && (
          <button
            type="button"
            className="mt-6 px-5 py-2.5 bg-critical-500 text-white rounded-xl font-semibold hover:bg-critical-400 transition-colors shadow-lg"
            onClick={onRetry}
          >
            Try Again
          </button>
        )}
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="text-center py-12">
        <p className="text-text-secondary">No analysis to display yet.</p>
      </Card>
    );
  }

  const severityConfig: Record<
    Severity,
    { label: string; icon: React.ReactNode; color: string }
  > = {
    critical: {
      label: "Critical",
      icon: <CircleAlert className="h-3.5 w-3.5 shrink-0" aria-hidden />,
      color: "text-critical-500",
    },
    high: {
      label: "High Impact",
      icon: <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden />,
      color: "text-warning-500",
    },
    medium: {
      label: "Medium Impact",
      icon: <AlertTriangle className="h-3.5 w-3.5 shrink-0 opacity-90" aria-hidden />,
      color: "text-caution-500",
    },
    low: {
      label: "Low Impact",
      icon: <Info className="h-3.5 w-3.5 shrink-0" aria-hidden />,
      color: "text-success-500",
    },
  };

  const filterChips: { id: SeverityFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "critical", label: "Critical" },
    { id: "high", label: "High" },
    { id: "medium", label: "Medium" },
    { id: "low", label: "Low" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <PerformanceScore
        currentScore={result.overallScore}
        optimizedScore={result.optimizedScore}
        topBottleneck={result.topBottleneck}
        seoReadiness={result.metrics.seoReadiness}
      />

      {result.issues.length > 0 && (
        <div className="flex flex-col gap-3 rounded-xl border border-background-border bg-background-soft/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-text-secondary">
            <Filter className="h-4 w-4 text-calm-400 shrink-0" aria-hidden />
            Filter by severity
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Severity filter">
            {filterChips.map((chip) => {
              const active = severityFilter === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setSeverityFilter(chip.id)}
                  className={clsx(
                    "rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors",
                    active
                      ? "border-calm-500/60 bg-calm-500/20 text-calm-200"
                      : "border-background-border bg-background-elevated/80 text-text-muted hover:border-calm-500/35 hover:text-text-primary",
                  )}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {SEVERITY_ORDER.map((severity) => {
        const issues = issuesBySeverity[severity];
        if (issues.length === 0) return null;

        const config = severityConfig[severity];

        return (
          <div key={severity} className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-background-border">
              <Badge severity={severity}>
                <span className="inline-flex items-center gap-1.5">
                  {config.icon}
                  {config.label}
                </span>
              </Badge>

              <span className="text-text-muted text-sm">
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

      {result.issues.length === 0 && (
        <Card className="text-center py-12">
          <div className="flex justify-center mb-4" aria-hidden>
            <PartyPopper className="h-16 w-16 text-success-500" strokeWidth={1.25} />
          </div>
          <h3 className="text-2xl font-bold mb-2 gradient-text">
            Perfect Code!
          </h3>
          <p className="text-text-secondary">
            No performance issues detected. Your code is already optimized!
          </p>
        </Card>
      )}
    </div>
  );
};
