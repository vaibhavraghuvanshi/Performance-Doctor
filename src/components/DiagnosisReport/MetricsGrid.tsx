import React from "react";
import type { Impact } from "../../types/issue";

interface MetricsGridProps {
  impact: Impact;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ impact }) => {
  if (!impact) return null;
  const metrics = [
    {
      label: "FPS",
      current: impact.fps?.current,
      optimized: impact.fps?.optimized,
      unit: "",
    },
    {
      label: "Render Time",
      current: impact.renderTime?.current,
      optimized: impact.renderTime?.optimized,
      unit: "",
    },
    {
      label: "Memory",
      current: impact.memory?.current,
      optimized: impact.memory?.optimized,
      unit: "",
    },
  ].filter((m) => m.current && m.optimized);

  if (metrics.length === 0) return null;

  const calculateImprovement = (current: any, optimized: any) => {
    const currentNum =
      typeof current === "string" ? parseFloat(current) : current;
    const optimizedNum =
      typeof optimized === "string" ? parseFloat(optimized) : optimized;

    if (isNaN(currentNum) || isNaN(optimizedNum)) return "0";

    const improvement = ((optimizedNum - currentNum) / currentNum) * 100;
    return improvement.toFixed(0);
  };

  return (
    <div>
      <h4 className="text-sm font-semibold text-ai-500 mb-3">
        📊 Expected Improvement
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metrics.map((metric, index) => {
          const improvement = calculateImprovement(
            metric.current,
            metric.optimized,
          );
          const isPositive = parseFloat(improvement) > 0;

          return (
            <div
              key={index}
              className="bg-ai-50 rounded-lg p-4 border border-ai-100"
            >
              <div className="text-xs text-ai-400 uppercase tracking-wide mb-2">
                {metric.label}
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg text-warning-500">
                  {metric.current}
                </span>
                <span className="text-ai-400">→</span>
                <span className="text-2xl font-bold text-success-500">
                  {metric.optimized}
                </span>
              </div>
              <div
                className={`text-xs font-semibold ${isPositive ? "text-success-500" : "text-critical-500"}`}
              >
                {isPositive ? "+" : ""}
                {improvement}% improvement
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
