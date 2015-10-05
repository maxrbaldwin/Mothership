var Datastore = require('nedb');
var path = require('path');

var db = new Datastore({
  filename: path.join(__dirname, '/env.db'),
  autoload: true
});

module.exports = db;
