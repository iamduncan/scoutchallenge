import { type Config } from "tailwindcss";
import { PluginCreator } from "tailwindcss/types/config.js";

const tailwindScrollbar: PluginCreator = function ({ addVariant }) {
  addVariant("supports-scrollbars", "@supports selector(::-webkit-scrollbar)");
  addVariant("scrollbar", "&::-webkit-scrollbar");
  addVariant("scrollbar-track", "&::-webkit-scrollbar-track");
  addVariant("scrollbar-thumb", "&::-webkit-scrollbar-thumb");
};

export default {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    fontFamily: {
      sans: ["Nunito", "sans-serif"],
    },
    extend: {
      colors: {
        "scout-purple": "#7413DC",
      },
    },
  },
  plugins: [tailwindScrollbar],
} satisfies Config;
