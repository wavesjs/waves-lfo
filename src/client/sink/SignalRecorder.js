import BaseLfo from '../../common/core/BaseLfo';

const AudioContext = window.AudioContext || window.webkitAudioContext;

const worker = `
var isInfiniteBuffer = false;
var stack = [];
var buffer;
var bufferLength;
var currentIndex;

function init() {
  buffer = new Float32Array(bufferLength);
  stack.length = 0;
  currentIndex = 0;
}

function append(block) {
  var availableSpace = bufferLength - currentIndex;
  var currentBlock;
  // return if already full
  if (availableSpace <= 0) { return; }

  if (availableSpace < block.length) {
    currentBlock = block.subarray(0, availableSpace);
  } else {
    currentBlock = block;
  }

  buffer.set(currentBlock, currentIndex);
  currentIndex += currentBlock.length;

  if (isInfiniteBuffer && currentIndex === buffer.length) {
    stack.push(buffer);

    currentBlock = block.subarray(availableSpace);
    buffer = new Float32Array(buffer.length);
    buffer.set(currentBlock, 0);
    currentIndex = currentBlock.length;
  }
}

self.addEventListener('message', function(e) {
  switch (e.data.command) {
    case 'init':
      if (isFinite(e.data.duration)) {
        bufferLength = e.data.sampleRate * e.data.duration;
      } else {
        isInfiniteBuffer = true;
        bufferLength = e.data.sampleRate * 10;
      }

      init();
      break;

    case 'process':
      var block = new Float32Array(e.data.buffer);
      append(block);


      // if the buffer is full return it, only works with finite buffers
      if (!isInfiniteBuffer && currentIndex === bufferLength) {
        var buf = buffer.buffer.slice(0);
        self.postMessage({ buffer: buf }, [buf]);
        init();
      }
      break;

    case 'stop':
      if (!isInfiniteBuffer) {
        var copy = buffer.buffer.slice(0, currentIndex * (32 / 8));
        self.postMessage({ buffer: copy }, [copy]);
      } else {
        var copy = new Float32Array(stack.length * bufferLength + currentIndex);
        stack.forEach(function(buffer, index) {
          copy.set(buffer, bufferLength * index);
        });

        copy.set(buffer.subarray(0, currentIndex), stack.length * bufferLength);
        self.postMessage({ buffer: copy.buffer }, [copy.buffer]);
      }
      init();
      break;
  }
}, false)`;

const definitions = {
  duration: {
    type: 'float',
    default: 10,
    min: 0,
    metas: { kind: 'static' },
  },
  ignoreLeadingZeros: {
    type: 'boolean',
    default: true,
    metas: { kind: 'static' },
  },
  retrieveAudioBuffer: {
    type: 'boolean',
    default: false,
    constant: true,
  },
  audioContext: {
    type: 'any',
    default: null,
    nullable: true,
  },
};

/**
 * Record an `signal` input stream of arbitrary duration and retrieve it
 * when done (as a raw `Float32Array` or an `AudioBuffer` occording to the
 * given configuration).
 * When recording is stopped (either when the `stop` method is called or the
 * defined duration has been recorded), the `Promise` returned by the `retrieve`
 * method is fullfilled with the `AudioBuffer` containing the recorded audio.
 *
 * @todo - add option to return only the Float32Array and not an audio buffer
 *  (node compliant) `retrieveAudioBuffer: false`
 *
 * @param {Object} options - Override default parameters.
 * @param {Number} [options.duration=10] - Maximum duration of the recording.
 * @param {Boolean} [options.retrieveAudioBuffer=false] - Define if an `AudioBuffer`
 *  should be retrieved or only the raw Float32Array of data.
 * @param {AudioContext} [options.audioContext=null] - If
 *  `retrieveAudioBuffer` is set to `true`, audio context to be used
 *  in order to create the final audio buffer.
 * @param {Object} [options.ignoreLeadingZeros=true] - Start the effective
 *  recording on the first non-zero value.
 *
 * @memberof module:sink
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * const audioContext = new AudioContext();
 *
 * navigator.mediaDevices
 *   .getUserMedia({ audio: true })
 *   .then(init)
 *   .catch((err) => console.error(err.stack));
 *
 * function init(stream) {
 *   const source = audioContext.createMediaStreamSource(stream);
 *
 *   const audioInNode = new lfo.source.AudioInNode({
 *     sourceNode: source,
 *     audioContext: audioContext,
 *   });
 *
 *   const audioRecorder = new lfo.sink.SignalRecorder({
 *     duration: 2,
 *     retrieveAudioBuffer: true,
 *     audioContext: audioContext,
 *   });
 *
 *   audioInNode.connect(audioRecorder);
 *   audioInNode.start();
 *
 *   audioRecorder
 *     .retrieve()
 *     .then((buffer) => {
 *       const bufferSource = audioContext.createBufferSource();
 *       bufferSource.buffer = buffer;
 *
 *       bufferSource.connect(audioContext.destination);
 *       bufferSource.start();
 *     })
 *     .catch((err) => console.error(err.stack));
 *
 *   audioRecorder.start();
 * }
 */
