import BaseLfoSegmentDescriptor from '../core/BaseLfoSegmentDescriptor';

/**
 * Find minimun and maximum values of a given `signal`.
 *
 * _support `standalone` usage_
 *
 * @memberof module:common.operator
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * const eventIn = new lfo.source.EventIn({
 *   frameSize: 512,
 *   frameType: 'signal',
 *   sampleRate: 0,
 * });
 *
 * const minMax = new lfo.operator.MinMax();
 *
 * const logger = new lfo.sink.Logger({ data: true });
 *
 * eventIn.connect(minMax);
 * minMax.connect(logger);
 * eventIn.start()
 *
 * // create a frame
 * const signal = new Float32Array(512);
 * for (let i = 0; i < 512; i++)
 *   signal[i] = i + 1;
 *
 * eventIn.process(null, signal);
 * > [1, 512];
 */
class MinMax extends BaseLfoSegmentDescriptor {
  constructor(options = {}) {
    // throw errors if options are given
    super({}, options);

    // segment mode
    this.segmentStartTime = null;
    this.min = null;
    this.max = null;
  }

  finalizeStream(endTime) {
    if (this.segmentMode) {
      this.frame.time = this.segmentStartTime;
      this.propagateFrame();
    }

    super.finalizeStream(endTime);
  }

  /** @private */
  processStreamParams(prevStreamParams = {}) {
    this.prepareStreamParams(prevStreamParams);

    this.streamParams.frameType = 'vector';
    this.streamParams.frameSize = 2;
    this.streamParams.description = ['min', 'max'];

    if (this.segmentMode === true)
      this.streamParams.frameRate = 0;

    this.propagateStreamParams();
  }

  processSegmentSignal(frame) {
    // if (segmentStartTime === null)
    //   default process
    // else if (segmentStartTime < frame.time && segmentStopTime < frame.time)
    //   do nothing
    // else if (segmentStopTime > frame.time)
    //   process data until stop time
    //   propagate frame and reinit buffer
    // else if (segmentStartTime > frame.time)
    //
  }


  /**
   * Use the `MinMax` operator in `standalone` mode (i.e. outside of a graph).
   *
   * @param {Float32Array|Array} data - Input signal.
   * @return {Array} - Min and max values.
   *
   * @example
   * const minMax = new MinMax();
   * minMax.initStream({ frameType: 'signal', frameSize: 10 });
   *
   * minMax.inputSignal([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
   * > [0, 5]
   */
  inputSignal(data) {
    const outData = this.frame.data;
    let min = +Infinity;
    let max = -Infinity;

    for (let i = 0, l = data.length; i < l; i++) {
      const value = data[i];
      if (value < min) min = value;
      if (value > max) max = value;
    }

    outData[0] = min;
    outData[1] = max;

    return outData;
  }

  /** @private */
  processSignal(frame) {
    if (this.segmentMode === true)
      this.processSegmentSignal(frame.data);
    else
      this.inputSignal(frame.data);
  }
}

export default MinMax;
