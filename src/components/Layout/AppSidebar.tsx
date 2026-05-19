import React from "react";
import { clsx } from "clsx";
import {
  Activity,
  BarChart3,
  Code2,
  GitCompare,
  History,
  Layers,
  LayoutTemplate,
  Settings,
  Smartphone,
} from "lucide-react";
import type { Screen } from "../../types/analysis";
import type { AuthUser } from "../../services/authApi";

export type SidebarNavAction =
  | { kind: "screen"; screen: Screen }
  | { kind: "section"; screen: "input"; sectionId: string };

interface AppSidebarProps {
  currentScreen: Screen;
  onAction: (action: SidebarNavAction) => void;
  canViewDiagnosis: boolean;
  canViewComparison: boolean;
  canViewSummary: boolean;
  user?: AuthUser | null;
}

type NavItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  action: SidebarNavAction;
  disabled?: boolean;
  disabledReason?: string;
};

export const AppSidebar: React.FC<AppSidebarProps> = ({
  currentScreen,
  onAction,
  canViewDiagnosis,
  canViewComparison,
  canViewSummary,
  user,
}) => {
  const items: NavItem[] = [
    {
      id: "editor",
      title: "Code Editor",
      subtitle: "Write or paste your code",
      icon: <Code2 className="h-5 w-5 shrink-0" strokeWidth={1.75} aria-hidden />,
      action: { kind: "screen", screen: "input" },
    },
    {
      id: "platform",
      title: "Platform",
      subtitle: "Select target platform",
      icon: <Smartphone className="h-5 w-5 shrink-0" strokeWidth={1.75} aria-hidden />,
      action: { kind: "section", screen: "input", sectionId: "workspace-platform" },
    },
    {
      id: "examples",
      title: "Examples",
      subtitle: "Explore quick examples",
      icon: <Layers className="h-5 w-5 shrink-0" strokeWidth={1.75} aria-hidden />,
      action: { kind: "section", screen: "input", sectionId: "workspace-examples" },
    },
    {
      id: "analysis",
      title: "Analysis",
      subtitle: "Review results",
      icon: <BarChart3 className="h-5 w-5 shrink-0" strokeWidth={1.75} aria-hidden />,
      action: { kind: "screen", screen: "diagnosis" },
      disabled: !canViewDiagnosis,
      disabledReason: "Run an analysis first",
    },
    {
      id: "comparison",
      title: "Comparison",
      subtitle: "Before & after code",
      icon: <GitCompare className="h-5 w-5 shrink-0" strokeWidth={1.75} aria-hidden />,
      action: { kind: "screen", screen: "comparison" },
      disabled: !canViewComparison,
      disabledReason: "Complete an analysis first",
    },
    {
      id: "summary",
      title: "Summary",
      subtitle: "Performance overview",
      icon: <LayoutTemplate className="h-5 w-5 shrink-0" strokeWidth={1.75} aria-hidden />,
      action: { kind: "screen", screen: "summary" },
      disabled: !canViewSummary,
      disabledReason: "Complete an analysis first",
    },
    {
      id: "history",
      title: "History",
      subtitle: "Past analyses",
      icon: <History className="h-5 w-5 shrink-0" strokeWidth={1.75} aria-hidden />,
      action: { kind: "screen", screen: "history" },
    },
    {
      id: "settings",
      title: "Settings",
      subtitle: "Account & session",
      icon: <Settings className="h-5 w-5 shrink-0" strokeWidth={1.75} aria-hidden />,
      action: { kind: "screen", screen: "settings" },
    },
  ];
  return (
    <aside className="hidden lg:flex w-72 shrink-0 flex-col border-r border-background-border bg-background-elevated/95 backdrop-blur-xl">
      <div className="p-6 border-b border-background-border">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-calm-500 to-primary-600 flex items-center justify-center shadow-soft ring-1 ring-white/10">
            <Activity className="h-5 w-5 text-white" strokeWidth={2} aria-hidden />
          </div>
          <div>
            <h1 className="text-lg font-bold text-text-primary leading-tight">Performance Doctor</h1>
            <span className="inline-flex mt-1 text-[10px] font-semibold uppercase tracking-wider text-calm-400 bg-calm-100/40 border border-calm-500/25 px-2 py-0.5 rounded-md">
              v1.0.0
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5" aria-label="Main">
        {items.map((item) => {
          const active =
            item.id === "editor"
              ? currentScreen === "input"
              : item.action.kind === "screen"
                ? currentScreen === item.action.screen
                : false;

          return (
            <button
              key={item.id}
              type="button"
              disabled={item.disabled}
              title={item.disabled ? item.disabledReason : undefined}
              onClick={() => !item.disabled && onAction(item.action)}
              className={clsx(
                "w-full flex items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200",
                item.disabled && "opacity-40 cursor-not-allowed",
                !item.disabled &&
                  active &&
                  "bg-calm-500/12 border border-calm-500/35 shadow-[inset_0_0_0_1px_rgba(77,143,135,0.2)]",
                !item.disabled &&
                  !active &&
                  "border border-transparent hover:bg-background-card hover:border-background-border",
              )}
            >
              <span
                className={clsx(
                  "mt-0.5",
                  active ? "text-calm-400" : "text-text-muted",
                )}
              >
                {item.icon}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-text-primary">{item.title}</span>
                <span className="block text-xs text-text-muted mt-0.5 leading-snug">{item.subtitle}</span>
              </span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-background-border">
        <div className="rounded-xl p-4 bg-gradient-to-br from-calm-500/12 to-primary-500/8 border border-calm-500/20">
          <div className="h-8 mb-3 flex items-end gap-0.5 opacity-60">
            {[40, 65, 45, 80, 55, 90].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-gradient-to-t from-calm-600 to-primary-400"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <p className="text-sm font-semibold text-text-primary">Optimize. Perform.</p>
          <p className="text-xs text-text-muted mt-1">Ship better apps.</p>
          {user && (
            <p className="text-[10px] text-calm-400/90 truncate border-t border-calm-500/20 pt-2 mt-3 font-medium">
              {user.displayName} · {user.email}
            </p>
          )}
        </div>
      </div>
    </aside>
  );
};
