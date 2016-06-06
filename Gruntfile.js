module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        'http-server': {
            build: {
                root: 'build/site/',
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
                src: ['site/**/*'],
                dest: 'build/'
            },
            tiles: {
                src: ['pagetiles/*'],
                dest: 'build/site/'
            },
            metadata: {
                cwd: 'screenshots/',
                expand: true,
                src: ['metadata.js'],
                dest: 'build/site/'
            }
        }
    });

    grunt.registerTask('build', ['clean:build', 'copy:site', 'copy:tiles', 'copy:metadata']);

    grunt.registerTask('server', ['http-server:build']);
    grunt.registerTask('default', ['build', 'server']);
};