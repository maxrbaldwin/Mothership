#!/usr/bin/env node
var cmds = require('./cmds');
var cmdUtils = require('./cmds/utils');

var args = cmdUtils.getArguments(process.argv);
var command = args[0];
var parameter = args[1];

if(command && cmds[command] && parameter) {
  cmds[command](parameter);
} else if(command && cmds[command] && !parameter) {
  cmds[command]();
} else {
  cmds.help();
}
