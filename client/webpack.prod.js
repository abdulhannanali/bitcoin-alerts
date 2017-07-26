const webpack = require('webpack');

const commonConfig = require('./webpack.common');
const Merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const finalConfig = Merge(commonConfig, {
  devtool: 'source-map',
  output: {
    publicPath: './'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader',
        })
      }
    ]
  },
  externals: [
    'material-design-lite'
  ],
  plugins: [
    new ExtractTextPlugin('[name].css'),
    new CleanWebpackPlugin(['build', 'dist']),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fname: true,
      },
      compress: {
        screw_ie8: true,
      },
      comments: false,
    })
  ]
});

module.exports = finalConfig;