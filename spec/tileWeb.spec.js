/*global jasmine, expect*/
var mkdirp = require('mkdirp-then');
var rimraf = require('rimraf-then');
var expectImagesToBeTheSame = require('./expectImagesToBeTheSame.helper.js').expectImagesToBeTheSame;
var tileWeb = require('../tileWeb.js').tileWeb;
var fileMatcher = require('node-jasmine-file-matcher');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;
var tmpDir = process.env.TMPDIR || '/tmp';
var tempDir = tmpDir + '/tileWeb_spec_' + process.pid;

describe('tileWeb', function () {
    beforeEach(function (done) {
        jasmine.addMatchers(fileMatcher);
        mkdirp(tempDir)
            .then(done)
            .catch(done.fail);
    });
    describe('When used on an page from the internet', function () {
        it('works', function (done) {
            const expectedFolder = tempDir + '/otterprojectsltdcom/indexhtml/';
            tileWeb('http://otterprojectsltd.com/index.html', tempDir)
            .then(() => expect(expectedFolder + 'index.html').toEqualFile('spec/expected/otterprojects/index-tiled.html'))
            .then(() => expect(expectedFolder + 'files/tileWeb.js').toEqualFile('spec/expected/otterprojects/index-tiled-files/tileWeb.js'))
            .then(() => expect(expectedFolder + 'files/openseadragon/openseadragon.js').toEqualFile('spec/expected/otterprojects/index-tiled-files/openseadragon/openseadragon.js'))
            .then(() => expectImagesToBeTheSame(expectedFolder + 'files/pagetiles/tile_0_0_0.png', 'spec/expected/otterprojects/index-tiled-files/pagetiles/tile_0_0_0.png'))
            .then(() => expectImagesToBeTheSame(expectedFolder + 'files/pagetiles/tile_2_1_2.png', 'spec/expected/otterprojects/index-tiled-files/pagetiles/tile_2_1_2.png'))
            .then(done)
            .catch(done.fail);
        });
    });

    afterEach(function (done) {
        rimraf(tempDir)
            .then(done)
            .catch(done.fail);
    });

});


