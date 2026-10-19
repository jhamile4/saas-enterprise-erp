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
        bgDeep: "#09090b",
        bgCard: "#121215",
        bgSurface: "#18181b",
        borderSubtle: "rgba(255, 255, 255, 0.08)",
        goldAccent: "#c9a063",
        goldHover: "#b38b4d",
        cyanAccent: "#38bdf8",
        greenAccent: "#34d399",
        redAccent: "#f87171",
        yellowAccent: "#fbbf24",
      },
    },
  },
  plugins: [],
};
export default config;
