import lfo from 'waves-lfo';

export default class Segmenter extends lfo.core.BaseLfo {
  constructor(options) {
    super(options, {
      logInput: false,
      filterOrder: 5,
      threshold: 0.08,
      offThreshold: -Infinity,
      minInter: 0.050,
      maxDuration: Infinity,
    });

    this.movingAverage = new lfo.operators.MovingAverage({ order: this.params.filterOrder });
    this.initSegment();
  }

  set threshold(value) {
    this.params.threshold = value;
  }

  set offThreshold(value) {
    this.params.offThreshold = value;
  }

  initSegment() {
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

  reset() {
    super.reset();
    this.movingAverage.reset();
    this.resetSegment();
  }

  finalize(time) {
    super.finalize(time);

    if(this.insideSegment)
      this.outputSegment(time);
  }

  process(time, frame, metaData) {
    const value = frame[0];

    if(this.params.logInput)
      value = Math.log(value);

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

    if(this.insideSegment) {
      this.min = Math.min(this.min, value);
      this.max = Math.max(this.max, value);
      this.sum += value;
      this.sumOfSquares += value * value;
      this.count++;

      if(time - this.onsetTime >= this.params.maxDuration || value < this.params.offThreshold) {
        this.outputSegment(time);
        this.insideSegment = false;
      }
    }
  }
}
