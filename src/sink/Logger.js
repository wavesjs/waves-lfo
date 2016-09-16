import BaseLfo from '../core/BaseLfo';
import parameters from 'parameters';

const definitions = {
  frameTime: {
    type: 'boolean',
    default: false,
    metas: { kind: 'dynamic' }
  },
  frameData: {
    type: 'boolean',
    default: false,
    metas: { kind: 'dynamic' }
  },
  frameMetadata: {
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
 * Utility sink to log the `frameTime`, `frameData`, `frameMetadata` and/or
 * the `streamAttributes` in any.
 *
 * @param {Object} options - Override parameters' default values.
 * @param {Boolean} [options.frameTime=false] - If set to true, log all
 *  incomming `frameTime`
 * @param {Boolean} [options.frameData=false] - If set to true, log all
 *  incomming `frameData`
 * @param {Boolean} [options.frameMetadata=false] - If set to true, log all
 *  incomming `frameMetadata`
 * @param {Boolean} [options.streamParams=false] - If set to true, log
 *  `streamParams` of previous operator when the graph is started.
 *
 * @todo - should extends LfoSink
 *
 * @example
 * const logger = new Logger({ frameTime: true });
 * whateverOperator.connect(logger);
 */
class Logger extends BaseLfo {
  constructor(options) {
    super();

    this.params = parameters(definitions, options);
  }

  processStreamParams(prevStreamParams) {
    if (this.params.get('streamParams') === true)
      console.log(prevStreamParams);
  }

  processFunction(frameTime, frameData, frameMetadata) {
    if (this.params.get('frameTime') === true)
      console.log(frameTime);

    if (this.params.get('frameData') === true)
      console.log(frameData);

    if (this.params.get('frameMetadata') === true)
      console.log(frameMetadata);
  }
}

export default Logger;
