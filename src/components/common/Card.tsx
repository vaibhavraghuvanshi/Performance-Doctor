import React from "react";
import { clsx } from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverable = false,
  glass = true,
}) => {
  return (
    <div
      className={clsx(
        "rounded-xl p-6 border",
        glass && "glass",
        hoverable && "card-hover cursor-pointer",
        !glass && "bg-slate-800 border-slate-700",
        className,
      )}
    >
      {children}
    </div>
  );
};
