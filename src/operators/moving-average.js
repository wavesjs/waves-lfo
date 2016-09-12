import BaseLfo from '../core/base-lfo';

/**
 * Compute a moving average operation on the incomming value(s).
 *
 * The input of this node is considered as a vector then if the `frameSize` is
 * superior to one, each index of the input frame is considered as belonging
 * to a different dimension and processed in parallel.
 * The node also expose two methods `inputScalar` and `inputArray` that allows
 * to use it outside a graph (eg. inside another node)
 *
 * @param {Object} options - Override default parameters.
 * @param {Number} [options.order=10] - Number of successive values on which
 *  the average is computed.
 * @param {Number} [options.fill=0] - Value to fill the ring buffer with before
 *  the firsts input frames.
 *
 * @memberof module:operators
 * @example
 * import * as lfo from 'waves-lfo';
 *
 * const eventIn = new lfo.sources.EventIn({ frameSize: 2, inputType: 'vector' });
 * const movingAverage = new lfo.operators.MovingAverage({ order: 5, fill: 0 });
 * const logger = new lfo.sinks.logger({ outFrame: true });
 *
 * eventIn.connect(movingAverage);
 * movingAverage.connect(logger);
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
  constructor(options) {
    super({
      order: 10,
      fill: 0,
    }, options);

    this.sum = null;
    this.ringBuffer = null;
    this.ringIndex = 0;

    // don't need to reinit the whole sub graph, only the ringBuffer
    this.addIntegerParam('order', 1, 1e9, 'static');
    this.addFloatParam('fill', -Infinity, +Infinity, 'static');
  }

  onParamUpdate(kind, name, value) {
    super.onParamUpdate(kind, name, value);

    // @todo - should be done lazily in process
    switch (name) {
      case 'order':
        this.setupStream();
        this.reset();
        break;
      case 'fill':
        this.reset();
        break;
    }
  }

  initialize(inStreamParams) {
    super.initialize(inStreamParams, {
      inputType: 'vector',
      outputType: 'vector',
      // inherit description from parent as the dimensions do not change
    });
  }

  setupStream() {
    super.setupStream();

    const frameSize = this.streamParams.frameSize;
    const order = this.getParam('order');

    this.ringBuffer = new Float32Array(order * frameSize);

    if (frameSize > 1)
      this.sum = new Float32Array(frameSize);
    else
      this.sum = 0;
  }

  reset() {
    super.reset();

    const order = this.getParam('order');
    const fill = this.getParam('fill');

    this.ringBuffer.fill(fill);

    const fillSum = order * fill;

    if (this.streamParams.frameSize > 1)
      this.sum.fill(fillSum);
    else
      this.sum = fillSum;

    this.ringIndex = 0;
  }

  /**
   * Process the input value and outputs the average according to the order.
   *
   * This method allows for the use a `MovingAverage` outside a graph (eg.
   * inside another node), in this case `initialize` and `reset` should be
   * called manually on the node.
   *
   * @param {Number} value - Input value to process.
   * @return {Number} - Average value.
   *
   * @example
   * const movingAverage = new MovingAverage({ order: 5, fill: 0 });
   * // the frame size must be defined manually as it is not forwarded by a parent node
   * movingAverage.initialize({ frameSize: 1 });
   * movingAverage.reset();
   *
   * movingAverage.inputScalar(1);
   * > 0.2
   */
  inputScalar(value) {
    const order = this.getParam('order');
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

  /**
   * Process the input values and outputs the moving average for each indices.
   *
   * This method allows for the use of a `MovingAverage` outside a graph (eg.
   * inside another node), in this case `initialize` and `reset` should be
   * called manually on the node.
   *
   * @param {Array|Float32Array} frame - Input values to process.
   * @return {Float32Array} - Average values.
   * @example
   * const movingAverage = new MovingAverage({ order: 5, fill: 0 });
   * // the frame size must be defined manually as it is not forwarded by a parent node
   * movingAverage.initialize({ frameSize: 2 });
   * movingAverage.reset();
   *
   * movingAverage.inputArray([1, 1]);
   * > [0.2, 0.2]
   */
  inputArray(frame) {
    const order = this.getParam('order');
    const outFrame = this.outFrame;
    const frameSize = this.streamParams.frameSize;
    const ringIndex = this.ringIndex;
    const ringOffset = ringIndex * frameSize;
    const ringBuffer = this.ringBuffer;
    const sum = this.sum;
    const scale = 1 / order;

    for (let i = 0; i < frameSize; i++) {
      const ringBufferIndex = ringOffset + i;
      const value = frame[i];
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

  process(time, frame, metadata) {
    super.process();

    const order = this.getParam('order');

    if (this.streamParams.frameSize > 1)
      this.inputArray(frame);
    else
      this.outFrame[0] = this.inputScalar(frame[0]);

    // shift time to take account of the added latency
    if (this.streamParams.sourceSampleRate)
      time -= (0.5 * (order - 1) / this.streamParams.sourceSampleRate);

    this.output(time, this.outFrame, metadata);
  }
}

export default MovingAverage;
