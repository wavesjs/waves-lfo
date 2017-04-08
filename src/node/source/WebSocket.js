import BaseLfo from '../../core/BaseLfo';
import SourceMixin from '../../core/SourceMixin';
import { wsServerFactory } from '../utils/wsServerFactory';
import * as wsUtils from '../../common/utils/wsUtils';


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
 *
 *
 *
 */
class WebSocket extends SourceMixin(BaseLfo) {
  constructor(options = {}) {
    super(parameters, options);

    this._onConnection = this._onConnection.bind(this);
    // this._onDisconnect = this._onDisconnect.bind(this);
    this._dispatch = this._dispatch.bind(this);

    this.wss = wsServerFactory(this.params.get('port'));
    this.wss.on('connection', this._onConnection);
    // this.wss.on('disconnect', this._onDisconnect); // doesn't exists ?
  }

  processStreamParams(prevStreamParams) {
    super.processStreamParams(prevStreamParams);
    console.log('processStreamParams');
  }

  resetStream() {
    this.frame.data.fill(0);
    console.log('resetStream');
  }

  finalizeStream(endTime) {
    console.log('finalizeStream', endTime);
    super.finalizeStream(endTime);
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

    const output = this.frame;
    // pull interface (we copy data since we don't know what could
    // be done outside the graph)
    for (let i = 0, l = this.streamParams.frameSize; i < l; i++)
      output.data[i] = frame.data[i];

    output.time = frame.time;
    output.metadata = frame.metadata;

    this.propagateFrame();
  }


  _onConnection(socket) {
    socket.on('message', this._dispatch);
  }

  // _onDisconnect(socket) {
  //   console.log('disconnect', socket);
  // }

  /**
   *
   * code 1 bytes
   *
   */
  _dispatch(ab) {
    const opcode = new Uint16Array(ab)[0]; // 1 bytes for opcode, 1 dead byte
    console.log('[opcode]', opcode);

    switch (opcode) {
      case 0: // PING
        // const
      // processStreamParams :   [1 byte for opcode, x bytes for payload]
      case 1: // PONG
        const payload = new Uint16Array(ab.slice(2));
        const prevStreamParams = wsUtils.Uint16Array2json(payload);
        this.processStreamParams(prevStreamParams);
        break;
      // resetStream
      case 1:
        this.resetStream();
        break;
      // finalizeStream
      case 2:
        const endTime = new Float64Array(ab.slice(2))[0];
        console.log(endTime);
        this.finalizeStream(endTime);
        break;
      case 3:

        break;
    }
  }
}

export default WebSocket;
