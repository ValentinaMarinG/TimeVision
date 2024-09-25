/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors:{
        grayText: '#858585',
        blueText: '#8696BB',
        CText: '#595A69',
        boldText:'#0D1B34',
        cardColor: '#4894FE',
        cardColorText: '#FFFFFF',
        shiftInColor: '#FEB052',
        shiftOutColor: '#4894FE',
        backGroundShiftList: '#fafafa'
      }
    },
  },
  plugins: [],
}

