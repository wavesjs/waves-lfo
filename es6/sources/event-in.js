'use strict';

var Lfo = require('../core/lfo-base');

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

    this.setupStream({
      frameSize: this.params.frameSize,
      frameRate: this.params.frameRate,
      // @NOTE does it make sens ?
      blockSampleRate: this.params.frameRate * this.params.frameSize
    });
  }

  start() {
    // should be setted in the first process call
    this.startTime = undefined;
    this.isStarted = true;
    this.reset();
  }

  stop() {
    this.startTime = undefined;
    this.isStarted = false;
    this.finalize();
  }

  process(time, frame, metaData = {}) {
    if (!this.isStarted) { return; }

    var audioContext = this.params.audioContext;
    var frameTime;

    // à revoir
    // if no time provided, use audioContext.currentTime
    frameTime = !isNaN(parseFloat(time)) && isFinite(time) ?
      time : audioContext.currentTime;

    // set `startTime` if first call after a `start`
    if (!this.startTime) { this.startTime = time; }

    // handle time according to config
    if (this.params.timeType === 'relative') {
      frameTime = time - this.startTime;
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
