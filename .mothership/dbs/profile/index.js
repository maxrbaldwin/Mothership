var Datastore = require('nedb');
var path = require('path');
var Promise = require('bluebird');

var db = new Datastore({
  filename: path.join(__dirname, '/profile.db'),
  autoload: true
});

module.exports = Promise.promisifyAll(db);
