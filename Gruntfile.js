module.exports = function(grunt) {
    grunt.initConfig({
        uglify: {
            dist: {
                src: 'd.js',
                dest: 'd.min.js'
            }
        },
        jshint: {
            options: {
                jshintrc: true
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            src: {
                src: ['d.js']
            },
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Default task.
    grunt.registerTask('default', ['jshint', 'uglify']);

};