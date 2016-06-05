var constants = require('./constants.js');
var execSync = require('child_process').execSync;
var cleanPath = require('./util.js').cleanPath;
var fs = require('fs');


module.exports.screenshotPage = function screenshot(pageName) {
    const outPath = constants.PAGE_SCREENSHOTS_PATH + pageName + '/';
    return cleanPath(outPath).then(() => {
        var command = 'node_modules/phantomjs-prebuilt/bin/phantomjs phantomjsScreenshot.js ' + constants.BASE_URL + '/' + pageName + ' ' + outPath;
        console.log('screenshot', command);
        execSync(command);

        var listHorizontal = fs.readdirSync(outPath)
            .filter(function (filename) {
                return (new RegExp('^'+constants.SCREENSHOT_FILENAME)).test(filename);
            })
            .map(filename=>outPath+filename)
            .map(filePath => {
                execSync('convert '+filePath+' ' + filePath + '.mpc');
                return filePath + '.mpc';
            })
            .reduce((memo, filename) => {
                var match = (new RegExp(constants.SCREENSHOT_FILENAME + '_(\\d+)_(\\d+)')).exec(filename);
                memo[match[1]] = memo[match[1]] || [];
                memo[match[1]][match[2]] = filename;
                return memo;
            }, []).map((listVertical, i) => {
                var newFile = outPath + constants.SCREENSHOT_FILENAME + '_' + i + '.mpc';
                execSync('convert '+listVertical.join(' ')+' -append ' + newFile);
                return newFile;
            });
        
        execSync('convert '+listHorizontal.join(' ')+' +append ' + outPath + constants.SCREENSHOT_FILENAME);

        fs.readdirSync(outPath)
            .filter(/./.test.bind(/(\.mpc|\.cache)$/))
            .map(filename => outPath + filename)
            .forEach(fs.unlinkSync);

        return pageName;
    });
};