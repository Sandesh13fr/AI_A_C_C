import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        black: "#000000",
        white: "#FFFFFF",
        teal: {
          DEFAULT: "#006C67",
          glow: "#00D7C8",
        },
        "mid-grey": "#888888",
        coral: "#FF8552",
        gold: "#D19900",
        peach: "#FFE1D1",
        "dark-surface": "#070909",
        "dark-card": "#101414",
        "dark-border": "#1E2B2A",
      },
      fontFamily: {
        display: ["DM Serif Display", "serif"],
        sans: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        "display-xl": ["72px", { lineHeight: "1.1" }],
        h1: ["40px", { lineHeight: "1.2" }],
        "h1-lg": ["56px", { lineHeight: "1.15" }],
        h2: ["28px", { lineHeight: "1.25" }],
        "h2-lg": ["36px", { lineHeight: "1.2" }],
        h3: ["22px", { lineHeight: "1.3" }],
        "h3-lg": ["24px", { lineHeight: "1.25" }],
        body: ["15px", { lineHeight: "1.5" }],
        "body-lg": ["16px", { lineHeight: "1.5" }],
        "body-sm": ["13px", { lineHeight: "1.4" }],
        "body-sm-lg": ["14px", { lineHeight: "1.4" }],
        label: ["11px", { lineHeight: "1.3" }],
        "label-lg": ["12px", { lineHeight: "1.3" }],
        micro: ["10px", { lineHeight: "1.2" }],
        "micro-lg": ["11px", { lineHeight: "1.2" }],
      },
      spacing: {
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "5": "24px",
        "6": "32px",
        "7": "48px",
        "8": "64px",
      },
      borderRadius: {
        card: "6px",
        modal: "8px",
        button: "4px",
        badge: "4px",
      },
    },
  },
  plugins: [],
};

export default config;
