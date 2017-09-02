/* eslint-disable import/no-commonjs */
const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  entry: ['babel-polyfill', './index.js'],

  output: {
    filename: 'js/app.js',
    path: path.join(__dirname, 'tmp'),
    publicPath: (process.env.NODE_ENV === 'production') ? '/observer/' : '/',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
            plugins: ['transform-runtime'],
          },
        },
      },
      {
        test: /\.pug$/,
        use: {
          loader: 'pug-loader',
        },
      },
    ],
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      DEBUG: false,
    }),

    new HtmlWebpackPlugin({
      title: 'GitHub Observer',
      hash: true,
    }),
  ],

  devtool: process.env === 'production' ? null : 'source-map',

  devServer: {
    port: 3000,
    historyApiFallback: true,
  },
};
