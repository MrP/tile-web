var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var constants = require('./constants.js');
var execSync = require('child_process').execSync;

module.exports.screenshotPage = function screenshot(pageName) {
    const outPath = constants.PAGE_SCREENSHOTS_PATH + pageName;
    return new Promise(function (resolve, reject) {
        rimraf(outPath, {glob: false, disableGlob: true}, function(error) {
            if (error) {
                reject(error);
            } else {
                mkdirp(outPath, function (e) {
                    if (e) {
                        reject(e);
                    } else {
                        try {
                            execSync('phantomjs phantomjsScreenshot.js ' + constants.BASE_URL + '/' + pageName+' '+outPath);
                            resolve(pageName);
                        } catch (e) {
                            reject(e);
                        }
                    }
                });
            }
        });
    });
};