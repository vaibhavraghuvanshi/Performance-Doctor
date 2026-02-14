import React from "react";
import Editor from "@monaco-editor/react";
import { Card } from "../common/Card";

interface CodePanelProps {
  title: string;
  code: string;
  status: "warning" | "success";
  stats?: {
    issues: number;
    fps: number;
    renderTime: string;
  };
}

export const CodePanel: React.FC<CodePanelProps> = ({
  title,
  code,
  status,
  stats,
}) => {
  const statusColors = {
    warning: {
      icon: "📛",
      bg: "bg-warning-500/20",
      border: "border-warning-500/30",
      text: "text-warning-500",
      badgeBg: "bg-warning-500/20",
    },
    success: {
      icon: "✅",
      bg: "bg-success-500/20",
      border: "border-success-500/30",
      text: "text-success-500",
      badgeBg: "bg-success-500/20",
    },
  };

  const colors = statusColors[status];

  // Provide safe defaults if stats is undefined
  const safeStats = stats ?? { issues: 0, fps: 0, renderTime: "N/A" };

  return (
    <Card glass className="overflow-hidden p-0">
      {/* Header */}
      <div
        className={`px-6 py-4 border-b border-white/10 ${colors.bg} ${colors.border}`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{colors.icon}</span>
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm flex-wrap">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 ${colors.badgeBg} rounded-lg`}
          >
            <span>{status === "warning" ? "⚠️" : "✓"}</span>
            <span className={colors.text}>
              {safeStats.issues} {safeStats.issues === 1 ? "issue" : "issues"}
            </span>
          </div>
          <div
            className={`flex items-center gap-2 px-3 py-1.5 ${colors.badgeBg} rounded-lg`}
          >
            <span>📊</span>
            <span className={colors.text}>{safeStats.fps} FPS</span>
          </div>
          <div
            className={`flex items-center gap-2 px-3 py-1.5 ${colors.badgeBg} rounded-lg`}
          >
            <span>⏱️</span>
            <span className={colors.text}>{safeStats.renderTime}</span>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="bg-slate-900">
        <Editor
          height="500px"
          language="typescript"
          theme="vs-dark"
          value={code || "// No code to display"}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            fontFamily: "JetBrains Mono, monospace",
            padding: { top: 16, bottom: 16 },
            scrollbar: {
              vertical: "auto",
              horizontal: "auto",
            },
          }}
        />
      </div>
    </Card>
  );
};
