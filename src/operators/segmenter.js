import BaseLfo from '../core/base-lfo';
import MovingAverage from './moving-average';


export default class Segmenter extends BaseLfo {
  constructor(options) {
    super({
      logInput: false,
      minInput: 0.000000000001,
      filterOrder: 5,
      threshold: 3,
      offThreshold: -Infinity,
      minInter: 0.050,
      maxDuration: Infinity,
    }, options);

    this.insideSegment = false;
    this.onsetTime = -Infinity;

    // stats
    this.min = Infinity;
    this.max = -Infinity;
    this.sum = 0;
    this.sumOfSquares = 0;
    this.count = 0;

    const minInput = this.params.minInput;
    let fill = minInput;

    if(this.params.logInput && minInput > 0)
      fill = Math.log(minInput);

    this.movingAverage = new MovingAverage({
      order: this.params.filterOrder,
      fill: fill,
    });

    this.lastMvavrg = fill;
  }

  set threshold(value) {
    this.params.threshold = value;
  }

  set offThreshold(value) {
    this.params.offThreshold = value;
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
    this.outFrame[0] = endTime - this.onsetTime;
    this.outFrame[1] = this.min;
    this.outFrame[2] = this.max;

    const norm = 1 / this.count;
    const mean = this.sum * norm;
    const meanOfSquare = this.sumOfSquares * norm;
    const squareOfmean = mean * mean;

    this.outFrame[3] = mean;
    this.outFrame[4] = 0;

    if (meanOfSquare > squareOfmean)
      this.outFrame[4] = Math.sqrt(meanOfSquare - squareOfmean);

    this.output(this.onsetTime);
  }

  initialize(inStreamParams) {
    super.initialize(inStreamParams, {
      frameSize: 5,
      description: [
        'duration',
        'min',
        'max',
        'mean',
        'std dev',
      ],
    });

    this.movingAverage.initialize(inStreamParams);
  }

  reset() {
    super.reset();
    this.movingAverage.reset();
    this.resetSegment();
  }

  finalize(endTime) {
    if (this.insideSegment)
      this.outputSegment(endTime);

    super.finalize(endTime);
  }

  process(time, frame, metaData) {
    const rawValue = frame[0];
    const minInput = this.params.minInput;
    let value = Math.max(rawValue, minInput);

    if (this.params.logInput)
      value = Math.log(value);

    const diff = value - this.lastMvavrg;
    this.lastMvavrg = this.movingAverage.inputScalar(value);

    this.metaData = metaData;

    if (diff > this.params.threshold && time - this.onsetTime > this.params.minInter) {
      if(this.insideSegment)
        this.outputSegment(time);

      // start segment
      this.insideSegment = true;
      this.onsetTime = time;
      this.max = -Infinity;
    }

    if (this.insideSegment) {
      this.min = Math.min(this.min, rawValue);
      this.max = Math.max(this.max, rawValue);
      this.sum += rawValue;
      this.sumOfSquares += rawValue * rawValue;
      this.count++;

      if (time - this.onsetTime >= this.params.maxDuration || value <= this.params.offThreshold) {
        this.outputSegment(time);
        this.insideSegment = false;
      }
    }
  }
}
