module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        'http-server': {
            build: {
                root: 'build/',
                port: process.env.PORT || '8080',
                host: process.env.IP || '0.0.0.0'
            }
        }
    });

    grunt.registerTask('serve', ['http-server:build']);
    grunt.registerTask('default', ['serve']);
};
