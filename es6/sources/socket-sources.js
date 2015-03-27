'use strict';

var Lfo = require('../core/lfo-base');
var WebSocketServer = require('ws').Server;
var { encodeMessage, decodeMessage } = require('../utils/socket-utils');

class SocketSourceServer {
  constructor(options) {
    var defaults = {
      port: 3030
    };

    super(null, options, defaults);

    this.initServer();
  }

  initServer() {
    this.server = new WebSocketServer({ port: this.params.port });

    this.server.on('connection', socket => {
      this.clients.push(socket);
    });
  }

  process(buffer) {
    var message = decodeMessage(buffer);

    this.time = message.time;
    this.frame = message.frame;
    this.metaData = message.metaData;

    this.output();
  }
}

module.exports = {
  SocketSourceServer: SocketSourceServer
};