/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#060812",
          card: "rgba(17, 25, 40, 0.55)",
          red: "#ff3b59",
          green: "#2bff88",
          yellow: "#ffd166",
          blue: "#46a7ff",
          cyan: "#22d3ee",
        },
      },
      boxShadow: {
        neonRed: "0 0 15px rgba(255, 59, 89, 0.55)",
        neonBlue: "0 0 15px rgba(70, 167, 255, 0.55)",
        neonGreen: "0 0 15px rgba(43, 255, 136, 0.45)",
      },
    },
  },
  plugins: [],
};
