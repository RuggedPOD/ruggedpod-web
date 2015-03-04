#!/usr/bin/env node

console.log('Init');

var http = require('http')
  , express = require('express')
  , io = require('socket.io')
  , pty = require('pty.js')
  , terminal = require('term.js');


console.log('Init PTY on serial port ');

var serialDevice = '/dev/tty.usbmodem1411';


var buff = []
  , socket
  , term;

term = pty.fork('screen', [serialDevice, '9600'], {
    cols: 120,
    rows: 40
});

term.on('data', function(data) {
  return !socket ? buff.push(data) : socket.emit('data', data);
});


console.log('Start HTTP Server');

var app = express()
  , server = http.createServer(app);

app.use(express.static(__dirname));
app.use(terminal.middleware());

httpPort = 7000;
console.log('listen on %d port', httpPort);
server.listen(httpPort);


console.log('Start websocket');

io = io.listen(server, {
  log: false
});

io.sockets.on('connection', function(sock) {
    socket = sock;

    socket.on('data', function(data) {
        console.log('Sending data to device serial port');
        console.log(data);
        term.write(data);
    });

    socket.on('disconnect', function() {
        console.log('Websocket disconnection');
        socket = null;
    });

    while (buff.length) {
        console.log('Sending buffered data to device serial port');
        socket.emit('data', buff.shift());
    }
});
