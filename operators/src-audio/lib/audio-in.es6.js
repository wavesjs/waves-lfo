
"use strict";

var Lfo = require('../../../lfo-base');
var audioContext = require('audio-context');

class AudioIn extends Lfo {

  constructor(options = {}) {
    if (!(this instanceof AudioIn)) return new AudioIn(options);
    
    this.type = 'audio-in';
    
    // defaults
    var defaults = {
      frameSize: 2048,
      blockSize: 256,
      hopSize: 256,
      channel: 0
    };

    super(null, options, defaults);
   
    // pubs
    this.frameSize = this.params.frameSize;
    this.blockSize = this.params.blockSize;
    this.hopSize = this.params.hopSize;
    this.channel = this.params.channel;
    this.frameOffset = 0;
    this.sampleRate = audioContext.sampleRate;

    // privs
    this._ctx = audioContext;
    this._currentTime = 0;
    this._src = this.params.src;

    this.setupStream({
      frameRate: this.sampleRate / this.hopSize,
      frameSize: this.frameSize,
      audioSampleRate: this._ctx.sampleRate
    });
  }

  start() {}

}

module.exports = AudioIn;