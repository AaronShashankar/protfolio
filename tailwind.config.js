/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        bg2: 'var(--bg2)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        pink: 'var(--pink)',
        cyan: 'var(--cyan)',
        violet: 'var(--violet)',
        yellow: 'var(--yellow)',
        line: 'var(--line)',
        card: 'var(--card)',
      },
      fontFamily: {
        unbounded: ['Unbounded', 'sans-serif'],
        grotesk: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'slide': 'slide 1.8s cubic-bezier(.6,0,.3,1) infinite',
        'marquee': 'mq 38s linear infinite',
        'marquee-rev': 'mq 46s linear infinite reverse',
        'pulse-subtle': 'pulseSubtle 2s infinite',
        'ring-scale': 'ringScale 4.4s ease-in-out infinite',
        'sheet-float': 'sheetFloat 5s ease-in-out infinite',
        'orbit-spin': 'spinz 12s linear infinite',
      },
      keyframes: {
        slide: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        mq: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseSubtle: {
          '0%': { boxShadow: '0 0 0 0 rgba(92, 225, 230, 0.7)' },
          '100%': { boxShadow: '0 0 0 12px transparent' },
        },
        ringScale: {
          '0%, 100%': { transform: 'scale(0.78)', opacity: '0.95' },
          '50%': { transform: 'scale(1.18)', opacity: '0.2' },
        },
        sheetFloat: {
          '0%, 100%': { transform: 'rotateX(58deg) rotateZ(-32deg) translateZ(calc(var(--k, 1) * 26px))' },
          '50%': { transform: 'rotateX(58deg) rotateZ(-32deg) translateZ(calc(var(--k, 1) * 62px))' },
        },
        spinz: {
          'to': { transform: 'rotate(360deg)' }
        }
      }
    },
  },
  plugins: [],
}
