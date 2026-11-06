/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0a1f44",   // deep navy
        accent: "#c8262e",    // subtle red
        background: "#ffffff"
      }
    }
  },
  plugins: []
};
