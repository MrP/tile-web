/*global phantom, $*/
var page = require('webpage').create();
var system = require('system');
var fs = require('fs');

page.onConsoleMessage = function(msg) {
  console.log(msg);
};

page.open(system.args[1], function () {
    page.render(system.args[2] + '/all.png');
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
            console.log('oi', linksjson, system.args[2]);
            fs.write(system.args[2] + '/links.json', linksjson, 'w');
            phantom.exit();
        });
});