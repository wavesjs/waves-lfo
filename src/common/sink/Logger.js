import BaseLfo from '../../common/core/BaseLfo';

const definitions = {
  time: {
    type: 'boolean',
    default: false,
    metas: { kind: 'dynamic' }
  },
  data: {
    type: 'boolean',
    default: false,
    metas: { kind: 'dynamic' }
  },
  metadata: {
    type: 'boolean',
    default: false,
    metas: { kind: 'dynamic' }
  },
  streamParams: {
    type: 'boolean',
    default: false,
    metas: { kind: 'dynamic' }
  },
  frameIndex: {
    type: 'boolean',
    default: false,
    metas: { kind: 'dynamic' }
  },
}

/**
 * Log `frame.time`, `frame.data`, `frame.metadata` and/or
 * `streamAttributes` of any node in the console.
 *
 * This sink can handle any type if input (`signal`, `vector`, `scalar`)
 *
 * @param {Object} options - Override parameters default values.
 * @param {Boolean} [options.time=false] - Log incomming `frame.time` if `true`.
 * @param {Boolean} [options.data=false] - Log incomming `frame.data` if `true`.
 * @param {Boolean} [options.metadata=false] - Log incomming `frame.metadata`
 *  if `true`.
 * @param {Boolean} [options.streamParams=false] - Log `streamParams` of the
 *  previous node when graph is started.
 * @param {Boolean} [options.frameIndex=false] - Log index of the incomming
 *  `frame`.
 *
 * @memberof module:common.sink
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * const logger = new lfo.sink.Logger({ data: true });
 * whateverOperator.connect(logger);
 */
class Logger extends BaseLfo {
  constructor(options) {
    super(definitions, options);
  }

  /** @private */
  processStreamParams(prevStreamParams) {
    if (this.params.get('streamParams') === true)
      console.log(prevStreamParams);

    this.frameIndex = 0;
  }

  /** @private */
  processFunction(frame) {
    if (this.params.get('frameIndex') === true)
      console.log(this.frameIndex++);

    if (this.params.get('time') === true)
      console.log(frame.time);

    if (this.params.get('data') === true)
      console.log(frame.data);

    if (this.params.get('metadata') === true)
      console.log(frame.metadata);
  }
}

export default Logger;
