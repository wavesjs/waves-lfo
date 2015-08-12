import BaseLfo from '../core/base-lfo';

const worker = `
var buffer;
var bufferLength;
var currentIndex;

function init() {
  if (!buffer) {
    buffer = new Float32Array(bufferLength);
  } else {
    for (var i = 0; i < bufferLength; i++) {
      buffer[i] = 0;
    }
  }

  currentIndex = 0;
}

function append(block) {
  var availableSpace = bufferLength - currentIndex;

  // return if already full
  if (availableSpace <= 0) { return; }

  if (availableSpace < block.length) {
    block = block.subarray(0, availableSpace);
  }

  buffer.set(block, currentIndex);
  currentIndex += block.length;
}

self.addEventListener('message', function(e) {
  switch (e.data.command) {
    case 'init':
      bufferLength = e.data.sampleRate * e.data.duration;
      init();
      break;

    case 'process':
      var block = new Float32Array(e.data.buffer);
      append(block);

      // if the buffer is full return it
      if (currentIndex === bufferLength) {
        var buf = buffer.buffer.slice(0);
        self.postMessage({ buffer: buf }, [buf]);
        init();
      }
      break;

    case 'finalize':
      // @TODO add option to not clip the returned buffer
      // values in FLoat32Array are 4 bytes long (32 / 8)
      var copy = buffer.buffer.slice(0, currentIndex * (32 / 8));
      self.postMessage({ buffer: copy }, [copy]);
      init();
      break;
  }
}, false)`;

let audioContext;

/**
 * Record an audio stream
 */
export default class AudioRecorder extends BaseLfo {
  constructor(options = {}) {
    const defaults = {
      duration: 60, // seconds
    };

    super(options, defaults);
    this.metaData = {};

    // needed to retrive an AudioBuffer
    if (!this.params.ctx) {
      if (!audioContext) { audioContext = new window.AudioContext(); }
      this.ctx = audioContext;
    } else {
      this.ctx = this.params.ctx;
    }

    const blob = new Blob([worker], { type: 'text/javascript' });
    this.worker = new Worker(window.URL.createObjectURL(blob));
  }

  initialize() {
    super.initialize();
    // propagate `streamParams` to the worker
    this.worker.postMessage({
      command: 'init',
      duration: this.params.duration,
      sampleRate: this.streamParams.sourceSampleRate
    });
  }

  start() {
    this._isStarted = true;
  }

  stop() {
    this._isStarted = false;
    this.finalize();
  }

  // called when `stop` is triggered on the source
  finalize() {
    this.worker.postMessage({ command: 'finalize' });
  }

  process(time, frame, metaData) {
    if (!this._isStarted) { return; }
    // `this.outFrame` must be recreated each time because
    // it is copied in the worker and lost for this context
    this.outFrame = new Float32Array(frame);

    const buffer = this.outFrame.buffer;
    this.worker.postMessage({ command: 'process', buffer: buffer }, [buffer]);
  }

  /**
   * retrieve the created audioBuffer
   * @return {Promise}
   */
  retrieve() {
    return new Promise((resolve, reject) => {
      var callback = (e) => {
        // if called when buffer is full, stop the recorder too
        this._isStarted = false;

        this.worker.removeEventListener('message', callback, false);
        // create an audio buffer from the data
        const buffer = new Float32Array(e.data.buffer);
        const length = buffer.length;
        const sampleRate = this.streamParams.sourceSampleRate;

        const audioBuffer = this.ctx.createBuffer(1, length, sampleRate);
        const audioArrayBuffer = audioBuffer.getChannelData(0);
        audioArrayBuffer.set(buffer, 0);

        resolve(audioBuffer);
      };

      this.worker.addEventListener('message', callback, false);
    });
  }
}