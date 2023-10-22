import { type Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme.js';
import { type PluginCreator } from 'tailwindcss/types/config.js';
import animatePlugin from 'tailwindcss-animate';
import radixPlugin from 'tailwindcss-radix';
import { extendedTheme } from './app/utils/extended-theme.ts';

const tailwindScrollbar: PluginCreator = function ({ addVariant }) {
  addVariant('supports-scrollbars', '@supports selector(::-webkit-scrollbar)');
  addVariant('scrollbar', '&::-webkit-scrollbar');
  addVariant('scrollbar-track', '&::-webkit-scrollbar-track');
  addVariant('scrollbar-thumb', '&::-webkit-scrollbar-thumb');
};

export default {
  content: ['./app/**/*.{ts,tsx,jsx,js}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      ...extendedTheme,
      fontFamily: {
        sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        ...extendedTheme.colors,
        'scout-purple': '#7413DC',
      },
    },
  },
  plugins: [tailwindScrollbar, animatePlugin, radixPlugin],
} satisfies Config;
