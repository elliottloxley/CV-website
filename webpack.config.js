module.exports = {
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      }
    ]
  },
  // vue-loader configurations
  vue: {
    // configure autoprefixer
    autoprefixer: {
      browsers: ['last 2 versions']
    }
  }
}
