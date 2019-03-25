const path = require('path');

module.exports = {
  mode: 'production',

  entry: {
    analytics: path.resolve('./src/index.js')
  },

  output: {
    filename: '[name].js',
    path: path.resolve('./../server/public/dist')
  },

  devtool: '#source-map',

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  }
};