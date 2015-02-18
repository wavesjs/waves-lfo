
"use strict";

let AudioIn = require('./audio-in');
let Framer = require('./framer');
var fs = require('fs');

// BinaryArray as source
class AudioInBuffer extends AudioIn {

  constructor(options = {}) {
    if (!(this instanceof AudioInBuffer)) return new AudioInBuffer(options);
    super(options);
   
    this.type = 'audio-in-buffer';

    this.framer = new Framer(this.outFrame, this.hopSize, this._ctx.sampleRate, (time, frame) => {
      this.output(time);
    });

    var wrk = fs.readFileSync(__dirname + '/process-worker.js', 'utf8');
    var blob = new Blob([wrk], { type: "text/javascript" });
    

    var workerMessage = (e) => {
      var block = e.data.block;
      var time = e.data.time;

      this.framer.input(time, block);
    };
    
    this._proc = new Worker(window.URL.createObjectURL(blob));
    this._proc.addEventListener('message', workerMessage, false);
  }

  start() {
    var message = {
      options: {
        sampleRate: this.sampleRate,
        hopSize: this.hopSize,
        blockSize: this.blockSize,
        frameSize: this.frameSize
      },
      data: this._src.getChannelData(this.channel)
    };

    this._proc.postMessage(message);
  }
}

module.exports = AudioInBuffer;