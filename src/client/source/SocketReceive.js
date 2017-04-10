import BaseLfo from '../../core/BaseLfo';
import { opcodes, encoders, decoders } from '../../common/utils/wsUtils';

const parameters = {
  port: {
    type: 'integer',
    default: 8000,
    nullable: true,
    constant: true,
  },
  url: {
    type: 'string',
    default: null,
    nullable: true,
    constant: true,
  }
}

/**
 * Receive an lfo frame as a socket message from a `node.sink.SocketSend`
 * instance.
 *
 * @experimental
 * @todo - handle init / start properly.
 */
class SocketReceive extends BaseLfo {
  constructor(options = {}) {
    super(parameters, options);

    const protocol = window.location.protocol.replace(/^http/, 'ws');
    const address = this.params.get('url') || window.location.hostname;
    const port = this.params.get('port') || ''; // everything falsy becomes ''
    const socketAddress = `${protocol}//${address}:${port}`;

    this._dispatch = this._dispatch.bind(this);

    this.socket = new WebSocket(socketAddress);
    this.socket.binaryType = 'arraybuffer';

    this.openedPromise = new Promise((resolve, reject) => {
      this.socket.onopen = resolve;
    });

    this.socket.onmessage = this._dispatch;
    this.socket.onerror = (err) => console.error(err.stack);
  }

  /** @private */
  initModule() {
    const promises = this.nextModules.map((mod) => mod.initModule());
    promises.push(this.openedPromise);
    // wait for children promises and send INIT_MODULE_ACK
    Promise.all(promises).then(() => {
      const buffer = encoders.initModuleAck();
      this.socket.send(buffer);
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

  /**
   * Decode and dispatch incomming frame according to opcode
   * @private
   */
  _dispatch(e) {
    const arrayBuffer = e.data;
    const opcode = decoders.opcode(arrayBuffer);

    switch (opcode) {
      case opcodes.INIT_MODULE_REQ:
        this.initModule();
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

export default SocketReceive;
