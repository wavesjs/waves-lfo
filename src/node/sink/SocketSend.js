import BaseLfo from '../../core/BaseLfo';
import { opcodes, encoders, decoders } from '../../common/utils/wsUtils';
import { WebSocket, wsServerFactory } from '../utils/wsServerFactory';


const parameters = {
  port: {
    type: 'integer',
    default: 8000,
    constant: true,
    nullable: true,
  },
  server: {
    type: 'any',
    default: null,
    constant: true,
    nullable: true,
  },
};

/**
 * Send an lfo frame as a socket message to a `client.source.SocketReceive`
 * instance.
 *
 * @experimental
 * @params {Object} options
 */
class SocketSend extends BaseLfo {
  constructor(options = {}) {
    super(parameters, options);

    this.wss = wsServerFactory({
      port: this.params.get('port'),
      server: this.params.get('server'),
    });

    // this.wss.onconnection = (socket) => {
    //   if (this.initialized) {
    //     // socket.send(initModule)
    //     // then
    //     // socket.procesStreamParams
    //     // socket.
    //   }
    // }
  }

  _broadcast(buffer) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN)
        client.send(buffer);
    });
  }

  initModule() {
    // send a INIT_MODULE_REQ to each client and wait for INIT_MODULE_ACK
    // no need to get children promises as we are in a leef
    const promises = [];

    this.wss.clients.forEach((client) => {
      const promise = new Promise((resolve, reject) => {
        client.onmessage = (e) => {
          const opcode = decoders.opcode(e.data);

          if (opcode === opcodes.INIT_MODULE_ACK)
            resolve();
        }
      });

      promises.push(promise);
    });

    const buffer = encoders.initModuleReq();
    this._broadcast(buffer);

    return Promise.all(promises);
  }

  processStreamParams(prevStreamParams) {
    super.processStreamParams(prevStreamParams);

    const buffer = encoders.streamParams(this.streamParams);
    this._broadcast(buffer);
  }

  resetStream() {
    super.resetStream();

    const buffer = encoders.resetStream();
    this._broadcast(buffer);
  }

    /** @private */
  finalizeStream(endTime) {
    super.finalizeStream(endTime);

    const buffer = encoders.finalizeStream(endTime);
    this._broadcast(buffer);
  }

  // process any type
  /** @private */
  processScalar() {}
  /** @private */
  processVector() {}
  /** @private */
  processSignal() {}

  processFrame(frame) {
    const frameSize = this.streamParams.frameSize;
    this.frame.time = frame.time;
    this.frame.data.set(frame.data, 0);
    this.frame.metadata = frame.metadata;

    const buffer = encoders.processFrame(this.frame, frameSize);
    this._broadcast(buffer);
  }
}

export default SocketSend;
