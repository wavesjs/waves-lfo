import BaseLfo from '../core/BaseLfo';

const definitions = {
  state: {
    type: 'enum',
    default: 'on',
    list: ['on', 'off'],
    metas: { kind: 'dynamic' },
  },
};

/**
 * The Toggle operator allows to stop the propagation of the stream in the
 * subgraph. When "on", frames are propagated, when "off" the propagation is
 * stopped.
 * The `streamParams` propagation is never bypassed so the subsequent subgraph
 * is always ready for incomming frames.
 *
 * @memberof module:operator
 *
 * @param {Object} options - Override default parameters.
 * @param {String} [options.state='on'] - Default state of the switch.
 *
 * @example
 * // todo
 */
class Toggle extends BaseLfo {
  constructor(options = {}) {
    super(definitions, options);

    this.state = this.params.get('state');
  }

  /**
   * Set the state of the operator.
   *
   * @param {String} state - New state of the operator, valid values are `'on'`
   *  and `'off'`.
   */
  setState(state) {
    if (definitions.state.list.indexOf(state) === -1)
      throw new Error(`Invalid switch state value "${state}" [valid values: "on"/"off"]`);

    this.state = state;
  }

  // define all possible stream API
  processScalar() {}
  processVector() {}
  processSignal() {}

  /** @private */
  processFrame(frame) {
    if (this.state === 'on') {
      this.prepareFrame();

      this.frame.time = frame.time;
      this.frame.metadata = frame.metadata;
      this.frame.data = frame.data;

      this.propagateFrame();
    }
  }
}

export default Toggle;
