import BaseLfo from '../../common/core/BaseLfo';
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
};

/**
 * Extract raw values from a given file. This node is based on the
 * [`aurora.js`](https://github.com/audiocogs/aurora.js) library.
 *
 * @param {Object} options - Override default options.
 * @param {String} filename - Path to the file.
 * @param {Number} frameSize - Size of output frame.
 * @param {Number} channel - Channel number of the input file.
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

    this.isStarted = false;
    this.processStreamParams = this.processStreamParams.bind(this);
  }

  /**
   * Start the graph, load the file and start slicing it.
   */
  start() {
    this.isStarted = true;

    const filename = this.params.get('filename');
    this.asset = av.Asset.fromFile(filename);
    this.asset.on('error', (err) => console.log(err.stack));
    // call `processStreamParams` because sampleRate is only available
    // at this point
    this.asset.decodeToBuffer(this.processStreamParams);
  }

  /**
   * Finalize the stream and stop the graph.
   */
  stop() {
    this.isStarted = false;

    this.finalizeStream(this.endTime);
  }

  /** @private */
  processStreamParams(buffer) {
    // console.log(this.asset);
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
    this.channelsPerFrame = channelsPerFrame;

    this.propagateStreamParams();
    this.processFrame(buffer);
  }

  /** @private */
  processFrame(buffer) {
    const frameSize = this.params.get('frameSize');
    const channel = this.params.get('channel');
    const sampleRate = this.streamParams.sourceSampleRate;
    const channelsPerFrame = this.channelsPerFrame;
    const length = buffer.length;
    const sourceFrameSize = frameSize * channelsPerFrame;
    const nbrFrames = Math.ceil(length / sourceFrameSize);
    const frameDuration = frameSize / sampleRate;
    const endTime = length / (channelsPerFrame * sampleRate);
    const data = this.frame.data;

    let sourceIndex = 0;

    // input buffer is interleaved, pick only values according to `channel`
    for (let frameIndex = 0; frameIndex < nbrFrames; frameIndex++) {
      for (let i = 0; i < frameSize; i++) {
        const index = sourceIndex + channel;
        data[i] = sourceIndex < length ? buffer[index] : 0;

        sourceIndex += channelsPerFrame;
      }

      this.frame.time = frameIndex * frameDuration;
      this.endTime = Math.min(this.frame.time + frameDuration, endTime);

      this.propagateFrame();
    }

    this.finalizeStream(this.endTime);
  }
}

export default AudioInFile;
