/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ds: {
          bg: "#131313",
          surface: "#201f1f",
          "surface-high": "#2a2a2a",
          "surface-highest": "#353534",
          "surface-low": "#1c1b1b",
          "surface-lowest": "#0e0e0e",
          primary: "#dcb8ff",
          "primary-container": "#8a2be2",
          secondary: "#bec2ff",
          "secondary-container": "#080cff",
          tertiary: "#ffb873",
          "on-surface": "#e5e2e1",
          "on-surface-variant": "#cfc2d7",
          outline: "#988ca0",
          "outline-variant": "#4c4354",
          error: "#ffb4ab",
        },
      },
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 80px 0 rgba(138,43,226,0.25)",
        glass: "0 20px 60px rgba(0,0,0,0.45)",
      },
      backdropBlur: {
        xl2: "40px",
      },
    },
  },
  plugins: [],
};
