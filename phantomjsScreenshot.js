/*global phantom, $*/
var page = require('webpage').create();
var system = require('system');
var fs = require('fs');
var constants = require('./constants.js');
const SILLY_LIMIT = 30000;
// var execSync = require('child_process').execSync;

const linksFile = system.args[2] + '/' + constants.LINKS_FILENAME;
const screenshotFile = system.args[2] + '/' + constants.SCREENSHOT_FILENAME;
const url = system.args[1];

page.open(url, function () {
    var metadata = {};
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
    metadata.width = rect.width;
    metadata.height = rect.height;
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
            page.render(name);
            files.push(name);
        }
        name = screenshotFile + '_' + i +'.png';
        filesAcross.push(name);
    }

    metadata.links = page.evaluate(function () {
        function offset(elem) {
            var rect = elem.getBoundingClientRect();
            if ( rect.width || rect.height ) {
                return {
                    top: rect.top + window.pageYOffset - document.documentElement.clientTop,
                    left: rect.left + window.pageXOffset - document.documentElement.clientLeft
                };
            }
            return rect;
        }

        var rects = [];
        [].slice.call(document.querySelectorAll('*[onclick]'))
            .filter(function (el) {
                return el.tagName.toUpperCase() !== 'A';
            })
            .forEach(function (element) {
                if (element.offsetWidth && element.offsetHeight) {
                    rects.push({
                        type: 'onclick',
                        tagName: element.tagName,
                        onclick: element.getAttribute('onclick'),
                        top: offset(element).top,
                        left: offset(element).left,
                        outerWidth: element.offsetWidth,
                        outerHeight: element.offsetHeight
                    });
                }
            });

        [].slice.call(document.querySelectorAll('a'))
            .forEach(function(a) {
                var imgs = a.querySelectorAll('img');
                if (imgs.length === 0) {
                    if (a.offsetWidth && a.offsetHeight) {
                        rects.push({
                            type: 'a',
                            tagName: a.tagName,
                            href: a.getAttribute('href'),
                            onclick: a.getAttribute('onclick'),
                            top: offset(a).top,
                            left: offset(a).left,
                            outerWidth: a.offsetWidth,
                            outerHeight: a.offsetHeight
                        });
                    }
                } else {
                    [].slice.call(imgs).forEach(function (img) {
                        rects.push({
                            type: 'a img',
                            tagName: img.tagName,
                            href: a.getAttribute('href'),
                            onclick: a.getAttribute('onclick'),
                            top: offset(img).top,
                            left: offset(img).left,
                            outerWidth: img.offsetWidth,
                            outerHeight: img.offsetHeight
                        });
                    });
                }
            });
        return rects;

    });

    var metadataJson = JSON.stringify(metadata);
    fs.write(linksFile, metadataJson, 'w');
    phantom.exit();
});



