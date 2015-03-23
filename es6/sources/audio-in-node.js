"use strict";

let { AudioIn } = require('./audio-in');
let Framer = require('./framer');

// web audio API node as a source
class AudioInNode extends AudioIn {

  constructor(options = {}) {
    super(options);

    this.type = 'audio-in-node';

    console.log(this.params);

    // this.reslicer = new Framer(this.outFrame, this.hopSize, this._ctx.sampleRate, (time, frame) => {
    //   this.output(this.time);
    // });

    this.scriptProcessor = this.ctx.createScriptProcessor(this.frameSize, 1, 1);
    // keep the script processor alive
    this.ctx['_process-' + new Date().getTime()] = this.scriptProcessor;
  }

  // connect the audio nodes to start streaming
  start() {

    this.scriptProcessor.onaudioprocess = (e) => {
      var block = e.inputBuffer.getChannelData(this.channel);
      // this.reslicer.input(this.time, block);
      // @FIXME: `this.time` is always `NaN`
      this.time += block.length / this.sampleRate;
      this.outFrame.set(block, 0);
      this.output();
    };

    // start "the patch" ;)
    this.src.connect(this.scriptProcessor);
    this.scriptProcessor.connect(this.ctx.destination);
  }
}

// function factory(options) {
//   return new AudioInNode(options);
// }
// factory.AudioInNode = AudioInNode;

// module.exports = factory;
module.exports = AudioInNode;