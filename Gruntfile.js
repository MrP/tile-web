var fs = require('fs');
var constants = require('./constants.js');


module.exports = function (grunt) {
    function maxLevel() {
        var reZoom = /^tile_(\d+)_/;
        return Math.max.apply(Math, fs.readdirSync('build/'+filesDir()+'/' + constants.TILES_DIR)
            .filter(reZoom.test.bind(reZoom))
            .map(file => file.match(reZoom)[1]));
    }

    function pageName() {
        if (grunt.option('newPage')) {
            return grunt.option('newPage').replace(/\.html$/i,'');
        } else if (grunt.option('page')) {
            return grunt.option('page').replace(/\.html$/i,'') + '-tiled';
        } else {
            grunt.fail.fatal('Error: missing --page=pageName.html');
        }
    }
    function page() {
        var orig = grunt.option('page');
        if (!/\.html$/i.test(orig)) {
            orig += '.html';
        }
        return orig;
    }
    function filesDir() {
        return pageName() + '-files';
    }

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pageName: pageName(),
        filesDir: filesDir(),
        'http-server': {
            build: {
                root: 'build/',
                port: process.env.PORT || '8080',
                host: process.env.IP || '0.0.0.0'
            },
            bg: {
                root: 'build/',
                port: process.env.PORT || '8080',
                host: process.env.IP || '0.0.0.0',
                runInBackground: true
            }
        },
        clean: {
            build: ['build/'],
            'build-page': ['build/<%= filesDir %>/', 'build/<%= pageName %>.html']
        },
        copy: {
            site: {
                cwd: 'site/files',
                expand: true,
                src: ['*', '!image.json.tpl'],
                dest: 'build/<%= filesDir %>/'
            },
            seadragon: {
                cwd: 'node_modules/openseadragon/build/',
                expand: true,
                src: ['openseadragon/**/*', '!**/*.map'],
                dest: 'build/<%= filesDir %>/'
            }
        },
        execute: {
            webTiler: {
                options: {
                    args: [page(), 'build/<%= filesDir %>/' + constants.TILES_DIR]
                },
                src: ['webTiler.js']
            }
        },
        template: {
            index: {
                options: {
                    data: {
                        title: '<%= metadata.title %>',
                        dimensions: '<%= metadata.dimensions %>',
                        width: '<%= metadata.width %>',
                        height: '<%= metadata.height %>',
                        links: '<%= metadata.links %>',
                        maxLevel: '<%= metadata.maxLevel %>',
                        tileSize: '<%= metadata.tileSize %>',
                        metas: '<%= metadata.metas %>',
                        scripts: '<%= metadata.scripts %>',
                        pageName: pageName(),
                        filesDir: filesDir(),
                        tilesDir: constants.TILES_DIR
                    }
                },
                files: {
                    'build/<%= pageName %>.html': ['site/index.html.tpl'],
                }
            }
        },
        watch: {
            site: {
                files: ['site/files/**/*'],
                tasks: ['copy:site'],
                options: {
                //   spawn: false,
                },
              },
        }
    });

    grunt.registerTask('deal-with-metadata', function () {
        var metadata = require('./build/' + filesDir() + '/' + constants.TILES_DIR + constants.LINKS_FILENAME);
        grunt.config.set('metadata', {
            title: metadata.title,
            dimensions: JSON.stringify(metadata.dimensions),
            height: metadata.dimensions.height,
            width: metadata.dimensions.width,
            links: JSON.stringify(metadata.links),
            maxLevel: maxLevel(),
            tileSize: 256,
            metas: metadata.metas.map(function (m) {
                return m.html;
            }).join('\n'),
            scripts: metadata.scripts.map(function (s) {
                return s.src ? '<script src="' + s.src.replace(/^https?:/, '') + '"></script>' : s.html;
            }).join('\n'),
        });
    });
    grunt.registerTask('build', function () {
        grunt.task.run([
            // 'clean:build',
            'clean:build-page',
            'copy:site',
            'copy:seadragon',
            // 'copy:tiles'
        ]);
    });

    grunt.registerTask('tile', function () {
        grunt.task.run(['execute:webTiler', 'deal-with-metadata', 'template:index']);
    });
    grunt.registerTask('server', ['http-server:build']);
    grunt.registerTask('server-bg', ['http-server:bg']);
    grunt.registerTask('default', ['build', 'tile', 'server']);
    grunt.registerTask('sitewatch', ['http-server:bg', 'watch:site']);
};
