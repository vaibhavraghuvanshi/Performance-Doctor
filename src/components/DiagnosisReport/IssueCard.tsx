import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { MetricsGrid } from "./MetricsGrid";
import type { Issue } from "../../types/issue";

interface IssueCardProps {
  issue: Issue;
  onViewFix: () => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue, onViewFix }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // const getImpactBadge = () => {
  //   if (issue.impact.fps) {
  //     const fpsDiff = issue.impact.fps.optimized - issue.impact.fps.current;
  //     return `${fpsDiff > 0 ? "+" : ""}${fpsDiff} FPS`;
  //   }
  //   return "Performance Impact";
  // };
  const getImpactBadge = () => {
    if (issue.impact && issue.impact.fps) {
      const fpsDiff = issue.impact.fps.optimized - issue.impact.fps.current;
      return `${fpsDiff > 0 ? "+" : ""}${fpsDiff} FPS`;
    }
    return "Performance Impact";
  };

  return (
    <Card
      hoverable
      glass
      className="card-hover bg-white/60 border border-ai-100"
    >
      <div
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Badge severity={issue.severity}>
                {issue.severity.toUpperCase()}
              </Badge>
              <span className="inline-flex items-center px-3 py-1 bg-warning-500/20 text-warning-500 rounded-lg text-xs font-semibold">
                {getImpactBadge()}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-ai-700 mb-1">
              {issue.title}
            </h3>
            <p className="text-sm text-ai-400 font-mono">
              {issue.location
                ? `Lines ${issue.location.start}–${issue.location.end}`
                : "Location unknown"}
            </p>
          </div>

          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-ai-400"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </motion.div>
        </div>

        {/* Explanation Preview */}
        {issue.explanation && (
          <div className="bg-ai-50 border-l-4 border-ai-500 rounded-lg p-4 mb-4">
            <p className="text-sm text-ai-700 leading-relaxed">
              <strong className="text-ai-500">💡 Why this matters:</strong>
              <br />
              {issue.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-white/10 space-y-4">
              {/* Metrics */}
              {issue.impact && <MetricsGrid impact={issue.impact} />}

              {/* Code Snippet */}
              {issue.codeSnippet && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-400 mb-2">
                    Problematic Code
                  </h4>
                  <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto custom-scrollbar">
                    <pre className="text-sm font-mono text-slate-300">
                      <code>{issue.codeSnippet}</code>
                    </pre>
                  </div>
                </div>
              )}

              {/* Fix Description */}
              {issue.fix && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-400 mb-2">
                    📋 The Fix
                  </h4>
                  <p className="text-sm text-slate-300 mb-3">
                    {issue.fix.description}
                  </p>
                  <div className="bg-success-500/10 border border-success-500/30 rounded-lg p-4">
                    <pre className="text-sm font-mono text-success-400 overflow-x-auto custom-scrollbar">
                      <code>{issue.fix.code}</code>
                    </pre>
                  </div>

                  {/* Alternatives */}
                  {issue.fix.alternatives &&
                    issue.fix.alternatives.length > 0 && (
                      <div className="mt-3 text-sm">
                        <p className="text-slate-400 mb-2">
                          Alternative approaches:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-slate-300">
                          {issue.fix.alternatives.map((alt, idx) => (
                            <li key={idx}>{alt}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 flex-wrap pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onViewFix}
                  icon={<span>✨</span>}
                >
                  View Fix
                </Button>
                <Button variant="secondary" size="sm" icon={<span>📚</span>}>
                  Learn More
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<span>📋</span>}
                  onClick={() => {
                    if (issue.fix) {
                      navigator.clipboard.writeText(issue.fix.code);
                    }
                  }}
                >
                  Copy Fix
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
