let id = 0;

/**
 * Base `lfo` class to be extended in order to create new nodes.
 *
 * Nodes are divided in 3 categories:
 * - **`source`** are responsible for acquering a signal and its properties
 *   (frameRate, frameSize, etc.)
 * - **`sink`** are endpoints of the graph, such nodes can be recorders,
 *   visualizers, etc.
 * - **`operator`** are used to make computation on the input signal and
 *   forward the results below in the graph.
 *
 * In most cases the methods to override / extend are:
 * - the **`constructor`** to define the parameters of the new lfo node.
 * - the **`processStreamParams`** method to define how the node modify the
 *   stream attributes (e.g. by changing the frame size)
 * - the **`processFrame`** method to define the operations that the node apply
 *   on the stream.
 *
 * <span class="warning">_This class should be considered abstract._</span>
 *
 * @memberof module:core
 */
class BaseLfo {
  constructor() {
    this.cid = id++;

    /**
     * Parameter bag containing parameter instances.
     *
     * @type {Object}
     * @name params
     * @instance
     * @memberof module:core.BaseLfo
     */
    this.params = null;

    /**
     * List of nodes connected to the ouput of the node (lower in the graph).
     * At each frame, the node forward its `time`, `frameData` and `metadata` to
     * to all its nextOps.
     *
     * @type {Array<BaseLfo>}
     * @name nextOps
     * @instance
     * @memberof module:core.BaseLfo
     */
    this.nextOps = [];

    /**
     * The node at which the current node is connected (upper in the graph) and
     * from which it receives frames to process at each cycle.
     * For `source`, this attribute is `null`.
     *
     * @type {BaseLfo}
     * @name prevOp
     * @instance
     * @memberof module:core.BaseLfo
     */
    this.prevOp = null;

    /**
     * Parameters of the stream from the point of vue of the current node.
     * Set to `null` when the node is destroyed.
     *
     * @type {Object}
     * @property {Number} frameSize - Frame size at the output of the node.
     * @property {Number} frameRate - Frame rate at the output of the node.
     * @property {String} frameType - Frame type at the output of the node,
     *  possible values are `signal`, `vector` or `scalar`.
     * @property {Number} sourceSampleRate - Sample rate of the source of the
     *  graph. _The value should be defined by sources and never modified_.
     * @property {Array|String} description - If type is `vector`, describe
     *  the dimension(s) of output stream.
     * @name streamParams
     * @instance
     * @memberof module:core.BaseLfo
     */
    this.streamParams = {
      frameType: null,
      frameSize: 1,
      frameRate: 0,
      sourceSampleRate: 0,
      description: null,
    };

    /**
     * Current frame of the operator.
     *
     * @type {Object}
     * @name frame
     * @property {Number} time - Time of the current frame.
     * @property {Float32Array} data - Data of the current frame.
     * @property {Object} metadata - Metadata associted to the current frame.
     * @instance
     * @memberof module:core.BaseLfo
     */
    this.frame = {
      time: 0,
      data: null,
      metadata: {},
    };

    /**
     * When set to `true` the sub-graph starting at the current node is
     * reinitialized on the next process call. This attribute is typically
     * set to `true` when a dynamic parameter is updated.
     *
     * @type {Boolean}
     * @name reinit
     * @instance
     * @memberof module:core.BaseLfo
     * @private
     */
    this.reinit = false;
  }

  /**
   * Function called when a param is updated. By default set the `reinit`
   * flag to `true` if the param is `static` one.
   *
   * @param {String} name - Name of the parameter.
   * @param {Mixed} value - Value of the parameter.
   * @param {Object} metas - Metadata associated to the parameter.
   */
  onParamUpdate(name, value, metas = {}) {
    if (metas.kind === 'static')
      this.reinit = true;
  }

