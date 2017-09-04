import BaseLfo from '../../core/BaseLfo';

const definitions = {
  type: {
    type: 'enum',
    list: ['linear'],
    default: 'linear',
    metas: {
      kind: 'dynamic',
    }
  },
  inputMin: {
    type: 'float',
    default: 0,
    min: -Infinity,
    max: +Infinity,
    metas: {
      kind: 'dynamic',
    },
  },
  inputMax: {
    type: 'float',
    default: 1,
    min: -Infinity,
    max: +Infinity,
    metas: {
      kind: 'dynamic',
    },
  },
  outputMin: {
    type: 'float',
    default: 1,
    min: -Infinity,
    max: +Infinity,
    metas: {
      kind: 'dynamic',
    },
  },
  outputMax: {
    type: 'float',
    default: 1,
    min: -Infinity,
    max: +Infinity,
    metas: {
      kind: 'dynamic',
    },
  },
}

/**
 * Apply a linear scale on the incomming stream. The output is not clipped.
 *
 * @todo - implement log and exp scale
 *
 * @param {Object} options - Override default options
 * @param {Number} [options.inputMin=0] - Input Minimum
 * @param {Number} [options.inputMax=1] - Input Maximum
 * @param {Number} [options.outputMin=0] - Output Minimum
 * @param {Number} [options.outputMax=1] - Output Maximum
 */
class Scale extends BaseLfo {
  constructor(options) {
    super(definitions, options);

    this.scale = null;
  }

  /** @private */
  _setScaleFunction() {
    const inputMin = this.params.get('inputMin');
    const inputMax = this.params.get('inputMax');
    const outputMin = this.params.get('outputMin');
    const outputMax = this.params.get('outputMax');

    const a = (outputMax - outputMin) / (inputMax - inputMin);
    const b = outputMin - a * inputMin;

    this.scale = (x) => a * x + b;
  }

  /** @private */
  onParamUpdate(name, value, metas) {
    super.onParamUpdate(name, value, metas);

    if (name !== 'type')
      this._setScaleFunction();
  }

  /** @private */
  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);

    this._setScaleFunction();

    this.propagateStreamParams();
  }

  inputVector(data) {
    const outData = this.frame.data;
    const frameSize = this.streamParams.frameSize;
    const scale = this.scale;

    for (let i = 0; i < frameSize; i++)
      outData[i] = scale(data[i]);

    return outData;
  }

  /** @private */
  processVector(frame) {
    this.frame.data = this.inputVector(frame.data);
  }

  inputSignal(data) {
    const outData = this.frame.data;
    const frameSize = this.streamParams.frameSize;
    const scale = this.scale;

    for (let i = 0; i < frameSize; i++)
      outData[i] = scale(data[i]);

    return outData;
  }

  /** @private */
  processSignal(frame) {
    this.frame.data = this.inputVector(frame.data);
  }
}

export default Scale;
