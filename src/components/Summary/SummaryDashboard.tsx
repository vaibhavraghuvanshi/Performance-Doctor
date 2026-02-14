import React from "react";
import { motion } from "framer-motion";
import { ScoreComparison } from "./ScoreComparison";
import { ImprovementCard } from "./ImprovementCard";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import type { AnalysisResult } from "../../types/analysis";

interface SummaryDashboardProps {
  result: AnalysisResult;
  onAnalyzeAnother: () => void;
}

export const SummaryDashboard: React.FC<SummaryDashboardProps> = ({
  result,
  onAnalyzeAnother,
}) => {
  const issuesSummary = {
    critical: result.issues.filter((i) => i.severity === "critical").length,
    high: result.issues.filter((i) => i.severity === "high").length,
    medium: result.issues.filter((i) => i.severity === "medium").length,
  };

  const handleDownloadReport = () => {
    // Create a simple text report
    const report = `
React Native Performance Doctor - Analysis Report
Generated: ${new Date().toLocaleString()}

Overall Score: ${result.overallScore}/100
Optimized Score: ${result.optimizedScore}/100
Improvement: +${result.optimizedScore - result.overallScore} points

Performance Metrics:
- FPS: ${result.metrics.fps.current} → ${result.metrics.fps.optimized}
- Render Time: ${result.metrics.renderTime.current} → ${result.metrics.renderTime.optimized}
- Memory: ${result.metrics.memory.current} → ${result.metrics.memory.optimized}
- Re-renders: ${result.metrics.reRenders.current} → ${result.metrics.reRenders.optimized}

Issues Fixed:
- Critical: ${issuesSummary.critical}
- High Impact: ${issuesSummary.high}
- Medium Impact: ${issuesSummary.medium}
    `.trim();

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "performance-report.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    const text = `Just analyzed my React Native code with Performance Doctor! 🩺\n\nScore improved from ${result.overallScore} to ${result.optimizedScore} (+${result.optimizedScore - result.overallScore} points)\nFPS: ${result.metrics.fps.current} → ${result.metrics.fps.optimized} 🚀`;

    if (navigator.share) {
      navigator
        .share({
          title: "Performance Doctor Results",
          text: text,
        })
        .catch(() => {
          // Fallback to clipboard
          navigator.clipboard.writeText(text);
          alert("Results copied to clipboard!");
        });
    } else {
      navigator.clipboard.writeText(text);
      alert("Results copied to clipboard!");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* Hero Section */}
      <Card className="text-center py-12 bg-gradient-to-br from-success-500/10 to-primary-500/10 border-success-500/30 shadow-xl">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="text-6xl mb-4"
        >
          ✨
        </motion.div>
        <h2 className="text-3xl font-bold mb-4 text-success-500">
          Analysis Complete!
        </h2>

        <ScoreComparison
          currentScore={result.overallScore}
          optimizedScore={result.optimizedScore}
        />

        <p className="text-xl text-success-500 font-semibold mt-4">
          +{result.optimizedScore - result.overallScore} point improvement 🚀
        </p>
      </Card>

      {/* Performance Gains */}
      <div>
        <h3 className="text-2xl font-bold mb-6 text-ai-500">
          Performance Gains
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        </div>
      </div>

      {/* Issues Fixed */}
      <Card className="bg-ai-50 border border-ai-100">
        <h3 className="text-xl font-semibold mb-6 text-ai-500">Issues Fixed</h3>
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

      {/* Actions */}
      <div className="flex gap-4 justify-center flex-wrap">
        <Button
          variant="primary"
          size="lg"
          icon={<span>📥</span>}
          onClick={handleDownloadReport}
        >
          Download Full Report
        </Button>
        <Button
          variant="secondary"
          size="lg"
          icon={<span>🐦</span>}
          onClick={handleShare}
        >
          Share Results
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={onAnalyzeAnother}
          icon={<span>🔄</span>}
        >
          Analyze Another Component
        </Button>
      </div>
    </div>
  );
};
