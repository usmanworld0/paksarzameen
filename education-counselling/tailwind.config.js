import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ivy: {
          viridian: "#002E21",
          green: "#207355",
          orange: "#FF5A26",
          "orange-hover": "#f23a00",
          sage: "#BECCAD",
          cream: "#F3F5F0",
          dark: "#002319",
        },
        brand: {
          green: "#002E21",
          gold: "#FF5A26",
          cream: "#F3F5F0",
        },
      },
      fontFamily: {
        sans: [
          '"PublicSans"',
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Text"',
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        serif: [
          '"FeatureText"',
          "Georgia",
          '"Times New Roman"',
          "Times",
          "serif",
        ],
        heading: [
          '"GrotzecCond"',
          '"PublicSans"',
          "-apple-system",
          "Helvetica",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
