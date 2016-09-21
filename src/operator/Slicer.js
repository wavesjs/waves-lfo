import BaseLfo from '../core/BaseLfo';
import parameters from 'parameters';

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
  centeredTimeTag: {
    type: 'boolean',
    default: false,
  }
}

/**
 * Change the frameSize, frameRate and hopSize of the signal.
 * Typically used in front of a fft...
 *
 * @todo - fix crash when hopSize > frameSize (allow to have a decimator for free)
 */
class Slicer extends BaseLfo {
  constructor(options) {
    super();

    this.params = parameters(definitions, options);

    const hopSize = this.params.get('hopSize');
    const frameSize = this.params.get('frameSize');

    if (!hopSize)
      this.params.set('hopSize', frameSize);

    this.params.addListener(this.onParamUpdate.bind(this));

    this.frameIndex = 0;
  }

  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);

    const hopSize = this.params.get('hopSize');
    const frameSize = this.params.get('frameSize');

    this.streamParams.frameSize = frameSize;
    this.streamParams.frameRate = prevStreamParams.sourceSampleRate / hopSize;

    this.propagateStreamParams();
  }

  /** private */
  resetStream() {
    super.resetStream();
    this.frameIndex = 0;
  }

  /** private */
  finalizeStream(endTime) {
    if (this.frameIndex > 0) {
      this.frame.data.fill(0, this.frameIndex);
      this.propagateFrame();
    }

    super.finalizeStream(endTime);
  }

  processFrame(frame) {
    this.prepareFrame();
    this.processFunction(frame);
    // don't call `propagateFrame` as it is call in the `processSignal`
  }

  processSignal(frame) {
    const time = frame.time;
    const block = frame.data;
    const metadata = frame.metadata;

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
          if (this.params.centeredTimeTag)
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
