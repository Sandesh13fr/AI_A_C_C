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
        ink: "#121B22",
        "ink-soft": "#5A6872",
        "app-line": "#D7E0E6",
        "app-line-strong": "#A8B6C1",
        "app-bg": "#F4F6F4",
        "app-panel": "#FFFFFF",
        "app-subtle": "#EBF0EE",
        "app-teal": "#1F6B63",
        "app-teal-deep": "#153D39",
        "app-mint": "#DCEDE7",
        "app-gold": "#A9751A",
        "app-gold-soft": "#F6E9C9",
        "app-coral": "#B45D45",
        "app-coral-soft": "#F5E0DA",
        "app-sky": "#DDEAF1",
        "app-success": "#295E45",
        "risk-low": "#DDEAF1",
        "risk-medium": "#F6E9C9",
        "risk-high": "#F5E0DA",
        "risk-critical": "#E7D2D6",
      },
      fontFamily: {
        display: ["Iowan Old Style", "Palatino Linotype", "Book Antiqua", "Georgia", "serif"],
        sans: ["Aptos", "Segoe UI", "Trebuchet MS", "sans-serif"],
        mono: ["Consolas", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        "display-xl": ["4.5rem", { lineHeight: "1", fontWeight: "400" }],
        h1: ["2.25rem", { lineHeight: "1.1", fontWeight: "500" }],
        h2: ["1.625rem", { lineHeight: "1.2", fontWeight: "500" }],
        h3: ["1.125rem", { lineHeight: "1.35", fontWeight: "500" }],
        body: ["0.975rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.55" }],
        label: ["0.75rem", { lineHeight: "1.3", fontWeight: "600" }],
        micro: ["0.6875rem", { lineHeight: "1.25", fontWeight: "600" }],
      },
      spacing: {
        18: "4.5rem",
      },
      borderRadius: {
        card: "1rem",
        button: "0.75rem",
        badge: "999px",
      },
      boxShadow: {
        panel: "0 1px 2px rgba(18, 27, 34, 0.06), 0 12px 24px rgba(18, 27, 34, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
