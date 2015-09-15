// @TODO: need bable

module.exports = function(grunt) {
  var options = {
    config: {
      src: './grunt/*.js'
    },
    pkg: grunt.file.readJSON('package.json')
  };

  var config = require('load-grunt-config')(grunt, options);

  grunt.initConfig(config);

  grunt.registerTask('default', ['watch']);
};
