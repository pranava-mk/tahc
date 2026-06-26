/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark mode only (primary theme)
        bg: '#191919',
        'bg-elevated': '#2A2A2A',
        text: '#D4D4D4',
        'text-secondary': '#9B9B9B',
        border: 'rgba(255, 255, 255, 0.05)',

        // Red accent (Nothing OS)
        accent: '#FF3B30',
        'accent-hover': '#FF5247',
        'accent-dim': 'rgba(255, 59, 48, 0.1)',

        // Semantic colors (minimal set)
        success: '#4F9768',
        error: '#E06C75',
        info: '#447ACB',
        warning: '#E5C07B',
      },

      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'Courier New', 'monospace'],
      },

      // Enhanced spacing for breathability
      spacing: {
        '0.5': '2px',
        '1': '4px',
        '1.5': '6px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '7': '28px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '14': '56px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
      },

      letterSpacing: {
        tighter: '-0.02em',
        tight: '-0.01em',
        wider: '0.01em',
        widest: '0.02em',
      },

      // Minimal motion system
      transitionDuration: {
        'instant': '50ms',
        'fast': '100ms',
        'quick': '150ms',
        'normal': '200ms',
        'smooth': '300ms',
        'medium': '350ms',
        'deliberate': '500ms',
      },

      transitionTimingFunction: {
        'expressive-effects': 'cubic-bezier(0.34, 0.80, 0.34, 1.00)',
        'expressive': 'cubic-bezier(0.38, 1.21, 0.22, 1.00)',
        'standard': 'cubic-bezier(0.27, 1.06, 0.18, 1.00)',
      },

      animation: {
        'fade-in': 'fadeIn 300ms cubic-bezier(0.34, 0.80, 0.34, 1.00)',
        'slide-up': 'slideUp 500ms cubic-bezier(0.38, 1.21, 0.22, 1.00)',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },

      // Minimal border radius (straighter edges)
      borderRadius: {
        'sm': '2px',
        'DEFAULT': '3px',
        'md': '4px',
        'lg': '6px',
        'xl': '8px',
      },

      // Line height for better readability
      lineHeight: {
        'relaxed': '1.7',
        'loose': '1.8',
      },
    },
  },
  plugins: [],
}
