const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: {
    app: './src/app/index.js',
    admin: './src/admin/index.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015']
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 20000
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf)/i,
        use: [
          'file-loader'
        ]
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ 
      filename: 'index.html',
      inject: true,
      minify: false,
      xhtml: true,
      template: 'templates/index.html',
      title: 'Bitcoin Alerts',
      excludeChunks: ['admin'],
      showErrors: true,
      includeExternals: true,
    }),
    new HtmlWebpackPlugin({
      title: 'Bitcoin Alerts | Admin Page', 
      filename: 'admin.html',
      template: 'templates/admin.html',
      excludeChunks: ['app'],
      includeExternals: true,
    }),
  ],
}