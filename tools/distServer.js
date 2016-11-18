import path from 'path';

/* Use "require" for non ES6 Modules */
let express = require('express');
let open = require('open');
let compression = require('compression');


/*eslint-disable no-console */

const port = 3002;
const app = express();

app.use(compression());
app.use(express.static("dist"));

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(port, function (err) {
    if (err) {
        console.log(err);
    } else {
        open(`http://127.0.0.1:${port}`);
    }
});