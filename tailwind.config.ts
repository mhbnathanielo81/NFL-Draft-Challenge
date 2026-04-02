import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        surface: "var(--surface)",
        accent: {
          DEFAULT: "#00e87b",
          dim: "#00e87b33",
          glow: "#00e87b22",
        },
        border: "var(--border)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        danger: "#f85149",
        warning: "#d29922",
        // Position colors
        pos: {
          qb: "#e74c3c",
          rb: "#2ecc71",
          wr: "#3498db",
          te: "#e67e22",
          ot: "#9b59b6",
          og: "#8e44ad",
          edge: "#f39c12",
          dt: "#1abc9c",
          lb: "#e91e63",
          cb: "#00bcd4",
          s: "#ff9800",
        },
      },
      fontFamily: {
        display: ["var(--font-chakra)", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
      keyframes: {
        "slide-in": {
          from: { transform: "translateY(8px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
      },
      animation: {
        "slide-in": "slide-in 0.3s ease forwards",
        "live-pulse": "pulse 1.5s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
