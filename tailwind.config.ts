import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        card: "var(--color-card)",
        border: "var(--color-border)",
        muted: "var(--color-muted)",
        surface: "var(--color-surface)",
        primary: "var(--color-primary)",
        gold: "var(--color-gold)",
        "gold-light": "var(--color-gold-light)",
        text: "var(--color-text)",
        "text-muted": "var(--color-text-muted)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        serif: ["var(--font-libre-baskerville)", "Libre Baskerville", "Georgia", "serif"],
        display: ["var(--font-libre-baskerville)", "Libre Baskerville", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
