import BaseLfo from '../core/base-lfo';
import * as ws from 'ws';
import { encodeMessage, arrayBufferToBuffer } from '../utils/socket-utils';


export default class SocketServer extends BaseLfo {
  constructor(options) {
    super(options, {
      port: 3031
    });

    this.server = null;
    this.initServer();
  }

  initServer() {
    this.server = new ws.Server({ port: this.params.port });
  }

  process(time, frame, metaData) {
    var arrayBuffer = encodeMessage(time, frame, metaData);
    var buffer = arrayBufferToBuffer(arrayBuffer);

    this.server.clients.forEach(function(client) {
      client.send(buffer);
    });
  }
}
