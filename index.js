'use strict';
var fsp = require('fs-promise');
var rmfr = require('rmfr');
var mkdirp = require('mkdirp-then');
var tile = require('image-tiler').tile;
var exec = require('child-process-promise').exec;
var template = require('lodash.template');
var cprPromise = require('cpr-promise');
var url = require('url');

const TILES_DIR = 'pagetiles/';

function copySite(path) {
    return Promise.all([
        cprPromise('node_modules/openseadragon/build/', path, {
            deleteFirst: false,
            overwrite: true,
            confirm: true,
            filter: /\.map$/
        }),
        cprPromise('site/files', path, {
            deleteFirst: false,
            overwrite: true,
            confirm: true
        })
    ]);
}

function maxLevel(pathOutTiles) {
    var reZoom = /^tile_(\d+)_/;
    return fsp.readdir(pathOutTiles)
    .then(paths => {
        return Math.max.apply(Math, paths
            .filter(reZoom.test.bind(reZoom))
            .map(file => file.match(reZoom)[1]));
    });
}


function produceTemplate(metadata, pathOutPage, filesDir) {
    return fsp.readFile('./site/index.html.tpl')
    .then(template)
    .then(compiledTemplate => {
        return compiledTemplate({
            title: metadata.title,
            dimensions: metadata.dimensions,
            links: metadata.links,
            maxLevel: metadata.maxLevel,
            tileSize: metadata.tileSize,
            metas: metadata.metas,
            scripts: metadata.scripts,
            filesDir: filesDir,
            tilesDir: TILES_DIR
        });
    })
    .then(html => fsp.writeFile(pathOutPage, html));
}

function dealWithMetadata(pathTmpMetadataFile, maxLevel, tileSize) {
    var metadata = require(pathTmpMetadataFile);
    return {
        title: metadata.title,
        dimensions: JSON.stringify(metadata.dimensions),
        height: metadata.dimensions.height,
        width: metadata.dimensions.width,
        links: JSON.stringify(metadata.links),
        maxLevel: maxLevel,
        tileSize: tileSize,
        metas: metadata.metas.map(function (m) {
            return m.html;
        }).join('\n'),
        scripts: metadata.scripts.map(function (s) {
            return s.src ? '<script src="' + s.src.replace(/^https?:/, '') + '"></script>' : s.html;
        }).join('\n'),
    };
}

module.exports.comicMap = (urlIn, pathOut, options) => {
    options = options || {};
    var urlObj = url.parse(urlIn);
    pathOut += '/' + urlObj.hostname + urlObj.pathname;
    // var pageNameOut = options.pageNameOut || urlIn.replace(/^.*\//, '').replace(/(\.html?)$/i,'-tiled$1');
    var pageNameOut = 'index.html';
    var tileSize = options.tileSize || 256;
    var tmpDir = options.tmpDir || process.env.TMPDIR || '/tmp';
    var pathTmpScreenshot = tmpDir + '/comic-map_screenshot' + process.pid + '/';
    var pathTmpScreenshotFile =  pathTmpScreenshot + 'all.png';
    var pathTmpMetadataFile = pathTmpScreenshot + 'metadata.json';
    // var filesDir = pageNameOut.replace(/\.html?$/i,'') + '-files';
    var filesDir = 'files';
    var pathOutFiles = pathOut + '/' + filesDir;
    var pathOutTiles = pathOutFiles + '/' + TILES_DIR;
    var pathOutPage = pathOut + '/' + pageNameOut;

    // Does away with the irritating warning about the fontconfig
    process.env.LC_ALL = 'C';

    return rmfr(pathTmpScreenshot)
    .then(() => mkdirp(pathTmpScreenshot))
    .then(() => mkdirp(pathOut))
    .then(() => rmfr(pathOutFiles))
    .then(() => rmfr(pathOutPage))
    .then(() => exec('node_modules/phantomjs-prebuilt/bin/phantomjs phantomjsScreenshot.js ' + urlIn + ' ' + pathTmpScreenshotFile + ' ' + pathTmpMetadataFile))
    .then(() => tile(pathTmpScreenshotFile, pathOutTiles, 'tile_{z}_{x}_{y}.png', {zeroZoomOut: false}))
    .then(() => maxLevel(pathOutTiles))
    .then((maxLevel) => dealWithMetadata(pathTmpMetadataFile, maxLevel, tileSize))
    .then((metadata) => produceTemplate(metadata, pathOutPage, filesDir))
    .then(() => copySite(pathOutFiles))
    .then(() => rmfr(pathTmpScreenshot))
    .catch(console.log.bind(console, urlIn, pathOut, options));
};