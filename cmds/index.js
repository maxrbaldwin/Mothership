var launch = require('./launch');
var secret = require('./secret');

var commands = {
  launch: launch,
  secret: secret,
  help: function() {
    console.log('help!');
  }
};

module.exports = commands;
