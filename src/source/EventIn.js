import BaseLfo from '../core/BaseLfo';
import parameters from 'parameters';

/**
 * Create a function that returns time in seconds according to the current
 * environnement (node or browser).
 * If running in node the time rely on `process.hrtime`, while if in the browser
 * it is provided by the `currentTime` of an `AudioContext`, this context can
 * optionnaly be provided to keep time consistency between several `EventIn`
 * nodes.
 *
 * @param {AudioContext} [audioContext=null] - Optionnal audio context.
 * @return {Function}
 * @private
 */
function getTimeFunction(audioContext = null) {
  if (typeof window === 'undefined') {
    return () => {
      const t = process.hrtime();
      return t[0] + t[1] * 1e-9;
    }
  } else {
    if (audioContext === null || (!audioContext instanceof AudioContext))
      audioContext = new AudioContext();

    return () => audioContext.currentTime;
  }
}


const definitions = {
  absoluteTime: {
    type: 'boolean',
    default: false,
    constant: true,
  },
  frameType: {
    type: 'enum',
    list: ['signal', 'vector', 'scalar'],
    default: 'signal',
    constant: true,
  },
  frameSize: {
    type: 'integer',
    default: 1,
    min: 1,
    max: +Infinity, // not recommended...
    metas: { kind: 'static' },
  },
  sampleRate: {
    type: 'float',
    default: 0,
    min: 0,
    max: +Infinity, // same here
    metas: { kind: 'static' },
  },
  description: {
    type: 'any',
    default: null,
    constant: true,
  }
};

/**
 * The `EventIn` operator allows to manually create a stream of data or to feed
 * a stream from another source (e.g. accelerometers) into a processing graph.
 *
 * @param {Object} options - Override parameters' default values.
 * @param {String} [options.frameType='signal'] - Type of the input - allowed
 * values: `signal`,  `vector` or `scalar`.
 * @param {Number} [options.frameSize=1] - Size of the output frame.
 * @param {Number} [options.sampleRate=0] - Rate of the source stream.
 * @param {Array|String} [options.description] - Optionnal description
 *  describing the dimensions of the output frame
 * @param {Boolean} [options.absoluteTime=false] - Define if time should be used
 *  as forwarded as given in the process method, or relatively to the time of
 *  the first `process` call after start.
 *
 * @memberof module:source
 *
 * @todo - Add a `logicalTime` parameter to tag frame acoording to frame rate.
 * @todo - Define if it makes sens to define a `frameRate` if time is defined
 *  on the fly.
 * @todo - For vector frame type use `options.frameRate` instead of
 *  `options.sampleRate`.
 *
 * @example
 * import * as lfo from 'waves-lfo';
 *
 * const eventIn = new lfo.source.EventIn({
 *   frameType: 'vector',
 *   frameSize: 3,
 *   frameRate: 1 / 50,
 *   description: ['alpha', 'beta', 'gamma']
 * });
 *
 * // connect source to operators and sink(s)
 *
 * // initialize the whole graph
 * eventIn.start();
 *
 * // feed `deviceorientation` data into the graph
 * window.addEventListener('deviceorientation', (e) => {
 *   const frame = {
 *     time: new Date().getTime(),
 *     data: [e.alpha, e.beta, e.gamma],
 *   };
 *   // by setting `time` to null, we let the node create
 *   // a relative time tag internally
 *   eventIn.processFrame(frame);
 * }, false);
 */
class EventIn extends BaseLfo {
  constructor(options = {}) {
    super();

    // audioContext is not a real parameter so cache it and remove from options
    const audioContext = options.audioContext;
    delete options.audioContext;

    this.params = parameters(definitions, options);
    this.params.addListener(this.onParamUpdate);

    this._getTime = getTimeFunction(audioContext);
    this._isStarted = false;
    this._startTime = null;
    this._systemTime = null;
    this._absoluteTime = this.params.get('absoluteTime');
  }

  /**
   * Start the whole graph, propagate the `streamParams` in the graph. Any call
   * to `process` or `processFrame` before `start` will be ignored.
   *
   * @see {@link module:core.BaseLfo#processStreamParams}
   * @see {@link module:core.BaseLfo#resetStream}
   * @see {@link module:source.EventIn#stop}
   */
  start(startTime = null) {
    this.processStreamParams();
    this.resetStream();

    this._startTime = startTime;
    this._isStarted = true;
    // values set in the first `process` call
    this._systemTime = null;
  }

  /**
   * Stop the whole graph, and finalize the strem. Any call to `process` after
   * `stop` will be ignored.
   *
   * @see {@link module:core.BaseLfo#finalizeStream}
   * @see {@link module:source.EventIn#start}
   */
  stop() {
    if (this._isStarted && this._startTime) {
      const currentTime = this._getTime();
      const endTime = this.frame.time + (currentTime - this._systemTime);

      this.finalizeStream(endTime);
      this._isStarted = false;
    }
  }

  /** @private */
  processStreamParams() {
    const frameSize = this.params.get('frameSize');
    const frameType = this.params.get('frameType');
    const sampleRate = this.params.get('sampleRate');
    const description = this.params.get('description');
    // init operator's stream params
    this.streamParams.frameSize = frameSize;
    this.streamParams.frameType = frameType;
    this.streamParams.sourceSampleRate = sampleRate;
    this.streamParams.description = description;

    if (frameType === 'signal')
      this.streamParams.frameRate = sampleRate / frameSize;
    else // `vector` or `scalar`
      this.streamParams.frameRate = sampleRate;

    this.propagateStreamParams();
  }

  /**
   * Propagate a frame object in the graph.
   *
   * @param {Object} frame - Input frame.
   * @param {Number} frame.time - Frame time.
   * @param {Float32Array|Array} frame.data - Frame data.
   * @param {Object} [frame.metadata=undefined] - Optionnal frame metadata.
   *
   * @example
   * eventIn.processFrame({ time: 1, data: [0, 1, 2] });
   */
  processFrame(frame) {
    if (!this._isStarted) return;

    this.prepareFrame();
    this.processFunction(frame);
    this.propagateFrame();
  }

  /**
   * Alternative interface to propagate a frame in the graph. Pack `time`,
   * `data` and `metadata` in a frame object.
   *
   * @param {Number} time - Frame time.
   * @param {Float32Array|Array} data - Frame data.
   * @param {Object} metadata - Optionnal frame metadata.
   *
   * @example
   * eventIn.process(1, [0, 1, 2]);
   * // is equivalent to
   * eventIn.processFrame({ time: 1, data: [0, 1, 2] });
   */
  process(time, data, metadata = null) {
    this.processFrame({ time, data, metadata });
  }

  /** @private */
  processFunction(frame) {
    const currentTime = this._getTime();
    const inData = frame.data.length ? frame.data : [frame.data];
    const outData = this.frame.data;
    // if no time provided, use system time
    let time = Number.isFinite(frame.time) ? frame.time : currentTime;

    if (this._startTime = null)
      this._startTime = time;

    if (this._absoluteTime === false)
      time = time - this._startTime;

    for (let i = 0, l = this.streamParams.frameSize; i < l; i++)
      outData[i] = inData[i];

    this.frame.time = time;
    this.frame.metadata = frame.metadata;
    // store current time to compute `endTime` on stop
    this._systemTime = currentTime;
  }
}

export default EventIn;
