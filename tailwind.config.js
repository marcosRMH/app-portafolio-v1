/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#e2e8f0',
          100: '#c8d0dc',
          200: '#a0abbd',
          300: '#7b87a2',
          400: '#596781',
          500: '#3d4a63',
          600: '#2a354a',
          700: '#1c2436',
          800: '#12121a',
          900: '#0a0a0f',
          950: '#050508',
        },
        primary: {
          DEFAULT: '#00d4ff',
          50: '#e0faff',
          100: '#b8f3ff',
          200: '#80ebff',
          300: '#3de0ff',
          400: '#00d4ff',
          500: '#00b8e0',
          600: '#0099bd',
          700: '#007a99',
          800: '#005c75',
          900: '#004052',
        },
        accent: {
          DEFAULT: '#7c3aed',
          50: '#f0e7ff',
          100: '#d9c5ff',
          200: '#b894ff',
          300: '#9b6aff',
          400: '#7c3aed',
          500: '#6326d1',
          600: '#4d1ab0',
          700: '#3a118f',
          800: '#290b6e',
          900: '#1a064d',
        },
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
