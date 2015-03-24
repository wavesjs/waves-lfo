"use strict";

let { AudioIn } = require('./audio-in');

// web audio API node as a source
class AudioInNode extends AudioIn {

  constructor(options = {}) {
    super(options);
    this.type = 'audio-in-node';

    var blockSize = this.streamParams.frameSize;
    this.scriptProcessor = this.ctx.createScriptProcessor(blockSize, 1, 1);

    // keep the script processor alive
    this.ctx['_process-' + new Date().getTime()] = this.scriptProcessor;
    this.scriptProcessor.onaudioprocess = this.process.bind(this);
  }

  // connect the audio nodes to start streaming
  start() {
    // start "the patch" ;)
    this.src.connect(this.scriptProcessor);
    this.scriptProcessor.connect(this.ctx.destination);
  }

  process(e) {
    var block = e.inputBuffer.getChannelData(this.params.channel);

    this.time += block.length / this.streamParams.blockSampleRate;
    this.outFrame.set(block, 0);
    this.output();
  }
}

// function factory(options) {
//   return new AudioInNode(options);
// }
// factory.AudioInNode = AudioInNode;

// module.exports = factory;
module.exports = AudioInNode;