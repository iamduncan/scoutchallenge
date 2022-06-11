module.exports = {
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
  plugins: [
    function ({ addVariant }) {
      addVariant(
        "supports-scrollbars",
        "@supports selector(::-webkit-scrollbar)"
      );
      addVariant("scrollbar", "&::-webkit-scrollbar");
      addVariant("scrollbar-track", "&::-webkit-scrollbar-track");
      addVariant("scrollbar-thumb", "&::-webkit-scrollbar-thumb");
    },
  ],
};
