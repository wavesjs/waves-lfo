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
 *
 * The `streamParams` propagation is never bypassed so the subsequent subgraph
 * is always ready for incomming frames.
 *
 * @memberof module:operator
 *
 * @param {Object} options - Override default parameters.
 * @param {String} [options.state='on'] - Default state of the toggle.
 *
 * @example
 * import * as lfo from 'waves-lfo';
 *
 * const frames = [
 *   { time: 0, data: [1, 2] },
 *   { time: 1, data: [3, 4] },
 *   { time: 2, data: [5, 6] },
 * ];
 *
 * const eventIn = new EventIn({
 *   frameSize: 2,
 *   frameRate: 0,
 *   frameType: 'vector',
 * });
 *
 * const toggle = new Toggle();
 *
 * const logger = new Logger({ data: true });
 *
 * eventIn.connect(toggle);
 * toggle.connect(logger);
 *
 * eventIn.start();
 *
 * eventIn.processFrame(frames[0]);
 * > [0, 1]
 *
 * // bypass subgraph
 * toggle.setState('off');
 * eventIn.processFrame(frames[1]);
 *
 * // re-open subgraph
 * toggle.setState('on');
 * eventIn.processFrame(frames[2]);
 * > [5, 6]
 */
class Toggle extends BaseLfo {
  constructor(options = {}) {
    super(definitions, options);

    this.state = this.params.get('state');
  }

  /**
   * Set the state of the toggle.
   *
   * @param {String} state - New state of the operator (`on` or `off`)
   */
  setState(state) {
    if (definitions.state.list.indexOf(state) === -1)
      throw new Error(`Invalid switch state value "${state}" [valid values: "on"/"off"]`);

    this.state = state;
  }

  // define all possible stream API
  /** @private */
  processScalar() {}
  /** @private */
  processVector() {}
  /** @private */
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
