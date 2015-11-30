#!/usr/bin/env node

/*
 * RuggedPOD management web console
 *
 * Copyright (C) 2015 Guillaume Giamarchi <guillaume.giamarchi@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

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
