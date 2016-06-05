var scraper = require('website-scraper');
var rimraf = require('rimraf');
var constants = require('./constants.js');

module.exports.scrapePage = function scrape(page) {
    return new Promise(function (resolve, reject) {
        rimraf(constants.WEBSITES_PATH + page, {glob: false, disableGlob: true}, function(error) {
            if (error) {
                reject(error);
            } else {
                var options = {
                  urls: [constants.BASE_URL + page],
                  directory: constants.WEBSITES_PATH + page,
                };
                
                scraper.scrape(options).then(function (result) {
                    resolve(result[0]);
                }).catch(function (error) {
                    console.log('error scraping', page, error);
                    reject(error);
                });    
            }
        });
    });
};