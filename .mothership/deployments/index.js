var fs = require('fs');
var path = require('path');

var dbPath = path.join(__dirname, '/schema.json');
var db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

var deployments = {
  set: function(key, value) {
    db[key] = value;

    fs.writeFileSync(dbPath, JSON.stringify(db), 'utf8');
  },
  get: function(key) {
    return db[key];
  }
};

module.exports = deployments;
