
"use strict";

let { AudioIn } = require('./audio-in');
let Framer = require('./framer');

// web audio API node as a source
class AudioInNode extends AudioIn {

  constructor(options = {}) {
    super(options);

    this.type = 'audio-in-node';

    console.log(this.params);

    this.reslicer = new Framer(this.outFrame, this.hopSize, this._ctx.sampleRate, (time, frame) => {
      this.output(this.time);
    });

    this._proc = this._ctx.createScriptProcessor(this.hopSize, 1, 1);
    // keep the script processor alive
    this._ctx['_process-' + new Date().getTime()] = this._proc;
  }

  // connect the audio nodes to start streaming
  start() {

    this._proc.onaudioprocess = (e) => {
      var block = e.inputBuffer.getChannelData(this.channel);
      this.reslicer.input(this.time, block);
      // @FIXME: `this.time` is always `NaN`
      this.time += block.length / this.sampleRate;
    };

    // start "the patch" ;)
    this._src.connect(this._proc);
    // does it make sens ?
    this._proc.connect(this._ctx.destination);
  }
}

function factory(options) {
  return new AudioInNode(options);
}
factory.AudioInNode = AudioInNode;

module.exports = factory;