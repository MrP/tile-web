'use strict';
var tilePage = require('./tiler.js').tilePage;
var screenshotPage = require('./screenshoter.js').screenshotPage;
var rimraf = require('rimraf');
var mkdirpp = require('./util.js').mkdirpp;

var pageName = process.argv[2];
var outPath = process.argv[3];
if (!pageName || !outPath) {
    console.error('Error: Missing argument: node webTiler.js pageName.html path/to/save/tiles/');
    process.exit(1);
}
var tmpDir = process.env.TMPDIR || '/tmp';
var tmpPath = tmpDir + '/comic-map_' + process.pid + '/';

mkdirpp(tmpPath)
.then(() => mkdirpp(outPath))
.then(() => screenshotPage(pageName, tmpPath, outPath))
.then(() => tilePage(tmpPath, outPath))
.then(() => rimraf(tmpPath))
.catch(console.log.bind(console, pageName, outPath));

