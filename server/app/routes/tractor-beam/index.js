var Router = require('express').Router();
// var msp = require('mothership-promises');

Router.post('/', function(req, res){
  res.status(200).send('All Good');
});

module.exports = Router;
