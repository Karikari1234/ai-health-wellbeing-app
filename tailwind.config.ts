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
          50: "#fff5f5",
          100: "#ffe0e0",
          200: "#ffc5c5",
          300: "#ffa8a8",
          400: "#ff8080",
          500: "#ff6b6b", /* Coral */
          600: "#fa5252",
          700: "#f03e3e",
          800: "#e03131",
          900: "#c92a2a",
        },
        accent: {
          500: "#ff6b6b", /* Coral */
          600: "#fa5252",
        },
        appBg: "#f0f4f8", /* Light blue/gray background */
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
};