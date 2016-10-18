import BaseLfo from '../core/BaseLfo';
import parameters from 'parameters';

const sqrt = Math.sqrt;

/**
 * Compute mean and standard deviation of a given `signal`.
 *
 * @memberof module:operator
 *
 * @example
 * import * as lfo from 'waves-lfo';
 *
 * const audioContext = new AudioContext();
 *
 * navigator.mediaDevices
 *   .getUserMedia({ audio: true })
 *   .then(init)
 *   .catch((err) => console.error(err.stack));
 *
 * function init(stream) {
 *   const source = audioContext.createMediaStreamSource(stream);
 *
 *   const audioInNode = new lfo.source.AudioInNode({
 *     sourceNode: source,
 *     audioContext: audioContext,
 *   });
 *
 *   const meanStddev = new lfo.operator.MeanStddev();
 *
 *   const traceDisplay = new lfo.sink.TraceDisplay({
 *     canvas: '#trace',
 *   });
 *
 *   audioInNode.connect(meanStddev);
 *   meanStddev.connect(traceDisplay);
 *   audioInNode.start();
 * }
 */
class MeanStddev extends BaseLfo {
  constructor(options = {}) {
    // no options available, just throw an error if some param try to be set.
    super({}, options);
  }

  /** @private */
  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);

    this.streamParams.frameType = 'vector';
    this.streamParams.frameSize = 2;
    this.streamParams.description = ['mean', 'stddev'];

    this.propagateStreamParams();
  }

  /**
   * Use a `MeanStddev` operator outside of a graph (i.e. `standalone` mode).
   *
   * @param {Array|Float32Array} values - Values to process.
   * @return {Array} - Mean and standart deviation of the input values.
   *
   * @example
   * import * as lfo from 'waves-lfo';
   *
   * const meanStddev = new lfo.operator.MeanStddev();
   * meanStddev.initStream({ frameType: 'vector', frameSize: 1024 });
   * meanStddev.inputVector(someSineSignal);
   * > [0, 0.7071]
   */
  inputSignal(values) {
    const outData = this.frame.data;
    const length = values.length;

    let mean = 0;
    let m2 = 0;

    // compute mean and variance with Welford algorithm
    // https://en.wikipedia.org/wiki/Algorithms_for_calculating_variance
    for (let i = 0; i < length; i++) {
      const x = values[i];
      const delta = x - mean;
      mean += delta / (i + 1);
      m2 += delta * (x - mean);
    }

    const variance = m2 / (length - 1);
    const stddev = sqrt(variance);

    outData[0] = mean;
    outData[1] = stddev;

    return outData;
  }

  /** @private */
  processSignal(frame) {
    this.inputSignal(frame.data);
  }
}

export default MeanStddev;
