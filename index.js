'use strict';
var tilePage = require('./tiler.js').tilePage;
var screenshotPage = require('./screenshoter.js').screenshotPage;
var constants = require('./constants.js');

Promise.resolve()
.then(() => screenshotPage(constants.PAGE_NAME))
.then(() => tilePage(constants.PAGE_NAME))
.catch(console.log.bind(console, constants.PAGE_NAME));

