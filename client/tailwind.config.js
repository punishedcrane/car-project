// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        courier: ['"Courier Prime"', 'monospace'],
        goldman: ['Goldman', 'cursive'],
        jersey: ['"Jersey 15"', 'cursive'],
      },
    },
  },
  plugins: [],
}
