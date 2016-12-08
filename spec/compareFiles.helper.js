/*global expect*/
var fsp = require('fs-promise');

module.exports.compareFiles = function compareFiles(generatedFile, expectedFile) {
    return Promise.all([
        fsp.readFile(generatedFile),
        fsp.readFile(expectedFile)
    ]).then(results => {
    	return expect(results[0]).toEqual(results[1]);
    });
};
