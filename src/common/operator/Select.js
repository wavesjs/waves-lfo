import BaseLfo from '../../core/BaseLfo';

const definitions = {
  index: {
    type: 'integer',
    default: 0,
    metas: { kind: 'static' },
  },
  indexes: {
    type: 'any',
    default: null,
    nullable: true,
    metas: { kind: 'dynamic' },
  }
};

/**
 * Select one or several indexes from a `vector` input. If only one index is
 * selected, the output will be of type `scalar`, otherwise the output will
 * be a vector containing the selected indexes.
 *
 * @memberof module:common.operator
 *
 * @param {Object} options - Override default values.
 * @param {Number} options.index - Index to select from the input frame.
 * @param {Array<Number>} options.indexes - Indices to select from the input
 *  frame, if defined, take precedance over `option.index`.
 *
 * @example
 * import * as lfo from 'waves-lfo/common';
 *
 * const eventIn = new lfo.source.EventIn({
 *   frameType: 'vector',
 *   frameSize: 3,
 * });
 *
 * const select = new lfo.operator.Select({
 *   indexes: [2, 0],
 * });
 *
 * eventIn.start();
 * eventIn.process(0, [0, 2, 4]);
 * > [4, 0]
 * eventIn.process(0, [1, 3, 5]);
 * > [5, 1]
 */
class Select extends BaseLfo {
  constructor(options = {}) {
    super(definitions, options);
  }

  /** @private */
  onParamUpdate(name, value, metas = {}) {
    super.onParamUpdate(name, value, metas);

    const index = this.params.get('index');
    const indexes = this.params.get('indexes');

    this.select = (indexes !== null) ? indexes : [index];
  }

  /** @private */
  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);

    const index = this.params.get('index');
    const indexes = this.params.get('indexes');

    let max = (indexes !== null) ?  Math.max.apply(null, indexes) : index;

    if (max >= prevStreamParams.frameSize)
      throw new Error(`Invalid select index "${max}"`);

    this.streamParams.frameType = (indexes !== null) ? 'vector' : 'scalar';
    this.streamParams.frameSize = (indexes !== null) ? indexes.length : 1;

    this.select = (indexes !== null) ? indexes : [index];

    // steal description() from parent
    if (prevStreamParams.description) {
      this.select.forEach((val, index) => {
        this.streamParams.description[index] = prevStreamParams.description[val];
      });
    }

    this.propagateStreamParams();
  }

  /** @private */
  processVector(frame) {
    const data = frame.data;
    const outData = this.frame.data;
    const select = this.select;

    for (let i = 0; i < select.length; i++)
      outData[i] = data[select[i]];
  }
}

export default Select;
