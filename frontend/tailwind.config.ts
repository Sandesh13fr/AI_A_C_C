import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#006C67",
          hover: "#005550",
          light: "#E6F4F3",
          glow: "#00D7C8",
        },
        ink: {
          900: "#111827",
          800: "#1F2937",
          700: "#374151",
          600: "#4B5563",
          500: "#6B7280",
          400: "#9CA3AF",
          300: "#D1D5DB",
          200: "#E5E7EB",
          100: "#F3F4F6",
          50: "#F9FAFB",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          alt: "#F9FAFB",
          inverse: "#070909",
          dark: "#111827",
          darkBorder: "#1F2937",
        },
        accent: {
          coral: "#FF8552",
          coralLight: "#FFF0EA",
          gold: "#D19900",
          goldLight: "#FFF8E1",
          peach: "#FFE1D1",
        },
        risk: {
          criticalBg: "#FEF2F2",
          criticalText: "#B42318",
          criticalBorder: "#FECACA",
          highBg: "#FFF3F0",
          highText: "#D92D20",
          highBorder: "#FED7C9",
          mediumBg: "#FFFBEB",
          mediumText: "#D19900",
          mediumBorder: "#FDE68A",
          lowBg: "#F0FDF9",
          lowText: "#006C67",
          lowBorder: "#A7F3D0",
          infoBg: "#F8FAFC",
          infoText: "#475467",
          infoBorder: "#E2E8F0",
        },
        status: {
          indexed: "#006C67",
          needsReview: "#D19900",
          flagged: "#D92D20",
          approved: "#059669",
          synced: "#475467",
          draft: "#9CA3AF",
          pending: "#D19900",
        },
        border: {
          DEFAULT: "#E5E7EB",
          strong: "#D1D5DB",
          subtle: "#F3F4F6",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "Menlo", "monospace"],
      },
      fontSize: {
        "display-xl": ["32px", { lineHeight: "1.2", fontWeight: "400", letterSpacing: "-0.01em" }],
        "display-lg": ["24px", { lineHeight: "1.3", fontWeight: "400", letterSpacing: "-0.01em" }],
        "heading-lg": ["20px", { lineHeight: "1.4", fontWeight: "600" }],
        "heading-md": ["16px", { lineHeight: "1.5", fontWeight: "600" }],
        "heading-sm": ["13px", { lineHeight: "1.5", fontWeight: "700", letterSpacing: "0.06em" }],
        "body-lg": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-md": ["14px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-sm": ["13px", { lineHeight: "1.5", fontWeight: "400" }],
        label: ["12px", { lineHeight: "1.4", fontWeight: "500", letterSpacing: "0.02em" }],
        "mono-md": ["13px", { lineHeight: "1.6", fontWeight: "400" }],
        "mono-sm": ["11px", { lineHeight: "1.5", fontWeight: "400" }],
      },
      spacing: {
        "sidebar": "220px",
        "sidebar-collapsed": "56px",
        "topbar": "52px",
        "content-max": "1280px",
      },
      borderRadius: {
        none: "0px",
        xs: "2px",
        sm: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
        full: "9999px",
      },
      borderWidth: {
        "3": "3px",
      },
      boxShadow: {
        focus: "0 0 0 3px rgba(0,108,103,0.15)",
        "focus-dark": "0 0 0 3px rgba(0,215,200,0.25)",
      },
      transitionDuration: {
        DEFAULT: "150ms",
      },
      maxWidth: {
        content: "1280px",
      },
    },
  },
  plugins: [],
};

export default config;
