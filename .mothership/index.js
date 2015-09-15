var deployments = require('./deployments');
var profile = require('./profile');

var access = {
  profile: profile,
  deployments: deployments
};

module.exports = access;
