import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        civic: {
          dark: "#080C16",
          darker: "#04070F",
          card: "#0E1526",
          cardBorder: "#1E293B",
          teal: {
            50: "#F0FDFA",
            100: "#CCFBF1",
            200: "#99F6E4",
            300: "#5EEAD4",
            400: "#2DD4BF",
            500: "#14B8A6",
            600: "#0D9488",
            700: "#0F766E",
            800: "#115E59",
            900: "#134E4A",
          },
          saffron: {
            400: "#FBBF24",
            500: "#F59E0B",
            600: "#D97706",
          },
          status: {
            reported: "#EF4444",
            inProgress: "#F59E0B",
            resolved: "#10B981",
            critical: "#DC2626",
            high: "#EA580C",
            medium: "#EAB308",
            low: "#10B981",
          }
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-sora)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "radial-glow": "radial-gradient(circle at 50% 0%, rgba(20, 184, 166, 0.15), transparent 70%)",
        "cyber-grid": "radial-gradient(circle, rgba(20, 184, 166, 0.08) 1px, transparent 1px)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2s linear infinite",
        "float": "float 4s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
