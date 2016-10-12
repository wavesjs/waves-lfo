import BaseLfo from '../core/BaseLfo';
import parameters from 'parameters';

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

const definitions = {
  audioBuffer: {
    type: 'any',
    default: null,
    constant: true,
  },
  frameSize: {
    type: 'integer',
    default: 512,
    constant: true,
  },
  channel: {
    type: 'integer',
    default: 0,
    constant: true,
  },
  useWorker: {
    type: 'boolean',
    default: true,
    constant: true,
  },
};

/**
 * Slice an `AudioBuffer` into signal blocks and propagate the resulting frames
 * through the graph.
 *
 * @param {Object} options - Override parameter' default values.
 * @param {AudioBuffer} audioBuffer - Audio buffer to process.
 * @param {Number} [options.frameSize=512] - Size of the output blocks.
 * @param {Number} [channel=0] - Number of the channel to process.
 * @param {Boolean} [useWorker=true] - If false, fallback to main thread for the
 *  slicing of the audio buffer, otherwise use a WebWorker.
 *
 * @memberof module:source
 *
 * @todo - Allow to pass raw buffer and sampleRate (simplified use server-side)
 *
 * @example
 * import * as lfo from 'waves-lfo';
 *
 * const audioInBuffer = new lfo.source.AudioInBuffer({
 *   audioBuffer: audioBuffer,
 *   frameSize: 512,
 * });
 *
 * const waveform = new lfo.sink.Waveform({
 *   canvas: '#waveform',
 *   duration: 1,
 *   color: 'steelblue',
 *   rms: true,
 * });
 *
 * audioInBuffer.connect(waveform);
 * audioInBuffer.start();
 */
class AudioInBuffer extends BaseLfo {
  constructor(options = {}) {
    super(definitions, options);

    const audioBuffer = this.params.get('audioBuffer');

    if (!audioBuffer)
      throw new Error('Invalid "audioBuffer" parameter');

    this.endTime = 0;
    this.worker = null;

    this.processFrame = this.processFrame.bind(this);
  }

  /**
   * Propagate the `streamParams` in the graph and start propagating frames.
   * When called, the slicing of the given `audioBuffer` starts immediately and
   * each resulting frame is propagated in graph.
   *
   * @see {@link module:core.BaseLfo#processStreamParams}
   * @see {@link module:core.BaseLfo#resetStream}
   * @see {@link module:source.AudioInBuffer#stop}
   */
  start() {
    this.processStreamParams();
    this.resetStream();

    if (this.params.useWorker) {
      const blob = new Blob([workerCode], { type: "text/javascript" });
      this.worker = new Worker(window.URL.createObjectURL(blob));
      this.worker.addEventListener('message', this.processFrame, false);
    } else {
      this.worker = new _PseudoWorker();
      this.worker.addListener(this.processFrame);
    }

    const channel = this.params.get('channel');
    const useWorker = this.params.get('useWorker');
    const audioBuffer = this.params.get('audioBuffer');
    const buffer = audioBuffer.getChannelData(channel).buffer;
    // copy data for worker if buffer is used elsewhere
    const sendBuffer = useWorker ? buffer.slice(0) : buffer;

    this.endTime = 0;
    this.worker.postMessage({
      blockSize: this.streamParams.frameSize,
      buffer: sendBuffer,
    }, [sendBuffer]);
  }

  /**
   * Finalize the stream and stop the whole graph. When `stop` is called, the
   * slicing of the `audioBuffer` stops immediately.
   *
   * @see {@link module:core.BaseLfo#finalizeStream}
   * @see {@link module:source.EventIn#start}
   */
  stop() {
    this.worker.terminate();
    this.worker = null;

    this.finalizeStream(this.endTime);
  }

  /** @private */
  processStreamParams() {
    const audioBuffer = this.params.get('audioBuffer');
    const frameSize = this.params.get('frameSize');
    const sourceSampleRate = audioBuffer.sampleRate;
    const frameRate = sourceSampleRate / frameSize;

    this.streamParams.frameSize = frameSize;
    this.streamParams.frameRate = frameRate;
    this.streamParams.frameType = 'signal';
    this.streamParams.sourceSampleRate = sourceSampleRate;

    this.propagateStreamParams();
  }

  /** @private */
  processFrame(e) {
    const sourceSampleRate = this.streamParams.sourceSampleRate;
    const command = e.data.command;
    const index = e.data.index;
    const buffer = e.data.buffer;
    const time = index / sourceSampleRate;

    if (command === 'finalize') {
      this.finalizeStream(time);
    } else if (command === 'process') {
      this.frame.data = new Float32Array(buffer);
      this.frame.time = time;
      this.propagateFrame();

      this.endTime = this.time + this.frame.data.length / sourceSampleRate;
    }
  }
}

export default AudioInBuffer;
