import React from "react";
import { motion } from "framer-motion";

interface ScoreComparisonProps {
  currentScore: number;
  optimizedScore: number;
}

export const ScoreComparison: React.FC<ScoreComparisonProps> = ({
  currentScore,
  optimizedScore,
}) => {
  return (
    <div className="flex items-center justify-center gap-8 my-8 flex-wrap bg-background-soft border border-background-border rounded-xl py-6 ring-1 ring-white/5">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-sm text-text-muted mb-2">Current Score</div>
        <div className="text-5xl font-bold text-warning-400">
          {currentScore}/100
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, type: "spring" }}
        className="text-4xl text-success-500"
      >
        <span className="text-text-muted">→</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="text-sm text-text-muted mb-2">Optimized Score</div>
        <div className="text-5xl font-bold text-success-500">
          {optimizedScore}/100
        </div>
      </motion.div>
    </div>
  );
};
