import BaseLfo from '../core/base-lfo';
import * as ws from 'ws';
import { bufferToArrayBuffer, decodeMessage } from '../utils/socket-utils';


// @TODO: handle `start` and `stop`
export default class SocketServer extends BaseLfo {
  constructor(options) {
    super({
      port: 3030
    }, options);

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
    this.server = new ws.Server({ port: this.params.port });

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
