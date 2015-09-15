var Router = require('express').Router();
var Promise = require('bluebird');
var path = require('path');
var pm2 = require('pm2');
var Git = require('nodegit');
var npm = require('npm');

var FS = Promise.promisifyAll(require('fs'));
var PM2 = Promise.promisifyAll(pm2);
var NPM = Promise.promisifyAll(npm);

var cache = require('./cache');

Router.post('/', function(req, res){
  var requestId = req.body.repository.pushed_at;
  var requestName = req.body.repository.name;
  var cloneURL = req.body.repository.clone_url;

  cache[requestId] = {};

  /* Save deployment record here. Use model method */

  var localPath = path.join(__dirname, '/apps/' + requestName);

  var cloneOptions = {};

  cloneOptions.remoteCallbacks = {
      certificateCheck: function() { return 1; }
  };

  var cloneRepository = Git.Clone(cloneURL, localPath, cloneOptions);

  var errorAndAttemptOpen = function() {
      return Git.Repository.open(localPath);
  };

  cloneRepository.catch(errorAndAttemptOpen)
      .then(function(repository) {
        return FS.readFileAsync(localPath + '/package.json');
      })
      .then(function(path){
        cache[requestId].package = JSON.parse(path);

        if(cache[requestId].package.name && cache[requestId].package.version && cache[requestId].package.scripts.start) {
            // save with deployment schema
            // pm2.connect(function(){
            //   console.log('connect');
            //   return pm2.startAsync(startCommand, { title: name });
            // });

            return NPM.loadAsync();
        } else {
          console.log('else');
        }
      })
      .then(function(rnpm){
        if(cache[requestId].package && cache[requestId].package.dependencies) {
          console.log('install');
          console.log(rnpm);
          rnpm.commands.install(Object.keys(cache[requestId].package.dependencies), function(){
            console.log('installed');
            console.log(pm2);
            return PM2.connectAsync();
          });
        }
      })
      .then(function(){
        var port;

        if(cache[requestId].ms && cache[requestId].ms.port) {
          port = cache[requestId].ms.port;
        } else {
          // @TODO: Write functions in cache that find out the next port, add and delete.
          port = 8000;
        }
        console.log(port);
        return PM2.startAsync(cache[requestId].package.scripts.start, {
           title: cache[requestId].package.name,
           port: port
         });
      })
      .then(function(apps){
        console.log(apps);
        return PM2.disconnectAsync();
      })
      .then(function(){
        // @TODO: function to delete out of cache.
        console.log('done');
      })
      .catch(function(err){
        console.log(err);
      });

  res.status(200).send('All Good');
});

module.exports = Router;
