/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0a0a0a',
        panel: '#111111',
        edge: '#1f1f1f',
        rule: '#262626',
        paper: '#f5f5f5',
        muted: '#a3a3a3',
        dim: '#737373',
        faint: '#525252',
        parity: '#3b82f6',
        robot: '#22c55e',
        human: '#9ca3af',
        warn: '#f59e0b',
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
