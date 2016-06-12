/*global phantom*/
var page = require('webpage').create();
var system = require('system');
var fs = require('fs');
var renderLargePage = require('phantomjs-render-large-page').renderLargePage;
var constants = require('./constants.js');

const linksFile = system.args[2] + '/' + constants.LINKS_FILENAME;
const screenshotFile = system.args[2] + '/' + constants.SCREENSHOT_FILENAME;
const url = system.args[1];

page.open(url, function () {
    var metadata = {
        baseUrl: constants.BASE_URL,
        pageName: url.replace(/^.*\//, ''),
    };
    metadata.scripts = page.evaluate(function () {
        return [].slice.call(document.querySelectorAll('script'))
            .map(function (script) {
                return {
                    src: script.src,
                    html: script.outerHTML
                };
            });
    });
    metadata.metas = page.evaluate(function () {
        return [].slice.call(document.querySelectorAll('meta'))
            .map(function (meta) {
                return {
                    html: meta.outerHTML
                };
            });
    });
    metadata.title = page.evaluate(function () {
        var title = document.querySelector('title');
        if (title) {
            return title.innerHTML;
        }
    });
    var rect = page.evaluate(function () {
        var body = document.body,
            html = document.documentElement;

        var height = Math.max( body.scrollHeight, body.offsetHeight,
            html.clientHeight, html.scrollHeight, html.offsetHeight );
        var width = Math.max( body.scrollWidth, body.offsetWidth,
            html.clientWidth, html.scrollWidth, html.offsetWidth );

        return {width: width, height: height};
    });
    metadata.dimensions = {width:rect.width, height:rect.height};

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
                            href: a.href,
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
                            href: a.href,
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
    
    renderLargePage(page, screenshotFile, function (error) {
        phantom.exit();
    });
});



