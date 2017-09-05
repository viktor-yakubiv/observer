/* eslint-disable import/no-commonjs */
const path = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const webpackConfig = {
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

      {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            'stylus-loader',
          ],
        }),
      },

      {
        test: /\.(svg|png)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'images/[name].[ext]',
          },
        },
      },
    ],
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      DEBUG: false,
    }),

    new ExtractTextPlugin('css/all.css'),

    new HtmlPlugin({
      title: 'GitHub Observer',
      template: 'theme/base.pug',
      hash: true,
    }),
  ],

  devtool: process.env === 'production' ? null : 'source-map',

  devServer: {
    port: 3000,
    historyApiFallback: true,
  },
};

if (process.env.NODE_ENV === 'production') {
  webpackConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin(),
    new CompressionPlugin({
      asset: '[path].gz',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
  );
}

module.exports = webpackConfig;
