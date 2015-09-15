var express = require('express');
var app = require('express')();
var bodyParser = require('body-parser');
var swig = require('swig');

app.use(bodyParser.json());

// Set view render engine
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(express.static('public'));

// Views cache
app.set('view cache', false);
swig.setDefaults({ cache: false });

// Set cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/mothership', require('./routes'));
app.use('/', require('./routes/dashboard'));

// app.use('/*', function(req, res){
//   res.status(200).render('index');
// });

module.exports = app;
