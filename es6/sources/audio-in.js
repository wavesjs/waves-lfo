
"use strict";

var { Lfo } = require('../core/lfo-base');
// var audioContext = new window.AudioContext();

class AudioIn extends Lfo {

  constructor(options = {}) {
    this.type = 'audio-in';

    // defaults
    var defaults = {
      frameSize: 512,
      // blockSize: 2048,
      // hopSize: 512,
      channel: 0
    };

    super(null, options, defaults);

    // private
    this.ctx = this.params.ctx || new window.AudioContext();
    // this._currentTime = 0;
    this.src = this.params.src;

    this.time = 0;
    this.metaData = {};

    // public
    // this.frameSize = this.params.frameSize;
    // this.blockSize = this.params.blockSize;
    // this.hopSize = this.params.hopSize;
    // this.channel = this.params.channel;
    this.frameOffset = 0;
    // this.sampleRate = this.ctx.sampleRate;

    this.setupStream({
      frameRate: this.ctx.sampleRate / this.params.frameSize,
      frameSize: this.params.frameSize,
      blockSampleRate: this.ctx.sampleRate
    });

    // console.log(this.streamParams);
  }

  start() {}

}

function factory(options) {
  return new AudioIn(options);
}
factory.AudioIn = AudioIn;

module.exports = factory;