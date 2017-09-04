import BaseLfo from '../../core/BaseLfo';

const definitions = {
  duration: {
    type: 'float',
    default: 10,
    min: 0,
    metas: { kind: 'static' },
  },
  callback: {
    type: 'any',
    default: null,
    nullable: true,
    metas: { kind: 'dynamic' },
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
 * when done.
 *
 * When recording is stopped (either when the `stop` method is called, the
 * defined duration has been recorded, or the source of the graph finalized
 * the stream), the callback given as parameter is executed  with the
 * `AudioBuffer` or `Float32Array` containing the recorded signal as argument.
 *
 * @todo - add option to return only the Float32Array and not an audio buffer
 *  (node compliant) `retrieveAudioBuffer: false`
 *
 * @param {Object} options - Override default parameters.
 * @param {Number} [options.duration=10] - Maximum duration of the recording.
 * @param {Number} [options.callback] - Callback to execute when a new record is
 *  ended. This can happen: `stop` is called on the recorder, `stop` is called
 *  on the source or when the buffer is full according to the given `duration`.
 * @param {Object} [options.ignoreLeadingZeros=true] - Start the effective
 *  recording on the first non-zero value.
 * @param {Boolean} [options.retrieveAudioBuffer=false] - Define if an `AudioBuffer`
 *  should be retrieved or only the raw Float32Array of data.
 *  (works only in browser)
 * @param {AudioContext} [options.audioContext=null] - If
 *  `retrieveAudioBuffer` is set to `true`, audio context to be used
 *  in order to create the final audio buffer.
 *  (works only in browser)
 *
 * @memberof module:common.sink
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
 *   const signalRecorder = new lfo.sink.SignalRecorder({
 *     duration: 6,
 *     retrieveAudioBuffer: true,
 *     audioContext: audioContext,
 *     callback: (buffer) => {
 *       const bufferSource = audioContext.createBufferSource();
 *       bufferSource.buffer = buffer;
 *       bufferSource.connect(audioContext.destination);
 *       bufferSource.start();
 *     }
 *   });
 *
 *   audioInNode.connect(signalRecorder);
 *   audioInNode.start();
 *   signalRecorder.start();
 * });
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
     * @memberof module:client.sink.SignalRecorder
     */
    this.isRecording = false;

    const retrieveAudioBuffer = this.params.get('retrieveAudioBuffer');
    const audioContext = this.params.get('audioContext');
    // needed to retrieve an AudioBuffer
    if (retrieveAudioBuffer && audioContext === null)
      throw new Error('Invalid parameter "audioContext": an AudioContext must be provided when `retrieveAudioBuffer` is set to `true`')

    this._audioContext = audioContext;
    this._ignoreZeros = false;
    this._isInfiniteBuffer = false;
    this._stack = [];
    this._buffer = null;
    this._bufferLength = null;
    this._currentIndex = null;
  }

  _initBuffer() {
    this._buffer = new Float32Array(this._bufferLength);
    this._stack.length = 0;
    this._currentIndex = 0;
  }

  /** @private */
  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);

    const duration = this.params.get('duration');
    const sampleRate = this.streamParams.sourceSampleRate;

    if (isFinite(duration)) {
      this._isInfiniteBuffer = false;
      this._bufferLength = sampleRate * duration;
    } else {
      this._isInfiniteBuffer = true;
      this._bufferLength = sampleRate * 10;
    }

    this._initBuffer();
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
   * Stop recording and execute the callback defined in parameters.
   */
  stop() {
    if (this.isRecording) {
      // ignore next incomming frame
      this.isRecording = false;

      const retrieveAudioBuffer = this.params.get('retrieveAudioBuffer');
      const callback = this.params.get('callback');
      const currentIndex = this._currentIndex;
      const buffer = this._buffer;
      let output;

      if (!this._isInfiniteBuffer) {
        output = new Float32Array(currentIndex);
        output.set(buffer.subarray(0, currentIndex), 0);
      } else {
        const bufferLength = this._bufferLength;
        const stack = this._stack;

        output = new Float32Array(stack.length * bufferLength + currentIndex);

        // copy all stacked buffers
        for (let i = 0; i < stack.length; i++) {
          const stackedBuffer = stack[i];
          output.set(stackedBuffer, bufferLength * i);
        };
        // copy data contained in current buffer
        output.set(buffer.subarray(0, currentIndex), stack.length * bufferLength);
      }

      if (retrieveAudioBuffer && this._audioContext) {
        const length = output.length;
        const sampleRate = this.streamParams.sourceSampleRate;
        const audioBuffer = this._audioContext.createBuffer(1, length, sampleRate);
        const channelData = audioBuffer.getChannelData(0);
        channelData.set(output, 0);

        callback(audioBuffer);
      } else {
        callback(output);
      }

      // reinit buffer, stack, and currentIndex
      this._initBuffer();
    }
  }

  /** @private */
  finalizeStream(endTime) {
    this.stop();
  }

  /** @private */
  processSignal(frame) {
    if (!this.isRecording)
      return;

    let block = null;
    const input = frame.data;
    const bufferLength = this._bufferLength;
    const buffer = this._buffer;

    if (this._ignoreZeros === false) {
      block = new Float32Array(input);
    } else if (input[input.length - 1] !== 0) {
      // find first index where value !== 0
      let i;

      for (i = 0; i < input.length; i++)
        if (input[i] !== 0) break;

      // copy non zero segment
      block = new Float32Array(input.subarray(i));
      // don't repeat this logic once a non-zero value has been found
      this._ignoreZeros = false;
    }

    if (block !== null) {
      const availableSpace = bufferLength - this._currentIndex;
      let currentBlock;

      if (availableSpace < block.length)
        currentBlock = block.subarray(0, availableSpace);
      else
        currentBlock = block;

      buffer.set(currentBlock, this._currentIndex);
      this._currentIndex += currentBlock.length;

      if (this._isInfiniteBuffer && this._currentIndex === bufferLength) {
        this._stack.push(buffer);

        currentBlock = block.subarray(availableSpace);
        this._buffer = new Float32Array(bufferLength);
        this._buffer.set(currentBlock, 0);
        this._currentIndex = currentBlock.length;
      }

      //  stop if the buffer is finite and full
      if (!this._isInfiniteBuffer && this._currentIndex === bufferLength)
        this.stop();
    }
  }
}

export default SignalRecorder;

