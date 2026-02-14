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
    <div className="flex items-center justify-center gap-8 my-8 flex-wrap bg-ai-50 border border-ai-100 rounded-xl py-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-sm text-ai-400 mb-2">Current Score</div>
        <div className="text-5xl font-bold text-warning-500">
          {currentScore}/100
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, type: "spring" }}
        className="text-4xl text-success-500"
      >
        <span className="text-ai-400">→</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="text-sm text-ai-400 mb-2">Optimized Score</div>
        <div className="text-5xl font-bold text-success-500">
          {optimizedScore}/100
        </div>
      </motion.div>
    </div>
  );
};
