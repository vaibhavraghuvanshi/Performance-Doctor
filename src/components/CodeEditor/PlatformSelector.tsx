import React from "react";
import { clsx } from "clsx";
import { Bot, Check, Globe2, Smartphone } from "lucide-react";
import type { Platform } from "../../types/analysis";

interface PlatformSelectorProps {
  platform: Platform;
  onChange: (platform: Platform) => void;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  platform,
  onChange,
}) => {
  const platforms: {
    value: Platform;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      value: "ios",
      label: "iOS",
      icon: <Smartphone className="h-7 w-7" strokeWidth={1.5} aria-hidden />,
    },
    {
      value: "android",
      label: "Android",
      icon: <Bot className="h-7 w-7" strokeWidth={1.5} aria-hidden />,
    },
    {
      value: "both",
      label: "Both",
      icon: <Globe2 className="h-7 w-7" strokeWidth={1.5} aria-hidden />,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {platforms.map((p) => {
        const selected = platform === p.value;
        return (
          <button
            key={p.value}
            type="button"
            onClick={() => onChange(p.value)}
            className={clsx(
              "relative flex flex-col items-center justify-center gap-1.5 rounded-xl border px-2 py-4 text-center transition-all duration-200 min-h-[100px]",
              selected
                ? "border-calm-500 bg-calm-500/15 shadow-[0_0_20px_rgba(77,143,135,0.18)] ring-1 ring-calm-500/35"
                : "border-background-border bg-background-soft/80 hover:border-calm-500/40 hover:bg-background-card",
            )}
          >
            {selected && (
              <span
                className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-calm-500 text-white shadow-sm"
                aria-hidden
              >
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
            )}
            <span
              className={clsx(
                selected ? "text-calm-300" : "text-text-muted",
              )}
            >
              {p.icon}
            </span>
            <span
              className={clsx(
                "text-xs font-semibold",
                selected ? "text-calm-200" : "text-text-secondary",
              )}
            >
              {p.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
