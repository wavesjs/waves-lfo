
"use strict";

var Lfo = require('../core/lfo-base');
var audioContext; // for lazy audioContext creation

class AudioIn extends Lfo {

  constructor(options = {}) {
    // this.type = 'audio-in';

    // defaults
    var defaults = {
      frameSize: 512,
      // blockSize: 2048,
      // hopSize: 512,
      channel: 0
    };

    super(options, defaults);

    // private
    if (!this.params.ctx) {
      audioContext = new AudioContext();
      this.ctx = audioContext;
    } else {
      this.ctx = this.params.ctx;
    }

    this.src = this.params.src;
    this.time = 0;
    this.metaData = {};
  }

  // configureStream() {

  // }

  start() {}
  stop() {}
}

module.exports = AudioIn;
