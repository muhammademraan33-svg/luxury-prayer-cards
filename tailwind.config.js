/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6e9f0',
          100: '#b8c0d6',
          200: '#8a97bc',
          300: '#5c6ea2',
          400: '#3d4f7f',
          500: '#1e305c', // Navy base
          600: '#1a2850',
          700: '#162044',
          800: '#121838',
          900: '#0e102c',
        },
        navy: {
          50: '#e6e9f0',
          100: '#b8c0d6',
          200: '#8a97bc',
          300: '#5c6ea2',
          400: '#3d4f7f',
          500: '#1e305c',
          600: '#1a2850',
          700: '#162044',
          800: '#121838',
          900: '#0e102c',
        },
        gold: {
          50: '#fffef5',
          100: '#fffce6',
          200: '#fff9cc',
          300: '#fff6b3',
          400: '#fff399',
          500: '#f5e882', // Royal gold
          600: '#d4c86f',
          700: '#b3a85c',
          800: '#928849',
          900: '#716836',
        },
      },
      fontFamily: {
        script: ['Dancing Script', 'cursive'],
        elegant: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
