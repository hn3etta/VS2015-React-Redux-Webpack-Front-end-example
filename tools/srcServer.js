import path from 'path';
import config from '../webpack.config';

/* Use "require" for non ES6 Modules */
let express = require('express');
let webpack = require('webpack');
let open = require('open');
let cors = require('cors');

/* eslint-disable no-console */

const port = 3002;
const app = express();
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use(cors());

app.get('*', function(req, res) {
  res.sendFile(path.join( __dirname, '../src/index.html'));
});

app.listen(port, function(err) {
  if (err) {
    console.log(err);
  } else {
    open(`http://127.0.0.1:${port}`);
  }
});
