'use strict';
var fsp = require('fs-extra');
var rimraf = require('rimraf-then');
var path = require('path');
var mkdirp = require('mkdirp-then');
var tile = require('image-tiler').tile;
var execFile = require('child-process-promise').execFile;
var template = require('lodash.template');
var cprPromise = require('cpr-promise');
var url = require('url');
var moduleRoot = require('module-root');

const TILES_DIR = 'pagetiles';

function copySite(pathFiles) {
    var dragonPath = path.join(moduleRoot('openseadragon'), 'build');
    var siteFilesPath = path.join(__dirname, 'site/files');

    return Promise.all([
        cprPromise(dragonPath, pathFiles, {
            deleteFirst: false,
            overwrite: true,
            confirm: true,
            filter: /\.map$/
        }),
        cprPromise(siteFilesPath, pathFiles, {
            deleteFirst: false,
            overwrite: true,
            confirm: true
        })
    ]).catch(console.log);
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
    var indexTemplatePath = path.join(__dirname, 'site/index.html.tpl');
    return fsp.readFile(indexTemplatePath)
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

module.exports.tileWeb = (urlIn, pathOut, options) => {
    options = options || {};
    var urlObj = url.parse(urlIn);
    if (urlObj.pathname === '' || urlObj.pathname === '/') {
        urlObj.pathname = '/index.html';
    }
    if (!pathOut || pathOut === '') {
        pathOut = '.';
    }
    var pathOutUrl = urlObj.hostname + urlObj.pathname;
    pathOutUrl = pathOutUrl.replace(/\./g, '');
    pathOut = path.join(pathOut, pathOutUrl);
    var pageNameOut = 'index.html';
    var tileSize = options.tileSize || 256;
    var tmpDir = options.tmpDir || process.env.TMPDIR || '/tmp';
    var pathTmpScreenshot = path.join(tmpDir, 'tile-web_screenshot' + process.pid);
    var pathTmpScreenshotFile =  path.join(pathTmpScreenshot, 'all.png');
    var pathTmpMetadataFile = path.join(pathTmpScreenshot, 'metadata.json');
    var filesDir = 'files';
    var pathOutFiles = path.join(pathOut, filesDir);
    var pathOutTiles = path.join(pathOutFiles, TILES_DIR);
    var pathOutPage = path.join(pathOut, pageNameOut);
    var phantomJsPrebuiltExe = path.resolve(moduleRoot('phantomjs-prebuilt'), 'bin', 'phantomjs');
    var phantomJsScreenshotScript = path.join(__dirname, 'phantomjsScreenshot.js');

    // Does away with the irritating warning about the fontconfig
    process.env.LC_ALL = 'C';

    return rimraf(pathTmpScreenshot)
        .then(() => mkdirp(pathTmpScreenshot))
        .then(() => mkdirp(pathOut))
        .then(() => rimraf(pathOutFiles))
        .then(() => rimraf(pathOutPage))
        .then(() => execFile(phantomJsPrebuiltExe, [phantomJsScreenshotScript, urlIn, pathTmpScreenshotFile, pathTmpMetadataFile]))
        .then(() => tile(pathTmpScreenshotFile, pathOutTiles, 'tile_{z}_{x}_{y}.png', {invertZoom: false}))
        .then(() => maxLevel(pathOutTiles))
        .then((maxLevel) => dealWithMetadata(pathTmpMetadataFile, maxLevel, tileSize))
        .then((metadata) => produceTemplate(metadata, pathOutPage, filesDir))
        .then(() => copySite(pathOutFiles))
        .then(() => pathOutUrl)
        .catch(console.log.bind(console, urlIn, pathOut, options));
};