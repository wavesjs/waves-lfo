
/**
 * Interface added to the lfo core to implement source
 *
 * Source have some responsability on graph as they mostly control its whole
 * lifecycle.
 * Sources must then
 *
 *
 */
 const SourceMixin = (superclass) => class extends superclass {
  constructor(...args) {
    super(...args);

    this._initPromise = null;
    this.ready = false;
  }

  /**
   * Maybe in sources only (source mixin ?)
   *
   * @todo - Add source mixin (init, start, stop)
   */
  init() {
    this._initPromise = this.initModule().then(() => {
      this.initStream(); // synchronous
      return Promise.resolve(true);
    });

    return this._initPromise;
  }

  /**
   * Start method implementation should more or less follow this pattern.
   * It's main purpose is to make sur init step is finished and set
   * `this.ready` to true when done. setting `this.ready`.
   * Should beahve synchronously when called inside `init().then()` and async
   * if called without init step.
   */
  start() {
    if (!this._initPromise) {
      this._initPromise = this.init();
      this._initPromise.then(() => this.start(startTime));
      return;
    }

    this._startTime = startTime;
    this._systemTime = null; // value set in the first `process` call

    this.ready = true;
  }

  stop() {
    this.ready = false;
  }

  // if a source is async this is to late to block the frame
  // propagateFrame() {
  //   if (this.ready === true)
  //     super.propagateFrame();
  // }

  processFrame(frame) {
    if (!this.ready === true) {
      this.prepareFrame();
      this.processFunction(frame);
      this.propagateFrame();
    }
  }
}

export default SourceMixin;
