#!/usr/bin/env node

var _ = require('underscore')
  , log4js = require('log4js');

log4js.configure('log4js.json', {});
var logger = log4js.getLogger('serial-console');

logger.info('Loading configuration...');

var config = require(__dirname + '/config.json');

var http = require('http')
  , express = require('express')
  , io = require('socket.io')
  , pty = require('pty.js')
  , terminal = require('term.js');

logger.info('Start HTTP Server on port %d', config.http.port);

var app = express()
  , server = http.createServer(app);

app.use(express.static(__dirname));
app.use(terminal.middleware());

server.listen(config.http.port);

io = io.listen(server, {
  log: false
});

io.sockets.on('connection', function(sock) {
    logger.info('Start websocket');

    socket = sock;

    socket.on('data', function(data) {
        logger.debug('Data received from websocket: %s', data);
        term.write(data);
    });

    socket.on('disconnect', function() {
        logger.info('Websocket disconnection');
        term.kill();
        socket = null;
    });

    var buff = []
      , socket
      , term;

    var screenArgs = [config.screen.device, config.screen.rate];
    logger.info('Init PTY with "%s" command and parameters %s', config.screen.cmd, screenArgs);
    term = pty.fork(config.screen.cmd, screenArgs, config.term);

    term.on('data', function(data) {
        logger.debug('Sending data to websocket: %s', data);
      return !socket ? buff.push(data) : socket.emit('data', data);
    });

    while (buff.length) {
        logger.debug('Sending buffered data to websocket: %s', buff);
        socket.emit('data', buff.shift());
    }
});
