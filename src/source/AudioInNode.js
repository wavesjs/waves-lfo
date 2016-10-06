import BaseLfo from '../core/BaseLfo';
import parameters from 'parameters';

const definitions = {
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
  sourceNode: {
    type: 'any',
    default: null,
    constant: true,
  },
  audioContext: {
    type: 'any',
    default: null,
    constant: true,
  },
};

/**
 * Use a WebAudio node as source.
 *
 * @param {Object} options - Override parameter' default values.
 * @param {AudioNode} sourceNode - Audio node to process.
 * @param {AudioContext} audioContext - Audio context used to create the audio
 *  node.
 * @param {Number} [options.frameSize=512] - Size of the output blocks.
 * @param {Number} [channel=0] - Number of the channel to process.
 *
 * @memberof module:source
 *
 * @example
 * import * as lfo from 'waves-lfo';
 *
 * const audioContext = new AudioContext();
 * const sine = audioContext.createOscillator();
 * sine.frequency.value = 2;
 *
 * const audioInNode = new lfo.source.AudioInNode({
 *   audioContext: audioContext,
 *   sourceNode: sine,
 * });
 *
 * const signalDisplay = new lfo.sink.SignalDisplay({
 *   canvas: '#signal',
 *   duration: 1,
 * });
 *
 * audioInNode.connect(signalDisplay);
 *
 * sine.start();
 * audioInNode.start();
 */
class AudioInNode extends BaseLfo {
  constructor(options = {}) {
    super();

    this.params = parameters(definitions, options);

    const audioContext = this.params.get('audioContext');
    const sourceNode = this.params.get('sourceNode');

    if (!audioContext || !(audioContext instanceof AudioContext))
      throw new Error('Invalid `audioContext` parameter');

    if (!sourceNode || !(sourceNode instanceof AudioNode))
      throw new Error('Invalid `sourceNode` parameter');

    this._channel = this.params.get('channel');
    this._blockDuration = null;
  }

  /**
   * Start the whole graph, propagate the `streamParams` in the graph. When the
   * method in called, blocks from the signal produced by the given audio node
   * are propagated into the graph immediately.
   *
   * @see {@link module:core.BaseLfo#processStreamParams}
   * @see {@link module:core.BaseLfo#resetStream}
   * @see {@link module:source.AudioInNode#stop}
   */
  start() {
    this.processStreamParams();
    this.resetStream();

    const audioContext = this.params.get('audioContext');
    this.frame.time = 0;
    this.scriptProcessor.connect(audioContext.destination);
  }

  /**
   * Stop the whole graph and finalize the stream.
   *
   * @see {@link module:core.BaseLfo#finalizeStream}
   * @see {@link module:source.AudioInNode#start}
   */
  stop() {
    this.finalizeStream(this.frame.time);
    this.scriptProcessor.disconnect();
  }

  /** @private */
  processStreamParams() {
    const audioContext = this.params.get('audioContext');
    const frameSize = this.params.get('frameSize');
    const sourceNode = this.params.get('sourceNode');
    const sampleRate = audioContext.sampleRate;

    this.streamParams.frameSize = frameSize;
    this.streamParams.frameRate = sampleRate / frameSize;
    this.streamParams.frameType = 'signal';
    this.streamParams.sourceSampleRate = sampleRate;

    this._blockDuration = frameSize / sampleRate;

    // prepare audio graph
    this.scriptProcessor = audioContext.createScriptProcessor(frameSize, 1, 1);
    this.scriptProcessor.onaudioprocess = this.processFrame.bind(this);
    sourceNode.connect(this.scriptProcessor);

    this.propagateStreamParams();
  }

  /**
   * Basically the `scriptProcessor.onaudioprocess` callback
   * @private
   */
  processFrame(e) {
    this.frame.data = e.inputBuffer.getChannelData(this._channel);
    this.propagateFrame();

    this.frame.time += this._blockDuration;
  }
}

export default AudioInNode;
