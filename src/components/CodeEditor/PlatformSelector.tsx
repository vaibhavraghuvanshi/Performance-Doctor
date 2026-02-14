import React from "react";
import { Card } from "../common/Card";
import { clsx } from "clsx";
import type { Platform } from "../../types/analysis";

interface PlatformSelectorProps {
  platform: Platform;
  onChange: (platform: Platform) => void;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  platform,
  onChange,
}) => {
  const platforms: { value: Platform; label: string; emoji: string }[] = [
    { value: "ios", label: "iOS", emoji: "📱" },
    { value: "android", label: "Android", emoji: "🤖" },
    { value: "both", label: "Both", emoji: "🌐" },
  ];

  return (
    <Card>
      <h3 className="text-sm font-semibold text-ai-500 mb-4 uppercase tracking-wide">
        Platform
      </h3>
      <div className="flex gap-2">
        {platforms.map((p) => (
          <button
            key={p.value}
            onClick={() => onChange(p.value)}
            className={clsx(
              "flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-300",
              platform === p.value
                ? "bg-ai-500 text-white shadow-soft border-2 border-ai-500"
                : "bg-white/60 text-ai-600 border border-ai-200 hover:bg-ai-100 hover:text-ai-700",
            )}
          >
            <span className="mr-1">{p.emoji}</span>
            {p.label}
          </button>
        ))}
      </div>
    </Card>
  );
};
