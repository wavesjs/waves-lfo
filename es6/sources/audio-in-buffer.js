"use strict";

var { AudioIn } = require('./audio-in');
var Framer = require('./framer');

var worker = 'self.addEventListener("message", function process(e) {
  var message = e.data;
  var blockSize = message.options.blockSize;
  var sampleRate = message.options.sampleRate;
  var buffer = message.data;
  var length = buffer.length;
  var block = new Float32Array(blockSize);

  for (var index = 0; index < length; index += blockSize) {
    var copySize = length - index;

    if (copySize > blockSize) { copySize = blockSize; }

    var bufferSegment = buffer.subarray(index, index + copySize);
    block.set(bufferSegment, 0);

    // no need for that, handled natively by Float32Array
    // for (var i = copySize; i < blockSize; i++) { block[i] = 0; }

    postMessage({ block: block, time: index / sampleRate });
  }
}, false);';

// AudioBuffer as source
// slice it in blocks through a worker
class AudioInBuffer extends AudioIn {

  constructor(options = {}) {
    super(options);

    if (!this.params.src || !(this.params.src instanceof AudioBuffer)) {
      throw new Error('An AudioBuffer source must be given');
    }

    this.type = 'audio-in-buffer';
    this.metaData = {};

    // init worker
    var blob = new Blob([worker], { type: "text/javascript" });
    this.worker = new Worker(window.URL.createObjectURL(blob));

    this.setupStream({
      frameSize: this.params.frameSize,
      frameRate: this.params.src.sampleRate / this.frameSize,
      blockSampleRate: this.params.src.sampleRate
    });

    this.worker.addEventListener('message', this.process.bind(this), false);
  }

  start() {
    var message = {
      options: {
        sampleRate: this.streamParams.blockSampleRate,
        blockSize: this.streamParams.frameSize
      },
      data: this.src.getChannelData(this.channel)
    };

    this.worker.postMessage(message);
  }

  process(e) {
    this.outFrame = e.data.block;
    this.time = e.data.time;

    this.output();
  }
}

// function factory(options) {
//   return new AudioInBuffer(options);
// }
// factory.AudioInBuffer = AudioInBuffer;

module.exports = AudioInBuffer;