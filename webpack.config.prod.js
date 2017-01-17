/* eslint-disable camelcase */

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const paths = require('./tools/paths');

const env = {
	'process.env.NODE_ENV': JSON.stringify('production')
};

// Assert this just to be safe.
// Development builds of React are slow and not intended for production.
if (env['process.env.NODE_ENV'] !== '"production"') {
	throw new Error('Production builds must have NODE_ENV=production.');
}

module.exports = {
	bail: true,
	devtool: 'source-map',
	entry: [
		require.resolve('./tools/polyfills'),
		paths.appIndexJs
	],
	output: {
		// Generated JS file names (with nested folders).
		// There will be one main bundle, and one file per asynchronous chunk.
		filename: 'static/js/[name].[chunkhash:8].js',
		chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
		path: paths.appDist,
		publicPath: '/'
	},
	module: {
		rules: [
			// Default loader: load all assets that are not handled
			// by other loaders with the url loader.
			// Note: This list needs to be updated with every change of extensions
			// the other loaders match.
			// E.g., when adding a loader for a new supported file extension,
			// we need to add the supported extension to this loader too.
			// Add one new line in `exclude` for each loader.
			//
			// "file" loader makes sure those assets get served by WebpackDevServer.
			// When you `import` an asset, you get its (virtual) filename.
			// In production, they would get copied to the `dist` folder.
			// "url" loader works like "file" loader except that it embeds assets
			// smaller than specified limit in bytes as data URLs to avoid requests.
			// A missing `test` is equivalent to a match.
			{
				exclude: [
					/\.html$/,
					/\.js$/,
					/\.scss$/,
					/\.json$/,
					/\.svg$/,
					/node_modules/
				],
				use: [{
					loader: 'url-loader',
					options: {
						limit: 10000,
						name: 'static/media/[name].[hash:8].[ext]'
					}
				}]
			},
			{
				test: /\.js$/,
				include: paths.appSrc,
				use: ['babel-loader']
			},
			{
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract({
					fallbackLoader: 'style-loader',
					loader: [
						{
							loader: 'css-loader',
							options: {
								importLoaders: 2
							}
						},
						'postcss-loader',
						'sass-loader'
					]
				})
				// Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
			},
			{
				test: /\.svg$/,
				use: [{
					loader: 'file-loader',
					options: {
						name: 'static/media/[name].[hash:8].[ext]'
					}
				}]
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			inject: true,
			template: paths.appHtml,
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeStyleLinkTypeAttributes: true,
				keepClosingSlash: true,
				minifyJS: true,
				minifyCSS: true,
				minifyURLs: true
			}
		}),
		new webpack.DefinePlugin(env),
		new webpack.LoaderOptionsPlugin({
			debug: false,
			minimize: true
		}),
		new webpack.optimize.UglifyJsPlugin({
			beautify: false,
			comments: false,
			compress: {
				screw_ie8: true,
				warnings: false
			},
			mangle: {
				screw_ie8: true
			},
			output: {
				comments: false,
				screw_ie8: true
			},
			sourceMap: true
		}),
		// Note: this won't work without ExtractTextPlugin.extract(..) in `loaders`.
		new ExtractTextPlugin('static/css/[name].[contenthash:8].css'),
		// Generate a manifest file which contains a mapping of all asset filenames
		// to their corresponding output file so that tools can pick it up without
		// having to parse `index.html`.
		new ManifestPlugin({
			fileName: 'asset-manifest.json'
		})
	],
	// Some libraries import Node modules but don't use them in the browser.
	// Tell Webpack to provide empty mocks for them so importing them works.
	node: {
		fs: 'empty',
		net: 'empty',
		tls: 'empty'
	}
};