  /**
   * Connect the current node (the `prevOp`) to another node (the `nextOp`).
   * A given node can be connected to several operators to which the stream
   * is forwarded on each `processFrame` call.
   *
   * @param {BaseLfo} next - Next operator in the graph.
   * @see {@link module:core.BaseLfo#process}
   * @see {@link module:core.BaseLfo#disconnect}
   */
  connect(next) {
    if (!(next instanceof BaseLfo))
      throw new Error('Invalid connection: child node is not an instance of `BaseLfo`');

    if (this.streamParams === null ||next.streamParams === null)
      throw new Error('Invalid connection: cannot connect a dead node');

    this.nextOps.push(next);
    next.prevOp = this;

    if (this.streamParams.frameType !== null) // graph has already been started
      next.processStreamParams(this.streamParams);
  }

  /**
   * Remove the given operator from its previous operators' `nextOps`.
   *
   * @param {BaseLfo} [next=null] - The operator to disconnect from the current
   *  operator. If `null` disconnect all the next nodes.
   */
  disconnect(next = null) {
    if (next === null) {
      this.nextOps.forEach((next) => this.disconnect(next));
    } else {
      const index = this.nextOps.indexOf(this);
      this.nextOps.splice(index, 1);
      next.prevOp = null;
    }
  }

  /**
   * Destroy all the nodes in the sub-graph starting from the current node.
   * When detroyed, the `streamParams` of the node are set to `null`, the
   * operator is then considered as `dead` and cannot be reconnected.
   *
   * @see {@link module:core.BaseLfo#connect}
   */
  destroy() {
    // destroy all chidren
    let index = this.nextOps.length;

    while (index--)
      this.nextOps[index].destroy();

    // disconnect itself from the previous operator
    if (this.prevOp)
      this.prevOp.disconnect(this);

    // mark the object as dead
    this.streamParams = null;
  }

  /**
   * Reset the `frameData` buffer by setting all its values to 0.
   * This method first propagate to all the next operators of the node
   * (graph resets from bottom to top).
   * The method is also automatically called when a source is started, just
   * after the call of `processStreamParams`.
   *
   * @see {@link module:core.BaseLfo#processStreamParams}
   */
  resetStream() {
    // buttom up
    for (let i = 0, l = this.nextOps.length; i < l; i++)
      this.nextOps[i].resetStream();

    // no buffer for `scalar` type or sink node
    if (this.streamParams.frameType !== 'scalar' && this.frame.data !== null)
      this.frame.data.fill(0);
  }

  /**
   * Finalize the stream. Is automatically called when a source is
   * stopped.
   *
   * @param {Number} endTime - Logical time at which the graph is stopped.
   */
  finalizeStream(endTime) {
    for (let i = 0, l = this.nextOps.length; i < l; i++)
      this.nextOps[i].finalizeStream(endTime);
  }

  /**
   * Initialize or update the operator's `streamParams` accroding to the
   * previous operators `streamParams` values.
   * This method should also create the `frameData` Float32Array accroding to
   * the operator's `frameSize`. If additionnal buffers has to be created
   * (e.g. ring buffers to keep track of past states of the node), they should
   * also be created here.
   * Finally, the method should call `outputStreamParams` to propagate
   * operator's `streamParams` to its next operators.
   *
   * @param {Object} prevStreamParams - `streamParams` of the previous operator.
   *
   * @see {@link module:core.BaseLfo#prepareStreamParams}
   * @see {@link module:core.BaseLfo#propagateStreamParams}
   * @see {@link module:core.BaseLfo#processFrame}
   */
  processStreamParams(prevStreamParams = {}) {
    this.prepareStreamParams(prevStreamParams);
    this.propagateStreamParams();
  }

