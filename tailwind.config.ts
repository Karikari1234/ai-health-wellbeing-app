/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        karla: ['var(--font-karla)', 'sans-serif'],
        merriweather: ['var(--font-merriweather)', 'serif'],
      },
      colors: {
        primary: {
          50: "#fdf2f2",
          100: "#fde8e8",
          200: "#fbd5d5",
          300: "#f8b4b4",
          400: "#f98080",
          500: "#dc143c", /* Crimson */
          600: "#c81032",
          700: "#b70d2e",
          800: "#a40a29",
          900: "#8b0724",
        },
        accent: {
          500: "#dc143c", /* Crimson */
          600: "#b70d2e",
        },
      },
    },
  },
  plugins: [],
};