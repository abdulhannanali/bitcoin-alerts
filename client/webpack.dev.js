const Merge = require('webpack-merge');
const commonConfig = require('./webpack.common');

module.exports = Merge(commonConfig, {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }
    ]
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    port: 4002,
  },
  plugins: [],
})