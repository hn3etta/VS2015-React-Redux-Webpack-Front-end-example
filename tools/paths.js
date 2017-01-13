const fs = require('fs');
const path = require('path');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
function resolveApp(relativePath) {
	return path.resolve(appDirectory, relativePath);
}

module.exports = {
	appDist: resolveApp('dist'),
	appHtml: resolveApp('src/index.html'),
	appIndexJs: resolveApp('src/index.js'),
	appNodeModules: resolveApp('node_modules'),
	appPackageJson: resolveApp('package.json'),
	appPublic: resolveApp('public'),
	appSrc: resolveApp('src')
};
