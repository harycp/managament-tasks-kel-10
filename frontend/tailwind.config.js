/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "notion-black": "#232528",
        "notion-white": "#fafafa",
        "notion-yellow": "#f5ae5d",
        "notion-gray": "#989c9b",
        "notion-red": "#ba5e53",
        "notion-blue": "#4aa4cd",
        "notion-peach": "#dda68f",
        "notion-beige": "#e4cda8",
        "notion-bg": "#ffffff",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        lyon: ["Lyon Text", "serif"],
      },
    },
  },
  plugins: [],
};
