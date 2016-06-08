'use strict';
var tilePage = require('./tiler.js').tilePage;
var screenshotPage = require('./screenshoter.js').screenshotPage;
var constants = require('./constants.js');

var pageName = process.argv[2] || constants.PAGE_NAME;
Promise.resolve()
.then(() => screenshotPage(pageName))
// .then(() => tilePage(pageName))
.catch(console.log.bind(console, pageName));

