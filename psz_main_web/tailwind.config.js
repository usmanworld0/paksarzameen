/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        psz: {
          forest: "#1f3b2d",
          sand: "#d3b483",
          charcoal: "#1a1f1d",
          cream: "#f6f1e5",
          olive: "#5f7a54"
        }
      },
      fontFamily: {
        heading: ["var(--font-heading)"],
        body: ["var(--font-body)"]
      },
      boxShadow: {
        soft: "0 18px 38px -24px rgba(20, 26, 24, 0.45)",
        panel: "0 10px 28px -18px rgba(19, 29, 24, 0.4)"
      }
    }
  },
  plugins: []
};
