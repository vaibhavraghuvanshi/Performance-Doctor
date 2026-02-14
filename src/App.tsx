import { useState } from "react";
import { Header } from "./components/Layout/Header";
import { CodeEditor } from "./components/CodeEditor/CodeEditor";
import { DiagnosisReport } from "./components/DiagnosisReport/DiagnosisReport";
import { ComparisonView } from "./components/Comparison/ComparisonView";
import { SummaryDashboard } from "./components/Summary/SummaryDashboard";
import type { Screen, Platform, AnalysisResult } from "./types/analysis";
import { analyzeCode } from "./services/api";

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("input");
  const [code, setCode] = useState("");
  const [platform, setPlatform] = useState<Platform>("both");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const analysis = await analyzeCode(code, platform);
      console.log("[LLM Backend Response]", analysis);
      setResult(analysis);
      setCurrentScreen("diagnosis");
    } catch (err: any) {
      setError(err.message);
      alert("Analysis failed: " + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setCode("");
    setResult(null);
    setCurrentScreen("input");
  };

  return (
    <div className="bg-background-main text-text-primary min-h-screen relative overflow-x-hidden">
      {/* Bubbles background */}
      <div className="bg-bubbles">
        <span className="bubble-left-1" />
        <span className="bubble-left-2" />
        <span className="bubble-left-3" />
        <span className="bubble-left-4" />
        <span className="bubble-left-5" />
        {/* Extra bubbles for right side */}
        <span className="bubble-right-1" />
        <span className="bubble-right-2" />
        <span className="bubble-right-3" />
      </div>
      <Header currentScreen={currentScreen} onScreenChange={setCurrentScreen} />

      {error && (
        <div className="container mx-auto px-4 py-2">
          <div className="bg-red-100 text-red-700 border border-red-300 rounded p-4 mb-4">
            {error}
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        {currentScreen === "input" && (
          <CodeEditor
            code={code}
            onChange={setCode}
            platform={platform}
            onPlatformChange={setPlatform}
            onAnalyze={handleAnalyze}
            isLoading={isAnalyzing}
          />
        )}

        {currentScreen === "diagnosis" && result && (
          <DiagnosisReport
            result={result}
            onViewComparison={() => setCurrentScreen("comparison")}
          />
        )}

        {currentScreen === "comparison" && result && (
          <ComparisonView
            original={code}
            optimized={result.optimizedCode}
            onViewSummary={() => setCurrentScreen("summary")}
          />
        )}

        {currentScreen === "summary" && result && (
          <SummaryDashboard result={result} onAnalyzeAnother={resetAnalysis} />
        )}
      </main>
    </div>
  );
}

export default App;
