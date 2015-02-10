module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    coffee: {
      api: {
        files: [{
          expand: true,
          cwd: "coffee/",
          src: ["**/*.coffee"],
          dest: "js/",
          ext: ".js"
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-coffee');
  // Default task(s).
  grunt.registerTask('default', ['coffee']);
};