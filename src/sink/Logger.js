import BaseLfo from '../core/BaseLfo';
import parameters from 'parameters';


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
}

/**
 * Utility sink to log `frame.time`, `frame.data`, `frame.metadata` and/or
 * `streamAttributes` of any node.
 *
 * @param {Object} options - Override parameters' default values.
 * @param {Boolean} [options.time=false] - If set to true, log all
 *  incomming `frame.time`
 * @param {Boolean} [options.data=false] - If set to true, log all
 *  incomming `frame.data`
 * @param {Boolean} [options.metadata=false] - If set to true, log all
 *  incomming `frame.metadata`
 * @param {Boolean} [options.streamParams=false] - If set to true, log
 *  `streamParams` of the previous operator when the graph is started.
 *
 * @todo - should extends LfoSink
 *
 * @memberof module:sink
 *
 * @example
 * const logger = new Logger({ data: true });
 * whateverOperator.connect(logger);
 */
class Logger extends BaseLfo {
  constructor(options) {
    super();

    this.params = parameters(definitions, options);
  }

  /** @private */
  processStreamParams(prevStreamParams) {
    if (this.params.get('streamParams') === true)
      console.log(prevStreamParams);

    this.index = 0;
  }

  /** @private */
  processFunction(frame) {
    console.log(this.index++);

    if (this.params.get('time') === true)
      console.log(frame.time);

    if (this.params.get('data') === true)
      console.log(frame.data);

    if (this.params.get('metadata') === true)
      console.log(frame.metadata);
  }
}

export default Logger;
