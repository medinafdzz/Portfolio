/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      sans: ['Satoshi'],
      serif: ['Satoshi'],
      mono: ['Satoshi'],
    },
    extend: {
      screens: {
        xs: '475px',
      },
    },
  },
  plugins: [],
};
