/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        psz: {
          green: "#009040",
          "green-light": "#00C261",
          "green-dark": "#008A43"
        },
        "vp-black": "#1d1d1f",
        "vp-dark": "#000000",
        "vp-white": "#ffffff",
        "vp-grey": "#f5f5f7",
        "vp-light": "hsl(0, 0%, 45%)"
      },
      fontFamily: {
        body: ["var(--font-body)", "Inter", "sans-serif"]
      }
    }
  },
  plugins: []
};
