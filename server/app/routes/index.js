var Router = require('express').Router();

Router.use('/tractor-beam', require('./tractor-beam'));

module.exports = Router;
