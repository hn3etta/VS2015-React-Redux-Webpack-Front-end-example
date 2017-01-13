process.env.NODE_ENV = 'development';

const chalk = require('chalk');
const cors = require('cors');
const clearConsole = require('react-dev-utils/clearConsole');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const historyApiFallback = require('connect-history-api-fallback');
const openBrowser = require('react-dev-utils/openBrowser');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const paths = require('./paths');
const config = require('../webpack.config');

let compiler;
const isInteractive = process.stdout.isTTY;

function setupCompiler(host, port, protocol) {
	// "Compiler" is a low-level interface to Webpack.
	// It lets us listen to some events and provide our own custom messages.
	compiler = webpack(config);

	// "invalid" event fires when you have changed a file, and Webpack is
	// recompiling a bundle. WebpackDevServer takes care to pause serving the
	// bundle, so if you refresh, it'll wait instead of serving the old one.
	// "invalid" is short for "bundle invalidated", it doesn't imply any errors.
	compiler.plugin('invalid', () => {
		if (isInteractive) {
			clearConsole();
		}
		console.log('Compiling...');
	});

	let isFirstCompile = true;

	// "done" event fires when Webpack has finished recompiling the bundle.
	// Whether or not you have warnings or errors, you will get this event.
	compiler.plugin('done', stats => {
		if (isInteractive) {
			clearConsole();
		}

		// We have switched off the default Webpack output in WebpackDevServer
		// options so we are going to "massage" the warnings and errors and present
		// them in a readable focused way.
		const messages = formatWebpackMessages(stats.toJson({}, true));
		const isSuccessful = !messages.errors.length && !messages.warnings.length;
		const showInstructions = isSuccessful && (isInteractive || isFirstCompile);

		if (isSuccessful) {
			console.log(chalk.green('Compiled successfully!'));
		}

		if (showInstructions) {
			console.log();
			console.log('The app is running at:');
			console.log();
			console.log('  ' + chalk.cyan(protocol + '://' + host + ':' + port + '/'));
			console.log();
			console.log('Note that the development build is not optimized.');
			console.log('To create a production build, use ' + chalk.cyan('npm run build') + '.');
			console.log();
			isFirstCompile = false;
		}

		// If errors exist, only show errors.
		if (messages.errors.length > 0) {
			console.log(chalk.red('Failed to compile.'));
			console.log();

			messages.errors.forEach(message => {
				console.log(message);
				console.log();
			});

			return;
		}

		// Show warnings if no errors were found.
		if (messages.warnings.length > 0) {
			console.log(chalk.yellow('Compiled with warnings.'));
			console.log();

			messages.warnings.forEach(message => {
				console.log(message);
				console.log();
			});

			console.log('You may use special comments to disable some warnings.');
			console.log('Use ' + chalk.yellow('// eslint-disable-next-line') + ' to ignore the next line.');
			console.log('Use ' + chalk.yellow('/* eslint-disable */') + ' to ignore all warnings in a file.');
		}
	});
}

function addMiddleware(devServer) {
	devServer.use(cors());
	devServer.use(historyApiFallback({
		// Paths with dots should still use the history fallback.
		// See https://github.com/facebookincubator/create-react-app/issues/387.
		disableDotRule: true
	}));

	// Finally, by now we have certainly resolved the URL.
	// It may be /index.html, so let the dev server try serving it again.
	devServer.use(devServer.middleware);
}

function runDevServer(host, port, protocol) {
	const devServer = new WebpackDevServer(compiler, {
		// Enable gzip compression of generated files.
		compress: true,
		// Silence WebpackDevServer's own logs since they're generally not useful.
		// It will still show compile warnings and errors with this setting.
		clientLogLevel: 'none',
		// By default WebpackDevServer serves physical files from current directory
		// in addition to all the virtual build products that it serves from memory.
		// This is confusing because those files won’t automatically be available in
		// production build folder unless we copy them. However, copying the whole
		// project directory is dangerous because we may expose sensitive files.
		// Instead, we establish a convention that only files in `public` directory
		// get served. Our build script will copy `public` into the `build` folder.
		contentBase: paths.appPublic,
		// Enable hot reloading server. It will provide /sockjs-node/ endpoint
		// for the WebpackDevServer client so it can learn when the files were
		// updated. The WebpackDevServer client is included as an entry point
		// in the Webpack development configuration.
		hot: true,
		// It is important to tell WebpackDevServer to use the same "root" path
		// as we specified in the config. In development, we always serve from /.
		publicPath: config.output.publicPath,
		// WebpackDevServer is noisy by default so we emit custom message instead
		// by listening to the compiler events with `compiler.plugin` calls above.
		quiet: true,
		// Reportedly, this avoids CPU overload on some systems.
		// https://github.com/facebookincubator/create-react-app/issues/293
		watchOptions: {
			ignored: /node_modules/
		},
		// Enable HTTPS if the HTTPS environment variable is set to 'true'
		https: protocol === 'https',
		host
	});

	// Our custom middleware proxies requests to /index.html or a remote API.
	addMiddleware(devServer);

	// Launch WebpackDevServer.
	devServer.listen(port, err => {
		if (err) {
			return console.log(err);
		}

		if (isInteractive) {
			clearConsole();
		}

		console.log(chalk.cyan('Starting the development server...'));
		console.log();

		if (isInteractive) {
			openBrowser(protocol + '://' + host + ':' + port + '/');
		}
	});
}

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;
const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
setupCompiler(host, port, protocol);
runDevServer(host, port, protocol);
