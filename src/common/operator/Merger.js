import BaseLfo from '../../core/BaseLfo';

const definitions = {
  // array defining the frameSizes of the input streamss
  // e.g. if [3, 2, 1], we wait for 3 different sources of respective 3, 2, 1 frameSizes
  frameSizes: {
    type: 'any',
    default: null,
    constant: true,
  }
}

/**
 * Merge multiple vector frames. The order of execution depends on the
 * order the branching was initially made. The first branche is master
 * on the time and trigger the output of the frame.
 *
 * @memberof module:common.operator
 *
 * @param {Object} options - Override default parameters
 * @param {Array} [options.frameSizes=null] - Array that defines the number
 *  of values to pick from each incomming vectors.
 *
 * @example
 * import * as lfo from 'waves-lfo/comon'
 *
 * const eventIn = new lfo.operator.EventIn({
 *   type: 'vector',
 *   frameSize: 4,
 *   frameRate: 0,
 * });
 *
 * const minMax = new lfo.operator.MinMax();
 * const magnitude = new lfo.operator.Magnitude();
 *
 * // take the first 2 values of the first branch and 1 value from the second branch
 * const merge = new lfo.operator.Merger({ frameSizes: [2, 1] });
 *
 * // this defines the order in which Merger will be called
 * eventIn.connect(minMax);
 * eventIn.connect(magnitude);
 *
 * minMax.connect(merger);
 * magnitude.connect(merger);
 */
class Merger extends BaseLfo {
  constructor(options) {
    super(definitions, options);
  }

  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);

    // ...
    const frameSizes = this.params.get('frameSizes');
    const numSources = frameSizes.length;

    let frameSize = 0;
    for (let i = 0; i < numSources; i++)
      frameSize += frameSizes[i];


    this.streamParams.frameSize = frameSize;
    this.numSources = numSources;
    this.sourceIndex = 0;

    this.propagateStreamParams();
  }

  processVector() {}
  // processSignal() {} // makes no sens to merge signals (maybe MUX / DEMUX)

  processFrame(frame) {
    const currentIndex = this.sourceIndex;
    const frameSizes = this.params.get('frameSizes');
    const numSources = frameSizes.length;
    const input = frame.data;
    const output = this.frame.data;

    // first source define time
    if (currentIndex === 0)
      this.frame.time = frame.time;

    const currentFrameSize = frameSizes[currentIndex];
    let offset = 0;

    for (let i = 0; i < currentIndex; i++)
      offset += frameSizes[i];

    // copy data
    for (let i = 0; i < currentFrameSize; i++)
      output[offset + i] = input[i];

    this.sourceIndex = (this.sourceIndex + 1) % numSources;

    // we just received the last input, output the frame
    if (this.sourceIndex === 0)
      this.propagateFrame();
  }
}

export default Merger;
