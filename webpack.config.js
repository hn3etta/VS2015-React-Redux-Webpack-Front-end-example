const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const webpack = require('webpack');
const paths = require('./tools/paths');

const env = {
	'process.env.NODE_ENV': JSON.stringify('development')
};

module.exports = {
	devtool: 'cheap-module-eval-source-map',
	entry: [
		require.resolve('./tools/polyfills'),
		'webpack-dev-server/client?http://localhost:3000',
		'webpack/hot/only-dev-server',
		'react-hot-loader/patch',
		'./src/index'
	],
	output: {
		filename: 'static/js/bundle.js',
		path: paths.appDist,
		pathinfo: true,
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
			// {
			// 	test: /\.js$/,
			// 	enforce: 'pre',
			// 	include: paths.appSrc,
			// 	use: [{
			// 		loader: 'xo-loader',
			// 		options: {
			// 			// This loader must ALWAYS return warnings during development. If
			// 			// errors are emitted, no changes will be pushed to the browser for
			// 			// testing until the errors have been resolved.
			// 			emitWarning: true
			// 		}
			// 	}]
			// },
			{
				test: /\.js$/,
				include: paths.appSrc,
				use: [{
					loader: 'babel-loader',
					options: {
						// This is a feature of `babel-loader` for webpack (not Babel itself).
						// It enables caching results in ./node_modules/.cache/babel-loader/
						// directory for faster rebuilds.
						cacheDirectory: true
					}
				}]
			},
			{
				test: /\.scss$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							importLoaders: 2
						}
					},
					'postcss-loader',
					'sass-loader'
				]
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
			template: paths.appHtml
		}),
		new webpack.DefinePlugin(env),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
		// Watcher doesn't work well if you mistype casing in a path so we use
		// a plugin that prints an error when you attempt to do this.
		// See https://github.com/facebookincubator/create-react-app/issues/240
		new CaseSensitivePathsPlugin(),
		// If you require a missing module and then `npm install` it, you still have
		// to restart the development server for Webpack to discover it. This plugin
		// makes the discovery automatic so you don't have to restart.
		// See https://github.com/facebookincubator/create-react-app/issues/186
		new WatchMissingNodeModulesPlugin(paths.appNodeModules)
	],
	// Some libraries import Node modules but don't use them in the browser.
	// Tell Webpack to provide empty mocks for them so importing them works.
	node: {
		fs: 'empty',
		net: 'empty',
		tls: 'empty'
	}
};
