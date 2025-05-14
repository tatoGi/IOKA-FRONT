module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-nested': {},
    '@fullhuman/postcss-purgecss': {
      content: [
        './pages/**/*.{js,jsx,ts,tsx}',
        './components/**/*.{js,jsx,ts,tsx}',
        './styles/**/*.css'
      ],
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
      safelist: {
        standard: [/^swiper-/, /^leaflet-/, /^slick-/, /^fa-/, /^fas-/, /^far-/, /^fab-/],
        deep: [/^swiper-/, /^leaflet-/, /^slick-/, /^fa-/, /^fas-/, /^far-/, /^fab-/],
        greedy: [/^swiper-/, /^leaflet-/, /^slick-/, /^fa-/, /^fas-/, /^far-/, /^fab-/]
      }
    },
    'autoprefixer': {}
  }
}; 