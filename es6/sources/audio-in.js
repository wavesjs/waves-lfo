
"use strict";

var { Lfo } = require('../core/lfo-base');
// var audioContext = new window.AudioContext();

class AudioIn extends Lfo {

  constructor(options = {}) {
    this.type = 'audio-in';

    // defaults
    var defaults = {
      frameSize: 512,
      blockSize: 2048,
      hopSize: 512,
      channel: 0
    };

    super(null, options, defaults);

    // private
    this._ctx = this.params.ctx || new window.AudioContext();
    this._currentTime = 0;
    this._src = this.params.src;

    // public
    this.frameSize = this.params.frameSize;
    this.blockSize = this.params.blockSize;
    this.hopSize = this.params.hopSize;
    this.channel = this.params.channel;
    this.frameOffset = 0;
    this.sampleRate = this._ctx.sampleRate;

    this.setupStream({
      frameRate: this.sampleRate / this.hopSize,
      frameSize: this.frameSize,
      audioSampleRate: this._ctx.sampleRate // cannot be used ... why is this here ?
    });
  }

  start() {}

}

function factory(options) {
  return new AudioIn(options);
}
factory.AudioIn = AudioIn;

module.exports = factory;