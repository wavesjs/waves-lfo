import AudioIn from './audio-in';

/**
 *  Use a WebAudio node as a source
 */
export default class AudioInNode extends AudioIn {

  constructor(options = {}) {
    super(options);
    // this.type = 'audio-in-node';
    this.metaData = {};
  }

  configureStream() {
    this.streamParams.frameSize = this.params.frameSize;
    this.streamParams.frameRate = this.ctx.sampleRate / this.params.frameSize;
    this.streamParams.sourceSampleRate = this.ctx.sampleRate;
  }

  initialize() {
    super.initialize();

    var blockSize = this.streamParams.frameSize;
    this.scriptProcessor = this.ctx.createScriptProcessor(blockSize, 1, 1);
    // prepare audio graph
    this.scriptProcessor.onaudioprocess = this.process.bind(this);
    this.src.connect(this.scriptProcessor);
  }

  // connect the audio nodes to start streaming
  start() {
    this.initialize();
    this.reset();
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
