import AudioIn from './audio-in';

const worker = `
self.addEventListener('message', function process(e) {
  var blockSize = e.data.options.blockSize;
  var sampleRate = e.data.options.sampleRate;
  var buffer = new Float32Array(e.data.buffer);

  var length = buffer.length;
  // var block = new Float32Array(blockSize);

  for (var index = 0; index < length; index += blockSize) {
    var copySize = length - index;
    if (copySize > blockSize) { copySize = blockSize; }

    var block = buffer.subarray(index, index + copySize);
    block = new Float32Array(block);

    postMessage({ buffer: block.buffer, time: index / sampleRate }, [block.buffer]);
  }
}, false)`;

/**
 * AudioBuffer as source, sliced it in blocks through a worker
 */
export default class AudioInBuffer extends AudioIn {
  constructor(options = {}) {
    super(options, {});
    this.metaData = {};

    if (!this.params.src || !(this.params.src instanceof AudioBuffer)) {
      throw new Error('An AudioBuffer source must be given');
    }
  }

  configureStream() {
    this.streamParams.frameSize = this.params.frameSize;
    this.streamParams.frameRate = this.params.src.sampleRate / this.params.frameSize;
    this.streamParams.sourceSampleRate = this.params.src.sampleRate;
  }

  initialize() {
    super.initialize();
    // init worker
    // @NOTE: could be done once in constructor ?
    const blob = new Blob([worker], { type: "text/javascript" });
    this.worker = new Worker(window.URL.createObjectURL(blob));
    this.worker.addEventListener('message', this.process.bind(this), false);
  }

  start() {
    // propagate to the whole chain
    this.initialize();
    this.reset();

    const buffer = this.src.getChannelData(this.channel).buffer

    this.worker.postMessage({
      options: {
        sampleRate: this.streamParams.sourceSampleRate,
        blockSize: this.streamParams.frameSize
      },
      buffer: buffer
    }, [buffer]);
  }

  stop() {
    // propagate to the whole chain
    this.finalize();
  }

  // callback of the worker
  process(e) {
    const block = new Float32Array(e.data.buffer);
    this.outFrame.set(block, 0);
    this.time = e.data.time;

    this.output();
  }
}
