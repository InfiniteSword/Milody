const config = require('./webpack.config');
const autoprefixer = require('autoprefixer');

const styleLoaders = [{
  test: /\.s[a|c]ss$/,
  exclude: /node_modules/,
  use: [{
    loader: 'style'
  }, {
    loader: 'css'
  }, {
    loader: 'postcss',
    options: {
      plugins: () => [autoprefixer]
    }
  }, {
    loader: 'sass'
  }]
}, {
  test: /\.css$/,
  use: [{
    loader: 'style'
  }, {
    loader: 'css'
  }, {
    loader: 'postcss',
    options: {
      plugins: () => [autoprefixer]
    }
  }]
}];

config.output.filename = 'main.js';

config.module.rules = config.module.rules.concat(styleLoaders);

config.devtool = 'source-map';

config.devServer = {
  contentBase: './dist', // 本地服务器所加载的页面所在的目录
  historyApiFallback: true, // 不跳转
  inline: true, // 实时刷新
  noInfo: true,
  hot: true,
  port: 8000,
  host: '0.0.0.0',
  proxy: {
    '/api/*': {
      target: 'http://127.0.0.1:8080/',
      secure: false
    }
  }
};

module.exports = config;
