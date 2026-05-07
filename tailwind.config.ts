import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Brand emerald — hand-tuned, NOT Tailwind's default cyan-leaning emerald.
        emerald: {
          50: "#f1faf5",
          100: "#dcf2e5",
          200: "#b9e4cc",
          300: "#87cea9",
          400: "#4fb07f",
          500: "#2c945f",
          600: "#1f7a4c",
          700: "#1a613e",
          800: "#174d33",
          900: "#143f2b",
          950: "#0a2418",
        },
        gold: {
          300: "#f3d77a",
          400: "#e9c25c",
          500: "#d8a83a",
          600: "#b88a26",
        },
        ivory: "#fbfaf5",
      },
      fontFamily: {
        // --font-sans is wired to Sofia Sans now; swap to true Sofia Pro by
        // changing the next/font import in app/layout.tsx — variable name stays.
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: [
          "var(--font-serif)",
          "ui-serif",
          "Georgia",
          "Cambria",
          "Times New Roman",
          "serif",
        ],
        script: ["var(--font-display)", "ui-serif", "cursive"],
        serif: [
          "var(--font-serif)",
          "ui-serif",
          "Georgia",
          "Cambria",
          "Times New Roman",
          "serif",
        ],
      },
      letterSpacing: {
        widest: "0.25em",
      },
    },
  },
  plugins: [],
};

export default config;
