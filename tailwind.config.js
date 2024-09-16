/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
    colors:{
      'ColorTitle':'#0D1B34',
      'ColorInput':'#F5F5F5',
      'ColorDescriptionText':'#858585',
      'black': "#0000"
    }
  },
  plugins: [],
}

