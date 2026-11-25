import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        botanical: {
          950: "#0D1813",
          900: "#15271E", // Deep botanical green
          800: "#233D2E", // Forest green
          700: "#32533F",
          600: "#446B53",
          500: "#5A866C",
          400: "#7CA38C",
          300: "#A4B29D", // Muted sage
          200: "#CBD5C7",
          100: "#E3E9E0",
          50: "#F2F5F0",
        },
        ivory: {
          DEFAULT: "#FBF9F4", // Warm ivory background
          warm: "#F5F2E9",
          parchment: "#EFE9DF",
          sand: "#E5DDD0",
          card: "#FFFFFF",
        },
        clay: {
          DEFAULT: "#B87555", // Natural clay / terracotta
          light: "#CE8E70",
          dark: "#96583D",
          hover: "#A36345",
        },
        bloom: {
          rose: "#D66874",
          crimson: "#9E2A3B",
          ruby: "#7C1E2D",
          blush: "#F4D7DB",
        },
        charcoal: {
          DEFAULT: "#1D211D",
          light: "#2C312C",
          muted: "#4D544D",
          border: "#D8DFD5",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "DM Serif Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Manrope", "system-ui", "-apple-system", "sans-serif"],
        mono: ["Consolas", "Monaco", "Courier New", "monospace"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(21, 39, 30, 0.05)",
        card: "0 4px 20px -2px rgba(21, 39, 30, 0.08)",
        elevated: "0 12px 32px -4px rgba(21, 39, 30, 0.12)",
        drawer: "-8px 0 32px rgba(21, 39, 30, 0.18)",
      },
      backgroundImage: {
        "organic-gradient": "linear-gradient(180deg, #FBF9F4 0%, #EFE9DF 100%)",
        "hero-overlay": "linear-gradient(180deg, rgba(21,39,30,0.3) 0%, rgba(21,39,30,0.85) 100%)",
        "botanical-pattern": "radial-gradient(circle at 50% 50%, rgba(164,178,157,0.08) 0%, transparent 70%)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-up": "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-subtle": "pulseSubtle 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

