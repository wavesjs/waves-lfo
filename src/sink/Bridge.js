import BaseLfo from '../core/BaseLfo';

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
 * @memberof module:sink
 *
 * @param {Object} options - Override default parameters.
 * @param {Function} [options.callback=null] - Callback to be executed
 *  on each frame.
 *
 * @example
 * // todo - both pull and push paradigms
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
    // pull interface (we copy data since we don't know what could
    // be done outside the graph)
    for (let i = 0; i < this.streamParams.frameSize; i++)
      output.data[i] = frame.data[i];

    output.time = frame.time;
    output.metadata = frame.metadata;

    // `push` interface
    callback(output);
  }
}

export default Bridge;
