'use strict';
var rimraf = require('rimraf-promise');
var mkdirp = require('mkdirp-promise');
var tile = require('image-tiler').tile;
var constants = require('./constants.js');
var exec = require('child-process-promise').exec;

var pageName = process.argv[2];
var outPath = process.argv[3];
if (!pageName || !outPath) {
    console.error('Error: Missing argument: node webTiler.js pageName.html path/to/save/tiles/');
    process.exit(1);
}
var tmpDir = process.env.TMPDIR || '/tmp';
var tmpScreenshot = tmpDir + '/comic-map_screenshot' + process.pid + '/';
var screenshotFilename =  tmpScreenshot + constants.SCREENSHOT_FILENAME;
var metadataFilename = outPath + '/' + constants.LINKS_FILENAME;
var url = constants.BASE_URL + '/' + pageName;
// Does away with the irritating warning about the fontconfig
process.env.LC_ALL = 'C';

mkdirp(outPath)
.then(() => mkdirp(tmpScreenshot))
.then(() => exec('node_modules/phantomjs-prebuilt/bin/phantomjs phantomjsScreenshot.js ' + url + ' ' + screenshotFilename + ' ' + metadataFilename))
.then(() => tile(screenshotFilename, outPath, 'tile_{z}_{x}_{y}.png', {zeroZoomOut:false}))
.then(() => rimraf(tmpScreenshot))
.catch(console.log.bind(console, pageName, outPath));
