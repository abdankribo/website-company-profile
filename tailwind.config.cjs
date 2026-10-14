/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./proyek/**/*.html",
    "./assets/js/**/*.js",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  // Existing component CSS remains responsible for its current layout while
  // utilities are migrated page by page. Disabling Preflight avoids changing
  // browser defaults across the legacy static pages during this transition.
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        decho: {
          navy: "#10164f",
          ink: "#172033",
          gold: "#d5a84f",
          cream: "#f7f5ef",
        },
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        display: ["Manrope", "DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
