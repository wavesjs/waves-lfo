import AudioIn from './audio-in';

const workerCode = `
self.addEventListener('message', function process(e) {
  var blockSize = e.data.blockSize;
  var sampleRate = e.data.sampleRate;
  var buffer = new Float32Array(e.data.buffer);
  var length = buffer.length;
  var index = 0;

  while (index + blockSize < length) {
    var copySize = Math.min(length - index, blockSize);
    var block = buffer.subarray(index, index + copySize);
    var sendBlock = new Float32Array(block);

    postMessage({ msg: 'process', buffer: sendBlock.buffer, time: index / sampleRate }, [sendBlock.buffer]);

    index += blockSize;
  }

  copySize = length - index;

  if (copySize > 0) {
    block = buffer.subarray(index, index + copySize);
    sendBlock = new Float32Array(block);
    postMessage({ msg: 'finalize', buffer: block.buffer, time: index / sampleRate }, [block.buffer]);
  }
}, false)`;

/**
 * AudioBuffer as source, sliced it in blocks through a worker
 */
export default class AudioInBuffer extends AudioIn {
  constructor(options = {}) {
    super(options, {});

    if (!this.params.src || !(this.params.src instanceof AudioBuffer))
      throw new Error('An AudioBuffer source must be given');

    this.blob = new Blob([workerCode], { type: "text/javascript" });
    this.worker = null;
  }

  configureStream() {
    this.streamParams.frameSize = this.params.frameSize;
    this.streamParams.frameRate = this.params.src.sampleRate / this.params.frameSize;
    this.streamParams.sourceSampleRate = this.params.src.sampleRate;
  }

  setupStream() {
    this.outFrame = null;
  }

  start() {
    this.initialize();
    this.reset();

    this.worker = new Worker(window.URL.createObjectURL(this.blob));
    this.worker.addEventListener('message', this.process.bind(this), false);

    const buffer = this.src.getChannelData(this.channel).buffer

    this.worker.postMessage({
      sampleRate: this.streamParams.sourceSampleRate,
      blockSize: this.streamParams.frameSize,
      buffer: buffer,
    }, [buffer]);
  }

  stop() {
    this.worker.terminate();
    this.worker = null;

    this.finalize();
  }

  // worker callback
  process(e) {
    const msg = e.data.msg;
    const buffer = e.data.buffer;

    if (buffer) {
      this.outFrame = new Float32Array(buffer);
      this.time = e.data.time;
      this.output();
    }

    if (msg === 'finalize')
      this.finalize();
  }
}
