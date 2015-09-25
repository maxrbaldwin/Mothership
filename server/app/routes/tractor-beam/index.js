var Router = require('express').Router();

Router.post('/', function(req, res){
  res.status(200).send('All Good');
});

module.exports = Router;
