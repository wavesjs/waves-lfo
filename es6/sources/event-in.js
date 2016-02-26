import BaseLfo from '../core/base-lfo';

/*
  can forward
    - relativeTime (according to it's start() method)
    - absoluteTime (audioContex time)
    - input time

  methods
    - `start()` -> call `reset()`
    - `stop()`  -> call `finalize()`
*/

export default class EventIn extends BaseLfo {
  constructor(options) {
    super(options, {
      timeType: 'absolute'
    });

    // test AudioContext for use in node environment
    if (!this.params.ctx && (typeof process === 'undefined')) {
      this.params.ctx = new AudioContext();
    }

    this._isStarted = false;
    this._startTime = undefined;
  }

  configureStream() {
    // throw error if some values are undefined ?
    this.streamParams.frameSize = this.params.frameSize;
    this.streamParams.frameRate = this.params.frameRate;
    // @NOTE what does make sens in this case ?
    // this.streamParams.sourceSampleRate = this.params.frameSize * this.params.frameRate;
    this.streamParams.sourceSampleRate = (this.params.sourceSampleRate || this.params.frameRate);
  }

  start() {
    // should be setted in the first process call
    this._isStarted = true;
    this._startTime = undefined;

    this.initialize();
    this.reset();
  }

  stop() {
    this._isStarted = false;
    this._startTime = undefined;
    this.finalize();
  }

  process(time, frame, metaData = {}) {
    if (!this._isStarted) { return; }
    // à revoir
    // if no time provided, use audioContext.currentTime
    var frameTime = !isNaN(parseFloat(time)) && isFinite(time) ?
      time : this.params.ctx.currentTime;

    // set `startTime` if first call after a `start`
    if (!this._startTime) { this._startTime = frameTime; }

    // handle time according to config
    if (this.params.timeType === 'relative') {
      frameTime = time - this._startTime;
    }

    // if scalar, create a vector
    if (frame.length === undefined) { frame = [frame]; }
    // works if frame is an array
    this.outFrame.set(frame, 0);
    this.time = frameTime;
    this.metaData = metaData;

    this.output();
  }
}

module.exports = EventIn;
