import React from "react";
import { motion } from "framer-motion";
import { Card } from "../common/Card";

interface ImprovementCardProps {
  label: string;
  currentValue: number | string;
  optimizedValue: number | string;
  unit: string;
}

export const ImprovementCard: React.FC<ImprovementCardProps> = ({
  label,
  currentValue,
  optimizedValue,
  unit,
}) => {
  const calculateImprovement = () => {
    const current =
      typeof currentValue === "string"
        ? parseFloat(currentValue)
        : currentValue;
    const optimized =
      typeof optimizedValue === "string"
        ? parseFloat(optimizedValue)
        : optimizedValue;

    if (isNaN(current) || isNaN(optimized)) return "0";

    const improvement = ((optimized - current) / current) * 100;
    return improvement.toFixed(0);
  };

  const improvement = calculateImprovement();
  const isPositive = parseFloat(improvement) > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
    >
      <Card className="h-full border-background-border ring-1 ring-white/5">
        <div className="text-sm text-text-muted mb-3 font-medium">{label}</div>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-lg text-warning-400 font-semibold">
            {currentValue}
            {unit}
          </span>
          <span className="text-text-muted">→</span>
          <span className="text-3xl font-bold text-success-500">
            {optimizedValue}
            {unit}
          </span>
        </div>
        <div
          className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${
            isPositive
              ? "bg-success-500/20 text-success-500"
              : "bg-critical-500/20 text-critical-500"
          }`}
        >
          {isPositive ? "+" : ""}
          {improvement}%
        </div>
      </Card>
    </motion.div>
  );
};
