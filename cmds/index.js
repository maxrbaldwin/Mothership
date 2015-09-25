var launch = require('./launch');
var secret = require('./secret');
var open = require('./open');
var profile = require('./profile');
var stop = require('./stop');
var help = require('./help');

var commands = {
  launch: launch,
  secret: secret,
  open: open,
  help: help
};

module.exports = commands;
