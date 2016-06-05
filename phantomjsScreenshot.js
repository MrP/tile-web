/*global phantom, $*/
var page = require('webpage').create();
var system = require('system');
var fs = require('fs');
var constants = require('./constants.js');
const SILLY_LIMIT = 30000;
// var execSync = require('child_process').execSync;

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
    var rect = page.evaluate(function () {
        var body = document.body,
            html = document.documentElement;

        var height = Math.max( body.scrollHeight, body.offsetHeight,
            html.clientHeight, html.scrollHeight, html.offsetHeight );
        var width = Math.max( body.scrollWidth, body.offsetWidth,
            html.clientWidth, html.scrollWidth, html.offsetWidth );

        return {width: width, height: height};
    });
    console.log('The page is very big', rect.width, rect.height);
    var filesAcross = [];
    var i,j, name;
    for (i=0; i < rect.width; i += SILLY_LIMIT) {
        var files = [];
        for (j=0; j < rect.height; j += SILLY_LIMIT) {
            page.clipRect = {
                left: i,
                top: j,
                width: Math.min(SILLY_LIMIT, rect.width - i),
                height: Math.min(SILLY_LIMIT, rect.height - j)
            };
            name = screenshotFile + '_' + i + '_' + j + '.png';
            console.log('rendering ', name, page.clipRect.top, page.clipRect.left, page.clipRect.width, page.clipRect.height);
            page.render(name);
            files.push(name);
        }
        name = screenshotFile + '_' + i +'.png';
        console.log('converting into ', name);
        filesAcross.push(name);
    }

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