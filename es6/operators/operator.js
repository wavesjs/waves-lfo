import BaseLfo from '../core/base-lfo';

/**
 * apply a given function on each frame
 *
 * @SIGNATURE scalar callback
 * function(value, index, frame) {
 *   return doSomething(value)
 * }
 *
 * @SIGNATURE vector callback
 * function(time, inFrame, outFrame) {
 *   outFrame.set(inFrame, 0);
 *   return time + 1;
 * }
 *
 */
export default class Operator extends BaseLfo {
  constructor(options) {
    super(options, {});

    this.params.type = this.params.type || 'scalar';

    if (this.params.onProcess) {
      this.callback = this.params.onProcess.bind(this);
    }
  }

  configureStream() {
    if (this.params.type === 'vector' && this.params.frameSize) {
      this.streamParams.frameSize = this.params.frameSize;
    }
  }

  process(time, frame, metaData) {
    // apply the callback to the frame
    if (this.params.type === 'vector') {
      var outTime = this.callback(time, frame, this.outFrame);

      if (outTime !== undefined) {
        time = outTime;
      }
    } else {
      for (var i = 0, l = frame.length; i < l; i++) {
        this.outFrame[i] = this.callback(frame[i], i);
      }
    }

    this.time = time;
    this.metaData = metaData;

    this.output();
  }
};
