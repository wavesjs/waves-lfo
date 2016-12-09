import BaseLfo from '../../core/BaseLfo';

const definitions = {
  order: {
    type: 'integer',
    min: 1,
    max: 1e9,
    default: 9,
    metas: { kind: 'dynamic' },
  },
  fill: {
    type: 'float',
    min: -Infinity,
    max: +Infinity,
    default: 0,
    metas: { kind: 'dynamic' },
  },
};

/**
 * Compute a moving median operation on the incomming frames (`scalar` or
 * `vector` type). If the input is of type vector, the moving median is
 * computed for each dimension in parallel. If the source sample rate is defined
 * frame time is shifted to the middle of the window defined by the order.
 *
 * _support `standalone` usage_
 *
 * @memberof module:common.operator
 *
 * @param {Object} options - Override default parameters.
 * @param {Number} [options.order=9] - Number of successive values in which
 *  the median is searched. This value must be odd. _dynamic parameter_
 * @param {Number} [options.fill=0] - Value to fill the ring buffer with before
 *  the first input frame. _dynamic parameter_
 *
 * @todo - Implement `processSignal`
 *
 * @example
 * import * as lfo from 'waves-lfo/common';
 *
 * const eventIn = new lfo.source.EventIn({
 *   frameSize: 2,
 *   frameType: 'vector',
 * });
 *
 * const movingMedian = new lfo.operator.MovingMedian({
 *   order: 5,
 *   fill: 0,
 * });
 *
 * const logger = new lfo.sink.Logger({ data: true });
 *
 * eventIn.connect(movingMedian);
 * movingMedian.connect(logger);
 *
 * eventIn.start();
 *
 * eventIn.processFrame(null, [1, 1]);
 * > [0, 0]
 * eventIn.processFrame(null, [2, 2]);
 * > [0, 0]
 * eventIn.processFrame(null, [3, 3]);
 * > [1, 1]
 * eventIn.processFrame(null, [4, 4]);
 * > [2, 2]
 * eventIn.processFrame(null, [5, 5]);
 * > [3, 3]
 */
class MovingMedian extends BaseLfo {
  constructor(options = {}) {
    super(definitions, options);

    this.ringBuffer = null;
    this.sorter = null;
    this.ringIndex = 0;

    this._ensureOddOrder();
  }

  /** @private */
  _ensureOddOrder() {
    if (this.params.get('order') % 2 === 0)
      throw new Error(`Invalid value ${order} for param "order" - should be odd`);
  }

  /** @private */
  onParamUpdate(name, value, metas) {
    super.onParamUpdate(name, value, metas);

    switch (name) {
      case 'order':
        this._ensureOddOrder();
        this.processStreamParams();
        this.resetStream();
        break;
      case 'fill':
        this.resetStream();
        break;
    }
  }

