/*global jasmine, expect*/
var mkdirp = require('mkdirp-then');
var execSync = require('child_process').execSync;
var rimraf = require('rimraf-then');
var fileMatcher = require('node-jasmine-file-matcher');
var expectImagesToBeTheSame = require('./expectImagesToBeTheSame.helper.js').expectImagesToBeTheSame;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;
var tmpDir = process.env.TMPDIR || '/tmp';
var tempDir = tmpDir + '/tile-web_spec_' + process.pid;

describe('tile-web cli', function () {
    beforeEach(function (done) {
        jasmine.addMatchers(fileMatcher);
        mkdirp(tempDir)
            .then(done)
            .catch(done.fail);
    });
    describe('When used on an web page from the internet', function () {
        it('works', function (done) {
            const expectedFolder = tempDir + '/otterprojectsltdcom/indexhtml/';
            execSync('node bin/tile-web http://otterprojectsltd.com/index.html '+ tempDir);
            expectImagesToBeTheSame(expectedFolder + 'files/pagetiles/tile_0_0_0.png', 'spec/expected/otterprojects/index-tiled-files/pagetiles/tile_0_0_0.png')
            .then(() => expectImagesToBeTheSame(expectedFolder + 'files/pagetiles/tile_2_1_2.png', 'spec/expected/otterprojects/index-tiled-files/pagetiles/tile_2_1_2.png'))
            .then(() => expect(expectedFolder + 'index.html').toEqualFile('spec/expected/otterprojects/index-tiled.html'))
            .then(() => expect(expectedFolder + 'files/tileWeb.js').toEqualFile('spec/expected/otterprojects/index-tiled-files/tileWeb.js'))
            .then(() => expect(expectedFolder + 'files/openseadragon/openseadragon.js').toEqualFile('spec/expected/otterprojects/index-tiled-files/openseadragon/openseadragon.js'))
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


