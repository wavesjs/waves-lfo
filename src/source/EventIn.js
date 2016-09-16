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


/**
 * EventIn parameter definitions.
 */
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
 * a stream from another source (eg. accelerometers) into a processing graph.
 *
 * @param {Object} options - Override parameters' default values.
 * @param {String} [options.inputType='signal'] - Type of the input - allowed
 * values: `signal`,  `vector` or `scalar`.
 * @param {Number} [options.frameSize=1] - Size of the output frame.
 * @param {Number} [options.sampleRate=0] - Rate of the source stream.
 * @param {Array|String} [options.description] - Optionnal description describing
 *  the dimensions of the output frame
 * @param {Boolean} [options.absoluteTime=false] - Define if time should be used as
 *  forwarded as given in the process method, or relatively to the time of the
 *  first `process` call after start.
 *
 * @memberof module:sources
 *
 * @example
 * import * as lfo from 'waves-lfo';
 *
 * const eventIn = new EventIn({
 *   frameType: 'vector',
 *   frameSize: 3,
 *   frameRate: 1 / 50,
 *   description: ['alpha', 'beta', 'gamma']
 * })
 *
 * // connect source to operators and sink(s)
 *
 * // initialize the whole graph
 * eventIn.start();
 *
 * // feed `deviceorientation` data into the graph
 * window.addEventListener('deviceorientation', (e) => {
 *   const frame = [e.alpha, e.beta, e.gamma];
 *   // by setting `time` to null, we let the node create
 *   // a relative time tag internally
 *   eventIn.processFrame(null, frame);
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
    this._startTime = undefined;
    this._systemTime = undefined;
    this._absoluteTime = this.params.get('absoluteTime');
  }

  onParamUpdate(name, value, metas) {
    super.onParamUpdate(name, value, metas);
  }

  /**
   * Start the whole graph, triggers the _initialization_ of all the node of the
   * graph. Any call to `process` before `start` will be ignored.
   */
  start() {
    this.processStreamParams();
    this.resetStream();

    this._isStarted = true;
    // values set in the first `process` call
    this._startTime = undefined;
    this._systemTime = undefined;
  }

  /**
   * Stop the whole graph, triggers the _finalization_ of all the node of the
   * graph. Any call to `process` after `stop` will be ignored.
   */
  stop() {
    if (this._isStarted && this._startTime) {
      const currentTime = this._getTime();
      const endTime = this.frame.time + (currentTime - this._systemTime);

      this.finalizeStream(endTime);
      this._isStarted = false;
    }
  }

  processStreamParams() {
    // this.preprocessStreamParams(); // no need for that in a source
    const frameSize = this.params.get('frameSize')
    const frameType = this.params.get('frameType')
    const sampleRate = this.params.get('sampleRate')
    const description = this.params.get('description')
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
   * As the `preprocessStreamParams` is not called and the logic is the same,
   * whatever the input type, we can define the `processFunction` directly.
   */
  processFunction(frame) {
    if (!this._isStarted) return;

    const currentTime = this._getTime();
    // if no time provided, use system time
    let time = Number.isFinite(frame.time) ? frame.time : currentTime;

    if (!this._startTime)
      this._startTime = time;

    if (this._absoluteTime === false)
      time = time - this._startTime;

    if (this.streamParams.frameType === 'scalar') {
      this.frame.data = frame.data;
    } else { // 'vector' or 'signal'
      const inData = frame.data;
      const outData = this.frame.data;

      for (let i = 0, l = this.streamParams.frameSize; i < l; i++)
        outData[i] = inData[i];
    }

    this.frame.time = time;
    this.frame.metadata = metadata;
    // store current time to compute `endTime` on stop
    this._systemTime = currentTime;
  }
}

export default EventIn;
