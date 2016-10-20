import BaseLfo from '../core/BaseLfo';

/**
 * No-op operator allowing to define `processScalar`, `processVector` or
 * `processSignal` at run time.
 *
 * @memberof module:operator
 */
export default class Noop extends BaseLfo {
  constructor(options) {
    super(options);
  }
}
