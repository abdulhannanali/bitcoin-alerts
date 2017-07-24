const Merge = require('webpack-merge');
const commonConfig = require('./webpack.common');

module.exports = Merge(commonConfig, {
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    port: 4002,
  },
  plugins: [],
})