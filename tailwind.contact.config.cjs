/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./kontak.html", "./assets/js/contact-form.js"],
  prefix: "tw-",
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        navy: "#111747",
        brand: "#3158e8",
        violet: "#7353df",
        pale: "#f4f6ff",
        line: "#e5e8f4",
        muted: "#69708b",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-6px)" },
          "75%": { transform: "translateX(6px)" },
        },
        pop: {
          "0%": { transform: "scale(.6)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        rise: {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        shake: "shake .35s",
        pop: "pop .25s ease-out",
        rise: "rise .35s ease-out",
      },
    },
  },
  plugins: [],
};
