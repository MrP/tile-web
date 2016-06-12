var fs = require('fs');


module.exports = function (grunt) {
    function maxLevel() {
        var reZoom = /^tile_(\d+)_/;
        return Math.max.apply(Math, fs.readdirSync('build/'+filesDir()+'/pagetiles')
            .filter(reZoom.test.bind(reZoom))
            .map(file => file.match(reZoom)[1]));
    }
    
    function pageName() {
        if (grunt.option('newPage')) {
            return grunt.option('newPage').replace(/\.html$/i,'');
        } else if (grunt.option('originalPage')) {
            return grunt.option('originalPage').replace(/\.html$/i,'') + '-tiled';
        } else {
            return 'page';
        }
    }
    function originalPage() {
        var orig = grunt.option('originalPage');
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
            }
        },
        clean: {
            build: ['build/'],
            pagetiles: ['pagetiles/'],
            screenshots: ['screenshots/']
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
            },
            tiles: {
                src: ['pagetiles/*'],
                dest: 'build/<%= filesDir %>/'
            }
        },
        execute: {
            webTiler: {
                options: {
                    args: [originalPage()]
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
                        metas: '<%= metadata.metas %>',
                        scripts: '<%= metadata.scripts %>',
                        pageName: pageName(),
                        filesDir: filesDir()
                    }
                },
                files: {
                    'build/<%= pageName %>.html': ['site/index.html.tpl'],
                }
            }
        }
    });

    grunt.registerTask('deal-with-metadata', function () {
        var metadata = require('./screenshots/metadata.json');
        grunt.config.set('metadata', {
            title: metadata.title,
            dimensions: JSON.stringify(metadata.dimensions),
            height: metadata.dimensions.height,
            width: metadata.dimensions.width,
            links: JSON.stringify(metadata.links),
            maxLevel: maxLevel(),
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
            'clean:build', 
            'copy:site', 
            'copy:seadragon', 
            'copy:tiles'
        ]);
        grunt.task.run(['deal-with-metadata', 'template:index']);
    });

    grunt.registerTask('tile', function () {
        grunt.task.run(['clean:screenshots', 'clean:pagetiles', 'execute:webTiler']);
    });
    grunt.registerTask('server', ['http-server:build']);
    grunt.registerTask('default', ['tile', 'build', 'server']);
};
