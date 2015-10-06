var Router = require('express').Router();
var Promise = require('bluebird');
var path = require('path');

var Git = Promise.promisifyAll(require('simple-git')());
var FS = Promise.promisifyAll(require('fs'));
var PM2 = Promise.promisifyAll(require('pm2'));

var exec = Promise.promisifyAll(require('child_process'));

var cache = require('./cache');

var getDependencies = function(dependencies) {
  var deps = '';

  Object.keys(dependencies).forEach(function(el) {
    deps = deps + ' ' + el;
  });

  return deps;
};

var nextPort = function() {
  cache.next = parseInt(cache.next) + 1;
  return cache.next;
}

Router.post('/', function(req, res) {
  var requestId = req.body.repository.pushed_at;
  var requestName = req.body.repository.name;
  var cloneURL = req.body.repository.clone_url;

  var baseDir = path.join(__dirname, '/ms-apps/');
  var localPath = baseDir + requestName;

  cache.deployments[requestName] = {};

  //@TODO: Save deployment record here. Use model method

  // Connect to PM2
  PM2.connectAsync()
    .then(function(list) {
      // List all running apps
      //@TODO: Flag deployment started

      return PM2.listAsync();
    })
    .then(function(list) {
      var sameApp = [];

      // Look through all deployed apps and return any app name with same localPath
      list.forEach(function(el, i) {
        if (list[i].name === requestName) {
          sameApp.push(el);
        }
      });

      // If an app was found return an open
      if (sameApp.length) {
        //@TODO: Flag merge

        return Git.pullAsync('origin', 'master').then(function(repo) {
            //@TODO: Save something here
            return Promise.resolve();
          })
          .then(function() {
            return PM2.restart(requestName);
          })
          .catch(function(err) {
            console.log('Merge Err', err);
          });
      } else {
        //@TODO: Flag clone

        return Git.cloneAsync(cloneURL, localPath).then(function() {
            return FS.readFileAsync(localPath + '/package.json');
          })
          .then(function(packageJson) {
            var deps;
            var pack = JSON.parse(packageJson);

            if (pack && pack.dependencies) {
              deps = getDependencies(pack.dependencies);
              cache.deployments[requestName].package = pack;

              console.log('install');
              return exec.execAsync('npm install --prefix ' + localPath + deps);
            }
          })
          .catch(function(err) {
            console.log('clone err', err);
          });
      }
    })
    .then(function(repo) {
      if (Array.isArray(repo)) {
        var port;

        if (cache.deployments[requestName].package.ms && cache.deployments[requestName].package.ms.options && cache.deployments[requestName].package.ms.options.port) {
          port = cache.deployments[requestName].package.ms.options.port;
        } else {
          //@TODO: Write functions in cache that find out the next port, add and delete.
          port = nextPort();
        }

        //@TODO: Flage boot
        return PM2.startAsync(localPath + '/' + cache.deployments[requestName].package.ms.start, {
          name: requestName,
          port: port
        });
      } else {
        Promise.resolve();
      }
    })
    .then(function(start){
      //@TODO: Flag disconnect
      //@TODO: Delete cache, send message, update db, emit socket
      return PM2.disconnectAsync();
    })
    .catch(function(err){
      console.log(err);
    });

  res.status(200).send('All Good');
});

module.exports = Router;
