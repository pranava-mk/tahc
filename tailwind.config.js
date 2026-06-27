/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Neo-brutalism: cream paper, ink lines, vibrant blocks.
        paper: '#FDF3DD',
        card: '#FFFFFF',
        ink: '#111111',
        muted: '#6B6B6B',
        // vibrant accents
        blue: '#3B5BFF',
        pink: '#FF4D8D',
        lime: '#B8FF3B',
        yellow: '#FFD43B',
        orange: '#FF7A3B',
        purple: '#9D4EDD',
        cyan: '#54E6E0',
        // semantic aliases (kept so older refs don't break)
        bg: '#FDF3DD',
        text: '#111111',
        'text-secondary': '#6B6B6B',
        accent: '#FF4D8D',
        border: '#111111',
        success: '#1FA84F',
        error: '#E5484D',
        warning: '#F76808',
        info: '#3B5BFF',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        brutal: '4px 4px 0 0 #111111',
        'brutal-sm': '2px 2px 0 0 #111111',
        'brutal-lg': '7px 7px 0 0 #111111',
        'brutal-pink': '4px 4px 0 0 #FF4D8D',
        'brutal-blue': '4px 4px 0 0 #3B5BFF',
        'brutal-inset': 'inset 3px 3px 0 0 rgba(17,17,17,0.12)',
      },
      borderWidth: { 3: '3px' },
      borderRadius: { brutal: '14px', 'brutal-sm': '8px' },
      letterSpacing: { tightest: '-0.04em', tighter: '-0.02em' },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        snappy: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 260ms cubic-bezier(0.22,1,0.36,1)',
        'pop-in': 'popIn 320ms cubic-bezier(0.34,1.56,0.64,1)',
        'slide-up': 'slideUp 360ms cubic-bezier(0.22,1,0.36,1)',
        marquee: 'marquee 22s linear infinite',
        wobble: 'wobble 2.4s ease-in-out infinite',
        blink: 'blink 1.1s steps(2,start) infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        popIn: { '0%': { opacity: '0', transform: 'translateY(6px) scale(0.96)' }, '100%': { opacity: '1', transform: 'translateY(0) scale(1)' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        wobble: { '0%,100%': { transform: 'rotate(-2deg)' }, '50%': { transform: 'rotate(2deg)' } },
        blink: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.2' } },
      },
    },
  },
  plugins: [],
}
