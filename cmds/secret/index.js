var chalk = require('chalk');

var secret = function(secret) {
  if(typeof secret === 'string') {
    process.env.MothershipClassified = secret;

    console.log(chalk.green('Github webhook secret set! Webhook secure!'));
  } else {
    console.log(chalk.red('Github webhook secret is not a string'));
  }
};

module.exports = secret;
