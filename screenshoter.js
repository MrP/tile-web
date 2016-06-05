var constants = require('./constants.js');
var execSync = require('child_process').execSync;
var cleanPath = require('./util.js').cleanPath;


module.exports.screenshotPage = function screenshot(pageName) {
    const outPath = constants.PAGE_SCREENSHOTS_PATH + pageName;
    return cleanPath(outPath).then(() => {
        return new Promise(function (resolve, reject) {
            var command = 'node_modules/phantomjs-prebuilt/bin/phantomjs phantomjsScreenshot.js ' + constants.BASE_URL + '/' + pageName+' '+outPath;
            console.log('screenshot', command);
            execSync(command);
            return pageName;
        });
    });
};