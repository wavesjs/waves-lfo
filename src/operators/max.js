import BaseLfo from '../core/base-lfo';

/**
 * Output the max value of the current frame.
 *
 *
 *
 * @note - not sure if it's usefull, but let's use it as a exercice
 */
class Max extends BaseLfo {
  constructor(options) {
    super({
      order: 1,
    }, options);

    // 'dyanmic' because should call it's own initialize method, even if
    // there is no need to propagate to children
    this.addIntegerParam('order', 1, Infinity, 'dynamic');
  }

  initialize(inStreamParams) {
    super.initialize(inStreamParams);

    const bufferSize = this.getParam('order') * this.streamParams.frameSize;
    this.ringBuffer = new Float32Array(bufferSize);
    this.ringIndex = 0;
  }

  inputScalar(value) {
    const order = this.getParam('order');
    const ringBuffer = this.ringBuffer;
    const ringIndex = this.ringIndex;
    let max = -Infinity;

    this.ringBuffer[ringIndex] = value;

    for (let i = 0; i < order; i++) {
      if (ringBuffer[i] > max)
        max = ringBuffer[i]
    }

    this.ringIndex = (ringIndex + 1) % order;

    return max;
  }

  inputArray(frame) {
    const order = this.getParam('order');
    const frameSize = this.streamParam.frameSize;
    const outFrame = this.outFrame;
    const ringBuffer = this.ringBuffer;
    const ringIndex = this.ringIndex;
    const ringOffset = ringIndex * order;

    for (let i = 0; i < frameSize; i++) {
      outFrame[i] = -Infinity;
      ringBuffer[ringOffset + i] = frame[i];

      for (let j = 0; j < order; j++) {
        const index = j * order + i;

        if (ringBuffer[index] > outFrame[i])
          outFrame[i] = ringBuffer[index];
      }
    }

    this.ringIndex = (ringIndex + 1) % order;

    return outFrame;
  }

  process(time, frame, metadata) {
    if (this.streamParam.frameSize > 1)
      this.inputArray(frame)
    else
      this.outFrame[0] = this.inputScalar(frame[0]);

    this.time = time; // should time be updated ?
    this.metadata = metadata;

    this.output();
  }
}

export default Max;

