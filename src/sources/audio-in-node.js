import BaseLfo from '../core/base-lfo';

/**
 *  Use a WebAudio node as a source
 */
export default class AudioInNode extends BaseLfo {

  constructor(options = {}) {
    super({
      frameSize: 512,
      channel: 0,
      audioContext: null,
      sourceNode: null,
    }, options);

    if (!this.params.ctx || !(this.params.ctx instanceof AudioContext)) {
      throw new Error('Missing audio context parameter (audioContext)');
    }

    if (!this.params.src || !(this.params.src instanceof AudioNode)) {
      throw new Error('Missing audio source node parameter (sourceNode)');
    }
  }

  initialize() {
    const ctx = this.params.ctx;

    super.initialize({
      frameSize: this.params.frameSize,
      frameRate: ctx.sampleRate / this.params.frameSize,
      sourceSampleRate: ctx.sampleRate,
    });

    var blockSize = this.streamParams.frameSize;
    this.scriptProcessor = ctx.createScriptProcessor(blockSize, 1, 1);

    // prepare audio graph
    this.scriptProcessor.onaudioprocess = this.process.bind(this);
    this.params.src.connect(this.scriptProcessor);
  }

  // connect the audio nodes to start streaming
  start() {
    this.initialize();
    this.reset();
    this.time = 0;
    this.scriptProcessor.connect(this.params.ctx.destination);
  }

  stop() {
    this.finalize(this.time);
    this.scriptProcessor.disconnect();
  }

  // is basically the `scriptProcessor.onaudioprocess` callback
  process(e) {
    const block = e.inputBuffer.getChannelData(this.params.channel);

    if (!this.blockDuration)
      this.blockDuration = block.length / this.streamParams.sourceSampleRate;

    this.outFrame = block;
    this.output();

    this.time += this.blockDuration;
  }
}
