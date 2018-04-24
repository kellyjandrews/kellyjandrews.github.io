const path = require('path');

module.exports = {
  mode: 'none',
  entry: ['./scripts/scripts.js'],
  output: {
    path: path.resolve('./assets/js/'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      { test: /\.hbs/, loader: "handlebars-template-loader" },
    ]
  },
  plugins: []
};
