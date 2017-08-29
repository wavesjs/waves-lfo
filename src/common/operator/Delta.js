import BaseLfo from '../../core/BaseLfo';


function simpleLinearRegression(values, dt) {
  // means
  let xSum = 0;
  let ySum = 0;
  const length = values.length;

  for (let i = 0; i < length; i++) {
    xSum += dt;
    ySum += values[i];
  }

  const xMean = xSum / length;
  const yMean = ySum / length;

  let sumDiffXMeanSquared = 0; // sum[ pow((x - xMean), 2) ]
  let sumDiffYMeanSquared = 0; // sum[ pow((y - yMean), 2) ]
  let sumDiffXYMean = 0;       // sum[ (x - xMean)(y - yMean) ]

  for (let i = 0; i < length; i++) {
    const diffXMean = dt * i - xMean;
    const diffYMean = values[i] - yMean;

    const diffXMeanSquared = diffXMean * diffXMean;
    const diffYMeanSquared = diffYMean * diffYMean;
    const diffXYMean = diffXMean * diffYMean;

    sumDiffXMeanSquared += diffXMeanSquared;
    sumDiffYMeanSquared += diffYMeanSquared;
    sumDiffXYMean += diffXYMean;
  }

  // horizontal line, all y on same line
  if (sumDiffYMeanSquared === 0)
    return 0;

  // Pearson correlation coefficient:
  // cf. https://www.youtube.com/watch?v=2SCg8Kuh0tE
  //
  //                 ∑ [ (x - xMean)(y - yMean) ]
  // r = ------------------------------------------------------
  //     sqrt( ∑ [ pow((x - xMean), 2), pow((y - yMean), 2) ] )
  //
  //
  const r = sumDiffXYMean / Math.sqrt(sumDiffXMeanSquared * sumDiffYMeanSquared);

  // then we have:
  // cf. https://www.youtube.com/watch?v=GhrxgbQnEEU
  //
  // y = a + bx
  // where:
  //         Sy
  // b = r * --
  //         Sx
  //
  // a = yMean - b * xMean
  //
  // S for standard deviation
  //            ∑ [ pow((x - xMean), 2) ]
  // Sx = sqrt( -------------------------  )
  //                      N - 1
  const Sx = Math.sqrt(sumDiffXMeanSquared / (length - 1));
  const Sy = Math.sqrt(sumDiffYMeanSquared / (length - 1));
  const b = r * (Sy / Sx);

  return b;
}

const definitions = {
  order: {
    type: 'integer',
    min: 2,
    max: +Infinity,
    default: 3,
  }
}

/**
 * Returns the simple derivative of successive value using
 * simple linear regression.
 * The current implementation assumes a fixed `frameRate` (`frame.time` is ignored)
 *
 * Before the module is filled, it outputs a value of 0.
 */
class Delta extends BaseLfo {
  constructor(options = {}) {
    super(definitions, options);

    this.buffers = null;
    this.ringIndex = 0;
  }

  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);

    const frameSize = this.streamParams.frameSize;
    const order = this.params.get('order');
    const bufferSize = frameSize * order;

    this.buffers = [];
    // counter before the operator starts outputing frames
    this.ringIndex = 0;

    for (let i = 0; i < frameSize; i++)
      this.buffers[i] = new Float32Array(order);

    this.propagateStreamParams();
  }

  resetStream() {
    super.resetStream();

    const frameSize = this.streamParams.frameSize;
    const order = this.params.get('order');
    const buffers = this.buffers;

    for (let i = 0; i < frameSize; i++) {
      for (let j = 0; j < order; j++)
        buffers[i][j] = 0;
    }

    this.ringIndex = 0;
  }

  /**
   * Assume a stream of vector at a fixed `frameRate`.
   */
  inputVector(data) {
    const order = this.params.get('order');
    const outData = this.frame.data;
    const frameSize = this.streamParams.frameSize;
    const frameRate = this.streamParams.frameRate;
    const buffers = this.buffers;
    const dt = 1 / frameRate;
    this.ringIndex += 1;

    // copy incomming data into buffer
    for (let i = 0; i < frameSize; i++) {
      const buffer = buffers[i];

      // we need to keep the order of the incomming frames
      // then we have to shift all the values in the buffers
      for (let j = 1; j < order; j++)
        buffer[j - 1] = buffer[j];

      buffer[order - 1] = data[i];

      if (this.ringIndex >= order)
        outData[i] = simpleLinearRegression(buffer, dt);
      else
        outData[i] = 0;
    }

    return outData;
  }

  processVector(frame) {


    // center time according to delta size
    const frameRate = this.streamParams.frameRate;
    this.frame.time -= 0.5 * (order - 1) / frameRate;
  }
}

export default Delta;





