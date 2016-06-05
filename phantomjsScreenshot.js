/*global phantom, $*/
var page = require('webpage').create();
var system = require('system');
var fs = require('fs');
var constants = require('./constants.js');

page.onConsoleMessage = function(msg) {
  console.log(msg);
};

const linfsFile = system.args[2] + '/' + constants.LINKS_FILENAME;
const screenshotFile = system.args[2] + '/' + constants.SCREENSHOT_FILENAME;
const url = system.args[1];

console.log('opening', url);
page.open(url, function () {
    console.log('opened', url);
    // page.render(screenshotFile, {quality: '100'});
    page.render(screenshotFile);
    console.log('rendered', url, 'to', screenshotFile);
    page.includeJs(
        'http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js',
        function () {
            console.log('loaded jquery');
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
            console.log('links', linksjson);
            fs.write(linfsFile, linksjson, 'w');
            console.log('wrote links to', linfsFile);
            phantom.exit();
        });
});