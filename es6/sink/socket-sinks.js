'use strict';

var Lfo = require('../core/lfo-base');
var WebSocketServer = require('ws').Server;
var { encodeMessage, decodeMessage, arrayBufferToBuffer } = require('../utils/socket-utils');

// send an Lfo stream from the browser over the network
// through a WebSocket - should be paired with a SocketSourceServer
// @NOTE: does it need to implement some ping process to maintain connection ?
class SocketSinkClient extends Lfo {
  constructor(options) {
    var defaults = {
      port: 3030,
      address: window.location.hostname
    };

    super(options, defaults);

    this.socket = null;
    this.initConnection();
  }

  initConnection() {
    var socketAddr = 'ws://' + this.params.address + ':' + this.params.port;
    this.socket = new WebSocket(socketAddr);
    this.socket.binaryType = 'arraybuffer';

    // callback to start to when WebSocket is connected
    this.socket.onopen = () => {
      this.params.onopen();
    };

    this.socket.onclose = () => {

    };

    this.socket.onmessage = () => {

    };

    this.socket.onerror = (err) => {
      console.log(err);
    };
  }

  process(time, frame, metaData) {
    var buffer = encodeMessage(time, frame, metaData);

    this.socket.send(buffer);
  }
}

class SocketSinkServer extends Lfo {
  constructor(options) {
    var defaults = {
      port: 3031
    };

    super(options, defaults);

    this.server = null;
    this.initServer();
  }

  initServer() {
    this.server = new WebSocketServer({ port: this.params.port });
  }

  process(time, frame, metaData) {
    var arrayBuffer = encodeMessage(time, frame, metaData);
    var buffer = arrayBufferToBuffer(arrayBuffer);

    this.server.clients.forEach(function(client) {
      // console.timeEnd('ServerProcess');
      client.send(buffer);
    });
  }
}

module.exports = {
  SocketSinkClient: SocketSinkClient,
  SocketSinkServer: SocketSinkServer
};







