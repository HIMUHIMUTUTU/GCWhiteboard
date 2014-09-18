
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var gcsfront = require('./routes/gcsfront');
var agent = require('./routes/agent');
var hwrecognition = require('./routes/hwrecognition');
var http = require('http');
var path = require('path');

var app = module.exports = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(express.favicon());
app.use(express.basicAuth('id', 'pass'));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/gcsfront', gcsfront.view);
app.get('/agent', agent.view);
app.get('/hwrecognition', hwrecognition.view);

server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


/* For socket-io */ 
var socketIO = require('socket.io');
var io = socketIO.listen(server);
app.set('io', io);
require('./socketio');

