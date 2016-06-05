/*global $*/
var mkdirp = require('mkdirp');
var constants = require('./constants.js');
var phantom = require('phantom');
var fs = require('fs');

module.exports.linkExtractor = function (pageName) {
    const outPath = constants.PAGE_SCREENSHOTS_PATH + pageName;
    return new Promise(function (resolve, reject) {
        mkdirp(outPath, function (e) {
            if (e) {
                reject(e);
            } else {
                var sitepage = null;
                var phInstance = null;
                phantom.create().then(instance => {
                    phInstance = instance;
                    instance.createPage()
                    .then(page => {
                        sitepage = page;
                        page.open(constants.BASE_URL + pageName);
                        
                        page.includeJs(
                            'http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js',
                            function () {
                                console.log('wwat up');
                                var links = page.evaluate(function () {
                                    var linkInfo = [];
                                    $('a img').each(function () {
                                        var $img = $(this);
                                        var $a = $img.closest('a');
                                        linkInfo.push({
                                            href: $a.attr('href'),
                                            onclick: $a.attr('onclick'),
                                            top: $img.offset().top,
                                            left: $img.offset().left,
                                            outerWidth: $img.outerWidth(),
                                            outerHeight: $img.outerHeight()
                                        });
                                    });
                                    return linkInfo;
                                });
                    
                                var linksjson = JSON.stringify(links);
                                console.log('oi', linksjson);
                                // phantom.exit();
                                fs.writeFileSync(outPath + '/links.json', linksjson);
                                // jsonfile.writeFile('./' + system.args[2] + 'links.shit', links, function (err) {
                                //     console.error(err);
                                // });
                            });
                        instance.exit();
                    })
                })
                .catch(error => {
                    console.log(error);
                    phInstance.exit();
                });
            }
        });
    });
};