import type { Config } from 'tailwindcss';

/** SNTURCO design tokens: navy + copper, warm sand neutrals. Kept from the original brand. */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: { DEFAULT: '1.25rem', md: '2rem', xl: '2.5rem' }, screens: { '2xl': '1280px' } },
    extend: {
      colors: {
        ink: '#0b1524',
        navy: { DEFAULT: '#14243b', 950: '#0b1524', 900: '#0d1828', 800: '#14243b', 700: '#1d3352', 600: '#2a4468', 400: '#5d7192' },
        charcoal: '#2b2f36',
        slate: '#5c6470',
        mist: '#eef0f3',
        line: '#e3ded5',
        sand: { DEFAULT: '#f5f1ea', 50: '#faf8f4', 200: '#ebe4d8', 300: '#ddd3c3' },
        copper: { DEFAULT: '#a86b45', 700: '#7d4f33', 600: '#8f5a39', 400: '#c08560', 300: '#d0a385', 200: '#e6c9b4' },
      },
      fontFamily: {
        sans: ['"Inter Variable"', '"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', '"IBM Plex Sans Arabic"', 'Georgia', 'serif'],
      },
      letterSpacing: { brand: '0.28em' },
      transitionTimingFunction: { cine: 'cubic-bezier(.2,.7,.1,1)' },
      keyframes: {
        rise: { '0%': { opacity: '0', transform: 'translateY(18px)' }, '100%': { opacity: '1', transform: 'none' } },
        fade: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        line: { '0%': { transform: 'scaleY(0)', transformOrigin: 'top' }, '50%': { transform: 'scaleY(1)', transformOrigin: 'top' }, '51%': { transformOrigin: 'bottom' }, '100%': { transform: 'scaleY(0)', transformOrigin: 'bottom' } },
      },
      animation: { rise: 'rise 1s cubic-bezier(.2,.7,.1,1) both', fade: 'fade 1.2s ease both', line: 'line 2.4s cubic-bezier(.6,0,.2,1) infinite' },
    },
  },
  plugins: [],
};
export default config;
