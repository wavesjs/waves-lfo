'use strict';

var { Lfo } = require('../core/lfo-base');

/*
  can forward
    - relativeTime (according to it's start() method)
    - absoluteTime (audioContex time)
    - input time

  methods
    - `start()` -> call `reset()`
    - `stop()`  -> call `finalize()`
*/

class EventIn extends Lfo {
  constructor(options) {

    var defaults = {
      timeType: 'absolute',
      frameSize: 1
    };
    // cannot have previous
    super(null, options, defaults);

    if (!this.params.audioContext) {
      this.params.audioContext = new AudioContext();
    }

    this.startTime = undefined;
    this.isStarted = false;

    this.setupStream({ frameSize: this.params.frameSize });
  }

  start() {
    // should be setted in the first process call
    this.startTime = undefined;
    this.isStarted = true;
  }

  stop() {
    this.finalize();
    this.startTime = undefined;
    this.isStarted = false;
  }

  process(time, frame, metadata) {
    if (!this.isStarted) { return; }

    var audioContext = this.params.audioContext;
    var frameTime;

    // à revoir
    // if no time provided, use audioContext.currentTime
    time = !isNaN(parseFloat(time)) && isFinite(time) ?
      time : audioContext.currentTime;

    // set `startTime` if first call of the method
    if (!this.startTime) {
      this.startTime = time;
    }

    // handle time according to config
    if (this.params.timeType === 'relative') {
      frameTime = time - this.startTime;
    } else {
      frameTime = time;
    }

    // if scalar, create a vector
    if (frame.length === undefined) { frame = [frame]; }
    // works if frame is an array
    this.outFrame.set(frame, 0);
    this.time = frameTime;
    this.output();
  }
}

module.exports = EventIn;
