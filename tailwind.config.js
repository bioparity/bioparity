/** @type {import('tailwindcss').Config} */
// Design tokens (Commit 8a)
// Color semantics:
//   bg / surface / card / border  — structural layers (deepest → topmost)
//   ink / ink-muted               — body text
//   accent-verified (green)       — celebratory / at-parity state
//   accent-experimental (amber)   — in-progress / partial-parity state
//   accent-ineligible (red)       — zero / failure / disqualifying state
//   accent-data (blue)            — neutral meta / data markers
// Legacy tokens (paper/panel/rule/robot/warn/parity/...) kept for backwards
// compatibility with pre-8a components; new code should prefer semantic names.
//
// Spacing rhythm: stay on Tailwind's default scale but target 4/8/16/24/40/64
// (Tailwind 1/2/4/6/10/16) for section-level gaps.
export default {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // New semantic tokens
        bg: '#0a0a0f',
        surface: '#14141f',
        card: '#1a1a2e',
        border: '#2a2a3e',
        ink: '#f4f3ef',
        'ink-muted': '#8b8a85',
        'accent-verified': '#22c55e',
        'accent-experimental': '#f59e0b',
        'accent-ineligible': '#ef4444',
        'accent-data': '#3b82f6',

        // Legacy aliases (kept so pre-8a usages keep rendering)
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
      fontSize: {
        display: ['72px', { lineHeight: '1.0', letterSpacing: '-0.04em' }],
        h1: ['48px', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        h2: ['32px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        h3: ['22px', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        body: ['16px', { lineHeight: '1.6', letterSpacing: '0' }],
        small: ['13px', { lineHeight: '1.5', letterSpacing: '0' }],
        micro: ['11px', { lineHeight: '1.4', letterSpacing: '0.02em' }],
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
