var chalk = require('chalk');
var Promise = require('bluebird');

var app = require('./app');

var server = require('http').createServer();

var startApp = new Promise(function(resolve){
  resolve();
});

var createApplication = function() {
  server.on('request', app);
};

var startServer = function() {
  var PORT = 2328;

  server.listen(PORT, function(){
    console.log(chalk.green('Mothership launched successfully on port ' + chalk.blue(PORT)));
  });
};

startApp.then(createApplication).then(startServer).then().catch(function(err){
  console.log(chalk.red(err.stack));
  process.kill(1);
});
