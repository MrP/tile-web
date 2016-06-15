'use strict';
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');

module.exports.cleanPath = function(outPath) {
    return new Promise(function (resolve, reject) {
        rimraf(outPath, {glob: false, disableGlob: true}, function (error) {
            if (error) {
                reject(error);
            } else {
                mkdirp(outPath, function (e) {
                    if (e) {
                        reject(e);
                    } else {
                        resolve();
                    }
                });
            }
        });
    });
};

module.exports.mkdirpp = function(outPath) {
    return new Promise(function (resolve, reject) {
        mkdirp(outPath, function (e) {
            if (e) {
                reject(e);
            } else {
                resolve();
            }
        });
    });
};
