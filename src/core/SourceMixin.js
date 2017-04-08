
/**
 * Interface added to `LfoCore to implement source
 *
 * Source have some responsability on graph as they mostly control its whole
 * lifecycle. They must implement the start and stop method in order to
 * make sure the graph is initialized and set `ready` to true.
 * A source should never accept and propagate incomming frames until `ready`
 * is set to `true`.
 *
 * @example
 * class MySource extends SourceMixin(BaseLfo) {
 *   start() {}
 *   stop() {}
 *   init() {}
 * }
 */
 const SourceMixin = (superclass) => class extends superclass {
  constructor(...args) {
    super(...args);

    this.initialized = null;
    this.ready = false;
  }

  /**
   * Initialize the graph by calling `initModule`. When the returned `Promise`
   * fulfills, the graph can be considered as initialized and `start` can be
   * called safely. If `start` is called whithout explicit `init`, `init` is
   * made internally, actual start of the graph is then not garanteed to be
   * synchronous.
   *
   * @return Promise
   *
   * @example
   * // safe initialization and start
   * source.init().then(() => source.start())
   * // safe initialization and start
   * source.start();
   */
  init() {
    this.initialized = this.initModule().then(() => { // when graph is ready
      this.initStream(); // this is synchronous
      return Promise.resolve(true);
    });

    return this.initialized;
  }

  /**
   * Interface method to implement that starts the graph.
   *
   * The method main purpose is to make sure take verify initialization step and
   * set `ready` to `true` when done.
   * Should behave synchronously when called inside `init().then()` and async
   * if called without init step.
   *
   * @example
   * // basic `start` implementation
   * start() {
   *   // there might be a problem here if `start` is called twice synchronously
   *   // as we should test if the promise is fullfiled instead of just "existing"
   *   // unfortunatly there is no way to check the status of a promise
   *   // synchronously (see http://stackoverflow.com/questions/30564053/how-can-i-synchronously-determine-a-javascript-promises-state)
   *   // So let's hope people will do the right thing until we have a better
   *   // solution.
   *   if (!this.initialized) {
   *     this.initialized = this.init();
   *     this.initialized.then(() => this.start(startTime));
   *     return;
   *   }
   *
   *   this.ready = true;
   * }
   */
  start() {}

  /**
   * Interface method to implement that stops the graph.
   *
   * @example
   * // basic `stop` implementation
   * stop() {
   *   this.ready = false;
   * }
   */
  stop() {
    this.ready = false;
  }

  /**
   * Never allow incomming frames if `this.ready` is not `true`.
   *
   * @param {Object} frame
   */
  processFrame(frame) {
    if (!this.ready === true) {
      this.prepareFrame();
      this.processFunction(frame);
      this.propagateFrame();
    }
  }
}

export default SourceMixin;
