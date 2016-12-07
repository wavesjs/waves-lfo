import BaseLfo from '../../core/BaseLfo';
import MovingAverage from './MovingAverage';

const min = Math.min;
const max = Math.max;

const definitions = {
  logInput: {
    type: 'boolean',
    default: false,
    metas: { kind: 'dyanmic' },
  },
  minInput: {
    type: 'float',
    default: 0.000000000001,
    metas: { kind: 'dyanmic' },
  },
  filterOrder: {
    type: 'integer',
    default: 5,
    metas: { kind: 'dyanmic' },
  },
  threshold: {
    type: 'float',
    default: 3,
    metas: { kind: 'dyanmic' },
  },
  offThreshold: {
    type: 'float',
    default: -Infinity,
    metas: { kind: 'dyanmic' },
  },
  minInter: {
    type: 'float',
    default: 0.050,
    metas: { kind: 'dyanmic' },
  },
  maxDuration: {
    type: 'float',
    default: Infinity,
    metas: { kind: 'dyanmic' },
  },
}

/**
 * Create segments based on attacks.
 *
 * @memberof module:common.operator
 *
 * @param {Object} options - Override default parameters.
 * @param {Boolean} [options.logInput=false] - Apply log on the input.
 * @param {Number} [options.minInput=0.000000000001] - Minimum value to use as
 *  input.
 * @param {Number} [options.filterOrder=5] - Order of the internally used moving
 *  average.
 * @param {Number} [options.threshold=3] - Threshold that triggers a segment
 *  start.
 * @param {Number} [options.offThreshold=-Infinity] - Threshold that triggers
 *  a segment end.
 * @param {Number} [options.minInter=0.050] - Minimum delay between two semgents.
 * @param {Number} [options.maxDuration=Infinity] - Maximum duration of a segment.
 *
 * @example
 * // assuming a stream from the microphone
 * const source = audioContext.createMediaStreamSource(stream);
 *
 * const audioInNode = new lfo.source.AudioInNode({
 *   sourceNode: source,
 *   audioContext: audioContext,
 * });
 *
 * const slicer = new lfo.operator.Slicer({
 *   frameSize: frameSize,
 *   hopSize: hopSize,
 *   centeredTimeTags: true
 * });
 *
 * const power = new lfo.operator.RMS({
 *   power: true,
 * });
 *
 * const segmenter = new lfo.operator.Segmenter({
 *   logInput: true,
 *   filterOrder: 5,
 *   threshold: 3,
 *   offThreshold: -Infinity,
 *   minInter: 0.050,
 *   maxDuration: 0.050,
 * });
 *
 * const logger = new lfo.sink.Logger({ time: true });
 *
 * audioInNode.connect(slicer);
 * slicer.connect(power);
 * power.connect(segmenter);
 * segmenter.connect(logger);
 *
 * audioInNode.start();
 */
class Segmenter extends BaseLfo {
  constructor(options) {
    super(definitions, options);

    this.insideSegment = false;
    this.onsetTime = -Infinity;

    // stats
    this.min = Infinity;
    this.max = -Infinity;
    this.sum = 0;
    this.sumOfSquares = 0;
    this.count = 0;

    const minInput = this.params.get('minInput');
    let fill = minInput;

    if (this.params.get('logInput') && minInput > 0)
      fill = Math.log(minInput);

    this.movingAverage = new MovingAverage({
      order: this.params.get('filterOrder'),
      fill: fill,
    });

    this.lastMvavrg = fill;
  }

  onParamUpdate(name, value, metas) {
    super.onParamUpdate(name, value, metas);

    if (name === 'filterOrder')
      this.movingAverage.params.set('order', value);
  }

  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);

    this.streamParams.frameType = 'vector';
    this.streamParams.frameSize = 5;
    this.streamParams.frameRate = 0;
    this.streamParams.description = ['duration', 'min', 'max', 'mean', 'stddev'];


    this.movingAverage.initStream(prevStreamParams);

    this.propagateStreamParams();
  }

  resetStream() {
    super.resetStream();
    this.movingAverage.resetStream();
    this.resetSegment();
  }

  finalizeStream(endTime) {
    if (this.insideSegment)
      this.outputSegment(endTime);

    super.finalizeStream(endTime);
  }

  resetSegment() {
    this.insideSegment = false;
    this.onsetTime = -Infinity;
    // stats
    this.min = Infinity;
    this.max = -Infinity;
    this.sum = 0;
    this.sumOfSquares = 0;
    this.count = 0;
  }

  outputSegment(endTime) {
    const outData = this.frame.data;
    outData[0] = endTime - this.onsetTime;
    outData[1] = this.min;
    outData[2] = this.max;

    const norm = 1 / this.count;
    const mean = this.sum * norm;
    const meanOfSquare = this.sumOfSquares * norm;
    const squareOfmean = mean * mean;

    outData[3] = mean;
    outData[4] = 0;

    if (meanOfSquare > squareOfmean)
      outData[4] = Math.sqrt(meanOfSquare - squareOfmean);

    this.frame.time = this.onsetTime;

    this.propagateFrame();
  }

  processSignal(frame) {
    const logInput = this.params.get('logInput');
    const minInput = this.params.get('minInput');
    const threshold = this.params.get('threshold');
    const minInter = this.params.get('minInter');
    const maxDuration = this.params.get('maxDuration');
    const offThreshold = this.params.get('offThreshold');
    const rawValue = frame.data[0];
    const time = frame.time;
    let value = Math.max(rawValue, minInput);

    if (logInput)
      value = Math.log(value);

    const diff = value - this.lastMvavrg;
    this.lastMvavrg = this.movingAverage.inputScalar(value);

    // update frame metadata
    this.frame.metadata = frame.metadata;

    if (diff > threshold && time - this.onsetTime > minInter) {
      if (this.insideSegment)
        this.outputSegment(time);

      // start segment
      this.insideSegment = true;
      this.onsetTime = time;
      this.max = -Infinity;
    }

    if (this.insideSegment) {
      this.min = min(this.min, rawValue);
      this.max = max(this.max, rawValue);
      this.sum += rawValue;
      this.sumOfSquares += rawValue * rawValue;
      this.count++;

      if (time - this.onsetTime >= maxDuration || value <= offThreshold) {
        this.outputSegment(time);
        this.insideSegment = false;
      }
    }
  }

  processFrame(frame) {
    this.prepareFrame();
    this.processFunction(frame);
    // do not propagate here as the frameRate is now zero
  }
}

export default Segmenter;
