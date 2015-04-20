'use strict';

var Lfo = require('../core/lfo-base');
var WebSocketServer = require('ws').Server;
var { bufferToArrayBuffer, encodeMessage, decodeMessage } = require('../utils/socket-utils');

// @TODO: handle `start` and `stop`

class SocketSourceServer extends Lfo {
  constructor(options) {
    var defaults = {
      port: 3030
    };

    super(options, defaults);

    // @TODO handle disconnect and so on...
    this.clients = [];
    this.server = null;
    this.initServer();

    // @FIXME - right place ?
    this.start();
  }

  start() {
    this.initialize();
    this.reset();
  }

  initServer() {
    this.server = new WebSocketServer({ port: this.params.port });

    this.server.on('connection', socket => {
      // this.clients.push(socket);
      socket.on('message', this.process.bind(this));
    });
  }

  process(buffer) {
    var arrayBuffer = bufferToArrayBuffer(buffer);
    var message = decodeMessage(arrayBuffer);

    this.time = message.time;
    this.outFrame = message.frame;
    this.metaData = message.metaData;

    this.output();
  }
}

class SocketSourceClient extends Lfo {
  constructor(options) {
    var defaults = {
      port: 3031,
      address: window.location.hostname
    };

    super(options, defaults);

    this.socket = null;
    this.initConnection();
  }

  start() {
    this.initialize();
    this.reset();
  }

  configureStream() {
    this.streamParams.frameSize = this.params.frameSize;
    this.streamParams.frameRate = this.params.frameRate;
    // @NOTE does it make sens ?
    this.streamParams.blockSampleRate = this.params.frameRate * this.params.frameSize;
  }

  initConnection() {
    var socketAddr = 'ws://' + this.params.address + ':' + this.params.port;
    this.socket = new WebSocket(socketAddr);
    this.socket.binaryType = 'arraybuffer';

    // callback to start to when WebSocket is connected
    this.socket.onopen = () => {
      this.start();
    };

    this.socket.onclose = () => {

    };

    this.socket.onmessage = (message) => {
      this.process(message.data);
    };

    this.socket.onerror = () => {
      console.log(err);
    };
  }

  process(buffer) {
    var message = decodeMessage(buffer);

    this.time = message.time;
    this.outFrame = message.frame;
    this.metaData = message.metaData;

    this.output();
  }
}

module.exports = {
  SocketSourceServer: SocketSourceServer,
  SocketSourceClient: SocketSourceClient
};