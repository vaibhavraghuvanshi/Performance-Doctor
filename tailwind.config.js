/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: {
          main: "#070709",
          soft: "#0c0d12",
          card: "#12131a",
          elevated: "#1a1b24",
          border: "#2a2d3d",
        },

        primary: {
          50: "#082f49",
          100: "#0c4a6e",
          200: "#075985",
          300: "#0369a1",
          400: "#0ea5e9",
          500: "#38bdf8",
          600: "#7dd3fc",
          700: "#bae6fd",
          800: "#e0f2fe",
          900: "#f0f9ff",
        },

        ai: {
          50: "#13081f",
          100: "#1c0f2e",
          200: "#2d1b4e",
          300: "#4c2d8a",
          400: "#7c3aed",
          500: "#8b5cf6",
          600: "#a78bfa",
          700: "#c4b5fd",
          800: "#ddd6fe",
          900: "#ede9fe",
        },

        /** Muted teal — primary actions / focus (easier on the eyes than pure purple). */
        calm: {
          50: "#0f1f1e",
          100: "#142a28",
          200: "#1d3d3a",
          300: "#2d5c57",
          400: "#3f7f78",
          500: "#4d8f87",
          600: "#5fa39a",
          700: "#7eb8b0",
          800: "#a8d4ce",
          900: "#e2f4f1",
        },

        success: {
          50: "#022c22",
          100: "#064e3b",
          200: "#065f46",
          300: "#047857",
          400: "#10b981",
          500: "#34d399",
          600: "#6ee7b7",
          700: "#a7f3d0",
          800: "#d1fae5",
          900: "#ecfdf5",
        },

        text: {
          primary: "#f4f4f5",
          secondary: "#a1a1aa",
          muted: "#71717a",
        },

        critical: {
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
        },
        warning: {
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
        },
        caution: {
          400: "#fde047",
          500: "#eab308",
          600: "#ca8a04",
        },
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "Monaco", "monospace"],
      },

      boxShadow: {
        soft: "0 12px 40px rgba(77, 143, 135, 0.22)",
        card: "0 8px 40px rgba(0, 0, 0, 0.55)",
        glow: "0 0 80px rgba(139, 92, 246, 0.15)",
      },

      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-in-out",
        "scale-in": "scaleIn 0.3s ease-in-out",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { transform: "translateY(60px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.96)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
