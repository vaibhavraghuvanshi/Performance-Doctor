/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        /* 🌤 Light App Backgrounds */
        background: {
          main: "#F8FAFC", // page background
          soft: "#F1F5F9", // subtle sections
          card: "#FFFFFF", // cards / panels
          border: "#E2E8F0",
        },

        /* 🌊 Primary (Blue – secondary accent) */
        primary: {
          50: "#F0F9FF",
          100: "#E0F2FE",
          200: "#BAE6FD",
          300: "#7DD3FC",
          400: "#38BDF8",
          500: "#0EA5E9",
          600: "#0284C7",
          700: "#0369A1",
          800: "#075985",
          900: "#0C4A6E",
        },

        /* 🧠 AI Accent (Purple – main identity) */
        ai: {
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
          800: "#5B21B6",
          900: "#4C1D95",
        },

        /* 🌱 Success (Soft green, non-neon) */
        success: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
        },

        /* 📝 Text */
        text: {
          primary: "#0F172A",
          secondary: "#475569",
          muted: "#94A3B8",
        },
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "Monaco", "monospace"],
      },

      boxShadow: {
        soft: "0 10px 30px rgba(139, 92, 246, 0.15)", // purple glow
        card: "0 8px 24px rgba(15, 23, 42, 0.08)",
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
