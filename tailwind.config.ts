import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: { DEFAULT: '1.25rem', lg: '2rem' }, screens: { '2xl': '1200px' } },
    extend: {
      colors: {
        navy: { DEFAULT: '#14243b', 900: '#0d1828', 800: '#14243b', 700: '#1d3352', 600: '#2a4468' },
        charcoal: '#2b2f36',
        slate: '#5c6470',
        mist: '#eef0f3',
        line: '#dfe3e8',
        sand: { DEFAULT: '#f5f1ea', 200: '#ebe4d8' },
        copper: { DEFAULT: '#a86b45', 600: '#8f5a39', 300: '#d0a385' },
      },
      fontFamily: {
        sans: ['"Inter Variable"', '"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', '"IBM Plex Sans Arabic"', 'Georgia', 'serif'],
      },
      letterSpacing: { brand: '0.28em' },
      keyframes: { rise: { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'none' } } },
      animation: { rise: 'rise .7s ease-out both' },
    },
  },
  plugins: [],
};
export default config;
