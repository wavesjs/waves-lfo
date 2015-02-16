
"use strict";

var Lfo = require('lfo/lfo-base');
var audioContext = require('audio-context');
var extend = Object.assign;

class AudioIn extends Lfo {

  constructor(previous = null, options = {}) {
    if (!(this instanceof AudioIn)) return new AudioIn(previous, options);
    
    this.type = 'audio-in';
   
    // if no process in the duck, then it's an options duck
    if(previous && !('process' in previous)){
      extend(options, previous);
      previous = null;
    }

    // defaults
    options = extend({
      frameSize: 2048,
      blockSize: 256,
      hopSize: 256,
      channel: 0
    }, options);

    super(previous, options);

    // pubs
    this.frameSize = options.frameSize;
    this.blockSize = options.blockSize;
    this.hopSize = options.hopSize;
    this.channel = options.channel;
    this.offset = 0;
    this.sampleRate = audioContext.sampleRate;

    // privs
    this.__buferSize = this.frameSize + this.blockSize;
    this.__ctx = audioContext;
    this.__currentTime = 0;
    this.__currentIndex = 0;
    this.__src = options.src;
  }

  start() {}

}

module.exports = AudioIn;