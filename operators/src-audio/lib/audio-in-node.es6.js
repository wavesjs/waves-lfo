
"use strict";

let AudioIn = require('./audio-in');
let Reslicer = require('./reslicer');
let Framer = require('./framer');


// web audio API node as a source
class AudioInNode extends AudioIn {

  constructor(options = {}) {
    if (!(this instanceof AudioInNode)) return new AudioInNode(options);
    super(options);
    
    this.type = 'audio-in-node';

    this.reslicer = new Framer(this.outFrame, this.hopSize, (time, frame) => {
      this.output(this.time);
    });

    this._proc = this._ctx.createScriptProcessor(this.hopSize, 1, 1);
    // keepalive
    this._ctx['_process-' + new Date().getTime()] = this._proc;
  }

  // connect the audio nodes to start streaming
  start() {

    this._proc.onaudioprocess = (e) => {
      var block = e.inputBuffer.getChannelData(this.channel);
      this.reslicer.input(this.time, block);
      this.time += block.length / this.sampleRate;
    };

    // start "the patch" ;) 
    this._src.connect(this._proc);
    this._proc.connect(this._ctx.destination);
  }

}

module.exports = AudioInNode;