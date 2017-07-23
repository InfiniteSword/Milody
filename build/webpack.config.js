const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ROOT_PATH = path.resolve(__dirname, '../');
const SRC_PATH = path.resolve(__dirname, '../src');
const DIST_PATH = path.resolve(__dirname, '../dist');
const envConfig = require('../config/index');

module.exports = {
  entry: './src/main.js',
  output: {
    path: DIST_PATH,
    publicPath: '/'
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }, {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        loaders: {
          'scss': 'vue-style-loader!css-loader!sass-loader',
          'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
        }
      }
    }, {
      test: /\.(png|jpg|gif|mp3)$/,
      loader: 'url-loader?name=assets/[name].[ext]',
      exclude: '/node_modules'
    }, {
      test: /\.(mp4|ogg|svg|mp3)$/,
      loader: 'file-loader!'
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': envConfig.env
    }),
    new HtmlWebpackPlugin({
      title: 'Demo',
      filename: './index.html', // 相对于output.path的路径
      template: './src/index.html',
      inject: 'body',
      minify: {
        removeComments: true
      },
      // favicon: './src/assets/favicon.png',
    })
  ],
  resolveLoader: {
    moduleExtensions: ['-loader']
  },
  resolve: {
    extensions: [
      '.js',
      '.scss'
    ],
    alias: {
      'root': ROOT_PATH,
      'src': SRC_PATH,
      'assets': SRC_PATH + '/assets',
      'node_modules': ROOT_PATH + '/node_modules',
      'vue$': 'vue/dist/vue.common.js',
    }
  }
}