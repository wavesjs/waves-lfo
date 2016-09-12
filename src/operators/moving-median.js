import BaseLfo from '../core/base-lfo';


/**
 * Compute a moving median operation on the incomming value(s).
 *
 * The input of this node is considered as a vector then if the `frameSize` is
 * superior to one, each index of the input frame is considered as belonging
 * to a different dimension and processed in parallel.
 * The node also expose two methods `inputScalar` and `inputArray` that allows
 * to use it outside a graph (eg. inside another node)
 *
 * @param {Object} options - Override default parameters.
 * @param {Number} [options.order=9] - Number of successive values on which
 *  the median is searched. This value should be odd.
 * @param {Number} [options.fill=0] - Value to fill the ring buffer with before
 *  the firsts input frames.
 *
 * @memberof module:operators
 * @example
 * import * as lfo from 'waves-lfo';
 *
 * const eventIn = new lfo.sources.EventIn({ frameSize: 2, inputType: 'vector' });
 * const movingMedian = new lfo.operators.MovingMedian({ order: 5, fill: 0 });
 * const logger = new lfo.sinks.logger({ outFrame: true });
 *
 * eventIn.connect(movingMedian);
 * movingMedian.connect(logger);
 * eventIn.start();
 *
 * eventIn.process(null, [1, 1]);
 * > [0, 0]
 * eventIn.process(null, [2, 2]);
 * > [0, 0]
 * eventIn.process(null, [3, 3]);
 * > [1, 1]
 * eventIn.process(null, [4, 4]);
 * > [2, 2]
 * eventIn.process(null, [5, 5]);
 * > [3, 3]
 */
class MovingMedian extends BaseLfo {
  constructor(options) {
    super({
      order: 9,
      fill: 0,
    }, options);

    this.ringBuffer = null;
    this.sorter = null;
    this.ringIndex = 0;

    this.addIntegerParam('order', 1, 1e9, 'static');
    this.addFloatParam('fill', -Infinity, Infinity, 'static');

    this.ensureOddOrder();
  }

  /** @private */
  ensureOddOrder() {
    const order = this.getParam('order');

    if (order % 2 === 0)
      throw new Error(`Invalid value ${order} for param "order" - should be odd`);
  }

  /** @inheritdoc */
  onParamUpdate(kind, name, value) {
    super.onParamUpdate(kind, name, value);

    switch (name) {
      case 'order':
        this.ensureOddOrder();
        this.setupStream();
        this.reset();
        break;
      case 'fill':
        this.reset();
        break;
    }
  }

  /** @inheritdoc */
  initialize(inStreamParams) {
    super.initialize(inStreamParams, {
      inputType: 'vector',
      outType: 'vector',
      // inherit description from parent as the dimensions do not change
    });
  }

  /** @inheritdoc */
  setupStream() {
    super.setupStream();

    const frameSize = this.streamParams.frameSize;
    const order = this.getParam('order');

    this.ringBuffer = new Float32Array(frameSize * order);
    this.sortBuffer = new Float32Array(frameSize * order);

    this.minIndices = new Uint32Array(frameSize);
  }

  /** @inheritdoc */
  reset() {
    super.reset();

    const fill = this.getParam('fill');

    this.ringBuffer.fill(fill);
    this.ringIndex = 0;
  }

  /**
   * Process the input value and outputs the median according to the order.
   *
   * This method allows for the use of a `MovingMedian` outside a graph (eg.
   * inside another node), in this case `initialize` and `reset` should be
   * called manually on the node.
   *
   * @param {Number} value - Input value to process.
   * @return {Number} - Median value.
   *
   * @example
   * const movingMedian = new MovingMedian({ order: 5, fill: 0 });
   * // the frame size must be defined manually as it is not forwarded by a parent node
   * movingMedian.initialize({ frameSize: 1 });
   * movingMedian.reset();
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
    const order = this.getParam('order');
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

    this.ringIndex = (ringIndex + 1) % order;
    return sortBuffer[medianIndex];
  }

  /**
   * Process the input values and outputs the moving median for each indices.
   *
   * This method allows for the use of a `MovingMedian` outside a graph (eg.
   * inside another node), in this case `initialize` and `reset` should be
   * called manually on the node.
   *
   * @param {Array|Float32Array} frame - Input values to process.
   * @return {Float32Array} - Median values foreach dimension.
   *
   * @example
   * const movingMedian = new MovingMedian({ order: 5, fill: 0 });
   * // the frame size must be defined manually as it is not forwarded by a parent node
   * movingMedian.initialize({ frameSize: 3 });
   * movingMedian.reset();
   *
   * movingMedian.inputArray([1, 1]);
   * > [0, 0]
   * movingMedian.inputArray([2, 2]);
   * > [1, 1]
   * movingMedian.inputArray([3, 3]);
   * > [2, 2]
   */
  inputArray(frame) {
    const ringBuffer = this.ringBuffer;
    const ringIndex = this.ringIndex;
    const sortBuffer = this.sortBuffer;
    const outFrame = this.outFrame;
    const minIndices = this.minIndices;
    const frameSize = this.streamParams.frameSize;
    const order = this.getParam('order');
    const medianIndex = Math.floor(order / 2);
    let startIndex = 0;

    for (let i = 0; i <= medianIndex; i++) {

      for (let j = 0; j < frameSize; j++) {
        outFrame[j] = +Infinity;
        minIndices[j] = 0;

        for (let k = startIndex; k < order; k++) {
          const index = k * frameSize + j;

          // update ring buffer corresponding to current
          if (k === ringIndex && i === 0) {
            ringBuffer[index] = frame[j];
            // console.log(j, Array.from(ringBuffer));
          }

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

    // console.log(sortBuffer);
    this.ringIndex = (ringIndex + 1) % order;

    return this.outFrame;
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

export default MovingMedian;
