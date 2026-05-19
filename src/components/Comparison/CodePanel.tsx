import React from "react";
import Editor from "@monaco-editor/react";
import { AlertTriangle, BarChart3, Check, Timer } from "lucide-react";
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
      Icon: AlertTriangle,
      bg: "bg-warning-500/20",
      border: "border-warning-500/30",
      text: "text-warning-500",
      badgeBg: "bg-warning-500/20",
    },
    success: {
      Icon: Check,
      bg: "bg-success-500/20",
      border: "border-success-500/30",
      text: "text-success-500",
      badgeBg: "bg-success-500/20",
    },
  };

  const colors = statusColors[status];
  const HeaderIcon = colors.Icon;

  const safeStats = stats ?? { issues: 0, fps: 0, renderTime: "N/A" };

  return (
    <Card glass className="overflow-hidden p-0">
      <div
        className={`px-6 py-4 border-b border-background-border ${colors.bg} ${colors.border}`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <HeaderIcon
              className={`h-7 w-7 shrink-0 ${colors.text}`}
              strokeWidth={1.75}
              aria-hidden
            />
            <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm flex-wrap">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 ${colors.badgeBg} rounded-lg`}
          >
            {status === "warning" ? (
              <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
            ) : (
              <Check className="h-4 w-4 shrink-0" aria-hidden strokeWidth={2.5} />
            )}
            <span className={colors.text}>
              {safeStats.issues} {safeStats.issues === 1 ? "issue" : "issues"}
            </span>
          </div>
          <div
            className={`flex items-center gap-2 px-3 py-1.5 ${colors.badgeBg} rounded-lg`}
          >
            <BarChart3 className="h-4 w-4 shrink-0" aria-hidden />
            <span className={colors.text}>{safeStats.fps} FPS</span>
          </div>
          <div
            className={`flex items-center gap-2 px-3 py-1.5 ${colors.badgeBg} rounded-lg`}
          >
            <Timer className="h-4 w-4 shrink-0" aria-hidden />
            <span className={colors.text}>{safeStats.renderTime}</span>
          </div>
        </div>
      </div>

      <div className="bg-[#0d1117] border-t border-background-border">
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
