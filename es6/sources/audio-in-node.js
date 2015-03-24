"use strict";

let AudioIn = require('./audio-in');

// web audio API node as a source
class AudioInNode extends AudioIn {

  constructor(options = {}) {
    super(options);
    this.type = 'audio-in-node';

    var blockSize = this.streamParams.frameSize;
    this.scriptProcessor = this.ctx.createScriptProcessor(blockSize, 1, 1);

    // keep the script processor alive
    // this.ctx['_process-' + new Date().getTime()] = this.scriptProcessor;
    this.scriptProcessor.onaudioprocess = this.process.bind(this);
    this.src.connect(this.scriptProcessor);
  }

  // connect the audio nodes to start streaming
  start() {
    this.reset();
    // start "the patch" ;)
    this.scriptProcessor.connect(this.ctx.destination);
  }

  stop() {
    this.finalize();
    this.scriptProcessor.disconnect();
  }

  // is basically the `scriptProcessor.onaudioprocess` callback
  process(e) {
    var block = e.inputBuffer.getChannelData(this.params.channel);

    this.time += block.length / this.streamParams.blockSampleRate;
    this.outFrame.set(block, 0);
    this.output();
  }
}

module.exports = AudioInNode;
