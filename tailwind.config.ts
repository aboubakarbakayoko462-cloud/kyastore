import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#F68B1E",
          dark: "#DD7A10",
        },
        navy: "#14161C",
        ink: "#1F2126",
        bg: "#F5F5F7",
        surface: "#FFFFFF",
        stone: "#6B7280",
        line: "#E5E7EB",
        success: { DEFAULT: "#1D9A55", bg: "#E6F6EC" },
        warn: { DEFAULT: "#B7791F", bg: "#FDF3DD" },
        danger: { DEFAULT: "#D92D20", bg: "#FBE7E5" },
        whatsapp: {
          DEFAULT: "#25D366",
          dark: "#1EBE5A",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      maxWidth: {
        content: "1240px",
      },
    },
  },
  plugins: [],
};
export default config;
