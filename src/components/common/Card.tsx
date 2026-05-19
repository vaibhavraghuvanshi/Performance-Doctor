import React from "react";
import { clsx } from "clsx";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
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
  ...rest
}) => {
  return (
    <div
      {...rest}
      className={clsx(
        "rounded-xl p-6 border",
        glass && "glass",
        hoverable && "card-hover cursor-pointer",
        !glass && "bg-background-elevated border-background-border",
        className,
      )}
    >
      {children}
    </div>
  );
};
