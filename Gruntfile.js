module.exports = function (grunt) {
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

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pageName: pageName(),
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
                src: ['*'],
                dest: 'build/files-<%= pageName %>/'
            },
            tiles: {
                src: ['pagetiles/*'],
                dest: 'build/files-<%= pageName %>/'
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
                        links: '<%= metadata.links %>',
                        metas: '<%= metadata.metas %>',
                        scripts: '<%= metadata.scripts %>',
                        pageName: pageName(),
                        filesDir: 'files-' + pageName() 
                    }
                },
                files: {
                    'build/<%= pageName %>.html': ['site/index.html.tpl'],
                }
            }
        }
    });
    
    grunt.registerTask('build', ['clean:build', 'copy:site',
        'copy:tiles', 'template:index'
    ]);

    grunt.registerTask('tile', function () {
        grunt.task.run(['clean:screenshots', 'clean:pagetiles', 'execute:webTiler']);
        var metadata = require('./screenshots/metadata.json');
        grunt.config.set('metadata', {
            title: metadata.title,
            dimensions: JSON.stringify(metadata.dimensions),
            links: JSON.stringify(metadata.links),
            metas: metadata.metas.map(function (m) {
                    return m.html
            }).join('\n'),
            scripts: metadata.scripts.map(function (s) {
                return s.src ? '<script src="' + s.src + '"></script>' : s.html
            }).join('\n'),
        });
    });
    grunt.registerTask('server', ['http-server:build']);
    grunt.registerTask('default', ['tile', 'build', 'server']);
};
