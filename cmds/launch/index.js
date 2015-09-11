// @TODO: Move promises into a "promise" directory.
// @TODO: Remove modules directory and unistall mothership-promises
// @TODO: Use PM2 to find out if mothership was already launched

var chalk = require('chalk');
var Promise = require('bluebird');
var path = require('path');
var fs = require('fs');

var PM2 = Promise.promisifyAll(require('pm2'));
var Prompt = Promise.promisifyAll(require('prompt'));

var start = function() {
  // start express app with webhook using pm2.
  console.log(chalk.yellow('Mothership preparing to launch...'));

  if(fs.existsSync(path.join(__dirname, '../../.env'))) {
    require('dotenv').load();
  }

  // Connect to PM2
  PM2.connectAsync()
    .then(function(){
      console.log(chalk.green('Mothership connected...'));

      // If there is no Github secret in the env variables. Ask if they want to add them. Else just resolve
      if(!process.env.MothershipClassified) {
        Prompt.start();
        console.log('Master, if you have a Github webhook secret you would like you start your Mothership with, please enter it below. If not, just press "Enter." You can set this value later.');
        return Prompt.getAsync(['secret']);
      } else {
        return Promise.resolve();
      }

    })
    .then(function(answer){

      // if there is an answer from the question about what is your MothershipClassified, set that value to MothershipClassified in process variables.
      if(answer.secret) {
        process.env.MothershipClassified = answer.secret;
      }

      return PM2.startAsync({
        script: path.join(__dirname, '../../server'),
        name: 'Mothership',
        port: 2328,
        watch: true
      });
    })
    .then(function(){
      console.log(chalk.green('Deployment Successful! Mothership launched on port ' + chalk.cyan(2328) + '!'));
      process.exit(0);
    })
    .catch(function(err){
      var error;

      if(err.success) {
        error = err.success;
      } else if(err.msg) {
        error = err.msg;
      } else {
        error = 'There is an undefined error';
      }
      console.log(chalk.red('Mothership launch error: ' + error));
      process.exit(1);
    });
};

module.exports = start;
