'use strict';
var tilePage = require('./tiler.js').tilePage;
var screenshotPage = require('./screenshoter.js').screenshotPage;

// const PAGE_NAME = 'page548.html';
const PAGE_NAME = 'subnormality.html';

Promise.resolve()
.then(() => screenshotPage(PAGE_NAME))
.then(() => tilePage(PAGE_NAME))
.then((results) => {
    console.log('end?', results);
}, (error) => {
    console.log('error', error);
});
