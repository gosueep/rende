module.exports = {
  content : ['./src/**/*.{html,js,tsx}'],
  theme : {
    extend : {},
  },
  plugins : [
    require('tailwind-scrollbar-hide')
  ],
}