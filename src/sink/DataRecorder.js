import BaseLfo from '../core/BaseLfo';

const worker = `
var _separateArrays = false;
var _data = [];
var _separateArraysData = { time: [], data: [] };

function init() {
  _data.length = 0;
  _separateArraysData.time.length = 0;
  _separateArraysData.data.length = 0;
}

function process(time, data) {
  if (_separateArrays) {
    _separateArraysData.time.push(time);
    _separateArraysData.data.push(data);
  } else {
    var datum = { time: time, data: data };
    _data.push(datum);
  }
}

self.addEventListener('message', function(e) {
  switch (e.data.command) {
    case 'init':
      _separateArrays = e.data.separateArrays;
      init();
      break;
    case 'process':
      var time = e.data.time;
      var data = new Float32Array(e.data.buffer);
      process(time, data);
      break;
    case 'stop':
      var data = _separateArrays ? _separateArraysData : _data;
      self.postMessage({ data: data });
      init();
      break;
  }
});
`;

const definitions = {
  separateArrays: {
    type: 'boolean',
    default: false,
    constant: true,
  },
};

/**
 * Record arbitrary data from a graph.
 *
 * This sink can handle `signal` and `vector` inputs.
 *
 * @param {Object} options - Override default parameters.
 * @param {Boolean} [options.separateArrays] - Format of the retrieved values:
 *  - when `false`, format is [{ time, data }, { time, data }, ...]
 *  - when `true`, format is { time: [...], data: [...] }
 *
 * @memberof module:sink
 *
 * @example
 * import * as lfo from 'waves-lfo';
 *
 * const eventIn = new lfo.source.EventIn({
 *  frameType: 'vector',
 *  frameSize: 2,
 *  frameRate: 0,
 * });
 *
 * const recorder = new lfo.sink.DataRecorder();
 *
 * eventIn.connect(recorder);
 * eventIn.start();
 * recorder.start();
 *
 * recorder.retrieve()
 *  .then((result) => console.log(result))
 *  .catch((err) => console.error(err.stack));
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
     * Define is the node is currently recording or not.
     *
     * @type {Boolean}
     * @name isRecording
     * @instance
     * @memberof module:sink.SignalRecorder
     */
    this.isRecording = false;

    // init worker
    const blob = new Blob([worker], { type: 'text/javascript' });
    this.worker = new Worker(window.URL.createObjectURL(blob));
  }

  /** @private */
  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);

    this.worker.postMessage({
      command: 'init',
      separateArrays: this.params.get('separateArrays'),
    });

    this.propagateStreamParams();
  }

  /**
   * Start recording.
   */
  start() {
    this.isRecording = true;
  }

  /**
   * Stop recording and trigger the fulfillment of the promise returned by the
   * `retrieve` method.
   */
  stop() {
    if (this.isRecording) {
      this.worker.postMessage({ command: 'stop' });
      this.isRecording = false;
    }
  }

  /** @private */
  finalizeStream() {
    this.stop();
  }

  /** @private */
  processSignal(frame) {
    if (this.isRecording)
      this._sendFrame(frame);
  }

  /** @private */
  processVector(frame) {
    if (this.isRecording)
      this._sendFrame(frame);
  }

  /** @private */
  _sendFrame(frame) {
    this.frame.data = new Float32Array(frame.data);
    const buffer = this.frame.data.buffer;

    this.worker.postMessage({
      command: 'process',
      time: frame.time,
      buffer: buffer,
    }, [buffer]);
  }

  /**
   * Retrieve a promise that will be fulfilled when `stop` is called.
   *
   * @return {Promise<Array>}
   */
  retrieve() {
    return new Promise((resolve, reject) => {
      const callback = (e) => {
        this._started = false;

        this.worker.removeEventListener('message', callback, false);
        resolve(e.data.data);
      };

      this.worker.addEventListener('message', callback, false);
    });
  }
}

export default DataRecorder;

