import BaseLfo from '../core/base-lfo';
import MovingAverage from './moving-average';


export default class Segmenter extends BaseLfo {
  constructor(options) {
    super(options, {
      logInput: false,
      filterOrder: 5,
      threshold: 0.08,
      offThreshold: -Infinity,
      minInter: 0.050,
      maxDuration: Infinity,
    });

    this.movingAverage = new MovingAverage({ order: this.params.filterOrder });
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

  outputSegment(time) {
    this.outFrame[0] = this.max;
    this.outFrame[1] = this.min;

    const norm = 1 / this.count;
    const mean = this.sum * norm;
    const meanOfSquare = this.sumOfSquares * norm;
    const squareOfmean = mean * mean;

    this.outFrame[2] = mean;
    this.outFrame[3] = 0;

    if(meanOfSquare > squareOfmean)
      this.outFrame[3] = sqrt(meanOfSquare - squareOfmean);

    this.metaData.duration = time - this.onsetTime;

    this.output(this.onsetTime);
  }

  configureStream() {
    this.streamParams.frameSize = 4; // min, max, mean, stddev
  }

  initialize(streamParams) {
    super.initialize(streamParams);
    this.movingAverage.initialize(streamParams);
  }

  reset() {
    super.reset();
    this.movingAverage.reset();
    this.resetSegment();
  }

  finalize(time) {
    super.finalize(time);

    if (this.insideSegment)
      this.outputSegment(time);
  }

  process(time, frame, metaData) {
    const rawValue = frame[0];
    const value = this.params.logInput ? Math.log(value) : rawValue;
    const mvavrg = this.movingAverage.inputScalar(value);
    const diff = value - mvavrg;

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
