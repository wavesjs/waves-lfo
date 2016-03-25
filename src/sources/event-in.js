import BaseLfo from '../core/base-lfo';


export default class EventIn extends BaseLfo {
  constructor(options) {
    super({
      absoluteTime: false,
    }, options);

    // test AudioContext for use in node environment
    if (!this.params.ctx && (typeof process === 'undefined')) {
      this.params.ctx = new AudioContext();
    }

    this._isStarted = false;
    this._startTime = undefined;
  }

  initialize() {
    super.initialize({
      frameSize: this.params.frameSize,
      frameRate: this.params.frameRate,
      sourceSampleRate: this.params.frameRate,
    });
  }

  start() {
    this.initialize();
    this.reset();

    const currentTime = this.params.ctx.currentTime;

    // should be setted in the first process call
    this._isStarted = true;
    this._startTime = undefined;
    this._lastTime = undefined;
  }

  stop() {
    if (this._isStarted && this._startTime) {
      const currentTime = this.params.ctx.currentTime;
      const endTime = this.time + (currentTime - this._lastTime);

      this.finalize(endTime);
    }
  }

  process(time, frame, metaData = {}) {
    if (!this._isStarted) return;

    const currentTime = this.params.ctx.currentTime;
    // if no time provided, use audioContext.currentTime
    time = !isNaN(parseFloat(time)) && isFinite(time) ?
      time : currentTime;

    // set `startTime` if first call after a `start`
    if (!this._startTime)
      this._startTime = time;

    // handle time according to config
    if (this.params.absoluteTime === false)
      time = time - this._startTime;

    // if scalar, create a vector
    if (frame.length === undefined)
      frame = [frame];

    // works if frame is an array
    this.outFrame.set(frame, 0);
    this.time = time;
    this.metaData = metaData;
    this._lastTime = currentTime;

    this.output();
  }
}

module.exports = EventIn;
