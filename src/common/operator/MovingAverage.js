import BaseLfo from '../../core/BaseLfo';

const definitions = {
  order: {
    type: 'integer',
    min: 1,
    max: 1e9,
    default: 10,
    metas: { kind: 'dynamic' }
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
 * Compute a moving average operation on the incomming frames (`scalar` or
 * `vector` type). If the input is of type vector, the moving average is
 * computed for each dimension in parallel. If the source sample rate is defined
 * frame time is shifted to the middle of the window defined by the order.
 *
 * _support `standalone` usage_
 *
 * @memberof module:common.operator
 *
 * @param {Object} options - Override default parameters.
 * @param {Number} [options.order=10] - Number of successive values on which
 *  the average is computed.
 * @param {Number} [options.fill=0] - Value to fill the ring buffer with before
 *  the first input frame.
 *
 * @todo - Implement `processSignal` ?
 *
 * @example
 * import * as lfo from 'waves-lfo/common';
 *
 * const eventIn = new lfo.source.EventIn({
 *   frameSize: 2,
 *   frameType: 'vector'
 * });
 *
 * const movingAverage = new lfo.operator.MovingAverage({
 *   order: 5,
 *   fill: 0
 * });
 *
 * const logger = new lfo.sink.Logger({ data: true });
 *
 * eventIn.connect(movingAverage);
 * movingAverage.connect(logger);
 *
 * eventIn.start();
 *
 * eventIn.process(null, [1, 1]);
 * > [0.2, 0.2]
 * eventIn.process(null, [1, 1]);
 * > [0.4, 0.4]
 * eventIn.process(null, [1, 1]);
 * > [0.6, 0.6]
 * eventIn.process(null, [1, 1]);
 * > [0.8, 0.8]
 * eventIn.process(null, [1, 1]);
 * > [1, 1]
 */
class MovingAverage extends BaseLfo {
  constructor(options = {}) {
    super(definitions, options);

    this.sum = null;
    this.ringBuffer = null;
    this.ringIndex = 0;
  }

  /** @private */
  onParamUpdate(name, value, metas) {
    super.onParamUpdate(name, value, metas);

    // @todo - should be done lazily in process
    switch (name) {
      case 'order':
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

    const frameSize = this.streamParams.frameSize;
    const order = this.params.get('order');

    this.ringBuffer = new Float32Array(order * frameSize);

    if (frameSize > 1)
      this.sum = new Float32Array(frameSize);
    else
      this.sum = 0;

    this.propagateStreamParams();
  }

  /** @private */
  resetStream() {
    super.resetStream();

    const order = this.params.get('order');
    const fill = this.params.get('fill');
    const ringBuffer = this.ringBuffer;
    const ringLength = ringBuffer.length;

    for (let i = 0; i < ringLength; i++)
      ringBuffer[i] = fill;

    const fillSum = order * fill;
    const frameSize = this.streamParams.frameSize;

    if (frameSize > 1) {
      for (let i = 0; i < frameSize; i++)
        this.sum[i] = fillSum;
    } else {
      this.sum = fillSum;
    }

    this.ringIndex = 0;
  }

  /** @private */
  processScalar(frame) {
    this.frame.data[0] = this.inputScalar(frame.data[0]);
  }

  /**
   * Use the `MovingAverage` operator in `standalone` mode (i.e. outside of a
   * graph) with a `scalar` input.
   *
   * @param {Number} value - Value to feed the moving average with.
   * @return {Number} - Average value.
   *
   * @example
   * import * as lfo from 'waves-lfo/client';
   *
   * const movingAverage = new lfo.operator.MovingAverage({ order: 5 });
   * movingAverage.initStream({ frameSize: 1, frameType: 'scalar' });
   *
   * movingAverage.inputScalar(1);
   * > 0.2
   * movingAverage.inputScalar(1);
   * > 0.4
   * movingAverage.inputScalar(1);
   * > 0.6
   */
  inputScalar(value) {
    const order = this.params.get('order');
    const ringIndex = this.ringIndex;
    const ringBuffer = this.ringBuffer;
    let sum = this.sum;

    sum -= ringBuffer[ringIndex];
    sum += value;

    this.sum = sum;
    this.ringBuffer[ringIndex] = value;
    this.ringIndex = (ringIndex + 1) % order;

    return sum / order;
  }

  /** @private */
  processVector(frame) {
    this.inputVector(frame.data);
  }

  /**
   * Use the `MovingAverage` operator in `standalone` mode (i.e. outside of a
   * graph) with a `vector` input.
   *
   * @param {Array} values - Values to feed the moving average with.
   * @return {Float32Array} - Average value for each dimension.
   *
   * @example
   * import * as lfo from 'waves-lfo/client';
   *
   * const movingAverage = new lfo.operator.MovingAverage({ order: 5 });
   * movingAverage.initStream({ frameSize: 2, frameType: 'scalar' });
   *
   * movingAverage.inputArray([1, 1]);
   * > [0.2, 0.2]
   * movingAverage.inputArray([1, 1]);
   * > [0.4, 0.4]
   * movingAverage.inputArray([1, 1]);
   * > [0.6, 0.6]
   */
  inputVector(values) {
    const order = this.params.get('order');
    const outFrame = this.frame.data;
    const frameSize = this.streamParams.frameSize;
    const ringIndex = this.ringIndex;
    const ringOffset = ringIndex * frameSize;
    const ringBuffer = this.ringBuffer;
    const sum = this.sum;
    const scale = 1 / order;

    for (let i = 0; i < frameSize; i++) {
      const ringBufferIndex = ringOffset + i;
      const value = values[i];
      let localSum = sum[i];

      localSum -= ringBuffer[ringBufferIndex];
      localSum += value;

      this.sum[i] = localSum;
      outFrame[i] = localSum * scale;
      ringBuffer[ringBufferIndex] = value;
    }

    this.ringIndex = (ringIndex + 1) % order;

    return outFrame;
  }

  /** @private */
  processFrame(frame) {
    this.prepareFrame();
    this.processFunction(frame);

    const order = this.params.get('order');
    let time = frame.time;
    // shift time to take account of the added latency
    if (this.streamParams.sourceSampleRate)
      time -= (0.5 * (order - 1) / this.streamParams.sourceSampleRate);

    this.frame.time = time;
    this.frame.metadata = frame.metadata;

    this.propagateFrame();
  }
}

export default MovingAverage;
