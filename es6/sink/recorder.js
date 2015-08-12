import BaseLfo from '../core/base-lfo';

const worker = `
var buffer;
var bufferLength;
var currentIndex;

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
      buffer = new Float32Array(bufferLength);
      currentIndex = 0;
      break;
    case 'process':
      var block = new Float32Array(e.data.buffer);
      append(block);
      break;
    case 'retrieve':
      var buf = buffer.buffer;
      self.postMessage({ buffer: buf }, [buf]);
      break;
  }
}, false)`;

let audioContext;

/**
 * Record an audio stream
 */
export default class Recorder extends BaseLfo {
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
  }

  initialize() {
    super.initialize();

    const blob = new Blob([worker], { type: "text/javascript" });
    this.worker = new Worker(window.URL.createObjectURL(blob));

    this.worker.postMessage({
      command: 'init',
      duration: this.params.duration,
      sampleRate: this.streamParams.sourceSampleRate
    });
  }

  process(time, frame, metaData) {
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
        this.worker.removeEventListener('message', callback, false);
        // create an audio buffer from the data
        const buffer = new Float32Array(e.data.buffer);
        const audioBuffer = this.ctx.createBuffer(1, buffer.length, this.streamParams.sourceSampleRate);
        const audioArrayBuffer = audioBuffer.getChannelData(0);
        audioArrayBuffer.set(buffer, 0);

        resolve(audioBuffer);
      };

      this.worker.addEventListener('message', callback, false);
      this.worker.postMessage({ command: 'retrieve' });
    });
  }
}