/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          deepest: 'var(--bg-deepest)',
          deep: 'var(--bg-deep)',
          surface: 'var(--bg-surface)',
          card: 'var(--bg-card)',
          'card-hover': 'var(--bg-card-hover)',
          input: 'var(--bg-input)',
        },
        neon: {
          cyan: 'var(--neon-cyan)',
          'cyan-dim': 'var(--neon-cyan-dim)',
          green: 'var(--neon-green)',
          'green-dim': 'var(--neon-green-dim)',
          magenta: 'var(--neon-magenta)',
          'magenta-dim': 'var(--neon-magenta-dim)',
          purple: 'var(--neon-purple)',
          orange: 'var(--neon-orange)',
          gold: 'var(--neon-gold)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        border: {
          subtle: 'var(--border-subtle)',
          medium: 'var(--border-medium)',
          accent: 'var(--border-accent)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'neon-cyan': '0 0 20px var(--border-accent), 0 0 60px var(--neon-cyan-dim)',
        'neon-green': '0 0 20px var(--neon-green-dim)',
      }
    },
  },
  plugins: [],
}
