'use strict';
var argv = require('minimist')(process.argv.slice(2), {string: ['pageNameOut', 'tmpDir'], number: ['tileSize']});
var comicMap = require('./comicMap.js').comicMap;
var deployToS3 = require('./deployToS3.js').deployToS3;

comicMap(argv._[0], argv._[1], {
    pageNameOut: argv.pageNameOut,
    tileSize: argv.tileSize,
    tmpDir: argv.tmpDir
}).then((pathOutPage) => {
    return deployToS3(argv._[1], pathOutPage, (progressAmount, progressTotal) => {
        // console.log('progress', progressAmount, progressTotal);
    });
}).then(() => {
    console.log('done');
})
.catch(console.log.bind(console));