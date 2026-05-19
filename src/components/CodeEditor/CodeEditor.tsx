import React, { useCallback, useMemo, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { Code2, Lightbulb, Rocket, Sparkles, Trash2, Upload } from "lucide-react";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { PlatformSelector } from "./PlatformSelector";
import type { Platform } from "../../types/analysis";

const EXAMPLE_CODE: Record<string, string> = {
  flatlist: `import React from 'react';\nimport { FlatList } from 'react-native';\n\nexport function FlatListExample() {\n  return (\n    <FlatList\n      data={[1,2,3]}\n      renderItem={({item}) => <div>{item}</div>}\n    />\n  );\n}`,
  hooks: `import React, { useEffect } from 'react';\n\nexport function HookExample({ value }) {\n  useEffect(() => {\n    // do something\n  }, []); // missing dependency\n  return <div>{value}</div>;\n}`,
  inline: `import React from 'react';\n\nexport function InlineFunctionExample({ items }) {\n  return (\n    <ul>\n      {items.map(item => (\n        <li key={item.id}>{item.name}</li>\n      ))}\n    </ul>\n  );\n}`,
};

type DetectMode = "auto" | "typescript" | "typescriptreact" | "javascript";

function inferLanguage(code: string): "typescript" | "typescriptreact" | "javascript" {
  if (/\b(jsx|tsx)\b/i.test(code) || /<\/?[A-Za-z][\w.]*(\s|>)/.test(code)) {
    return "typescriptreact";
  }
  if (/^\s*import\s+.*from\s+['"]react['"]/m.test(code) && /<[A-Za-z]/.test(code)) {
    return "typescriptreact";
  }
  return "typescript";
}

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  platform: Platform;
  onPlatformChange: (platform: Platform) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  platform,
  onPlatformChange,
  onAnalyze,
  isLoading,
}) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [detectMode, setDetectMode] = useState<DetectMode>("auto");

  const resolvedLanguage = useMemo(() => {
    if (detectMode === "auto") return inferLanguage(code);
    return detectMode;
  }, [code, detectMode]);

  const lineCount = useMemo(
    () => Math.max(1, code.split(/\r\n|\n|\r/).length),
    [code],
  );

  const langBadge = resolvedLanguage === "typescriptreact" ? "TSX" : resolvedLanguage === "javascript" ? "JS" : "TS";

  const handleEditorMount = useCallback((ed: editor.IStandaloneCodeEditor) => {
    editorRef.current = ed;
  }, []);

  const handleFormat = useCallback(() => {
    void editorRef.current?.getAction("editor.action.formatDocument")?.run();
  }, []);

  const handleClear = useCallback(() => {
    onChange("");
    editorRef.current?.setValue("");
  }, [onChange]);

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      onChange(text);
      const name = file.name.toLowerCase();
      if (name.endsWith(".tsx") || name.endsWith(".jsx")) setDetectMode("typescriptreact");
      else if (name.endsWith(".ts")) setDetectMode("typescript");
      else if (name.endsWith(".js")) setDetectMode("javascript");
    };
    reader.readAsText(file);
  };

  const readyToAnalyze = Boolean(code.trim());

  return (
    <div className="flex flex-1 flex-col lg:flex-row min-h-0 animate-fade-in">
      {/* Center: editor workspace */}
      <div className="flex flex-1 flex-col min-w-0 min-h-0 border-b lg:border-b-0 lg:border-r border-background-border">
        <div className="shrink-0 px-5 py-5 lg:px-8 lg:py-6 border-b border-background-border bg-background-soft/40">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex gap-4 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-background-elevated border border-background-border flex items-center justify-center text-calm-400 shrink-0">
                <Code2 className="h-5 w-5" strokeWidth={2} aria-hidden />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-primary tracking-tight">
                  Code Editor
                </h2>
                <p className="text-sm text-text-muted mt-1 max-w-xl">
                  Write or paste your code below to analyze performance
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success-500 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
              <label className="sr-only" htmlFor="lang-detect">
                Language detection
              </label>
              <select
                id="lang-detect"
                value={detectMode}
                onChange={(e) => setDetectMode(e.target.value as DetectMode)}
                className="appearance-none rounded-lg border border-background-border bg-background-card px-3 py-2 pr-8 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-calm-500/40 bg-[length:1rem] bg-[right_0.5rem_center] bg-no-repeat"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2371717a'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                }}
              >
                <option value="auto">Auto-detect</option>
                <option value="typescript">TypeScript</option>
                <option value="typescriptreact">TypeScript React</option>
                <option value="javascript">JavaScript</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0 p-4 lg:p-6">
          <div className="flex-1 flex flex-col min-h-0 rounded-2xl border border-background-border bg-background-card/90 overflow-hidden ring-1 ring-white/5 shadow-card">
            <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-background-border bg-background-elevated/80">
              <span className="text-xs font-mono font-semibold text-text-primary truncate max-w-[40%]">
                ProductScreen.tsx
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-calm-500/20 text-calm-300 border border-calm-500/30">
                {langBadge}
              </span>
              <span className="text-xs text-text-muted font-mono">{lineCount} lines</span>
              <div className="flex-1" />
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-critical-400 transition-colors px-2 py-1 rounded-lg hover:bg-background-soft"
              >
                <Trash2 className="h-3.5 w-3.5 shrink-0" aria-hidden strokeWidth={2} />
                Clear
              </button>
            </div>
            <div className="min-h-[320px] bg-[#0d1117]">
              <Editor
                height="520px"
                language={resolvedLanguage}
                theme="vs-dark"
                value={code}
                onChange={(value) => onChange(value ?? "")}
                onMount={handleEditorMount}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  fontFamily: "JetBrains Mono, monospace",
                  padding: { top: 16, bottom: 16 },
                  tabSize: 2,
                }}
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 border-t border-background-border bg-background-elevated/90 text-xs text-text-muted">
              <div className="flex flex-wrap items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".ts,.tsx,.js,.jsx,.txt"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-semibold text-text-secondary hover:text-text-primary hover:bg-background-soft transition-colors"
                >
                  <Upload className="h-3.5 w-3.5 shrink-0" aria-hidden strokeWidth={2} />
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={handleFormat}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-semibold text-text-secondary hover:text-text-primary hover:bg-background-soft transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden strokeWidth={2} />
                  Format Code
                </button>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <span>
                  {lineCount} lines ·{" "}
                  {resolvedLanguage === "typescriptreact"
                    ? "TypeScript React"
                    : resolvedLanguage === "javascript"
                      ? "JavaScript"
                      : "TypeScript"}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-success-500 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: workflow */}
      <aside className="w-full lg:w-[380px] shrink-0 overflow-y-auto bg-background-soft/20 lg:bg-background-main/40 p-5 lg:p-6 space-y-5 border-t lg:border-t-0 lg:border-l border-background-border">
        <div id="workspace-platform" className="scroll-mt-4">
          <Card className="shadow-card !p-5">
            <h3 className="text-sm font-bold text-text-primary">Platform</h3>
            <p className="text-xs text-text-muted mt-1 mb-4">Select target platform</p>
            <PlatformSelector platform={platform} onChange={onPlatformChange} />
          </Card>
        </div>

        <div id="workspace-examples" className="scroll-mt-4">
          <Card className="shadow-card !p-5">
            <h3 className="text-sm font-bold text-text-primary">Quick Examples</h3>
            <p className="text-xs text-text-muted mt-1 mb-4">Choose an example to analyze</p>
            <select
              className="w-full bg-background-soft border border-background-border rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-calm-500/40"
              onChange={(e) => {
                if (e.target.value) {
                  onChange(EXAMPLE_CODE[e.target.value]);
                }
              }}
              defaultValue=""
            >
              <option value="">Select an example...</option>
              <option value="flatlist">FlatList Issues</option>
              <option value="hooks">Hook Dependencies</option>
              <option value="inline">Inline Functions</option>
            </select>
          </Card>
        </div>

        <div
          id="workspace-analysis"
          className="scroll-mt-4"
          aria-busy={isLoading}
          aria-live="polite"
        >
          <Card className="shadow-card !p-5">
            <h3 className="text-sm font-bold text-text-primary">Analysis</h3>
            <p className="text-xs text-text-muted mt-1 mb-4">
              {readyToAnalyze ? "Ready to analyze your code" : "Add code to get started"}
            </p>
            <Button
              variant="primary"
              size="lg"
              className="w-full text-base py-3.5 rounded-xl font-bold"
              onClick={onAnalyze}
              isLoading={isLoading}
              disabled={!readyToAnalyze || isLoading}
              icon={!isLoading && <Rocket className="h-5 w-5 shrink-0" aria-hidden strokeWidth={2} />}
            >
              {isLoading ? "Analyzing..." : "Analyze Performance"}
            </Button>
            <p className="text-xs text-text-muted mt-3 text-center">
              AI analysis often takes 15–90s; DevTools may show “pending” until the response finishes.
            </p>
          </Card>
        </div>

        <Card glass={false} className="!p-5 border-dashed border-calm-500/30 bg-calm-500/8">
          <div className="flex gap-3">
            <Lightbulb className="h-5 w-5 shrink-0 text-calm-400 mt-0.5" aria-hidden strokeWidth={2} />
            <div>
              <h3 className="text-sm font-bold text-calm-300">Pro Tip</h3>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                For best results, include the component logic and any performance-critical operations.
              </p>
            </div>
          </div>
        </Card>
      </aside>
    </div>
  );
};
