import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  ChevronDown,
  Copy,
  Wrench,
} from "lucide-react";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { MetricsGrid } from "./MetricsGrid";
import type { Issue, IssueType } from "../../types/issue";
import { copyToClipboard } from "../../utils/clipboard";

const LEARN_MORE_BY_TYPE: Partial<Record<IssueType, string>> = {
  "llm-insight": "https://reactnative.dev/docs/performance",
  "inline-function": "https://react.dev/reference/react/useCallback",
  "inline-object": "https://react.dev/reference/react/useMemo",
  "missing-memo": "https://react.dev/reference/react/memo",
  "missing-key-extractor":
    "https://reactnative.dev/docs/flatlist#keyextractor",
  "heavy-computation": "https://reactnative.dev/docs/performance#ram-bundles",
  "hook-dependencies": "https://react.dev/reference/react/useEffect",
  "missing-get-item-layout":
    "https://reactnative.dev/docs/flatlist#getitemlayout",
  flatlist: "https://reactnative.dev/docs/flatlist",
  "flatlist-tuning": "https://reactnative.dev/docs/flatlist#props",
  "flatlist-key-index": "https://reactnative.dev/docs/flatlist#keyextractor",
  sectionlist: "https://reactnative.dev/docs/sectionlist",
  "sectionlist-key-extractor":
    "https://reactnative.dev/docs/sectionlist#keyextractor",
  "bridge-native-call": "https://reactnative.dev/docs/communication-ios",
  "json-stringify-cost": "https://reactnative.dev/docs/performance",
  "native-event-emitter": "https://reactnative.dev/docs/native-modules-ios",
  "image-dimensions": "https://reactnative.dev/docs/image#style",
  "usecallback-empty-deps-jsx": "https://react.dev/reference/react/useCallback",
  "react-unsafe-html":
    "https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html",
  "react-find-dom-node": "https://react.dev/reference/react-dom#finddomnode-deprecated",
  "next-ssr-gssp":
    "https://nextjs.org/docs/pages/building-your-application/data-fetching/get-server-side-props",
  "next-ssr-gsp":
    "https://nextjs.org/docs/pages/building-your-application/data-fetching/get-static-props",
  "next-ssr-gspaths":
    "https://nextjs.org/docs/pages/building-your-application/data-fetching/get-static-paths",
  "bundle-lodash": "https://lodash.com/per-method-packages",
  "bundle-mui-icons": "https://mui.com/material-ui/icons/",
  "seo-next-head-title": "https://nextjs.org/docs/pages/api-reference/components/head",
  "cwv-img-layout": "https://web.dev/articles/cls",
  "cwv-blocking-script": "https://web.dev/articles/loading-best-practices",
};

const DEFAULT_LEARN_MORE = "https://reactnative.dev/docs/performance";

interface IssueCardProps {
  issue: Issue;
  onViewFix: () => void;
}

function formatLocation(issue: Issue): string {
  const { start, end } = issue.location ?? { start: 0, end: 0 };
  if (start === 0 && end === 0) return "Source location not specified";
  return `Lines ${start}–${end}`;
}

function impactHasMetrics(impact: Issue["impact"]): boolean {
  if (!impact || typeof impact !== "object") return false;
  return !!(
    impact.fps ||
    impact.renderTime ||
    impact.memory
  );
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue, onViewFix }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copyNote, setCopyNote] = useState<string | null>(null);

  const getImpactBadge = () => {
    if (issue.impact && issue.impact.fps) {
      const fpsDiff = issue.impact.fps.optimized - issue.impact.fps.current;
      return `${fpsDiff > 0 ? "+" : ""}${fpsDiff} FPS`;
    }
    return "Performance Impact";
  };

  const learnMoreUrl =
    LEARN_MORE_BY_TYPE[issue.type as IssueType] ?? DEFAULT_LEARN_MORE;

  const handleLearnMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(learnMoreUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopyFix = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!issue.fix?.code) return;
    const ok = await copyToClipboard(issue.fix.code);
    setCopyNote(
      ok
        ? "Copied to clipboard"
        : "Copy failed — select the code and copy manually.",
    );
    window.setTimeout(() => setCopyNote(null), 2800);
  };

  return (
    <Card
      hoverable
      glass
      className="card-hover border-background-border ring-1 ring-white/5"
    >
      <div
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
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
            <h3 className="text-xl font-semibold text-text-primary mb-1">
              {issue.title}
            </h3>
            <p className="text-sm text-text-muted font-mono">
              {formatLocation(issue)}
            </p>
          </div>

          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-text-muted"
          >
            <ChevronDown className="h-6 w-6" aria-hidden strokeWidth={2} />
          </motion.div>
        </div>

        {issue.explanation && (
          <div className="bg-calm-100/30 border-l-4 border-calm-500 rounded-lg p-4 mb-4">
            <p className="text-sm text-text-secondary leading-relaxed">
              <strong className="text-calm-400">Why this matters:</strong>
              <br />
              {issue.explanation}
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-background-border space-y-4">
              {impactHasMetrics(issue.impact) && (
                <MetricsGrid impact={issue.impact} />
              )}

              {issue.codeSnippet && (
                <div>
                  <h4 className="text-sm font-semibold text-text-muted mb-2">
                    Problematic Code
                  </h4>
                  <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto custom-scrollbar border border-background-border">
                    <pre className="text-sm font-mono text-text-secondary">
                      <code>{issue.codeSnippet}</code>
                    </pre>
                  </div>
                </div>
              )}

              {issue.fix && (
                <div>
                  <h4 className="text-sm font-semibold text-text-muted mb-2">
                    The Fix
                  </h4>
                  <p className="text-sm text-text-secondary mb-3">
                    {issue.fix.description}
                  </p>
                  <div className="bg-success-500/10 border border-success-500/25 rounded-lg p-4">
                    <pre className="text-sm font-mono text-success-500 overflow-x-auto custom-scrollbar">
                      <code>{issue.fix.code}</code>
                    </pre>
                  </div>

                  {issue.fix.alternatives &&
                    issue.fix.alternatives.length > 0 && (
                      <div className="mt-3 text-sm">
                        <p className="text-text-muted mb-2">
                          Alternative approaches:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-text-secondary">
                          {issue.fix.alternatives.map((alt, idx) => (
                            <li key={idx}>{alt}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
              )}

              <div className="flex flex-col gap-2 pt-2">
                <div className="flex gap-3 flex-wrap">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewFix();
                    }}
                    icon={<Wrench className="h-4 w-4 shrink-0" aria-hidden strokeWidth={2} />}
                  >
                    View Fix
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<BookOpen className="h-4 w-4 shrink-0" aria-hidden strokeWidth={2} />}
                    onClick={handleLearnMore}
                  >
                    Learn More
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Copy className="h-4 w-4 shrink-0" aria-hidden strokeWidth={2} />}
                    onClick={handleCopyFix}
                    disabled={!issue.fix?.code}
                  >
                    Copy Fix
                  </Button>
                </div>
                {copyNote && (
                  <p className="text-xs text-text-muted" role="status">
                    {copyNote}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
