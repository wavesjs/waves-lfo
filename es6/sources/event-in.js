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
      timeType: 'absolute', // 'absolute', 'relative', 'slave'
      audioContext: new AudioContext(), // should overriden in options
      frameSize: 1,
    };
    // cannot have previous
    super(null, options, defaults);

    /*
      frameSize: 1,
      frameRate: 0
      // are ok ?
    */
    this.setupStream({ frameSize: this.params.frameSize });
  }

  start() {
    this.startTime = this.params.currentTime;
    this.isStarted = true;
  }

  stop() {
    this.finalize();
    this.isStarted = false;
  }

  process(time, frame) {
    if (!this.isStarted) { return; }
    var frameTime;
    var audioContext = this.params.audioContext;
    // handle time according to config
    switch (this.params.timeType) {
      case 'relative':
        frameTime = audioContext.currentTime - this.startTime;
        break;
      case 'absolute':
        frameTime = audioContext.currentTime;
        break;
      case 'slave':
      default:
        frameTime = time;
        break;
    }

    // works if frame is an array
    this.outFrame.set(frame, 0);
    // fallback if number ?
    this.output(time);
  }
}

module.exports = EventIn;