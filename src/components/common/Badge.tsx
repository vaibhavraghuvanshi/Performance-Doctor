import React from "react";
import { clsx } from "clsx";
import type { Severity } from "../../types/issue";

interface BadgeProps {
  severity: Severity;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  severity,
  children,
  className,
}) => {
  const severityStyles = {
    critical: "bg-critical-500/20 text-critical-500 border-critical-500/30",
    high: "bg-warning-500/20 text-warning-500 border-warning-500/30",
    medium: "bg-caution-500/20 text-caution-500 border-caution-500/30",
    low: "bg-success-500/20 text-success-500 border-success-500/30",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide border",
        severityStyles[severity],
        className,
      )}
    >
      {children}
    </span>
  );
};
