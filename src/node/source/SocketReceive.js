import BaseLfo from '../../core/BaseLfo';
import { opcodes, decoders, encoders } from '../../common/utils/wsUtils';
import { wsServerFactory } from '../utils/wsServerFactory';


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
 * Receive an lfo frame as a socket message from a `client.sink.SocketSend`
 * instance.
 *
 * <p class="warning">Experimental</p>

 * @memberof module:node.source
 *
 * @params {Object} options
 *
 * @example
 * const socket = new lfo.source.SocketReceive({ port: 8000 });
 * const logger = new lfo.sink.Logger({
 *   time: true,
 *   data: true,
 * });
 *
 * socket.connect(logger);
 */
class SocketReceive extends BaseLfo {
  constructor(options = {}) {
    super(parameters, options);

    this._onConnection = this._onConnection.bind(this);
    this._dispatch = this._dispatch.bind(this);

    this.wss = wsServerFactory({
      port: this.params.get('port'),
      server: this.params.get('server'),
    });

    this.wss.on('connection', this._onConnection);
  }

  /** @private */
  initModule(socket) {
    const promises = this.nextModules.map((mod) => mod.initModule());
    // wait for children promises and send INIT_MODULE_ACK
    Promise.all(promises).then(() => {
      const buffer = encoders.initModuleAck();
      socket.send(buffer);
    });
  }

  // process any type
  /** @private */
  processScalar() {}
  /** @private */
  processVector() {}
  /** @private */
  processSignal() {}

  /** @private */
  processFrame(frame) {
    this.prepareFrame();
    this.frame = frame;
    this.propagateFrame();
  }

  /** @private */
  _onConnection(socket) {
    socket.on('message', this._dispatch(socket));
  }

  /**
   * Decode and dispatch incomming frame according to opcode
   * @private
   */
  _dispatch(socket) {
    return (arrayBuffer) => {
      const opcode = decoders.opcode(arrayBuffer);

      switch (opcode) {
        case opcodes.INIT_MODULE_REQ:
          this.initModule(socket);
          break;
        case opcodes.PROCESS_STREAM_PARAMS:
          const prevStreamParams = decoders.streamParams(arrayBuffer);
          this.processStreamParams(prevStreamParams);
          break;
        case opcodes.RESET_STREAM:
          this.resetStream();
          break;
        case opcodes.FINALIZE_STREAM:
          const endTime = decoders.finalizeStream(arrayBuffer);
          this.finalizeStream(endTime);
          break;
        case opcodes.PROCESS_FRAME:
          const frameSize = this.streamParams.frameSize;
          const frame = decoders.processFrame(arrayBuffer, frameSize);
          this.processFrame(frame);
          break;
      }
    }
  }
}

export default SocketReceive;
