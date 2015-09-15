module.exports = {
  dist: {
    files: [{
      expand: true,
      cwd: "sass",
      src: ["**/*.scss"],
      dest: "public/styles",
      ext: '.css'
    }]
  }
};
