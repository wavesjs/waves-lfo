import BaseLfo from '../../common/core/BaseLfo';

const definitions = {
  callback: {
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
 * @memberof module:sink
 *
 * @param {Object} options - Override default parameters.
 * @param {Function} [options.callback=null] - Callback to be executed
 *  on each frame.
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
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
 *   callback: (frame) => console.log(frame),
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

    /**
     * Alias `this.frame`.
     *
     * @type {Object}
     * @name data
     * @instance
     * @memberof module:sink.Bridge
     */
    this.data = null;
  }

  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);
    this.propagateStreamParams();

    // alias `this.frame`
    this.data = this.frame;
  }

  // process any type
  processScalar() {}
  processVector() {}
  processSignal() {}

  processFrame(frame) {
    this.prepareFrame();

    const callback = this.params.get('callback');
    const output = this.frame;
    output.data = new Float32Array(this.streamParams.frameSize);
    // pull interface (we copy data since we don't know what could
    // be done outside the graph)
    for (let i = 0; i < this.streamParams.frameSize; i++)
      output.data[i] = frame.data[i];

    output.time = frame.time;
    output.metadata = frame.metadata;

    // `push` interface
    if (callback !== null)
      callback(output);
  }
}

export default Bridge;
