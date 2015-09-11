var chalk = require('chalk');
var Promise = require('bluebird');
var path = require('path');
// var mss = require('mothership-server');

var PM2 = Promise.promisifyAll(require('pm2'));

var start = function() {
  // start express app with webhook using pm2.
  console.log(chalk.yellow('Mothership preparing to launch...'));

  PM2.connectAsync()
    .then(function(){
      console.log(chalk.green('Mothership connected...'));

      return PM2.startAsync({
        script: path.join(__dirname, '../../server'),
        name: 'Mothership',
        port: 2328
      });
    })
    .then(function(){
      console.log(chalk.green('Deployment Successful! Mothership launched!'));
      process.exit(0);
    })
    .catch(function(err){
      var error;

      if(err.success) {
        error = err.success;
      } else if(err.msg) {
        error = err.msg;
      }
      console.log(chalk.red('Mothership launch error: Success ' + error));
      process.exit(1);
    });
};

start();

module.exports = start;
