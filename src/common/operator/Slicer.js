import BaseLfo from '../core/BaseLfo';

const definitions = {
  frameSize: {
    type: 'integer',
    default: 512,
    metas: { kind: 'static' },
  },
  hopSize: { // should be nullable
    type: 'integer',
    default: null,
    nullable: true,
    metas: { kind: 'static' },
  },
  centeredTimeTags: {
    type: 'boolean',
    default: false,
  }
}

/**
 * Change the `frameSize` and `hopSize` of a `signal` input according to
 * the given options.
 * This operator updates the stream parameters according to its configuration.
 *
 * @memberof module:common.operator
 *
 * @param {Object} options - Override default parameters.
 * @param {Number} [options.frameSize=512] - Frame size of the output signal.
 * @param {Number} [options.hopSize=null] - Number of samples between two
 *  consecutive frames. If null, `hopSize` is set to `frameSize`.
 * @param {Boolean} [options.centeredTimeTags] - Move the time tag to the middle
 *  of the frame.
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * const eventIn = new lfo.source.EventIn({
 *   frameType: 'signal',
 *   frameSize: 10,
 *   sampleRate: 2,
 * });
 *
 * const slicer = new lfo.operator.Slicer({
 *   frameSize: 4,
 *   hopSize: 2
 * });
 *
 * const logger = new lfo.sink.Logger({ time: true, data: true });
 *
 * eventIn.connect(slicer);
 * slicer.connect(logger);
 * eventIn.start();
 *
 * eventIn.process(0, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
 * > { time: 0, data: [0, 1, 2, 3] }
 * > { time: 1, data: [2, 3, 4, 5] }
 * > { time: 2, data: [4, 5, 6, 7] }
 * > { time: 3, data: [6, 7, 8, 9] }
 */
class Slicer extends BaseLfo {
  constructor(options = {}) {
    super(definitions, options);

    const hopSize = this.params.get('hopSize');
    const frameSize = this.params.get('frameSize');

    if (!hopSize)
      this.params.set('hopSize', frameSize);

    this.params.addListener(this.onParamUpdate.bind(this));

    this.frameIndex = 0;
  }

  /** @private */
  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);

    const hopSize = this.params.get('hopSize');
    const frameSize = this.params.get('frameSize');

    this.streamParams.frameSize = frameSize;
    this.streamParams.frameRate = prevStreamParams.sourceSampleRate / hopSize;

    this.propagateStreamParams();
  }

  /** @private */
  resetStream() {
    super.resetStream();
    this.frameIndex = 0;
  }

  /** @private */
  finalizeStream(endTime) {
    if (this.frameIndex > 0) {
      const frameRate = this.streamParams.frameRate;
      const frameSize = this.streamParams.frameSize;
      const data = this.frame.data;
      // set the time of the last frame
      this.frame.time += (1 / frameRate);

      for (let i = this.frameIndex; i < frameSize; i++)
        data[i] = 0;

      this.propagateFrame();
    }

    super.finalizeStream(endTime);
  }

  /** @private */
  processFrame(frame) {
    this.prepareFrame();
    this.processFunction(frame);
  }

  /** @private */
  processSignal(frame) {
    const time = frame.time;
    const block = frame.data;
    const metadata = frame.metadata;

    const centeredTimeTags = this.params.get('centeredTimeTags');
    const hopSize = this.params.get('hopSize');
    const outFrame = this.frame.data;
    const frameSize = this.streamParams.frameSize;
    const sampleRate = this.streamParams.sourceSampleRate;
    const samplePeriod = 1 / sampleRate;
    const blockSize = block.length;

    let frameIndex = this.frameIndex;
    let blockIndex = 0;

    while (blockIndex < blockSize) {
      let numSkip = 0;

      // skip block samples for negative frameIndex (frameSize < hopSize)
      if (frameIndex < 0) {
        numSkip = -frameIndex;
        frameIndex = 0; // reset `frameIndex`
      }

      if (numSkip < blockSize) {
        blockIndex += numSkip; // skip block segment
        // can copy all the rest of the incoming block
        let numCopy = blockSize - blockIndex;
        // connot copy more than what fits into the frame
        const maxCopy = frameSize - frameIndex;

        if (numCopy >= maxCopy)
          numCopy = maxCopy;

        // copy block segment into frame
        const copy = block.subarray(blockIndex, blockIndex + numCopy);
        outFrame.set(copy, frameIndex);
        // advance block and frame index
        blockIndex += numCopy;
        frameIndex += numCopy;

        // send frame when completed
        if (frameIndex === frameSize) {
          // define time tag for the outFrame according to configuration
          if (centeredTimeTags)
            this.frame.time = time + (blockIndex - frameSize / 2) * samplePeriod;
          else
            this.frame.time = time + (blockIndex - frameSize) * samplePeriod;

          this.frame.metadata = metadata;
          // forward to next nodes
          this.propagateFrame();

          // shift frame left
          if (hopSize < frameSize)
            outFrame.set(outFrame.subarray(hopSize, frameSize), 0);

          frameIndex -= hopSize; // hop forward
        }
      } else {
        // skip entire block
        const blockRest = blockSize - blockIndex;
        frameIndex += blockRest;
        blockIndex += blockRest;
      }
    }

    this.frameIndex = frameIndex;
  }
}

export default Slicer;
