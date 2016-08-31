import BaseLfo from '../core/base-lfo';


/**
 * Change the frameSize, frameRate and hopSize of the signal.
 * Typically used in front of a fft...
 */
export default class Framer extends BaseLfo {
  constructor(options) {
    super({
      frameSize: 512,
      centeredTimeTag: false
    }, options);

    this.frameIndex = 0;
  }

  initialize(inStreamParams) {
    if (!this.params.hopSize)
      this.params.hopSize = this.params.frameSize; // hopSize defaults to frameSize

    super.initialize(inStreamParams, {
      frameSize: this.params.frameSize,
      frameRate: inStreamParams.sourceSampleRate / this.params.hopSize,
    });
  }

  // @NOTE must be tested
  reset() {
    this.frameIndex = 0;
    super.reset();
  }

  finalize(endTime) {
    if (this.frameIndex > 0) {
      this.outFrame.fill(0, this.frameIndex);
      this.output();
    }

    super.finalize(endTime);
  }

  process(time, block, metadata) {
    const outFrame = this.outFrame;
    const sampleRate = this.streamParams.sourceSampleRate;
    const samplePeriod = 1 / sampleRate;
    const frameSize = this.streamParams.frameSize;
    const blockSize = block.length;
    const hopSize = this.params.hopSize;
    let frameIndex = this.frameIndex;
    let blockIndex = 0;

    while (blockIndex < blockSize) {
      let numSkip = 0;

      // skip block samples for negative frameIndex
      if (frameIndex < 0) {
        numSkip = -frameIndex;
      }

      if (numSkip < blockSize) {
        blockIndex += numSkip; // skip block segment

        // can copy all the rest of the incoming block
        let numCopy = blockSize - blockIndex;

        // connot copy more than what fits into the frame
        const maxCopy = frameSize - frameIndex;

        if (numCopy >= maxCopy) {
          numCopy = maxCopy;
        }

        // copy block segment into frame
        const copy = block.subarray(blockIndex, blockIndex + numCopy);

        outFrame.set(copy, frameIndex);

        // advance block and frame index
        blockIndex += numCopy;
        frameIndex += numCopy;

        // send frame when completed
        if (frameIndex === frameSize) {
          // define time tag for the outFrame according to configuration
          if (this.params.centeredTimeTag) {
            this.time = time + (blockIndex - frameSize / 2) * samplePeriod;
          } else {
            this.time = time + (blockIndex - frameSize) * samplePeriod;
          }

          // forward metadata ?
          this.metadata = metadata;

          // forward to next nodes
          this.output();

          // shift frame left
          if (hopSize < frameSize) {
            outFrame.set(outFrame.subarray(hopSize, frameSize), 0);
          }

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
