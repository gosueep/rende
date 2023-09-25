module.exports = {
  content : [
    './index.html',
    './src/**/*.{html,js,tsx}'
  ],
  theme : {
    extend : {},
  },
  plugins : [
    require('tailwind-scrollbar-hide')
  ],
}