'use strict';

var Lfo = require('../core/lfo-base');
var { encodeMessage, decodeMessage } = require('../utils/socket-utils');

class SocketSynk {
  constructor() {

  }

  // prepare the buffer to send over the network
  formatMessage() {

  }

  // onmessage callback
  // dispatch handchecks and data message
  routeMessage() {

  }
}


// send an Lfo stream from the browser over the network
// throught a WebSocket - should be paired with a SocketSourceServer
// @NOTE: does it need to implement some ping process to maintain connection ?
class SocketSyncClient extends Lfo {
  constructor(previous, options) {
    var defaults = {
      port: 3030,
      address: window.location.hostname
    }

    super(previous, options, defaults);

    this.socket = null;
    this.initConnection();
  }

  initConnection() {
    var socketAddr = 'ws://' + this.params.address + ':' + this.params.port;
    this.socket = new WebSocket(socketAddr);
    this.socket.binaryType = 'arraybuffer';

    this.socket.onopen = () => {
      this.isReady = true;
    };

    this.socket.onclose = () => {

    };

    this.socket.onmessage = () => {
      // should not receive messages
      // maybe handshakes form the server ?
    };

    this.socket.onerror = () {
      // repoen socket ?
    };
  }

  process(time, frame, metaData) {
    var buffer = encodeMessage(time, frame, metaData);
    this.socket.send(buffer);
  }
}

class SocketSyncServer extends Lfo {

}





