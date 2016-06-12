var constants = require('./constants.js');
var execSync = require('child_process').execSync;
var cleanPath = require('./util.js').cleanPath;

// Does away with the irritating warning about the fontconfig
process.env.LC_ALL = 'C';

module.exports.screenshotPage = function screenshot(pageName) {
    const outPath = constants.PAGE_SCREENSHOTS_PATH + '/';
    return cleanPath(outPath).then(() => {
        var command = 'node_modules/phantomjs-prebuilt/bin/phantomjs phantomjsScreenshot.js ' + constants.BASE_URL + '/' + pageName + ' ' + outPath;
        execSync(command);
        return pageName;
    });
};