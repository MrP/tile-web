'use strict';
var constants = require('./constants.js');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var execSync = require('child_process').execSync;
var sizeOf = require('image-size');
var cleanPath = require('./util.js').cleanPath;

function tile(inPath, outPath, zoom) {
    console.log(inPath, outPath);
    return new Promise(function (resolve, reject) {
        try {
            execSync('convert '+ inPath +
            ' -crop 256x256 -set filename:tile "'+zoom+'_%[fx:page.x/256]_%[fx:page.y/256]" +repage +adjoin "' +
            outPath + '/tile_%[filename:tile].png"');
            console.log('resolved tile');
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
    console.log(inPath, outPath, zoom);
    var inPathMpc = inPath + '.mpc';
    execSync('convert ' + inPath + ' ' + inPathMpc);
    return tile(inPathMpc, outPath, zoom)
        .then(function () {
            if (!imageSmallerThanTile(inPath)) {
                var newZoom = zoom + 1;
                var newInPath = inPath + '-'+ newZoom + '.png';
                execSync('convert ' + inPathMpc + ' -resize 50% '+ newInPath);
                return tileRec(newInPath, outPath, newZoom);
            }
        });
}

module.exports.tilePage = function (pageName) {
    const outPath = constants.PAGE_TILES_PATH + pageName ;
    const inPath = constants.PAGE_SCREENSHOTS_PATH + pageName + '/all.png';
    return cleanPath(outPath)
        .then(()=>tileRec(inPath, outPath, 0))
        .then(() => pageName)
        .catch(console.log.bind(console, pageName));
};
