import React from "react";
import Editor from "@monaco-editor/react";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { PlatformSelector } from "./PlatformSelector";
import type { Platform } from "../../types/analysis";

const EXAMPLE_CODE: Record<string, string> = {
  flatlist: `import React from 'react';\nimport { FlatList } from 'react-native';\n\nexport function FlatListExample() {\n  return (\n    <FlatList\n      data={[1,2,3]}\n      renderItem={({item}) => <div>{item}</div>}\n    />\n  );\n}`,
  hooks: `import React, { useEffect } from 'react';\n\nexport function HookExample({ value }) {\n  useEffect(() => {\n    // do something\n  }, []); // missing dependency\n  return <div>{value}</div>;\n}`,
  inline: `import React from 'react';\n\nexport function InlineFunctionExample({ items }) {\n  return (\n    <ul>\n      {items.map(item => (\n        <li key={item.id}>{item.name}</li>\n      ))}\n    </ul>\n  );\n}`,
};

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
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      {/* Editor Panel */}
      <div className="lg:col-span-2">
        <div className="rounded-2xl bg-white/60 border border-ai-100 shadow-xl p-0 relative">
          {/* File Info */}
          <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-ai-100 to-ai-50 border-b border-ai-100 rounded-t-2xl">
            <span className="bg-ai-500 text-white text-xs font-mono px-3 py-1 rounded-lg">
              ProductScreen.tsx
            </span>
            <span className="text-xs text-ai-500 font-mono">125 lines</span>
          </div>
          {/* Monaco Editor */}
          <Editor
            height="600px"
            language="typescript"
            theme="vs-dark"
            value={code}
            onChange={(value) => onChange(value ?? "")}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              fontFamily: "JetBrains Mono, monospace",
              padding: { top: 16, bottom: 16 },
            }}
          />
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-8">
        {/* Platform Selector */}
        <Card className="bg-white/60 border border-ai-100 shadow-xl">
          <h3 className="text-sm font-semibold text-ai-500 mb-4 uppercase tracking-wide">
            PLATFORM
          </h3>
          <PlatformSelector platform={platform} onChange={onPlatformChange} />
        </Card>

        {/* Quick Examples */}
        <Card className="bg-white/60 border border-ai-100 shadow-xl">
          <h3 className="text-sm font-semibold text-ai-500 mb-4 uppercase tracking-wide">
            QUICK EXAMPLES
          </h3>
          <select
            className="w-full bg-white/60 border border-ai-200 rounded-lg px-4 py-3 text-ai-600 focus:outline-none focus:ring-2 focus:ring-ai-400"
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

        {/* Analysis Info & Button */}
        <Card className="bg-white/60 border border-ai-100 shadow-xl">
          <h3 className="text-sm font-semibold text-ai-500 mb-4 uppercase tracking-wide">
            ANALYSIS
          </h3>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-ai-500 animate-pulse" />
            <span className="text-sm text-ai-500">
              Estimated time: ~5 seconds
            </span>
          </div>
          <Button
            variant="primary"
            size="lg"
            className="w-full bg-gradient-to-r from-ai-500 to-primary-400 text-white text-lg py-4 rounded-xl shadow-lg"
            onClick={onAnalyze}
            isLoading={isLoading}
            disabled={!code || isLoading}
            icon={!isLoading && <span>🔍</span>}
          >
            {isLoading ? "Analyzing..." : "Analyze Performance"}
          </Button>
        </Card>
      </div>
    </div>
  );
};
