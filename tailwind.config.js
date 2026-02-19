/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-main': 'var(--bg-main)',
        'bg-card': 'var(--bg-card)',
        'text-main': 'var(--text-main)',
        'text-muted': 'var(--text-muted)',
        'yellow': 'var(--color-yellow)',
        'green': 'var(--color-green)',
        'red': 'var(--color-red)',
        'cyan': 'var(--color-cyan)',
      }
    },
  },
  plugins: [],
}