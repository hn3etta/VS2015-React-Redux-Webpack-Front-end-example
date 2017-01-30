/* eslint-disable unicorn/no-process-exit */

// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = 'production';

const path = require('path');
const chalk = require('chalk');
const filesize = require('filesize');
const fs = require('fs-extra');
const gzipSize = require('gzip-size').sync;
const openBrowser = require('react-dev-utils/openBrowser');
const recursive = require('recursive-readdir');
const server = require('pushstate-server');
const stripAnsi = require('strip-ansi');
const webpack = require('webpack');
const paths = require('./paths');
const config = require('../webpack.config.prod');

// Input: /User/dan/app/build/static/js/main.82be8.js
// Output: /static/js/main.js
function removeFileNameHash(fileName) {
	return fileName
		.replace(paths.appDist, '')
		.replace(/\/?(.*)(\.\w+)(\.js|\.css)/, (match, p1, p2, p3) => p1 + p3);
}

// Input: 1024, 2048
// Output: "(+1 KB)"
function getDifferenceLabel(currentSize, previousSize) {
	const FIFTY_KILOBYTES = 1024 * 50;
	const difference = currentSize - previousSize;
	const fileSize = Number.isNaN(difference) ? 0 : filesize(difference);
	if (difference >= FIFTY_KILOBYTES) {
		return chalk.red('+' + fileSize);
	} else if (difference < FIFTY_KILOBYTES && difference > 0) {
		return chalk.yellow('+' + fileSize);
	} else if (difference < 0) {
		return chalk.green(fileSize);
	}
	return '';
}

// First, read the current file sizes in build directory.
// This lets us display how much they changed later.
recursive(paths.appDist, (err, fileNames) => {
	// Ignore ENOENT: no such file or directory.
	// If `paths.appDist` does not exist, it will be created.
	if (err && err.code !== 'ENOENT') {
		return console.log(err);
	}

	const previousSizeMap = (fileNames || [])
	.filter(fileName => /\.(js|css)$/.test(fileName))
	.reduce((memo, fileName) => {
		const contents = fs.readFileSync(fileName);
		const key = removeFileNameHash(fileName);
		memo[key] = gzipSize(contents);
		return memo;
	}, {});

	// Remove all content but keep the directory so that
	// if you're in it, you don't end up in Trash
	fs.emptyDirSync(paths.appDist);

	// Start the webpack build
	build(previousSizeMap);

	// Merge with the public folder
	copyPublicFolder();
});

// Print a detailed summary of build files.
function printFileSizes(stats, previousSizeMap) {
	const assets = stats.toJson().assets
	.filter(asset => /\.(js|css)$/.test(asset.name))
	.map(asset => {
		const fileContents = fs.readFileSync(paths.appDist + '/' + asset.name);
		const size = gzipSize(fileContents);
		const previousSize = previousSizeMap[removeFileNameHash(asset.name)];
		const difference = getDifferenceLabel(size, previousSize);
		return {
			folder: path.join(paths.appDist, path.dirname(asset.name)),
			name: path.basename(asset.name),
			size,
			sizeLabel: filesize(size) + (difference ? ' (' + difference + ')' : '')
		};
	});
	assets.sort((a, b) => b.size - a.size);
	const longestSizeLabelLength = Math.max.apply(null,
		assets.map(a => stripAnsi(a.sizeLabel).length)
	);
	assets.forEach(asset => {
		let sizeLabel = asset.sizeLabel;
		const sizeLength = stripAnsi(sizeLabel).length;
		if (sizeLength < longestSizeLabelLength) {
			const rightPadding = ' '.repeat(longestSizeLabelLength - sizeLength);
			sizeLabel += rightPadding;
		}
		console.log(
			'  ' + sizeLabel +
			'  ' + chalk.dim(asset.folder + path.sep) + chalk.cyan(asset.name)
		);
	});
}

// Print out errors
function printErrors(summary, errors) {
	console.log(chalk.red(summary));
	console.log();
	errors.forEach(err => {
		console.log(err.message || err);
		console.log();
	});
}

// Create the production build and print the deployment instructions.
function build(previousSizeMap) {
	console.log('Creating an optimized production build...');
	webpack(config).run((err, stats) => {
		if (err) {
			printErrors('Failed to compile.', [err]);
			process.exit(1);
		}

		if (stats.compilation.errors.length > 0) {
			printErrors('Failed to compile.', stats.compilation.errors);
			process.exit(1);
		}

		if (process.env.CI && stats.compilation.warnings.length > 0) {
			printErrors('Failed to compile.', stats.compilation.warnings);
			process.exit(1);
		}

		console.log(chalk.green('Compiled successfully.'));
		console.log();

		console.log('File sizes after gzip:');
		console.log();
		printFileSizes(stats, previousSizeMap);
		console.log();

		const openCommand = process.platform === 'win32' ? 'start' : 'open';
		console.log('The project was built assuming it is hosted at the server root.');
		console.log('The ' + chalk.cyan('dist') + ' folder is ready to be deployed.');
		console.log('You may also serve it locally with a static server:');
		console.log();
		console.log('  ' + chalk.cyan('npm') + ' install -g pushstate-server');
		console.log('  ' + chalk.cyan('pushstate-server') + ' dist');
		console.log('  ' + chalk.cyan(openCommand) + ' http://localhost:3000/');
		console.log();

		if (!process.env.CI) {
			const PORT = process.env.PORT || 3000;
			server.start({
				port: PORT,
				directory: paths.appDist
			});
			openBrowser(`http://localhost:${PORT}/`);
		}
	});
}

function copyPublicFolder() {
	fs.copySync(paths.appPublic, paths.appDist, {
		dereference: true,
		filter: file => file !== paths.appHtml
	});
}
