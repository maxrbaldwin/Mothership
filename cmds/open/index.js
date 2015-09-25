var open = require('open');

var openMothership = function() {
  open('http://localhost:2328');
};

module.exports = openMothership;
