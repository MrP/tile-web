/*global jasmine, expect*/
var mkdirp = require('mkdirp-then');
var rmfr = require('rmfr');
var expectImagesToBeTheSame = require('./expectImagesToBeTheSame.helper.js').expectImagesToBeTheSame;
var comicMap = require('../comicMap.js').comicMap;
var fileMatcher = require('node-jasmine-file-matcher');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;
var tmpDir = process.env.TMPDIR || '/tmp';
var tempDir = tmpDir + '/comicMap_spec_' + process.pid;

describe('comicMap', function () {
    beforeEach(function (done) {
        jasmine.addMatchers(fileMatcher);
        mkdirp(tempDir)
            .then(done)
            .catch(done.fail);
    });
    describe('When used on an page from the internet', function () {
        it('works', function (done) {
            const expectedFolder = tempDir + '/otterprojectsltdcom/indexhtml/';
            comicMap('http://otterprojectsltd.com/index.html', tempDir)
            .then(() => expect(expectedFolder + 'index.html').toEqualFile('spec/expected/otterprojects/index-tiled.html'))
            .then(() => expect(expectedFolder + 'files/comicMap.js').toEqualFile('spec/expected/otterprojects/index-tiled-files/comicMap.js'))
            .then(() => expect(expectedFolder + 'files/openseadragon/openseadragon.js').toEqualFile('spec/expected/otterprojects/index-tiled-files/openseadragon/openseadragon.js'))
            .then(() => expectImagesToBeTheSame(expectedFolder + 'files/pagetiles/tile_0_0_0.png', 'spec/expected/otterprojects/index-tiled-files/pagetiles/tile_0_0_0.png'))
            .then(() => expectImagesToBeTheSame(expectedFolder + 'files/pagetiles/tile_2_1_2.png', 'spec/expected/otterprojects/index-tiled-files/pagetiles/tile_2_1_2.png'))
            .then(done)
            .catch(done.fail);
        });
    });

    afterEach(function (done) {
        rmfr(tempDir)
            .then(done)
            .catch(done.fail);
    });

});


