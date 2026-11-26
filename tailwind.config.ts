import type { Config } from 'tailwindcss';

/** SNTURCO design tokens: Dark Luxury (anthracite #202124, off-white #F1EEE9, champagne #C6A98E, taupe #B8AAA0, grey #858B91). */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: { DEFAULT: '1.25rem', md: '2rem', xl: '2.5rem' }, screens: { '2xl': '1280px' } },
    extend: {
      colors: {
        // DARK LUXURY – ANTHRACITE & CHAMPAGNE. Token names kept from v1 so components stay readable:
        // navy/ink = anthracite family, copper = champagne family, sand = off-white family.
        white: '#F8F6F2',
        ink: '#18191B',
        anthracite: '#202124',
        offwhite: '#F1EEE9',
        champagne: '#C6A98E',
        taupe: '#B8AAA0',
        grey: '#858B91',
        navy: { DEFAULT: '#202124', 950: '#151618', 900: '#1B1C1E', 800: '#202124', 700: '#2A2B2E', 600: '#36373B', 400: '#858B91' },
        charcoal: '#2A2B2E',
        slate: '#5E6369',
        mist: '#E7E3DD',
        line: '#DDD7CF',
        sand: { DEFAULT: '#E9E5DF', 50: '#F1EEE9', 200: '#E2DCD4', 300: '#B8AAA0' },
        copper: { DEFAULT: '#C6A98E', 700: '#7A604B', 600: '#B4967A', 400: '#D1B9A2', 300: '#C6A98E', 200: '#DCCAB8' },
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
