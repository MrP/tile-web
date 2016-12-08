/*global jasmine*/
var fs = require('fs');
var execSync = require('child_process').execSync;
var rimraf = require('rimraf');
var compareImages = require('./compareImages.helper.js').compareImages;
var compareFiles = require('./compareFiles.helper.js').compareFiles;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;
var tmpDir = process.env.TMPDIR || '/tmp';
var tempDir = tmpDir + '/comic-map_spec_' + process.pid;

describe('comic-map cli', function () {
    beforeEach(function () {
        fs.mkdirSync(tempDir);
    });
    describe('When used on an web page from the internet', function () {
        it('works', function (done) {
            execSync('node bin/comic-map http://otterprojectsltd.com/index.html '+ tempDir);
            compareImages(tempDir + '/index-tiled-files/pagetiles/tile_0_0_0.png', 'expected/otterprojects/index-tiled-files/pagetiles/tile_0_0_0.png')
            .then(() => compareImages(tempDir + '/index-tiled-files/pagetiles/tile_2_1_2.png', 'expected/otterprojects/index-tiled-files/pagetiles/tile_2_1_2.png'))
            .then(() => compareFiles(tempDir + '/index-tiled.html', 'spec/expected/otterprojects/index-tiled.html'))
            .then(() => compareFiles(tempDir + '/index-tiled-files/comicMap.js', 'spec/expected/otterprojects/index-tiled-files/comicMap.js'))
            .then(() => compareFiles(tempDir + '/index-tiled-files/openseadragon/openseadragon.js', 'spec/expected/otterprojects/index-tiled-files/openseadragon/openseadragon.js'))
            .then(done)
            .catch(done.fail);
        });
    });


    afterEach(function () {
        rimraf.sync(tempDir);
    });

});


