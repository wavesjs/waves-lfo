import BaseLfo from '../../core/BaseLfo';

const definitions = {
  processStreamParams: {
    type: 'any',
    default: null,
    nullable: true,
    metas: { kind: 'dynamic' },
  },
  processFrame: {
    type: 'any',
    default: null,
    nullable: true,
    metas: { kind: 'dynamic' },
  },
  finalizeStream: {
    type: 'any',
    default: null,
    nullable: true,
    metas: { kind: 'dynamic' },
  },
};

/**
 * Create a bridge between the graph and application logic. Handle `push`
 * and `pull` paradigms.
 *
 * This sink can handle any type of input (`signal`, `vector`, `scalar`)
 *
 * @memberof module:common.sink
 *
 * @param {Object} options - Override default parameters.
 * @param {Function} [options.processFrame=null] - Callback executed on each
 *  `processFrame` call.
 * @param {Function} [options.finalizeStream=null] - Callback executed on each
 *  `finalizeStream` call.
 *
 * @see {@link module:common.core.BaseLfo#processFrame}
 * @see {@link module:common.core.BaseLfo#processStreamParams}
 *
 * @example
 * import * as lfo from 'waves-lfo/common';
 *
 * const frames = [
 *  { time: 0, data: [0, 1] },
 *  { time: 1, data: [1, 2] },
 * ];
 *
 * const eventIn = new EventIn({
 *   frameType: 'vector',
 *   frameSize: 2,
 *   frameRate: 1,
 * });
 *
 * const bridge = new Bridge({
 *   processFrame: (frame) => console.log(frame),
 * });
 *
 * eventIn.connect(bridge);
 * eventIn.start();
 *
 * // callback executed on each frame
 * eventIn.processFrame(frame[0]);
 * > { time: 0, data: [0, 1] }
 * eventIn.processFrame(frame[1]);
 * > { time: 1, data: [1, 2] }
 *
 * // pull current frame when needed
 * console.log(bridge.frame);
 * > { time: 1, data: [1, 2] }
 */
class Bridge extends BaseLfo {
  constructor(options = {}) {
    super(definitions, options);
  }

  /** @private */
  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);

    const processStreamParamsCallback = this.params.get('processStreamParams');

    if (processStreamParamsCallback !== null)
      processStreamParamsCallback(this.streamParams);

    this.propagateStreamParams();
  }

  /** @private */
  finalizeStream(endTime) {
    const finalizeStreamCallback = this.params.get('finalizeStream');

    if (finalizeStreamCallback !== null)
      finalizeStreamCallback(endTime);
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

    const processFrameCallback = this.params.get('processFrame');
    const output = this.frame;
    output.data = new Float32Array(this.streamParams.frameSize);
    // pull interface (we copy data since we don't know what could
    // be done outside the graph)
    for (let i = 0; i < this.streamParams.frameSize; i++)
      output.data[i] = frame.data[i];

    output.time = frame.time;
    output.metadata = frame.metadata;

    // `push` interface
    if (processFrameCallback !== null)
      processFrameCallback(output);
  }
}

export default Bridge;
