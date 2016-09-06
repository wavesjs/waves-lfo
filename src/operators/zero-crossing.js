import BaseLfo from '../core/base-lfo';
import MovingAverage from '../operators/moving-average';


/**
 * Find the zero-crossing on the incomming signal.
 *
 * @todo - should throttle values to have a constant output frame rate
 * now the output frame rate depends on the frequency of the signal, which
 * can probably cause some problems.
 */
class ZeroCrossing extends BaseLfo {

  constructor(options) {
    super({
      order: 3,
      // interpolation: 'linear' // do we need a quadratic interpolation ?
    }, options);

    this.lastSample = null;
    this.lastCrossingTime = null;
    this.lastLastCrossingTime = null;
    // @note this is not a period but a half period
    this.avgFilled = false;

    // 'static' because only the internal movingAverage must reset
    // how to handle that correctly ?
    this.addIntegerParam('order', 1, 1000, 'static');

    this.movingAverage = new MovingAverage({
      order: this.getParam('order'),
      fill: 0,
    });
  }

  initialize(inStreamParams) {
    super.initialize(inStreamParams, {
      frameRate: 0,
      frameSize: 3,
      description: [
        'period',
        'freq',
        'mean freq',
      ],
      inputType: 'block',
      outputType: 'vector',
    });

    this.movingAverage.initialize({ frameSize: 1 });
  }

  outputStats(crossingTime) {
    if (this.lastLastCrossingTime) {
      const period = crossingTime - this.lastLastCrossingTime;
      const freq = 1 / period;
      const meanFreq = this.movingAverage.inputScalar(freq);

      // fill the moving average with the first frequency found
      if (!this.avgFilled) {
        this.movingAverage.setParam('fill', period);
        this.movingAverage.reset();
      }

      this.avgFilled = true;

      this.outFrame[0] = period;
      this.outFrame[1] = freq;
      this.outFrame[2] = meanFreq;

      this.output(crossingTime);
    }

    this.lastLastCrossingTime = this.lastCrossingTime;
    this.lastCrossingTime = crossingTime;
  }

  process(time, frame, metadata) {
    const length = frame.length;
    const sampleRate = this.streamParams.sourceSampleRate;
    const samplePeriod = 1 / sampleRate;
    let lastSample = this.lastSample;

    for (let i = 0; i < length; i++) {
      const sample = frame[i];

      if (lastSample &&
          ((lastSample >= 0 && sample < 0) ||
           (lastSample < 0 && sample >= 0))
      ) {
        // define offset where 0 occur between the 2 samples
        const offset = -lastSample / (sample - lastSample)
        const crossingTime = (i + offset) * samplePeriod + time;
        this.outputStats(crossingTime);
      }

      lastSample = sample;
    }

    this.lastSample = lastSample;
  }
}

export default ZeroCrossing;
