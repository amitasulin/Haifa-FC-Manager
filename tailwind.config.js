/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'haifa-green': '#00A651',
        'haifa-dark-green': '#008040',
        'haifa-white': '#FFFFFF',
      },
    },
  },
  plugins: [],
}