  /** @private */
  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);
    // outType is similar to input type

    const frameSize = this.streamParams.frameSize;
    const order = this.params.get('order');

    this.ringBuffer = new Float32Array(frameSize * order);
    this.sortBuffer = new Float32Array(frameSize * order);

    this.minIndices = new Uint32Array(frameSize);

    this.propagateStreamParams();
  }

  /** @private */
  resetStream() {
    super.resetStream();

    const fill = this.params.get('fill');
    const ringBuffer = this.ringBuffer;
    const ringLength = ringBuffer.length;

    for (let i = 0; i < ringLength; i++)
      this.ringBuffer[i] = fill;

    this.ringIndex = 0;
  }

  /** @private */
  processScalar(frame) {
    this.frame.data[0] = this.inputScalar(frame.data[0]);
  }

  /**
   * Allows for the use of a `MovingMedian` outside a graph (e.g. inside
   * another node), in this case `processStreamParams` and `resetStream`
   * should be called manually on the node.
   *
   * @param {Number} value - Value to feed the moving median with.
   * @return {Number} - Median value.
   *
   * @example
   * import * as lfo from 'waves-lfo/client';
   *
   * const movingMedian = new MovingMedian({ order: 5 });
   * movingMedian.initStream({ frameSize: 1, frameType: 'scalar' });
   *
   * movingMedian.inputScalar(1);
   * > 0
   * movingMedian.inputScalar(2);
   * > 0
   * movingMedian.inputScalar(3);
   * > 1
   * movingMedian.inputScalar(4);
   * > 2
   */
  inputScalar(value) {
    const ringIndex = this.ringIndex;
    const ringBuffer = this.ringBuffer;
    const sortBuffer = this.sortBuffer;
    const order = this.params.get('order');
    const medianIndex = (order - 1) / 2;
    let startIndex = 0;

    ringBuffer[ringIndex] = value;

    for (let i = 0; i <= medianIndex; i++) {
      let min = +Infinity;
      let minIndex = null;

      for (let j = startIndex; j < order; j++) {
        if (i === 0)
          sortBuffer[j] = ringBuffer[j];

        if (sortBuffer[j] < min) {
          min = sortBuffer[j];
          minIndex = j;
        }
      }

      // swap minIndex and startIndex
      const cache = sortBuffer[startIndex];
      sortBuffer[startIndex] = sortBuffer[minIndex];
      sortBuffer[minIndex] = cache;

      startIndex += 1;
    }

    const median = sortBuffer[medianIndex];
    this.ringIndex = (ringIndex + 1) % order;

    return median;
  }

  /** @private */
  processVector(frame) {
    this.inputVector(frame.data);
  }

  /**
   * Allows for the use of a `MovingMedian` outside a graph (e.g. inside
   * another node), in this case `processStreamParams` and `resetStream`
   * should be called manually on the node.
   *
   * @param {Array} values - Values to feed the moving median with.
   * @return {Float32Array} - Median values for each dimension.
   *
   * @example
   * import * as lfo from 'waves-lfo/client';
   *
   * const movingMedian = new MovingMedian({ order: 3, fill: 0 });
   * movingMedian.initStream({ frameSize: 3, frameType: 'vector' });
   *
   * movingMedian.inputArray([1, 1]);
   * > [0, 0]
   * movingMedian.inputArray([2, 2]);
   * > [1, 1]
   * movingMedian.inputArray([3, 3]);
   * > [2, 2]
   */
  inputVector(values) {
    const order = this.params.get('order');
    const ringBuffer = this.ringBuffer;
    const ringIndex = this.ringIndex;
    const sortBuffer = this.sortBuffer;
    const outFrame = this.frame.data;
    const minIndices = this.minIndices;
    const frameSize = this.streamParams.frameSize;
    const medianIndex = Math.floor(order / 2);
    let startIndex = 0;

    for (let i = 0; i <= medianIndex; i++) {

      for (let j = 0; j < frameSize; j++) {
        outFrame[j] = +Infinity;
        minIndices[j] = 0;

        for (let k = startIndex; k < order; k++) {
          const index = k * frameSize + j;

          // update ring buffer corresponding to current
          if (k === ringIndex && i === 0)
            ringBuffer[index] = values[j];

          // copy value in sort buffer on first pass
          if (i === 0) 
            sortBuffer[index] = ringBuffer[index];

          // find minium in the remaining array
          if (sortBuffer[index] < outFrame[j]) {
            outFrame[j] = sortBuffer[index];
            minIndices[j] = index;
          }
        }

        // swap minimum and curent index
        const swapIndex = startIndex * frameSize + j;
        const v = sortBuffer[swapIndex];
        sortBuffer[swapIndex] = sortBuffer[minIndices[j]];
        sortBuffer[minIndices[j]] = v;

        // store this minimum value as current result
        outFrame[j] = sortBuffer[swapIndex];
      }

      startIndex += 1;
    }

    this.ringIndex = (ringIndex + 1) % order;

    return this.frame.data;
  }

  /** @private */
  processFrame(frame) {
    this.preprocessFrame();
    this.processFunction(frame);

    const order = this.params.get('order');
    let time = frame.time;
    // shift time to take account of the added latency
    if (this.streamParams.sourceSampleRate)
      time -= (0.5 * (order - 1) / this.streamParams.sourceSampleRate);

    this.frame.time = time;
    this.frame.metadata = frame.metadata;

    this.propagateFrame(time, this.outFrame, metadata);
  }
}

export default MovingMedian;
