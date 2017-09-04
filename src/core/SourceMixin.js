
/**
 * Interface added to `LfoCore to implement source
 *
 * Source have some responsability on graph as they mostly control its whole
 * lifecycle. They must implement the start and stop method in order to
 * make sure the graph is initialized and set `started` to true.
 * A source should never accept and propagate incomming frames until `started`
 * is set to `true`.
 *
 * @name SourceMixin
 * @memberof module:core
 * @mixin
 *
 * @example
 * class MySource extends SourceMixin(BaseLfo) {}
 */
 const SourceMixin = (superclass) => class extends superclass {
  constructor(...args) {
    super(...args);

    this.initialized = false;
    this.initPromise = null;
    this.started = false;

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
  }

  /**
   * Initialize the graph by calling `initModule`. When the returned `Promise`
   * fulfills, the graph can be considered as initialized and `start` can be
   * called safely. If `start` is called whithout explicit `init`, `init` is
   * made internally, actual start of the graph is then not garanteed to be
   * synchronous.
   *
   * @memberof module:core.SourceMixin
   * @instance
   * @name init
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
    this.initPromise = this.initModule().then(() => {
      this.initStream(); // this is synchronous
      this.initialized = true;
      return Promise.resolve(true);
    });

    return this.initPromise;
  }

  /**
   * Interface method to implement that starts the graph.
   *
   * The method main purpose is to make sure take verify initialization step and
   * set `started` to `true` when done.
   * Should behave synchronously when called inside `init().then()` and async
   * if called without init step.
   *
   * @memberof module:core.SourceMixin
   * @instance
   * @name start
   *
   * @example
   * // basic `start` implementation
   * start() {
   *   if (this.initialized === false) {
   *     if (this.initPromise === null) // init has not yet been called
   *       this.initPromise = this.init();
   *
   *     this.initPromise.then(this.start);
   *     return;
   *   }
   *
   *   this.started = true;
   * }
   */
  start() {}

  /**
   * Interface method to implement that stops the graph.
   *
   * @memberof module:core.SourceMixin
   * @instance
   * @name stop
   *
   * @example
   * // basic `stop` implementation
   * stop() {
   *   this.started = false;
   * }
   */
  stop() {}

  /**
   * The implementation should never allow incomming frames
   * if `this.started` is not `true`.
   *
   * @memberof module:core.SourceMixin
   * @instance
   * @name processFrame
   *
   * @param {Object} frame
   *
   * @example
   * // basic `processFrame` implementation
   * processFrame(frame) {
   *   if (this.started === true) {
   *     this.prepareFrame();
   *     this.processFunction(frame);
   *     this.propagateFrame();
   *   }
   * }
   */
  processFrame(frame) {}
}

export default SourceMixin;
