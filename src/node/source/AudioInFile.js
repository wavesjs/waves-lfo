import BaseLfo from '../../core/BaseLfo';
import av from 'av';


const definitions = {
  filename: {
    type: 'string',
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
  progressCallback: {
    type: 'any',
    default: null,
    nullable: true,
    constant: true,
  },
};

const noop = function() {};

/**
 * Read a file and propagate raw signal into the graph.
 *
 * This node is based on the
 * [`aurora.js`](https://github.com/audiocogs/aurora.js) library.
 *
 * @param {Object} options - Override default options.
 * @param {String} [options.filename=null] - Path to the file.
 * @param {Number} [options.frameSize=512] - Size of output frame.
 * @param {Number} [options.channel=0] - Channel number of the input file.
 * @param {Number} [options.progressCallback=null] - Callback to be excuted on each
 *  frame output, receive as argument the current progress ratio.
 *
 * @todo - define which channel should be loaded.
 *
 * @memberof module:node.source
 *
 * @example
 * import * as lfo from 'waves-lfo/node';
 * import path from 'path';
 *
 * const filename = path.join(process.cwd(), './my-file');
 *
 * const audioInFile = new AudioInFile({
 *   filename: filename,
 *   frameSize: 512,
 * });
 *
 * const logger = new Logger({
 *   data: true,
 * });
 *
 * audioInFile.connect(logger);
 * audioInFile.start();
 */
class AudioInFile extends BaseLfo {
  constructor(options) {
    super(definitions, options);

    this.processStreamParams = this.processStreamParams.bind(this);
  }

  /**
   * Start the graph, load the file and start slicing it.
   *
   * @see {@link module:common.core.BaseLfo#processStreamParams}
   * @see {@link module:common.core.BaseLfo#resetStream}
   * @see {@link module:node.source.AudioInFile#stop}
   */
  start() {
    const filename = this.params.get('filename');
    this.asset = av.Asset.fromFile(filename);
    this.asset.on('error', (err) => console.log(err.stack));
    // call `processStreamParams` because sampleRate is only available
    this.asset.decodeToBuffer((buffer) => {
      this.initStream();
      this.processFrame(buffer);
    });
  }

  /**
   * Finalize the stream and stop the graph.
   *
   * @see {@link module:common.core.BaseLfo#finalizeStream}
   * @see {@link module:node.source.AudioInFile#start}
   */
  stop() {
    this.finalizeStream(this.endTime);
  }

  /** @private */
  processStreamParams() {
    const frameSize = this.params.get('frameSize');
    const channel = this.params.get('channel');
    const sourceSampleRate = this.asset.format.sampleRate;
    const channelsPerFrame = this.asset.format.channelsPerFrame;

    if (channel >= channelsPerFrame)
      throw new Error('Invalid channel number, given file only contains ${channelsPerFrame} channels');

    this.streamParams.frameType = 'signal';
    this.streamParams.frameSize = frameSize;
    this.streamParams.sourceSampleRate = sourceSampleRate;
    this.streamParams.frameRate = sourceSampleRate / frameSize;
    this.streamParams.sourceSampleCount = frameSize;

    this.channelsPerFrame = channelsPerFrame;

    this.propagateStreamParams();
  }

  /** @private */
  processFrame(buffer) {
    const frameSize = this.params.get('frameSize');
    const channel = this.params.get('channel');
    const progressCallback = this.params.get('progressCallback') || noop;
    const sampleRate = this.streamParams.sourceSampleRate;
    const channelsPerFrame = this.channelsPerFrame;
    const length = buffer.length;
    const sourceFrameSize = frameSize * channelsPerFrame;
    const nbrFrames = Math.ceil(length / sourceFrameSize);
    const frameDuration = frameSize / sampleRate;
    const endTime = length / (channelsPerFrame * sampleRate);
    const data = this.frame.data;
    const that = this;

    let sourceIndex = 0;
    let frameIndex = 0;

    // input buffer is interleaved, pick only values according to `channel`
    (function slice() {
      for (let i = 0; i < frameSize; i++) {
        const index = sourceIndex + channel;
        data[i] = sourceIndex < length ? buffer[index] : 0;

        sourceIndex += channelsPerFrame;
      }

      that.frame.time = frameIndex * frameDuration;
      that.endTime = Math.min(that.frame.time + frameDuration, endTime);
      that.propagateFrame();

      frameIndex += 1;
      progressCallback(frameIndex / nbrFrames);

      if (frameIndex < nbrFrames)
        setTimeout(slice, 0);
      else
        that.finalizeStream(that.endTime);
    }());

  }
}

export default AudioInFile;
