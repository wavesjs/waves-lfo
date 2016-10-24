import BaseLfo from '../../common/core/BaseLfo';


const definitions = {
  separateArrays: {
    type: 'boolean',
    default: false,
    constant: true,
  },
  callback: {
    type: 'any',
    default: null,
    nullable: true,
    metas: { kind: 'dynamic' },
  },
};

/**
 * Record input frames from a graph.
 * This sink can handle `signal`, `vector` or `scalar` inputs.
 *
 * @param {Object} options - Override default parameters.
 * @param {Boolean} [options.separateArrays=false] - Format of the retrieved
 *  values:
 *  - when `false`, format is [{ time, data }, { time, data }, ...]
 *  - when `true`, format is { time: [...], data: [...] }
 * @param {Function} [options.callback] - Callback to execute when a new record
 *  is ended. This can happen when: `stop` is called on the recorder, or `stop`
 *  is called on the source.
 *
 * @todo - Add auto record param.
 *
 * @memberof module:client.sink
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * const eventIn = new lfo.source.EventIn({
 *  frameType: 'vector',
 *  frameSize: 2,
 *  frameRate: 0,
 * });
 *
 * const recorder = new lfo.sink.DataRecorder({
 *   callback: (data) => console.log(data),
 * });
 *
 * eventIn.connect(recorder);
 * eventIn.start();
 * recorder.start();
 *
 * eventIn.process(0, [0, 1]);
 * eventIn.process(1, [1, 2]);
 *
 * recorder.stop();
 * > [{ time: 0, data: [0, 1] }, { time: 1, data: [1, 2] }];
 */
class DataRecorder extends BaseLfo {
  constructor(options = {}) {
    super(definitions, options);

    /**
     * Define if the node is currently recording.
     *
     * @type {Boolean}
     * @name isRecording
     * @instance
     * @memberof module:sink.SignalRecorder
     */
    this.isRecording = false;
  }

  /** @private */
  _initStore() {
    const separateArrays = this.params.get('separateArrays');

    if (separateArrays)
      this._store = { time: [], data: [] };
    else
      this._store = [];
  }

  /** @private */
  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);
    this._initStore();
    this.propagateStreamParams();
  }

  /**
   * Start recording.
   *
   * @see {@link module:client.sink.DataRecorder#stop}
   */
  start() {
    this.isRecording = true;
  }

  /**
   * Stop recording and execute the callback defined in parameters.
   *
   * @see {@link module:client.sink.DataRecorder#start}
   */
  stop() {
    if (this.isRecording) {
      const callback = this.params.get('callback');

      if (callback !== null)
        callback(this._store);

      this.isRecording = false;
      this._initStore();
    }
  }

  /** @private */
  finalizeStream() {
    this.stop();
  }

  // handle any input types
  /** @private */
  processScalar(frame) {}
  /** @private */
  processSignal(frame) {}
  /** @private */
  processVector(frame) {}

  processFrame(frame) {
    if (this.isRecording) {
      this.prepareFrame(frame);

      const separateArrays = this.params.get('separateArrays');

      this.frame.data = new Float32Array(frame.data);
      this.frame.time = frame.time;
      this.frame.metadata = frame.metadata;

      if (!separateArrays) {
        this._store.push(this.frame);
      } else {
        this._store.time.push(this.frame.time);
        this._store.data.push(this.frame.data);
      }
    }
  }
}

export default DataRecorder;

