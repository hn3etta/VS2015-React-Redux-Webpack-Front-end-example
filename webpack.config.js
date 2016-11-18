import webpack from 'webpack';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const GLOBALS = {
    "process.env.NODE_ENV": JSON.stringify("production")
};

export default {
  debug: true,
  devtool: /* For Development */'eval-source-map' /* For Production  'source-map'*/,
  noInfo: false,
  entry: [
    'babel-polyfill',
    /* For Development */ 'eventsource-polyfill', // necessary for hot reloading with IE
    /* For Development */'webpack-hot-middleware/client?reload=true', //note that it reloads the page if hot module reloading fails.
    './src/index'
  ],
  target: 'web',
  output: {
    path: __dirname + '/dist', // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
      contentBase: /* For Development */ './src'  /* For Production  './dist'*/
  },
  plugins: [
    /* For Development*/
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.ProvidePlugin({
        Promise: 'imports?this=>global!exports?global.Promise!es6-promise',
        fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    })
    
    /* For Production 
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin(GLOBALS),
    new ExtractTextPlugin("styles.css"),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.ProvidePlugin({
        Promise: 'imports?this=>global!exports?global.Promise!es6-promise',
        fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    })
    */
  ],
  module: {
    loaders: [
      {test: /\.js$/, include: path.join(__dirname, 'src'), loaders: ['babel']},
      {test: /(\.scss)$/, /* Development */loaders: ['style', 'css', "sass"]  /*Production loader: ExtractTextPlugin.extract("css!sass?sourceMap")*/ },
      {test: /\.png$/, loader: 'url-loader?limit=200000&mimetype=image/png&name=[name].[ext]'},
      {test: /\.jpg$/, loader: 'url-loader?limit=200000&mimetype=image/jpg&name=[name].[ext]'},
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
      {test: /\.(woff|woff2)$/, loader: 'url?prefix=font/&limit=5000'},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'}
    ]
  }
};
