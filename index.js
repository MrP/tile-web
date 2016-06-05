'use strict';
// var scrapePage = require('./scraper.js').scrapePage;
// var tileImage = require('./tiler.js').tileImage;
var tilePage = require('./tiler.js').tilePage;
var screenshotPage = require('./screenshoter.js').screenshotPage;

// const PAGE_NAME = 'page548.html';
const PAGE_NAME = 'subnormality.html';


screenshotPage(PAGE_NAME)
// .then(tilePage)
.then((results) => {
    console.log('end?', results);
}, (error) => {
    console.log('error', error);
});


// tilePage(PAGE_NAME)
//     .then((results) => {
//         console.log('end?', results);
//     }, (error) => {
//         console.log('error', error);
//     });