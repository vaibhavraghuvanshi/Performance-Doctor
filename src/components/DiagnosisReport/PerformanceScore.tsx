import React, { useEffect, useState } from "react";
import { Card } from "../common/Card";

interface PerformanceScoreProps {
  currentScore: number;
  optimizedScore: number;
  topBottleneck: string | null;
}

export const PerformanceScore: React.FC<PerformanceScoreProps> = ({
  currentScore,
  optimizedScore,
  topBottleneck,
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Animate score on mount
    const timer = setTimeout(() => {
      setAnimatedScore(currentScore);
    }, 100);

    return () => clearTimeout(timer);
  }, [currentScore]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "from-success-500 to-success-600";
    if (score >= 60) return "from-caution-500 to-warning-500";
    return "from-critical-500 to-warning-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Needs Improvement";
    return "Critical Issues";
  };

  return (
    <Card className="text-center bg-white/60 border border-ai-100">
      <div className="mb-4">
        <div
          className={`text-7xl font-bold transition-all duration-1000 ${
            currentScore >= 80
              ? "text-success-500"
              : currentScore >= 60
                ? "text-warning-500"
                : "text-critical-500"
          }`}
        >
          {animatedScore}/100
        </div>
        <div className="text-lg text-ai-400 mt-2">
          Performance Score · {getScoreLabel(currentScore)}
        </div>
      </div>

      {/* Score Bar */}
      <div className="h-3 bg-ai-50 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full bg-gradient-to-r ${getScoreColor(currentScore)} transition-all duration-1000 ease-out`}
          style={{ width: `${animatedScore}%` }}
        />
      </div>

      {/* Top Bottleneck */}
      {topBottleneck && (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-warning-500/20 rounded-lg">
          <span className="text-sm text-warning-500 font-medium">
            ⚠️ Top Bottleneck: {topBottleneck}
          </span>
        </div>
      )}

      {/* Potential Score */}
      {optimizedScore > currentScore && (
        <div className="mt-4 pt-4 border-t border-ai-100">
          <div className="text-sm text-ai-400 mb-1">
            Potential Score After Fixes
          </div>
          <div className="text-3xl font-bold text-success-500">
            {optimizedScore}/100
          </div>
          <div className="text-sm text-success-500 mt-1">
            +{optimizedScore - currentScore} point improvement possible
          </div>
        </div>
      )}
    </Card>
  );
};
