import React, { useEffect, useState } from "react";
import { Gauge, Search } from "lucide-react";
import { Card } from "../common/Card";

interface PerformanceScoreProps {
  currentScore: number;
  optimizedScore: number;
  topBottleneck: string | null;
  seoReadiness?: { current: number; optimized: number };
}

export const PerformanceScore: React.FC<PerformanceScoreProps> = ({
  currentScore,
  optimizedScore,
  topBottleneck,
  seoReadiness,
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedSeo, setAnimatedSeo] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(currentScore);
    }, 100);
    return () => clearTimeout(timer);
  }, [currentScore]);

  useEffect(() => {
    if (seoReadiness === undefined) return;
    const timer = setTimeout(() => {
      setAnimatedSeo(seoReadiness.current);
    }, 120);
    return () => clearTimeout(timer);
  }, [seoReadiness]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "from-success-500 to-success-400";
    if (score >= 60) return "from-caution-500 to-warning-500";
    return "from-critical-500 to-warning-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Needs Improvement";
    return "Critical Issues";
  };

  const seoLabel = (score: number) => {
    if (score >= 80) return "Strong";
    if (score >= 60) return "Fair";
    return "Needs attention";
  };

  return (
    <Card className="text-center border-background-border shadow-card ring-1 ring-white/5">
      <div className="mb-4 flex flex-col items-center gap-2">
        <Gauge className="h-8 w-8 text-calm-400" aria-hidden />
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
        <div className="text-lg text-text-secondary mt-2">
          Runtime performance · {getScoreLabel(currentScore)}
        </div>
      </div>

      <div className="h-3 bg-background-soft rounded-full overflow-hidden mb-4 ring-1 ring-background-border">
        <div
          className={`h-full bg-gradient-to-r ${getScoreColor(currentScore)} transition-all duration-1000 ease-out rounded-full`}
          style={{ width: `${animatedScore}%` }}
        />
      </div>

      {seoReadiness !== undefined && (
        <div className="mb-4 rounded-xl border border-background-border bg-background-soft/50 px-4 py-4 text-left">
          <div className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-2">
            <Search className="h-4 w-4 text-calm-400 shrink-0" aria-hidden />
            SEO &amp; Core Web Vitals readiness
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <span
              className={`text-3xl font-bold tabular-nums ${
                seoReadiness.current >= 80
                  ? "text-success-500"
                  : seoReadiness.current >= 60
                    ? "text-warning-500"
                    : "text-critical-400"
              }`}
            >
              {animatedSeo}/100
            </span>
            <span className="text-xs text-text-muted">
              {seoLabel(seoReadiness.current)} · target {seoReadiness.optimized}/100 after fixes
            </span>
          </div>
          <div className="mt-2 h-2 bg-background-main rounded-full overflow-hidden ring-1 ring-background-border">
            <div
              className={`h-full bg-gradient-to-r ${getScoreColor(seoReadiness.current)} transition-all duration-1000 ease-out rounded-full`}
              style={{ width: `${animatedSeo}%` }}
            />
          </div>
        </div>
      )}

      {topBottleneck && (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-warning-500/15 rounded-lg border border-warning-500/25">
          <span className="text-sm text-warning-400 font-medium">
            Top Bottleneck: {topBottleneck}
          </span>
        </div>
      )}

      {optimizedScore > currentScore && (
        <div className="mt-4 pt-4 border-t border-background-border">
          <div className="text-sm text-text-muted mb-1">
            Potential Score After Fixes
          </div>
          <div className="text-3xl font-bold text-success-500">
            {optimizedScore}/100
          </div>
          <div className="text-sm text-success-400 mt-1">
            +{optimizedScore - currentScore} point improvement possible
          </div>
        </div>
      )}
    </Card>
  );
};
