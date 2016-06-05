'use strict';
var scrapePage = require('./scraper.js').scrapePage;
var tileImage = require('./tiler.js').tileImage;
var tilePage = require('./tiler.js').tilePage;
var screenshotPage = require('./screenshoter.js').screenshotPage;

// const PAGE_NAME = 'page548.html';
const PAGE_NAME = 'subnormality.html';

// scrapePage(PAGE_NAME).then(function (result) {
//     return result.assets.filter(function (asset) {
//         return /^images\//.test(asset.filename);
//     }).map(function (image) {
//         return image.filename.replace(/^images\//, '');
//     }).map(function (imageFilename) {
//         return tileImage(PAGE_NAME, imageFilename);
//     });
// }).then(function (tilePromisesArray) {
//     return Promise.all(tilePromisesArray);
// }).then((results) => {
//     console.log('end?', results);
// }, (error) => {
//     console.log('error', error);
// });



screenshotPage(PAGE_NAME)
.then(tilePage)
.then((results) => {
    console.log('end?', results);
}, (error) => {
    console.log('error', error);
});