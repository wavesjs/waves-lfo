import BaseLfo from '../../core/BaseLfo';
import SourceMixin from '../../core/SourceMixin';
import Ticker from '@ircam/ticker';

const definitions = {
  source: {
    type: 'any',
    default: null,
    metas: {
      kind: 'static',
    },
  },
}

/**
 * Regenerate a vector stream (possibly in time) in time from a recording.
 * The given recording should comply with the format output by the DataRecorder
 * lfo.
 *
 *
 * @param {Object} options - Override parameters' default values.
 * @param {Array<Object>} [options.source] - Actual recording to process. Should
 *  be compliant with format output by the DataRecorder
 *
 * @see {@link module:common.sink.DataRecorder}
 */
class DataReader extends SourceMixin(BaseLfo) {
  constructor(options) {
    super(definitions, options);

    this.sourceStartTime = null;
    this.sourceEndTime = null;

    this._ticker = null;
    this._frames = null;
    this._frameIndex = 0;
    this._numFrames = null;
    this._hasStarted = false;

    /**
     * define if the recording has the format:
     * { time: [...], data: [[...], [...]] } // true
     * or
     * [{ time, data }, { time, data }]
     */
    this._separateArrayFrames = null;

    this.processFrame = this.processFrame.bind(this);
  }

  processStreamParams() {
    let source = this.params.get('source');

    try {
      source = JSON.parse();
    } catch(err) {} // already JSON, do nothing

    if (source === null)
      throw new Error('Undefined DataReader source');

    this.streamParams = source.streamParams;
    this._frames = source.frames;

    if (this.streamParams === undefined || this._frames === undefined)
      throw new Error('Invalid DataReader source');

    const frameRate = this.streamParams.frameRate;
    const frames = this._frames;
    const numFrames = this._separateArrayFrames ? frames.time.length : frames.length;
    const separateArrayFrames = Array.isArray(frames[0].time) ? true : false;

    if (frameRate === 0) {
      // the recording doesn't have a frameRate, estimate from 10 first frames
      const max = Math.min(10, numFrames);
      let sum = 0;

      for (let i = 0; i < max - 1; i++) {
        const time0 = separateArrayFrames ? frames.time[i] : frames[i].time;
        const time1 = separateArrayFrames ? frames.time[i + 1] : frames[i + 1].time;
        const dt = time1 - time0;
        sum += dt;
      }

      const period = sum / (max - 1);
      this.streamParams.frameRate = 1 / period;
    }

    this.sourceStartTime = separateArrayFrames ? frames.time[0] : frames[0].time;
    this.sourceEndTime = separateArrayFrames ? frames.time[numFrames - 1] : frames[numFrames - 1].time;
    this._numFrames = numFrames;
    this._separateArrayFrames = separateArrayFrames;

    const period = 1 / this.streamParams.frameRate;

    // keep only one ticker instance
    if (this._ticker === null)
      this._ticker = new Ticker(period * 1000, this.processFrame);
    else
      this._ticker.period = period * 1000;

    this.propagateStreamParams();
  }

  /**
   * Start output stream.
   */
  start() {
    if (this.initialized === false) {
      if (this.initPromise === null) // init has not yet been called
        this.initPromise = this.init();

      return this.initPromise.then(() => this.start());
    }

    this._hasStarted = true;
    this._ticker.start();
  }

  /**
   * Stop the output stream and the pointer.
   */
  stop() {
    if (this._hasStarted === true) {
      this._ticker.stop();
      // const end time
      const period = 1 / this.streamParams.frameRate;
      const offset = this.sourceStartTime;
      const endTime = this._frameIndex * period + offset;

      this._frameIndex = 0;
      this._hasStarted = false;

      this.finalizeStream(endTime);
    }
  }

  /**
   * Stop the output stream without reseting the pointer.
   */
  pause() {
    if (this._hasStarted === true) {
      this._ticker.stop();

      this._hasStarted = false;
    }
  }

  /**
   * Go to a given time. The given time must be in the boundaries defined by the
   *
   *
   */
  seek(time) {
    // find the index closest to the given time
    const duration = this.sourceEndTime - this.sourceStartTime;
    const offset = this.sourceStartTime;
    const phase = (time - offset) / (duration - offset);
    const index = Math.floor(phase * this._numFrames);

    this._frameIndex = index;
  }

  prepareFrame() {
    // this prevent seek before start...
    // if (this._reinit === true) // source has been updated
    //   this._frameIndex = 0;

    super.prepareFrame();
  }

  /**
   * Ticker callback
   * @private
   */
  processFrame(logicalTime) {
    this.prepareFrame();

    let frame;

    if (this._separateArrayFrames) {
      const time = this._frames.time[this._frameIndex];
      const data = this._frames.data[this._frameIndex];

      frame = { time, data };
    } else {
      frame = this._frames[this._frameIndex];
    }

    this._frameIndex += 1;
    this.frame = frame;

    this.propagateFrame();

    if (this._frameIndex >= this._numFrames)
      this.stop();
  }
}

export default DataReader;
