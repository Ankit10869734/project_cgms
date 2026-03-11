/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00ccff',
        secondary: '#ff006e',
        danger: '#ff3366',
        warning: '#ff9933',
        success: '#00ff88',
        info: '#00bcd4',
      }
    },
  },
  plugins: [],
}