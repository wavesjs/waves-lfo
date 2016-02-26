import BaseLfo from '../core/base-lfo';

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

  if(copySize > 0) {
    block = buffer.subarray(index, index + copySize);
    sendBlock = new Float32Array(block);
    postMessage({ msg: 'finalize', buffer: block.buffer, time: index / sampleRate }, [block.buffer]);
  }
}, false)`;

/**
 * AudioBuffer as source, sliced it in blocks through a worker
 */
export default class AudioInBuffer extends BaseLfo {
  constructor(options = {}) {
    super({
      frameSize: 512,
      channel: 0,
      ctx: null,
      buffer: null,
    }, options);

    if (!this.params.ctx || !(this.params.ctx instanceof AudioContext)) {
      throw new Error('Missing audio context parameter (ctx)');
    }

    if (!this.params.buffer || !(this.params.buffer instanceof AudioBuffer)) {
      throw new Error('Missing audio buffer parameter (buffer)');
    }

    this.blob = new Blob([workerCode], { type: "text/javascript" });
    this.worker = null;
  }

  setupStream() {
    this.outFrame = null;
  }

  initialize() {
    super.initialize({
      frameSize: this.params.frameSize,
      frameRate: this.params.buffer.sampleRate / this.params.frameSize,
      sourceSampleRate: this.params.buffer.sampleRate,
    });
  }

  start() {
    this.initialize();
    this.reset();

    this.worker = new Worker(window.URL.createObjectURL(this.blob));
    this.worker.addEventListener('message', this.process.bind(this), false);

    const buffer = this.params.buffer.getChannelData(this.params.channel).buffer

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

    if(buffer) {
      this.outFrame = new Float32Array(buffer);
      this.time = e.data.time;
      this.output();
    }

    if(msg === 'finalize')
      this.finalize();
  }
}
