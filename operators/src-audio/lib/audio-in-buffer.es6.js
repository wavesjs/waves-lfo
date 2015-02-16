
"use strict";

let AudioIn = require('./audio-in');
var fs = require('fs');

// BinaryArray as source
class AudioInBuffer extends AudioIn {

  constructor(previous = null, options = {}) {
    if (!(this instanceof AudioInBuffer)) return new AudioInBuffer(previous, options);
    super(previous, options);
   
    this.type = 'audio-in-buffer';

    var wrk = fs.readFileSync(__dirname + '/process-worker.js', 'utf8');
    var blob = new Blob([wrk], { type: "text/javascript" });
    var workerMessage = (e) => this.emit('frame', e.data.time, e.data.frame);
    this.__proc = new Worker(window.URL.createObjectURL(blob));
    this.__proc.addEventListener('message', workerMessage, false);
  }

  start() {
    var message = {
      options: {
        sampleRate: this.sampleRate,
        hopSize: this.hopSize,
        frameSize: this.frameSize
      },
      data: this.__src.getChannelData(this.channel)
    };

    this.__proc.postMessage(message);
  }
}

module.exports = AudioInBuffer;