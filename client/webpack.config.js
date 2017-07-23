const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = [
  {
    entry: {
      app: './app/index.js',
      admin: './app/index.js'
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/'
    },
    devtool: 'inline-source-map',
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
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ]
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
    devServer: {
      contentBase: './dist',
      port: 4002,
     },
    plugins: [
      // new CleanWebpackPlugin(['build', 'dist']),
      new HtmlWebpackPlugin({ 
        filename: 'index.html',
        inject: true,
        minify: false,
        xhtml: true,
        template: 'templates/index.html',
        title: 'Bitcoin Alerts',
        chunks: ['app'],
        showErrors: true,
      }),
      new HtmlWebpackPlugin({
        filename: 'admin.html',
        template: 'templates/admin.html',
        chunks:['admin'],
      }),
    ],
  }
]