/** @type {import("prettier").Options} */
export default {
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 80,
  semi: true,
  useTabs: false,
  overrides: [
    {
      files: ['**/*.json'],
      options: {
        useTabs: false,
      },
    },
  ],
  plugins: ['prettier-plugin-tailwindcss'],
};
