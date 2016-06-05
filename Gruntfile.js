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
            build: ['build/']
        },
        copy: {
            site: {
                src: ['site/**/*'],
                dest: 'build/'
            },
            tiles: {
                src: ['pagetiles/**/*'],
                dest: 'build/site/'
            }
        }
    });

    grunt.registerTask('build', ['clean:build', 'copy:site', 'copy:tiles']);

    grunt.registerTask('server', ['http-server:build']);
    grunt.registerTask('default', ['build', 'server']);
};