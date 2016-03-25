import BaseLfo from '../core/base-lfo';

const workerCode = `
self.addEventListener('message', function process(e) {
  var blockSize = e.data.blockSize;
  var bufferSource = e.data.buffer;
  var buffer = new Float32Array(bufferSource);
  var length = buffer.length;
  var index = 0;

  while (index < length) {
    var copySize = Math.min(length - index, blockSize);
    var block = buffer.subarray(index, index + copySize);
    var sendBlock = new Float32Array(block);

    postMessage({
      command: 'process',
      index: index,
      buffer: sendBlock.buffer,
    }, [sendBlock.buffer]);

    index += copySize;
  }

  postMessage({
    command: 'finalize',
    index: index,
    buffer: bufferSource,
  }, [bufferSource]);
}, false)`;


class _PseudoWorker {
  constructor() {
    this._callback = null;
  }

  postMessage(e) {
    const blockSize = e.blockSize;
    const bufferSource = e.buffer;
    const buffer = new Float32Array(bufferSource);
    const length = buffer.length;
    const that = this;
    let index = 0;

    (function slice() {
      if (index < length) {
        var copySize = Math.min(length - index, blockSize);
        var block = buffer.subarray(index, index + copySize);
        var sendBlock = new Float32Array(block);

        that._send({
          command: 'process',
          index: index,
          buffer: sendBlock.buffer,
        });

        index += copySize;
        setTimeout(slice, 0);
      } else {
        that._send({
          command: 'finalize',
          index: index,
          buffer: buffer,
        });
      }
    }());
  }

  addListener(callback) {
    this._callback = callback;
  }

  _send(msg) {
    this._callback({ data: msg });
  }
}

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
      useWorker: true,
    }, options);

    this.buffer = this.params.buffer;
    this.endTime = 0;

    if (!this.params.ctx || !(this.params.ctx instanceof AudioContext))
      throw new Error('Missing audio context parameter (ctx)');

    if (!this.params.buffer || !(this.params.buffer instanceof AudioBuffer))
      throw new Error('Missing audio buffer parameter (buffer)');

    this.blob = new Blob([workerCode], { type: "text/javascript" });
    this.worker = null;

    this.process = this.process.bind(this);
  }

  setupStream() {
    this.outFrame = null;
  }

  initialize() {
    super.initialize({
      frameSize: this.params.frameSize,
      frameRate: this.buffer.sampleRate / this.params.frameSize,
      sourceSampleRate: this.buffer.sampleRate,
    });
  }

  start() {
    this.initialize();
    this.reset();

    if (this.params.useWorker) {
      this.worker = new Worker(window.URL.createObjectURL(this.blob));
      this.worker.addEventListener('message', this.process, false);
    } else {
      this.worker = new _PseudoWorker();
      this.worker.addListener(this.process);
    }

    this.endTime = 0;

    const buffer = this.buffer.getChannelData(this.params.channel).buffer;
    let sendBuffer = buffer;

    if (this.params.useWorker)
      sendBuffer = buffer.slice(0);

    this.worker.postMessage({
      blockSize: this.streamParams.frameSize,
      buffer: sendBuffer,
    }, [sendBuffer]);
  }

  stop() {
    this.worker.terminate();
    this.worker = null;

    this.finalize(this.endTime);
  }

  // worker callback
  process(e) {
    const sourceSampleRate = this.streamParams.sourceSampleRate;
    const command = e.data.command;
    const index = e.data.index;
    const buffer = e.data.buffer;
    const time = index / sourceSampleRate;

    if (command === 'finalize') {
      this.finalize(time);
    } else {
      this.outFrame = new Float32Array(buffer);
      this.time = time;
      this.output();

      this.endTime = this.time + this.outFrame.length / sourceSampleRate;
    }
  }
}
