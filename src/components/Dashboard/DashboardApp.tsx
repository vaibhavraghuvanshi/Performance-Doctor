import { useCallback, useState } from "react";
import { clsx } from "clsx";
import { AppSidebar, type SidebarNavAction } from "../Layout/AppSidebar";
import { CodeEditor } from "../CodeEditor/CodeEditor";
import { DiagnosisReport } from "../DiagnosisReport/DiagnosisReport";
import { ComparisonView } from "../Comparison/ComparisonView";
import { SummaryDashboard } from "../Summary/SummaryDashboard";
import { HistoryScreen } from "../History/HistoryScreen";
import { SettingsScreen } from "../Settings/SettingsScreen";
import type { Screen, Platform, AnalysisResult } from "../../types/analysis";
import { analyzeCode } from "../../services/api";
import { saveHistoryEntry } from "../../services/historyApi";
import { useAuth } from "../../contexts/AuthContext";

function scrollToWorkspaceSection(sectionId: string) {
  requestAnimationFrame(() => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  });
}

export function DashboardApp() {
  const { user } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>("input");
  const [code, setCode] = useState("");
  const [platform, setPlatform] = useState<Platform>("both");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setResult(null);
    try {
      const analysis = await analyzeCode(code, platform);
      setResult(analysis);
      setCurrentScreen("diagnosis");
      void saveHistoryEntry({
        code,
        platform,
        result: analysis,
      }).catch(() => {
        /* history is best-effort */
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Analysis failed unexpectedly.";
      setAnalysisError(message);
      setCurrentScreen("diagnosis");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setCode("");
    setResult(null);
    setAnalysisError(null);
    setCurrentScreen("input");
  };

  const handleDiagnosisRetry = () => {
    setAnalysisError(null);
    setCurrentScreen("input");
  };

  const handleScreenChange = useCallback((screen: Screen) => {
    if (screen === "input") {
      setAnalysisError(null);
    }
    setCurrentScreen(screen);
  }, []);

  const handleSidebarAction = useCallback(
    (action: SidebarNavAction) => {
      if (action.kind === "screen") {
        handleScreenChange(action.screen);
        return;
      }
      handleScreenChange("input");
      setTimeout(() => scrollToWorkspaceSection(action.sectionId), 50);
    },
    [handleScreenChange],
  );

  const handleOpenHistoryEntry = useCallback((nextCode: string, nextResult: AnalysisResult) => {
    setCode(nextCode);
    setResult(nextResult);
    setAnalysisError(null);
    setCurrentScreen("diagnosis");
  }, []);

  const canViewDiagnosis = !!result || !!analysisError;
  const canViewComparison = !!result;
  const canViewSummary = !!result;

  const mobileTabs: { id: Screen; label: string; enabled: boolean }[] = [
    { id: "input", label: "Editor", enabled: true },
    { id: "diagnosis", label: "Results", enabled: canViewDiagnosis },
    { id: "comparison", label: "Compare", enabled: canViewComparison },
    { id: "summary", label: "Summary", enabled: canViewSummary },
    { id: "history", label: "History", enabled: true },
    { id: "settings", label: "Settings", enabled: true },
  ];

  return (
    <div className="flex h-[100dvh] min-h-0 flex-col bg-background-main text-text-primary overflow-hidden">
      {import.meta.env.VITE_PUBLIC_BETA === "1" && (
        <div
          className="shrink-0 border-b border-ai-500/35 bg-ai-500/10 px-4 py-2.5 text-center text-sm text-text-secondary"
          role="status"
        >
          <span className="font-semibold text-ai-300">Public beta</span>
          {" — "}
          Scores and exports are indicative; validate on real devices before shipping. Send feedback from your team channel or repo issues.
        </div>
      )}
      <div className="flex flex-1 min-h-0">
        <AppSidebar
          currentScreen={currentScreen}
          onAction={handleSidebarAction}
          canViewDiagnosis={canViewDiagnosis}
          canViewComparison={canViewComparison}
          canViewSummary={canViewSummary}
          user={user}
        />

        <div className="flex flex-1 flex-col min-w-0 min-h-0">
          <nav
            className="lg:hidden flex shrink-0 gap-1 px-2 py-2 border-b border-background-border bg-background-elevated/90 backdrop-blur overflow-x-auto"
            aria-label="Workflow"
          >
            {mobileTabs.map((t) => (
              <button
                key={t.id}
                type="button"
                disabled={!t.enabled}
                onClick={() => t.enabled && handleScreenChange(t.id)}
                className={clsx(
                  "shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition-colors",
                  currentScreen === t.id
                    ? "bg-calm-500 text-white"
                    : t.enabled
                      ? "text-text-secondary hover:bg-background-card"
                      : "text-text-muted opacity-40 cursor-not-allowed",
                )}
              >
                {t.label}
              </button>
            ))}
          </nav>

          <main className="flex-1 min-h-0 overflow-y-auto flex flex-col">
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

            {currentScreen === "diagnosis" && (
              <div className="flex-1 p-5 lg:p-10 max-w-5xl mx-auto w-full">
                <DiagnosisReport
                  result={result}
                  errorMessage={analysisError ?? undefined}
                  onRetry={analysisError ? handleDiagnosisRetry : undefined}
                  onViewComparison={() => setCurrentScreen("comparison")}
                />
              </div>
            )}

            {currentScreen === "comparison" && result && (
              <div className="flex-1 p-5 lg:p-10 max-w-6xl mx-auto w-full">
                <ComparisonView
                  original={code}
                  optimized={result.optimizedCode}
                  onViewSummary={() => setCurrentScreen("summary")}
                />
              </div>
            )}

            {currentScreen === "summary" && result && (
              <div className="flex-1 p-5 lg:p-10 max-w-6xl mx-auto w-full">
                <SummaryDashboard result={result} onAnalyzeAnother={resetAnalysis} />
              </div>
            )}

            {currentScreen === "history" && (
              <HistoryScreen onOpenEntry={handleOpenHistoryEntry} />
            )}

            {currentScreen === "settings" && (
              <SettingsScreen onBackToEditor={() => setCurrentScreen("input")} />
            )}

            {currentScreen !== "input" &&
              currentScreen !== "history" &&
              currentScreen !== "settings" &&
              !result &&
              !analysisError &&
              (currentScreen === "comparison" || currentScreen === "summary") && (
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="max-w-md w-full text-center py-12 rounded-2xl border border-background-border glass shadow-card px-6">
                    <p className="text-lg font-medium text-text-primary mb-2">Nothing to show yet</p>
                    <p className="text-sm text-text-secondary mb-6">
                      Run an analysis from the editor first to unlock this step.
                    </p>
                    <button
                      type="button"
                      className="px-6 py-2.5 rounded-xl bg-calm-500 text-white font-semibold hover:bg-calm-400 shadow-soft transition-colors"
                      onClick={() => handleScreenChange("input")}
                    >
                      Go to Code Editor
                    </button>
                  </div>
                </div>
              )}
          </main>
        </div>
      </div>
    </div>
  );
}
