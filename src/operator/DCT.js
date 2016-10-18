import BaseLfo from '../core/BaseLfo';
import parameters from 'parameters';

const sqrt = Math.sqrt;
const cos = Math.cos;
const PI = Math.PI;

// DCT Type 2 - orthogonal matrix scaling
function getDCTWeights(order, N, type = 'htk') {
  const weights = new Float32Array(N * order);
  const piOverN = PI / N;
  const scale0 = 1 / sqrt(2);
  const scale = sqrt(2 / N);

  for (let k = 0; k < order; k++) {
    const s = (k === 0) ? (scale0 * scale) : scale;
    // const s = scale; // rta doesn't apply k=0 scaling

    for (let n = 0; n < N; n++)
      weights[k * N + n] = s * cos(k * (n + 0.5) * piOverN);
  }

  return weights;
}

const definitions = {
  order: {
    type: 'integer',
    default: 12,
    metas: { kind: 'static' },
  },
};

/**
 * Compute the Discrete Cosine Transform of an input signal.
 * (HTK style weighting).
 *
 * This operator can handle `signal` as well as `vector` inputs.
 *
 * @memberof module:operator
 *
 * @param {Object} options - Override default parameters.
 * @param {Number} [options.order=12] - Number of computed bins.
 *
 * @example
 * import * as lfo from 'waves-lfo';
 *
 * // assuming some audio buffer
 * const source = new AudioInBuffer({
 *   audioBuffer: audioBuffer,
 *   useWorker: false,
 * });
 *
 * const slicer = new Slicer({
 *   frameSize: 512,
 *   hopSize: 512,
 * });
 *
 * const dct = new DCT({
 *   order: 12,
 * });
 *
 * const logger = new lfo.sink.Logger({ data: true });
 *
 * source.connect(slicer);
 * slicer.connect(dct);
 * dct.connect(logger);
 *
 * source.start();
 */
class DCT extends BaseLfo {
  constructor(options) {
    super(definitions, options);
  }

  /** @private */
  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);

    const order = this.params.get('order');
    const inFrameSize = prevStreamParams.frameSize;

    this.streamParams.frameSize = order;
    this.streamParams.frameType = 'vector';
    this.streamParams.description = [];

    this.weightMatrix = getDCTWeights(order, inFrameSize);

    this.propagateStreamParams();
  }

  /**
   * Use the DCT operator outside of a graph (i.e. `standalone` mode).
   *
   * @param {Array} values - Input values.
   * @return {Array} - DCT of the input array.
   *
   * @example
   * const dct = new lfo.operator.DCT({ order: 12 });
   * // mandatory for use in standalone mode
   * dct.initStream({ frameSize: 512, frameType: 'signal' });
   * dct.inputSignal(data);
   */
  inputSignal(values) {
    const order = this.params.get('order');
    const frameSize = values.length;
    const outFrame = this.frame.data;
    const weights = this.weightMatrix;

    for (let k = 0; k < order; k++) {
      const offset = k * frameSize;
      outFrame[k] = 0;

      for (let n = 0; n < frameSize; n++)
        outFrame[k] += values[n] * weights[offset + n];
    }

    return outFrame;
  }

  /** @private */
  processSignal(frame) {
    this.inputSignal(frame.data);
  }

  /** @private */
  processVector(frame) {
    this.inputSignal(frame.data);
  }
}

export default DCT;
