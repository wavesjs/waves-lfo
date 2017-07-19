import BaseLfo from '../../core/BaseLfo';
import SourceMixin from '../../core/SourceMixin';

// http://stackoverflow.com/questions/17575790/environment-detection-node-js-or-browser
const isNode = new Function('try { return this === global; } catch(e) { return false }');

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
  if (isNode()) {
    return () => {
      const t = process.hrtime();
      return t[0] + t[1] * 1e-9;
    }
  } else {
    // @todo - replace with `performance.now`
    if (audioContext === null || (!audioContext instanceof AudioContext)) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioContext();
    }

    return () => audioContext.currentTime;
  }
}


const definitions = {
  absoluteTime: {
    type: 'boolean',
    default: false,
    constant: true,
  },
  audioContext: {
    type: 'any',
    default: null,
    constant: true,
    nullable: true,
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
    default: null,
    min: 0,
    max: +Infinity, // same here
    nullable: true,
    metas: { kind: 'static' },
  },
  frameRate: {
    type: 'float',
    default: null,
    min: 0,
    max: +Infinity, // same here
    nullable: true,
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
 * a stream from another source (e.g. sensors) into a processing graph.
 *
 * @param {Object} options - Override parameters' default values.
 * @param {String} [options.frameType='signal'] - Type of the input - allowed
 * values: `signal`,  `vector` or `scalar`.
 * @param {Number} [options.frameSize=1] - Size of the output frame.
 * @param {Number} [options.sampleRate=null] - Sample rate of the source stream,
 *  if of type `signal`.
 * @param {Number} [options.frameRate=null] - Rate of the source stream, if of
 *  type `vector`.
 * @param {Array|String} [options.description] - Optionnal description
 *  describing the dimensions of the output frame
 * @param {Boolean} [options.absoluteTime=false] - Define if time should be used
 *  as forwarded as given in the process method, or relatively to the time of
 *  the first `process` call after start.
 *
 * @memberof module:common.source
 *
 * @todo - Add a `logicalTime` parameter to tag frame according to frame rate.
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * const eventIn = new lfo.source.EventIn({
 *   frameType: 'vector',
 *   frameSize: 3,
 *   frameRate: 1 / 50,
 *   description: ['alpha', 'beta', 'gamma'],
 * });
 *
 * // connect source to operators and sink(s)
 *
 * // initialize and start the graph
 * eventIn.start();
 *
 * // feed `deviceorientation` data into the graph
 * window.addEventListener('deviceorientation', (e) => {
 *   const frame = {
 *     time: window.performace.now() / 1000,
 *     data: [e.alpha, e.beta, e.gamma],
 *   };
 *
 *   eventIn.processFrame(frame);
 * }, false);
 */
class EventIn extends SourceMixin(BaseLfo) {
  constructor(options = {}) {
    super(definitions, options);

    const audioContext = this.params.get('audioContext');
    this._getTime = getTimeFunction(audioContext);
    this._startTime = null;
    this._systemTime = null;
    this._absoluteTime = this.params.get('absoluteTime');
  }

  /**
   * Propagate the `streamParams` in the graph and allow to push frames into
   * the graph. Any call to `process` or `processFrame` before `start` will be
   * ignored.
   *
   * @see {@link module:common.core.BaseLfo#processStreamParams}
   * @see {@link module:common.core.BaseLfo#resetStream}
   * @see {@link module:common.source.EventIn#stop}
   */
  start(startTime = null) {
    if (this.initialized === false) {
      if (this.initPromise === null) // init has not yet been called
        this.initPromise = this.init();

      this.initPromise.then(() => this.start(startTime));
      return;
    }

    this._startTime = startTime;
    this._systemTime = null; // value set in the first `process` call

    this.started = true;
  }

  /**
   * Finalize the stream and stop the whole graph. Any call to `process` or
   * `processFrame` after `stop` will be ignored.
   *
   * @see {@link module:common.core.BaseLfo#finalizeStream}
   * @see {@link module:common.source.EventIn#start}
   */
  stop() {
    if (this.started && this._startTime !== null) {
      const currentTime = this._getTime();
      const endTime = this.frame.time + (currentTime - this._systemTime);

      this.finalizeStream(endTime);
      this.started = false;
    }
  }

  /** @private */
  processStreamParams() {
    const frameSize = this.params.get('frameSize');
    const frameType = this.params.get('frameType');
    const sampleRate = this.params.get('sampleRate');
    const frameRate = this.params.get('frameRate');
    const description = this.params.get('description');

    // init operator's stream params
    this.streamParams.frameSize = frameType === 'scalar' ? 1 : frameSize;
    this.streamParams.frameType = frameType;
    this.streamParams.description = description;

    if (frameType === 'signal') {
      if (sampleRate === null)
        throw new Error('Undefined "sampleRate" for "signal" stream');

      this.streamParams.sourceSampleRate = sampleRate;
      this.streamParams.frameRate = sampleRate / frameSize;
      this.streamParams.sourceSampleCount = frameSize;

    } else if (frameType === 'vector' || frameType === 'scalar') {
      if (frameRate === null)
        throw new Error(`Undefined "frameRate" for "${frameType}" stream`);

      this.streamParams.frameRate = frameRate;
      this.streamParams.sourceSampleRate = frameRate;
      this.streamParams.sourceSampleCount = 1;
    }

    this.propagateStreamParams();
  }

  /** @private */
  processFunction(frame) {
    const currentTime = this._getTime();
    const inData = frame.data.length ? frame.data : [frame.data];
    const outData = this.frame.data;
    // if no time provided, use system time
    let time = Number.isFinite(frame.time) ? frame.time : currentTime;

    if (this._startTime === null)
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
    if (!this.started) return;

    this.prepareFrame();
    this.processFunction(frame);
    this.propagateFrame();
  }
}

export default EventIn;
