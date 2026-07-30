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
          50: '#fff5f0',
          100: '#ffe6da',
          200: '#ffc9ab',
          300: '#ffa471',
          400: '#ff7a3d',
          500: '#ff5b22', // DABBA orange
          600: '#ea470f',
          700: '#c2350a',
          800: '#9a2c0c',
          900: '#7c260f',
        },
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        cream: {
          DEFAULT: '#f2efe7',
          50: '#faf8f3',
          100: '#f2efe7',
          200: '#e8e3d5',
          300: '#dad3bf',
          400: '#c7bda3',
        },
        ink: {
          DEFAULT: '#16140f',
          700: '#2b2820',
          500: '#57523f',
          400: '#7a7560',
        },
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 22s linear infinite',
      },
    },
  },
  plugins: [],
}
