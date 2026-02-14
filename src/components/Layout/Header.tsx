import React from "react";
import { clsx } from "clsx";
import type { Screen } from "../../types/analysis";

interface HeaderProps {
  currentScreen: Screen;
  onScreenChange: (screen: Screen) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onScreenChange,
}) => {
  const tabs = [
    { id: "input" as Screen, label: "📝 Code Input" },
    { id: "diagnosis" as Screen, label: "🩺 Diagnosis" },
    { id: "comparison" as Screen, label: "🔄 Comparison" },
    { id: "summary" as Screen, label: "📊 Summary" },
  ];

  return (
    <header className="bg-transparent pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-ai-500 to-primary-400 flex items-center justify-center shadow-lg mb-3">
            <span className="text-3xl">🧬</span>
          </div>
          <h1 className="text-4xl font-extrabold gradient-text mb-2">
            Performance Doctor
          </h1>
          <p className="text-lg text-text-secondary font-medium">
            AI-powered performance analysis for React Native developers
          </p>
        </div>
        <nav className="flex justify-center gap-4 mb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                currentScreen === tab.id ? null : onScreenChange(tab.id)
              }
              className={clsx(
                "px-7 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm",
                currentScreen === tab.id
                  ? "bg-ai-500 text-white shadow-soft"
                  : "bg-white/40 text-ai-600 hover:bg-ai-100",
              )}
              style={{
                minWidth: 140,
                boxShadow:
                  currentScreen === tab.id
                    ? "0 4px 24px 0 rgba(139,92,246,0.10)"
                    : undefined,
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