class SignalRecorder extends BaseLfo {
  constructor(options = {}) {
    super(definitions, options);

    /**
     * Define is the node is currently recording or not.
     *
     * @type {Boolean}
     * @name isRecording
     * @instance
     * @memberof module:sink.SignalRecorder
     */
    this.isRecording = false;

    const retrieveAudioBuffer = this.params.get('retrieveAudioBuffer');
    let audioContext = this.params.get('audioContext');
    // needed to retrieve an AudioBuffer
    if (retrieveAudioBuffer && audioContext === null)
      audioContext = new AudioContext();

    this.audioContext = audioContext;
    this._ignoreZeros = false;

    const blob = new Blob([worker], { type: 'text/javascript' });
    this.worker = new Worker(window.URL.createObjectURL(blob));
  }

  /** @private */
  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);

    // initialize worker according to stream params
    this.worker.postMessage({
      command: 'init',
      sampleRate: this.streamParams.sourceSampleRate,
      duration: this.params.get('duration'),
    });

    this.propagateStreamParams();
  }

  /**
   * Start recording.
   */
  start() {
    this.isRecording = true;
    this._ignoreZeros = this.params.get('ignoreLeadingZeros');
  }

  /**
   * Stop recording.
   */
  stop() {
    if (this.isRecording) {
      this.worker.postMessage({ command: 'stop' });
      this.isRecording = false;
    }
  }

  /** @private */
  finalizeStream(endTime) {
    this.stop();
  }

  /** @private */
  processSignal(frame) {
    // console.log(frame, this.isRecording);
    if (!this.isRecording)
      return;

    // `sendFrame` must be recreated each time because
    // it is copied in the worker and lost for this context
    let sendFrame = null;
    const input = frame.data;

    if (this._ignoreZeros === false) {
      sendFrame = new Float32Array(input);
    } else if (input[input.length - 1] !== 0) {
      // find first index where value !== 0
      let i;

      for (i = 0; i < input.length; i++)
        if (input[i] !== 0) break;

      // copy non zero segment
      sendFrame = new Float32Array(input.subarray(i));
      this._ignoreZeros = false;
    }

    if (sendFrame !== null) {
      const buffer = sendFrame.buffer;

      this.worker.postMessage({
        command: 'process',
        buffer: buffer
      }, [buffer]);
    }
  }

  /**
   * Retrieve the `Float32Array` or the `AudioBuffer` when the stream is
   * stopped or when the buffer is full according to the duration defined in
   * parameters.
   *
   * @return {Promise<AudioBuffer>}
   */
  retrieve() {
    return new Promise((resolve, reject) => {
      const callback = (e) => {
        const retrieveAudioBuffer = this.params.get('retrieveAudioBuffer');
        // if called when buffer is full, stop the recorder too
        this.isRecording = false;

        this.worker.removeEventListener('message', callback, false);
        // create an audio buffer from the data
        const buffer = new Float32Array(e.data.buffer);

        if (retrieveAudioBuffer) {
          const length = buffer.length;
          const sampleRate = this.streamParams.sourceSampleRate;

          const audioBuffer = this.audioContext.createBuffer(1, length, sampleRate);
          const channelData = audioBuffer.getChannelData(0);
          channelData.set(buffer, 0);

          resolve(audioBuffer);
        } else {
          resolve(buffer);
        }
      };

      this.worker.addEventListener('message', callback, false);
    });
  }
}

export default SignalRecorder;

