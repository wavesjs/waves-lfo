import BaseLfo from '../core/base-lfo';

// var isPowerOfTwo = function(number) {
//   while ((number % 2 === 0) && number > 1) {
//     number = number / 2;
//   }

//   return number === 1;
// }

export default class Framer extends BaseLfo {
  constructor(options) {
    var defaults = {
      frameSize: 512,
      // define a good name cf. Nobert
      centeredTimeTag: false
    };

    super(options, defaults);

    this.frameIndex = 0;

    // throw error if frameSize is not a power of 2 ?
    // if (!isPowerOfTwo(this.streamParams.frameSize)) {
    //   // throw Error() ?
    // }
  }

  configureStream() {
    // defaults to `hopSize` === `frameSize`
    if (!this.params.hopSize) {
      this.params.hopSize = this.params.frameSize;
    }

    this.streamParams.frameSize = this.params.frameSize;
    this.streamParams.frameRate = this.streamParams.blockSampleRate / this.params.hopSize;
  }

  // @NOTE must be tested
  reset() {
    this.frameIndex = 0;
    super.reset();
  }

  finalize() {
    // @NOTE what about time ?
    // fill the ongoing buffer with 0
    for (let i = this.frameIndex, l = this.outFrame.length; i < l; i++) {
      this.outFrame[i] = 0;
    }
    // output it
    this.output();

    super.finalize();
  }

  process(time, block, metaData) {
    var sampleRate = this.streamParams.blockSampleRate;
    var samplePeriod = 1 / sampleRate;

    var frameIndex = this.frameIndex;
    var frameSize = this.streamParams.frameSize;
    var blockSize = block.length;
    var blockIndex = 0;
    var hopSize = this.params.hopSize;

    var outFrame = this.outFrame;

    while (blockIndex < blockSize) {
      var numSkip = 0;

      // skip block samples for negative frameIndex
      if (frameIndex < 0) {
        numSkip = -frameIndex;
      }

      if (numSkip < blockSize) {
        blockIndex += numSkip; // skip block segment
        // can copy all the rest of the incoming block
        var numCopy = blockSize - blockIndex;
        // connot copy more than what fits into the frame
        var maxCopy = frameSize - frameIndex;

        if (numCopy >= maxCopy) {
          numCopy = maxCopy;
        }

        // copy block segment into frame
        var copy = block.subarray(blockIndex, blockIndex + numCopy);
        // console.log(blockIndex, frameIndex, numCopy);
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

          // forward metaData ?
          this.metaData = metaData;

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
        var blockRest = blockSize - blockIndex;
        frameIndex += blockRest;
        blockIndex += blockRest;
      }
    }

    this.frameIndex = frameIndex;
  }
}
