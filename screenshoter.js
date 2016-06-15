var constants = require('./constants.js');
var execSync = require('child_process').execSync;

// Does away with the irritating warning about the fontconfig
process.env.LC_ALL = 'C';

module.exports.screenshotPage = function screenshot(pageName, tmpPath, outPath) {
    execSync('node_modules/phantomjs-prebuilt/bin/phantomjs phantomjsScreenshot.js ' + constants.BASE_URL + '/' + pageName + ' ' + tmpPath + ' ' + outPath);
};