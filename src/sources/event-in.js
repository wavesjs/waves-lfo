import BaseLfo from '../core/base-lfo';

/**
 * Create a function that return a time in seconds depending on the
 * environnement (node or browser)
 * If running in node the time rely on `process.hrtime`, while if in the browser
 * it is provided by the current time of an `AudioContext`, this context can
 * optionnaly be provided to keep time consistency between several `EventIn`
 * nodes.
 *
 * @param {AudioContext} [audioContext=null] - Optionnal audio context to be
 *  used to get the time.
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
 * The `EventIn` class allows to manually create a stream of data or to feed
 * a stream from any source (eg. accelerometers) into a lfo graph.
 *
 * @param {Object} options - Override default parameters.
 * @param {String} [options.outType='block'] - Type of the output - allowed values:
 * `block` or `vector`.
 * @param {Number} [options.frameSize=1] - Size of the output frame.
 * @param {Number} [options.frameRate=0] - Frame rate of the stream. Also define the
 *  `sourceSampleRate` of the stream parameters.
 * @param {Array|String} [options.description] - Optionnal description describing
 *  the dimensions of the output frame
 * @param {Boolean} [options.absoluteTime=false] - Define if time should be used as
 *  forwarded as given in the process method, or relatively to the time of the
 *  first `process` call after start.
 *
 * @memberof module:sources
 * @example
 * import * as lfo from 'waves-lfo';
 *
 * const eventIn = new EventIn({
 *   outputType: 'vector',
 *   frameSize: 3,
 *   frameRate: 1 / 50,
 *   description: ['alpha', 'beta', 'gamma']
 * })
 *
 * // connect source to operators and sink(s)
 * // initialize the whole graph
 * eventIn.start();
 *
 * // feed `deviceorientation` data into the graph
 * window.addEventListener('deviceorientation', (e) => {
 *   const frame = [e.alpha, e.beta, e.gamma];
 *   // by setting `time` to null, we let the node create
 *   // a relative time tag internally
 *   eventIn.process(null, frame);
 * }, false);
 */
class EventIn extends BaseLfo {
  constructor(options) {
    const audioContext = options.audioContext;
    delete options.audioContext;

    super({
      absoluteTime: false,
      outputType: 'block',
      frameSize: 1,
      frameRate: 0,
      description: null,
    }, options);

    this._getTime = getTimeFunction(audioContext);

    this._isStarted = false;
    this._startTime = undefined;
    this._systemTime = undefined;

    this.addBooleanParam('absoluteTime', 'constant');
    this.addConstantParam('outputType', ['block', 'vector'], 'constant');
    this.addIntegerParam('frameSize', 1, 1e9, 'dynamic');
    this.addFloatParam('frameRate', 0, 1e9, 'dynamic');
    this.addAnyParam('frameRate', 'constant');
  }

  initialize() {
    const frameSize = this.getParam('frameSize');
    const frameRate = this.getParam('frameRate');
    const sourceSampleRate = this.getParam('frameRate');
    const outputType = this.getParam('outputType');
    const description = this.getParam('description');

    super.initialize({
      frameSize,
      frameRate,
      sourceSampleRate,
      outputType,
      description,
    });
  }

  /**
   * Start the whole graph, triggers the _initialization_ of all the node of the
   * graph. Any call to `process` before `start` will be ignored.
   */
  start() {
    this.initialize();
    this.reset();

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
      const endTime = this.time + (currentTime - this._systemTime);

      this.finalize(endTime);
      this._isStarted = false;
    }
  }

  process(time, frame, metadata = {}) {
    super.process(time, frame, metadata);

    if (!this._isStarted) return;

    const currentTime = this._getTime();
    // if no time provided, use system time
    time = Number.isFinite(time) ? time : currentTime;

    if (!this._startTime)
      this._startTime = time;

    if (this.getParam('absoluteTime') === false)
      time = time - this._startTime;

    // deal with scalar input
    if (!frame.length)
      frame = [frame];

    for (let i = 0; i < this.streamParam.frameSize; i++)
      this.outFrame[i] = frame[i];

    this.time = time;
    this.metadata = metadata;

    // store current time to compute `endTime` on stop
    this._systemTime = currentTime;
    this.output();
  }
}

export default EventIn;
