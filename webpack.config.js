const path = require('path');

module.exports = {
  mode: 'none',
  entry: ['./scripts/scripts.js'],
  output: {
    path: path.resolve('./assets/js/'),
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /(node_modules)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['react', 'env'],
        }
      }
    }]
  },
  plugins: []
};
