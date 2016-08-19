import BaseLfo from '../core/base-lfo';

/**
 *
 * @todo - Revise how time is provided to make it compatible with node
 */
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

    this._isStarted = true;
    // define in the first `process` call
    this._startTime = undefined;
    this._audioTime = undefined;
  }

  stop() {
    if (this._isStarted && this._startTime) {
      const currentTime = this.params.ctx.currentTime;
      const endTime = this.time + (currentTime - this._audioTime);

      this.finalize(endTime);
      this._isStarted = false;
    }
  }

  process(time, frame, metaData = {}) {
    if (!this._isStarted) return;

    const currentTime = this.params.ctx.currentTime;
    // if no time provided, use audioContext.currentTime
    time = Number.isFinite(time) ? time : currentTime;

    if (!this._startTime)
      this._startTime = time;

    if (this.params.absoluteTime === false)
      time = time - this._startTime;

    // deal with scalar input
    if (!frame.length)
      frame = [frame];

    for (let i = 0; i < this.streamParam.frameSize; i++)
      this.outFrame[i] = frame[i];

    this.time = time;
    this.metaData = metaData;
    this._audioTime = currentTime;

    this.output();
  }
}

module.exports = EventIn;
