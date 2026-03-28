/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: '#D4537E',
          light: '#FBEAF0',
          border: '#F4C0D1',
          text: '#3d2a2a',
          muted: '#b89898',
          bg: '#FDF6F0',
        },
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
      },
    },
  },
  plugins: [],
}
