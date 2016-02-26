import BaseLfo from '../core/base-lfo';

/**
 *  Use a WebAudio node as a source
 */
export default class AudioInNode extends AudioIn {

  constructor(options = {}) {
    super({
      frameSize: 512,
      channel: 0,
      ctx: null,
      src: null,
      timeType: 'absolute',
    }, options);

    if (!this.params.ctx || !(this.params.ctx instanceof AudioContext)) {
      throw new Error('Missing audio context parameter (ctx)');
    }

    if (!this.params.src || !(this.params.src instanceof AudioNode)) {
      throw new Error('Missing audio source node parameter (src)');
    }
  }

  initialize() {
    super.initialize({
      frameSize: this.params.frameSize,
      frameRate: this.ctx.sampleRate / this.params.frameSize,
      sourceSampleRate: this.ctx.sampleRate,
    });

    var blockSize = this.streamParams.frameSize;
    this.scriptProcessor = this.ctx.createScriptProcessor(blockSize, 1, 1);

    // prepare audio graph
    this.scriptProcessor.onaudioprocess = this.process.bind(this);
    this.params.src.connect(this.scriptProcessor);
  }

  // connect the audio nodes to start streaming
  start() {
    this.initialize();
    this.reset();

    if (this.params.timeType === 'relative')
      this.time = 0;

    // start "the patch" ;)
    this.scriptProcessor.connect(this.ctx.destination);
  }

  stop() {
    this.finalize();
    this.scriptProcessor.disconnect();
  }

  // is basically the `scriptProcessor.onaudioprocess` callback
  process(e) {
    const block = e.inputBuffer.getChannelData(this.params.channel);

    this.time += block.length / this.streamParams.sourceSampleRate;
    this.outFrame.set(block, 0);
    this.output();
  }
}
