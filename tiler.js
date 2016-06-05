'use strict';
var constants = require('./constants.js');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var execSync = require('child_process').execSync

function tile(inPath, outPath) {
    console.log(inPath, outPath);
    return new Promise(function (resolve, reject) {
        rimraf(outPath, {glob: false, disableGlob: true}, function (error) {
            if (error) {
                reject(error);
            } else {
                mkdirp(outPath, function (e) {
                    if (e) {
                        reject(e);
                    } else {
                        try {
                            execSync('convert '+ inPath + ' ' + inPath + '.mpc');
                            execSync('convert '+ inPath + '.mpc' +
                            ' -crop 256x256 -set filename:tile "%[fx:page.x/256+121]_%[fx:page.y/256+73]" +repage +adjoin "' +
                            outPath + '/tile_%[filename:tile].png"');
                            console.log('resolved tile');
                            resolve();
                        } catch (e) {
                            reject(e);
                        }
                    }
                });
            }
        });
    });
};



module.exports.tileImage = function (pageName, filename) {
    const outPath = constants.TILES_PATH + pageName + '/' + filename;
    const inPath = constants.WEBSITES_PATH + pageName + '/images/' + filename;
    return tile(inPath, outPath)
        .then(() => filename)
        .catch(console.log.bind(console, filename));
};

module.exports.tilePage = function (pageName) {
    const outPath = constants.PAGE_TILES_PATH + pageName ;
    const inPath = constants.PAGE_SCREENSHOTS_PATH + pageName + '/all.png';
    return tile(inPath, outPath)
        .then(() => pageName)
        .catch(console.log.bind(console, pageName));
};
