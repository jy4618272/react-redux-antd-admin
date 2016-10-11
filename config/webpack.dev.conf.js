var webpack = require('webpack'),
    config = require('./webpack.base.conf');
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    OpenBrowserPlugin = require('open-browser-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    // SOURCE_MAP = true; // 大多数情况下用不到
    SOURCE_MAP = false;

config.output.filename = '[name].js';
config.output.chunkFilename = '[id].js';

// config.devtool = SOURCE_MAP ? 'eval-source-map' : false;

// // add hot-reload related code to entry chunk
config.entry.app = [
    'babel-polyfill',  // 可以使用完整的ES6特性, 大概增加100KB
		'webpack-dev-server/client?http://localhost:3000', // WebpackDevServer host and port
		'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
    config.entry.app
];

// // generate loader string to be used with extract text plugin
function generateExtractLoaders(loaders) {
  return loaders.map(function (loader) {
    return loader + '-loader' + (SOURCE_MAP ? '?sourceMap' : '');
  }).join('!');
}

// // config.output.publicPath = '/';

config.plugins = (config.plugins || []).concat([
  new OpenBrowserPlugin({ url: 'http://localhost:3000' }),
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.NoErrorsPlugin(),
  new ExtractTextPlugin('[name].css'),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: config.commonPath.indexHTML,
    chunksSortMode: 'none'
  })
]);

module.exports = config;