  /**
   * Common logic to do at the beginning of the `processStreamParam`.
   * This method should be called at the beginning of the `processStreamParam`
   * method.
   *
   * @param {Object} prevStreamParams - `streamParams` of the previous operator.
   */
  prepareStreamParams(prevStreamParams = {}) {
    Object.assign(this.streamParams, prevStreamParams);
    const prevFrameType = prevStreamParams.frameType;

    switch (prevFrameType) {
      case 'scalar':
        if (this.processScalar)
          this.processFunction = this.processScalar;
        else if (this.processVector)
          this.processFunction = this.processVector;
        else if (this.processSignal)
          this.processFunction = this.processSignal;
        else
          throw new Error(`${this.constructor.name} - no "process" function found`);
        break;
      case 'vector':
        if (!('processVector' in this))
          throw new Error(`${this.constructor.name} - "processVector" is not defined`);

        this.processFunction = this.processVector;
        break;
      case 'signal':
        if (!('processSignal' in this))
          throw new Error(`${this.constructor.name} - "processSignal" is not defined`);

        this.processFunction = this.processSignal;
        break;
      default:
        // defaults to processFunction
        break;
    }
  }

  /**
   * Create the `this.frame.data` buffer and forward the operator's `streamParam`
   * to all its next operators. This method must be called at the end of the
   * `processStreamParams` method.
   *
   * @see {@link module:core.BaseLfo#processStreamParams}
   */
  propagateStreamParams() {
    this.frame.data = new Float32Array(this.streamParams.frameSize);

    for (let i = 0, l = this.nextOps.length; i < l; i++)
      this.nextOps[i].processStreamParams(this.streamParams);
  }

  /**
   * Define the particular logic the operator applies to the stream.
   * The implementation **must** update `this.frame.time`, `this.frame.data` and
   * `this.frame.metadata` according to the frame forwarded by the previous
   * operator.
   * If the operator is not a `sink` operator, the implemention **must** also
   * end the process with a call to `this.ouputFrame` to forward the current
   * values to all the nextOps of the operator.
   *
   * @param {Object} frame - Frame (time, data, and metadata) as given by the
   *  previous operator. The incomming reference should never be modified by
   *  the operator.
   *
   * @example
   * // definition of a wonderfull `DivideByTwo` operator
   * processFrame(frame) {
   *   this.prepareFrame();
   *
   *   const data = this.frame.data;
   *   const frameSize = this.streamParams.frameSize;
   *
   *   for (let i = 0; i < frameSize; i++)
   *     data[i] = frameData[i] / 2;
   *
   *   this.frame.time = frame.time;
   *   this.frame.metadata = frame.metadata;
   *
   *   this.propagateFrame();
   * }
   *
   * @see {@link module:core.BaseLfo#prepareFrame}
   * @see {@link module:core.BaseLfo#propagateFrame}
   * @see {@link module:core.BaseLfo#processStreamParams}
   */
  processFrame(frame) {
    this.prepareFrame();

    // frameTime and frameMetadata defaults to identity
    this.frame.time = frame.time;
    this.frame.metadata = frame.metadata;

    this.processFunction(frame);
    this.propagateFrame();
  }

  /**
   * Pointer to function to be called in `processFrame` according to the
   * `streamParams.frameType`. Is dynamically assigned in `prepareStreamParams`.
   *
   * @see {@link module:core.BaseLfo#processFrame}
   * @see {@link module:core.BaseLfo#prepareStreamParams}
   */
  processFunction(frame) {
    this.frame = frame;
  }

  /**
   * Common logic to do at the beginning of the `processFrame`.
   * This method should be called at the beginning of the `processFrame` method.
   *
   * @see {@link module:core.BaseLfo#processFrame}
   */
  prepareFrame() {
    if (this.reinit === true) {
      this.processStreamParams();
      this.reset();
      this.reinit = false;
    }
  }

  /**
   * Forward the current `frameTime`, `frameData` and `frameMetadata` to the
   * next operators. This method should be called at the end of the
   * `processFrame` method.
   *
   * @see {@link module:core.BaseLfo#processFrame}
   */
  propagateFrame() {
    for (let i = 0, l = this.nextOps.length; i < l; i++)
      this.nextOps[i].processFrame(this.frame);
  }
}

export default BaseLfo;

