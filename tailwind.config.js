/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand color (calm, protective teal)
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        // Secondary/safety indicator (green)
        safety: 'rgb(var(--color-safety) / <alpha-value>)',
        // Warnings (amber/orange)
        warn: 'rgb(var(--color-warn) / <alpha-value>)',
        // Danger/alerts (red)
        danger: 'rgb(var(--color-danger) / <alpha-value>)',
        // Muted text/accents
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
      },
    },
  },
  plugins: [],
};
