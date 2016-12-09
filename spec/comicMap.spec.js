/*global jasmine, expect*/
var fs = require('fs');
var rimraf = require('rimraf');
var compareImages = require('./compareImages.helper.js').compareImages;
var comicMap = require('../index.js').comicMap;
var fileMatcher = require('node-jasmine-file-matcher');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;
var tmpDir = process.env.TMPDIR || '/tmp';
var tempDir = tmpDir + '/comicMap_spec_' + process.pid;

describe('comicMap', function () {
    beforeEach(function () {
        jasmine.addMatchers(fileMatcher);
        fs.mkdirSync(tempDir);
    });
    describe('When used on an comic from the internet', function () {
        it('works', function (done) {
            comicMap('http://otterprojectsltd.com/index.html', tempDir)
            .then(() => compareImages(tempDir + '/index-tiled-files/pagetiles/tile_0_0_0.png', 'expected/otterprojects/index-tiled-files/pagetiles/tile_0_0_0.png'))
            .then(() => compareImages(tempDir + '/index-tiled-files/pagetiles/tile_2_1_2.png', 'expected/otterprojects/index-tiled-files/pagetiles/tile_2_1_2.png'))
            .then(() => expect(tempDir + '/index-tiled.html').toEqualFile('spec/expected/otterprojects/index-tiled.html'))
            .then(() => expect(tempDir + '/index-tiled-files/comicMap.js').toEqualFile('spec/expected/otterprojects/index-tiled-files/comicMap.js'))
            .then(() => expect(tempDir + '/index-tiled-files/openseadragon/openseadragon.js').toEqualFile('spec/expected/otterprojects/index-tiled-files/openseadragon/openseadragon.js'))
            .then(done)
            .catch(done.fail);
        });
    });


    afterEach(function () {
        rimraf.sync(tempDir);
    });

});


