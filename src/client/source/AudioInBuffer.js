import BaseLfo from '../../common/core/BaseLfo';


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
};

/**
 * Slice an `AudioBuffer` into signal blocks and propagate the resulting frames
 * through the graph.
 *
 * @param {Object} options - Override parameter' default values.
 * @param {AudioBuffer} [options.audioBuffer] - Audio buffer to process.
 * @param {Number} [options.frameSize=512] - Size of the output blocks.
 * @param {Number} [options.channel=0] - Number of the channel to process.
 *
 * @memberof module:client.source
 *
 * @todo - Allow to pass raw buffer and sampleRate (simplified use server-side)
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
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
  }

  /**
   * Propagate the `streamParams` in the graph and start propagating frames.
   * When called, the slicing of the given `audioBuffer` starts immediately and
   * each resulting frame is propagated in graph.
   *
   * @see {@link module:common.core.BaseLfo#processStreamParams}
   * @see {@link module:common.core.BaseLfo#resetStream}
   * @see {@link module:client.source.AudioInBuffer#stop}
   */
  start() {
    this.initStream();

    const channel = this.params.get('channel');
    const audioBuffer = this.params.get('audioBuffer');
    const buffer = audioBuffer.getChannelData(channel);
    this.endTime = 0;

    this.processFrame(buffer);
  }

  /**
   * Finalize the stream and stop the whole graph. When called, the slicing of
   * the `audioBuffer` stops immediately.
   *
   * @see {@link module:common.core.BaseLfo#finalizeStream}
   * @see {@link module:client.source.AudioInBuffer#start}
   */
  stop() {
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
    this.streamParams.sourceSampleCount = frameSize;

    this.propagateStreamParams();
  }

  /** @private */
  processFrame(buffer) {
    const sampleRate = this.streamParams.sourceSampleRate;
    const frameSize = this.streamParams.frameSize;
    const length = buffer.length;
    const nbrFrames = Math.ceil(buffer.length / frameSize);
    const data = this.frame.data;

    for (let i = 0; i < nbrFrames; i++) {
      const offset = i * frameSize;
      const nbrCopy = Math.min(length - offset, frameSize);

      for (let j = 0; j < frameSize; j++)
        data[j] = j < nbrCopy ? buffer[offset + j] : 0;

      this.frame.time = offset / sampleRate;
      this.endTime = this.frame.time + nbrCopy / sampleRate;
      this.propagateFrame();
    }

    this.finalizeStream(this.endTime);
  }
}

export default AudioInBuffer;
