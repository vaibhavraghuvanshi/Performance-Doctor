import React from "react";
import { clsx } from "clsx";
import { Dna, FileCode2, GitCompare, LayoutDashboard, Stethoscope } from "lucide-react";
import type { Screen } from "../../types/analysis";

interface HeaderProps {
  currentScreen: Screen;
  onScreenChange: (screen: Screen) => void;
  canViewDiagnosis: boolean;
  canViewComparison: boolean;
  canViewSummary: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onScreenChange,
  canViewDiagnosis,
  canViewComparison,
  canViewSummary,
}) => {
  const tabs: {
    id: Screen;
    label: string;
    icon: React.ReactNode;
    enabled: boolean;
  }[] = [
    { id: "input", label: "Code Input", enabled: true, icon: <FileCode2 className="h-4 w-4 shrink-0" aria-hidden /> },
    {
      id: "diagnosis",
      label: "Diagnosis",
      enabled: canViewDiagnosis,
      icon: <Stethoscope className="h-4 w-4 shrink-0" aria-hidden />,
    },
    {
      id: "comparison",
      label: "Comparison",
      enabled: canViewComparison,
      icon: <GitCompare className="h-4 w-4 shrink-0" aria-hidden />,
    },
    {
      id: "summary",
      label: "Summary",
      enabled: canViewSummary,
      icon: <LayoutDashboard className="h-4 w-4 shrink-0" aria-hidden />,
    },
  ];

  return (
    <header className="bg-transparent pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-calm-500 to-primary-600 flex items-center justify-center shadow-soft mb-3 ring-1 ring-white/10">
            <Dna className="h-9 w-9 text-white" strokeWidth={1.5} aria-hidden />
          </div>
          <h1 className="text-4xl font-extrabold gradient-text mb-2">
            Performance Doctor
          </h1>
          <p className="text-lg text-text-secondary font-medium text-center max-w-2xl">
            AI-powered performance analysis for React, React Native, and Next.js
          </p>
        </div>
        <nav
          className="flex justify-center gap-4 mb-2 flex-wrap"
          aria-label="Analysis steps"
        >
          {tabs.map((tab) => {
            const disabled = !tab.enabled;
            return (
              <button
                key={tab.id}
                type="button"
                disabled={disabled}
                title={
                  disabled && tab.id !== "input"
                    ? "Run an analysis first to unlock this step"
                    : undefined
                }
                onClick={() => {
                  if (disabled || currentScreen === tab.id) return;
                  onScreenChange(tab.id);
                }}
                className={clsx(
                  "inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-semibold transition-all duration-200 border min-w-[140px]",
                  currentScreen === tab.id
                    ? "bg-calm-500 text-white border-calm-400 shadow-soft"
                    : disabled
                      ? "bg-background-soft/80 text-text-muted border-background-border cursor-not-allowed opacity-50"
                      : "bg-background-elevated/90 text-text-secondary border-background-border hover:border-calm-500/45 hover:text-text-primary hover:bg-background-card",
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
