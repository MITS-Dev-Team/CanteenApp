/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      dropShadow:{
        'greengoblin':"2px 2px 60px 25px rgba(28, 166, 114, 0.35)",

      }
    },
  },
  plugins: [],
};