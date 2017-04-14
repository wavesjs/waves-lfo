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
 * Send an lfo frame as a socket message to a `node.source.SocketReceive`
 * instance.
 *
 * <p class="warning">Experimental</p>
 *
 * @example
 * const eventIn = new lfo.source.EventIn({
 *   frameType: 'vector',
 *   frameSize: 2,
 *   frameRate: 1,
 * });
 *
 * const socketSend = new lfo.sink.SocketSend({
 *   port: 3000
 * });
 *
 * eventIn.connect(socketSend);
 *
 * eventIn.init().then(() => {
 *   eventIn.start();
 *
 *   let time = 0;
 *
 *   (function createFrame() {
 *     eventIn.process(time, [Math.random(), Math.random()], { test: true });
 *     time += 1;
 *
 *     setTimeout(createFrame, 1000);
 *   }());
 * });
 */
class SocketSend extends BaseLfo {
  constructor(options = {}) {
    super(parameters, options);

    const protocol = window.location.protocol.replace(/^http/, 'ws');
    const address = this.params.get('url') || window.location.hostname;
    const port = this.params.get('port') || ''; // everything falsy becomes ''
    const socketAddress = `${protocol}//${address}:${port}`;

    this.socket = new WebSocket(socketAddress);
    this.socket.binaryType = 'arraybuffer';

    this.openedPromise = new Promise((resolve, reject) => {
      this.socket.onopen = resolve;
    });

    this.socket.onerror = (err) => console.error(err.stack);
  }

  initModule() {
    // send a INIT_MODULE_REQ and wait for INIT_MODULE_ACK
    // no need to get children promises as we are in a leef
    return this.openedPromise.then(() => {
      return new Promise((resolve, reject) => {
        this.socket.onmessage = (e) => {
          const opcode = decoders.opcode(e.data);

          if (opcode === opcodes.INIT_MODULE_ACK)
            resolve();
        }

        const buffer = encoders.initModuleReq();
        this.socket.send(buffer);
      });
    });
  }

  processStreamParams(prevStreamParams) {
    super.processStreamParams(prevStreamParams);

    const buffer = encoders.streamParams(this.streamParams);
    this.socket.send(buffer);
  }

  resetStream() {
    super.resetStream();

    const buffer = encoders.resetStream();
    this.socket.send(buffer);
  }

    /** @private */
  finalizeStream(endTime) {
    super.finalizeStream(endTime);

    const buffer = encoders.finalizeStream(endTime);
    this.socket.send(buffer);
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
    this.socket.send(buffer);
  }
}

export default SocketSend;
