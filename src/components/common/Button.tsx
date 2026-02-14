import React from "react";
import { clsx } from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border";

  const variants = {
    primary:
      "bg-gradient-to-r from-ai-500 to-success-400 hover:from-ai-600 hover:to-success-500 text-white shadow-lg hover:shadow-ai-500/30 hover:scale-105 border-ai-500",
    secondary:
      "bg-white/60 hover:bg-ai-50 border border-ai-200 text-ai-600 border-ai-300",
    ghost:
      "bg-transparent hover:bg-ai-50 text-ai-500 hover:text-ai-700 border-ai-200",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Analyzing...</span>
        </>
      ) : (
        <>
          {icon}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};
