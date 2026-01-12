/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        clip: {
          primary: '#2563eb',
          secondary: '#7c3aed',
          accent: '#0ea5e9',
          dark: '#1e293b'
        }
      }
    },
  },
  plugins: [],
}
