'use strict';
var constants = require('./constants.js');
var execSync = require('child_process').execSync;
var sizeOf = require('image-size');
var cleanPath = require('./util.js').cleanPath;
var fs = require('fs');

function tile(inPath, outPath, zoom) {
    return new Promise(function (resolve, reject) {
        try {
            execSync('convert '+ inPath +
            ' -crop 256x256 -set filename:tile "'+zoom+'_%[fx:page.x/256]_%[fx:page.y/256]" +repage +adjoin "' +
            outPath + '/tile_%[filename:tile].png"');
            resolve();
        } catch (e) {
            reject(e);
        }
    });
}

function imageSmallerThanTile(path) {
    var size = sizeOf(path);
    return size.height < 256 && size.width < 256;
}

function tileRec(inPath, outPath, zoom) {
    var inPathMpc = inPath + '.mpc';
    execSync('convert ' + inPath + ' ' + inPathMpc);
    return tile(inPathMpc, outPath, zoom)
        .then(function () {
            if (!imageSmallerThanTile(inPath)) {
                var newZoom = zoom + 1;
                var newInPath = inPath.replace(/(-zoom\d+)?\.png$/, '-zoom'+ newZoom + '.png');
                execSync('convert ' + inPathMpc + ' -resize 50% '+ newInPath);
                fs.unlinkSync(inPathMpc);
                fs.unlinkSync(inPath + '.cache');
                fs.unlinkSync(inPath);
                return tileRec(newInPath, outPath, newZoom);
            } else {
                fs.unlinkSync(inPathMpc);
                fs.unlinkSync(inPath + '.cache');
                fs.unlinkSync(inPath);
            }
        });
}

module.exports.tilePage = function (pageName) {
    const outPath = constants.PAGE_TILES_PATH + pageName ;
    const inPath = constants.PAGE_SCREENSHOTS_PATH + pageName + '/' + constants.SCREENSHOT_FILENAME;
    return cleanPath(outPath)
        .then(()=>tileRec(inPath, outPath, 0))
        .then(() => pageName);
};
