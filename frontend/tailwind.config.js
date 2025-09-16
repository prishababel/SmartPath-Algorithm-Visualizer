/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#e5edff',
          200: '#cfe0ff',
          300: '#b6d3ff',
          400: '#8fb6ff',
          500: '#6b98ff',
          600: '#4f7bff',
          700: '#3b5fe6',
          800: '#2c48b3',
          900: '#1d2f80'
        }
      }
    }
  },
  plugins: []
}
