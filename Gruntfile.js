module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['*.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['jshint']);

};
