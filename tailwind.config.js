/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cyber: {
          50: '#f0fdf9',
          100: '#ccfbef',
          200: '#99f6e0',
          300: '#5feacc',
          400: '#2dd4aa',
          500: '#14b892',
          600: '#0d9373',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        neon: {
          green: '#00FF88',
          blue: '#3366FF',
          purple: '#9D4EDD',
          pink: '#FF3366',
          orange: '#FF8C00',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'border-spin': 'border-spin 3s linear infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'cyber': '0 0 20px rgba(20, 184, 166, 0.3)',
        'neon-green': '0 0 20px rgba(0, 255, 136, 0.5)',
        'neon-blue': '0 0 20px rgba(51, 102, 255, 0.5)',
      }
    },
  },
  plugins: [],
  safelist: [
    'text-emerald-400',
    'text-blue-400',
    'text-red-400',
    'text-yellow-400',
    'text-orange-400',
    'text-purple-400',
    'text-green-400',
    'bg-emerald-500/20',
    'bg-blue-500/20',
    'bg-red-500/20',
    'bg-yellow-500/20',
    'bg-orange-500/20',
    'bg-purple-500/20',
    'bg-green-500/20',
    'border-emerald-500/30',
    'border-blue-500/30',
    'border-red-500/30',
    'border-yellow-500/30',
    'border-orange-500/30',
    'border-purple-500/30',
    'border-green-500/30',
  ]
};