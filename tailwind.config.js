/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        primary: '#fbbf24',
        card: '#1a1a1a',
        muted: '#999999'
      },
      fontFamily: {
        mono: ['"Space Mono"', 'monospace'],
        display: ['"Syne"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
