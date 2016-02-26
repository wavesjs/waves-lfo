import BaseLfo from '../core/base-lfo';
import { encodeMessage } from '../utils/socket-utils';

// send an Lfo stream from the browser over the network
// through a WebSocket - should be paired with a SocketSourceServer
// @NOTE: does it need to implement some ping process to maintain connection ?
export default class SocketClient extends BaseLfo {
  constructor(options) {
    super(options, {
      port: 3030,
      address: window.location.hostname
    });

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
      console.error(err);
    };
  }

  process(time, frame, metaData) {
    var buffer = encodeMessage(time, frame, metaData);
    this.socket.send(buffer);
  }
}
