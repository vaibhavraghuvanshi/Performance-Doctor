import React, { useState } from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import {
  Braces,
  FileText,
  NotebookText,
  RefreshCw,
  Rocket,
  Share2,
  Sparkles,
} from "lucide-react";
import { ScoreComparison } from "./ScoreComparison";
import { ImprovementCard } from "./ImprovementCard";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import type { AnalysisResult } from "../../types/analysis";
import { copyToClipboard } from "../../utils/clipboard";
import { downloadAnalysisReport } from "../../utils/reportExport";

interface SummaryDashboardProps {
  result: AnalysisResult;
  onAnalyzeAnother: () => void;
}

export const SummaryDashboard: React.FC<SummaryDashboardProps> = ({
  result,
  onAnalyzeAnother,
}) => {
  const [shareNote, setShareNote] = useState<string | null>(null);
  const seo = result.metrics.seoReadiness;

  const issuesSummary = {
    critical: result.issues.filter((i) => i.severity === "critical").length,
    high: result.issues.filter((i) => i.severity === "high").length,
    medium: result.issues.filter((i) => i.severity === "medium").length,
  };

  const handleShare = async () => {
    const text = `Performance Doctor — analysis summary\n\nRuntime score: ${result.overallScore} → potential ${result.optimizedScore} (+${result.optimizedScore - result.overallScore})\nFPS: ${result.metrics.fps.current} → ${result.metrics.fps.optimized}${seo ? `\nSEO / CWV readiness: ${seo.current} → ${seo.optimized}` : ""}`;

    const showCopyFallback = async () => {
      const ok = await copyToClipboard(text);
      setShareNote(
        ok
          ? "Results copied to clipboard."
          : "Could not copy — select this summary text manually.",
      );
      window.setTimeout(() => setShareNote(null), 4000);
    };

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Performance Doctor Results",
          text,
        });
      } catch {
        await showCopyFallback();
      }
    } else {
      await showCopyFallback();
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      <Card className="text-center py-12 bg-gradient-to-br from-success-500/15 via-background-card to-calm-500/10 border-success-500/25 shadow-card ring-1 ring-white/5">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="flex justify-center mb-4"
          aria-hidden
        >
          <Sparkles className="h-14 w-14 text-success-400" strokeWidth={1.25} />
        </motion.div>
        <h2 className="text-3xl font-bold mb-4 text-success-500">
          Analysis Complete!
        </h2>

        <ScoreComparison
          currentScore={result.overallScore}
          optimizedScore={result.optimizedScore}
        />

        <p className="text-xl text-success-500 font-semibold mt-4 inline-flex items-center justify-center gap-2">
          <Rocket className="h-6 w-6 shrink-0" strokeWidth={2} aria-hidden />
          +{result.optimizedScore - result.overallScore} point improvement potential
        </p>
      </Card>

      <div>
        <h3 className="text-2xl font-bold mb-6 text-text-primary">
          Performance Gains
        </h3>
        <div
          className={clsx(
            "grid grid-cols-1 md:grid-cols-2 gap-6",
            seo ? "lg:grid-cols-5" : "lg:grid-cols-4",
          )}
        >
          <ImprovementCard
            label="Frames Per Second"
            currentValue={result.metrics.fps.current}
            optimizedValue={result.metrics.fps.optimized}
            unit=""
          />
          <ImprovementCard
            label="Render Time"
            currentValue={result.metrics.renderTime.current}
            optimizedValue={result.metrics.renderTime.optimized}
            unit=""
          />
          <ImprovementCard
            label="Memory Usage"
            currentValue={result.metrics.memory.current}
            optimizedValue={result.metrics.memory.optimized}
            unit=""
          />
          <ImprovementCard
            label="Re-renders/sec"
            currentValue={result.metrics.reRenders.current}
            optimizedValue={result.metrics.reRenders.optimized}
            unit=""
          />
          {seo && (
            <ImprovementCard
              label="SEO & CWV readiness"
              currentValue={seo.current}
              optimizedValue={seo.optimized}
              unit=""
            />
          )}
        </div>
      </div>

      <Card className="border-background-border ring-1 ring-white/5">
        <h3 className="text-xl font-semibold mb-6 text-calm-400">Issues Fixed</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-5xl font-bold text-critical-500 mb-2"
            >
              {issuesSummary.critical}
            </motion.div>
            <div className="text-critical-400">Critical Issues</div>
          </div>
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="text-5xl font-bold text-warning-500 mb-2"
            >
              {issuesSummary.high}
            </motion.div>
            <div className="text-warning-400">High Impact</div>
          </div>
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="text-5xl font-bold text-caution-500 mb-2"
            >
              {issuesSummary.medium}
            </motion.div>
            <div className="text-caution-400">Medium Impact</div>
          </div>
        </div>
      </Card>

      {shareNote && (
        <p className="text-center text-sm text-text-muted" role="status">
          {shareNote}
        </p>
      )}

      <Card className="border-background-border ring-1 ring-white/5">
        <h3 className="text-lg font-semibold mb-2 text-text-primary">Export report</h3>
        <p className="text-sm text-text-muted mb-4">
          Plain text (shareable), Markdown (docs / PRs), or JSON (full machine-readable result including all issues and optimized code).
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            variant="secondary"
            size="md"
            icon={<FileText className="h-4 w-4 shrink-0" aria-hidden strokeWidth={2} />}
            onClick={() => downloadAnalysisReport(result, "txt")}
          >
            Download .txt
          </Button>
          <Button
            variant="secondary"
            size="md"
            icon={<NotebookText className="h-4 w-4 shrink-0" aria-hidden strokeWidth={2} />}
            onClick={() => downloadAnalysisReport(result, "md")}
          >
            Download .md
          </Button>
          <Button
            variant="secondary"
            size="md"
            icon={<Braces className="h-4 w-4 shrink-0" aria-hidden strokeWidth={2} />}
            onClick={() => downloadAnalysisReport(result, "json")}
          >
            Download .json
          </Button>
        </div>
      </Card>

      <div className="flex gap-4 justify-center flex-wrap">
        <Button
          variant="secondary"
          size="lg"
          icon={<Share2 className="h-5 w-5 shrink-0" aria-hidden strokeWidth={2} />}
          onClick={handleShare}
        >
          Share Results
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={onAnalyzeAnother}
          icon={<RefreshCw className="h-5 w-5 shrink-0" aria-hidden strokeWidth={2} />}
        >
          Analyze Another Component
        </Button>
      </div>
    </div>
  );
};
