import BaseLfo from '../../core/BaseLfo';
import SourceMixin from '../../core/SourceMixin';

const AudioContext = window.AudioContext || window.webkitAudioContext;

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
 * Use a `WebAudio` node as a source for the graph.
 *
 * @param {Object} options - Override parameter' default values.
 * @param {AudioNode} [options.sourceNode=null] - Audio node to process
 *  (mandatory).
 * @param {AudioContext} [options.audioContext=null] - Audio context used to
 *  create the audio node (mandatory).
 * @param {Number} [options.frameSize=512] - Size of the output blocks, define
 *  the `frameSize` in the `streamParams`.
 * @param {Number} [options.channel=0] - Number of the channel to process.
 *
 * @memberof module:client.source
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
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
 * // start the sine oscillator node and the lfo graph
 * sine.start();
 * audioInNode.start();
 */
class AudioInNode extends SourceMixin(BaseLfo) {
  constructor(options = {}) {
    super(definitions, options);

    const audioContext = this.params.get('audioContext');
    const sourceNode = this.params.get('sourceNode');

    if (!audioContext || !(audioContext instanceof AudioContext))
      throw new Error('Invalid `audioContext` parameter');

    if (!sourceNode || !(sourceNode instanceof AudioNode))
      throw new Error('Invalid `sourceNode` parameter');

    this.sourceNode = sourceNode;
    this._channel = this.params.get('channel');
    this._blockDuration = null;

    this.processFrame = this.processFrame.bind(this);
  }

  /**
   * Propagate the `streamParams` in the graph and start to propagate signal
   * blocks produced by the audio node into the graph.
   *
   * @see {@link module:common.core.BaseLfo#processStreamParams}
   * @see {@link module:common.core.BaseLfo#resetStream}
   * @see {@link module:client.source.AudioInNode#stop}
   */
  start() {
    if (this.initialized === false) {
      if (this.initPromise === null) // init has not yet been called
        this.initPromise = this.init();

      this.initPromise.then(this.start);
      return;
    }

    const audioContext = this.params.get('audioContext');
    const frameSize = this.params.get('frameSize');

    this.frame.time = 0;
    // @note: recreate each time because of a firefox weird behavior
    this.scriptProcessor = audioContext.createScriptProcessor(frameSize, 1, 1);
    this.scriptProcessor.onaudioprocess = this.processFrame;

    this.started = true;
    this.sourceNode.connect(this.scriptProcessor);
    this.scriptProcessor.connect(audioContext.destination);
  }

  /**
   * Finalize the stream and stop the whole graph.
   *
   * @see {@link module:common.core.BaseLfo#finalizeStream}
   * @see {@link module:client.source.AudioInNode#start}
   */
  stop() {
    this.finalizeStream(this.frame.time);
    this.started = false;
    this.sourceNode.disconnect();
    this.scriptProcessor.disconnect();
  }

  /** @private */
  processStreamParams() {
    const audioContext = this.params.get('audioContext');
    const frameSize = this.params.get('frameSize');
    const sampleRate = audioContext.sampleRate;

    this.streamParams.frameSize = frameSize;
    this.streamParams.frameRate = sampleRate / frameSize;
    this.streamParams.frameType = 'signal';
    this.streamParams.sourceSampleRate = sampleRate;
    this.streamParams.sourceSampleCount = frameSize;

    this._blockDuration = frameSize / sampleRate;

    this.propagateStreamParams();
  }

  /**
   * Basically the `scriptProcessor.onaudioprocess` callback
   * @private
   */
  processFrame(e) {
    if (this.started === false)
      return;

    this.frame.data = e.inputBuffer.getChannelData(this._channel);
    this.propagateFrame();

    this.frame.time += this._blockDuration;
  }
}

export default AudioInNode;
