
let id = 0;

/**
 * Base `lfo` class to be extended in order to create new nodes.
 *
 * Nodes are divided in 3 categories:
 * - **`sources`** are responsible for acquering a signal and its properties
 *   (frameRate, frameSize, etc.)
 * - **`sinks`** are endpoints of the graph, such nodes can be recorders,
 *   visualizers, etc.
 * - **`operators`** are used to make computation on the input signal and
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

    /**
     * Parameters of the stream from the point of vue of the current node.
     * Set to `null` when the node is destroyed.
     *
     * @type {Object}
     * @property {Number} frameSize - Frame size at the output of the node.
     * @property {Number} frameRate - Frame rate at the output of the node.
     * @property {String} frameType - Frame type at the output of the node,
     *  possible values are `signal` or `vector`.
     * @property {Number} sourceSampleRate - Sample rate of the source of the
     *  graph. _The value should be defined by sources and never modified_.
     * @property {Array|String} description - If type is `vector`, describe
     *  the dimension(s) of output stream.
     * @name streamParams
     * @instance
     * @memberof module:core.BaseLfo
     */
    this.streamParams = {
      frameSize: 1,
      frameRate: 0,
      frameType: null,
      sourceSampleRate: 0,
      description: null,
    };

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
     * For `sources`, this attribute is `null`.
     *
     * @type {BaseLfo}
     * @name prevOp
     * @instance
     * @memberof module:core.BaseLfo
     */
    this.prevOp = null;

    /**
     * _Stream_ - Time of the current frame.
     *
     * @type {Number}
     * @name frameTime
     * @instance
     * @memberof module:core.BaseLfo
     */
    this.frameTime = 0;

    /**
     * _Stream_ - Data of the current frame.
     *
     * @type {Float32Array}
     * @name frameData
     * @instance
     * @memberof module:core.BaseLfo
     */
    this.frameData = null;

    /**
     * _Stream_ - Metadata associated to the current frame.
     *
     * @type {Object}
     * @name frameMetadata
     * @instance
     * @memberof module:core.BaseLfo
     */
    this.frameMetadata = {};
  }

  /**
   * Function called when a param is updated. By default set the `reinit`
   * flag to `true` if the param is `static` one.
   *
   * @param {String} name - Name of the parameter.
   * @param {Mixed} value - Value of the parameter.
   * @param {Object} metas - Metadata associated to the parameter.
   */
  onParamUpdate(name, value, metas) {
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
   * Reset the `frameData` buffer by setting all its values to 0.
   * This method first propagate to all the next operators of the node
   * (graph resets from bottom to top).
   * The method is also automatically called when a source is started, just
   * after the call of `processStreamParams`.
   *
   * @see {@link module:core.BaseLfo#processStreamParams}
   */
  reset() {
    for (let i = 0, l = this.nextOps.length; i < l; i++)
      this.nextOps[i].reset();

    // sinks don't have `frameData`
    if (this.frameData)
      this.frameData.fill(0)
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
   * Finalize the stream. Is automatically called when a source is
   * stopped.
   *
   * @param {Number} endTime - Logical time at which the graph is stopped.
   */
  finalize(endTime) {
    for (let i = 0, l = this.nextOps.length; i < l; i++)
      this.nextOps[i].finalize(endTime);
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
   * @see {@link module:core.BaseLfo#outputStreamParams}
   * @see {@link module:core.BaseLfo#processFrame}
   */
  processStreamParams(prevStreamParams) {
    Object.assign(this.streamParams, prevStreamParams);
    const frameSize = this.streamParams.frameSize;

    if (frameSize > 0)
      this.frameData = new Float32Array(frameSize);

    this.outputStreamParams();
  }

  /**
   * Forward the operator's `streamParam` to all its next operators. This method
   * must be called at the end of the `processStreamParams` method.
   *
   * @see {@link module:core.BaseLfo#processStreamParams}
   */
  outputStreamParams() {
    for (let i = 0, l = this.nextOps.length; i < l; i++)
      this.nextOps[i].processStreamParams(this.streamParams);
  }

  /**
   * Define the particular logic the operator applies to the stream.
   * The implementation **must** update `this.frameTime`, `this.frameData` and
   * `this.frameMetadata` according to the values forwarded by the previous
   * operator.
   * If the operator is not a `sink` operator, the implemention **must** also
   * end the process with a call to `this.ouputFrame` to forward the current
   * values to all the nextOps of the operator.
   *
   * @param {Number} frameTime - Frame time of the current frame as given by the
   *  previous operator.
   * @param {Float32Array} frameData - Frame data as given by the previous
   *  operator.
   * @param {object} frameMetadata - Frame metadatas as given by the previous
   *  operator.
   *
   * @example
   * // definition of a wonderfull `DivideByTwo` operator
   * process(frameTime, frameData, frameMetadata) {
   *   super.process(frameTime, frameData, frameMetadata);
   *
   *   const frameSize = this.streamParams.frameSize;
   *   for (let i = 0; i < frameSize; i++)
   *     this.frameData[i] = frameData[i] / 2;
   *
   *   this.frameTime = frameTime;
   *   this.frameData = frameData;
   *   this.frameMetadata = frameMetadata;
   *
   *   this.outputFrame();
   * }
   */
  processFrame(frameTime, frameData, frameMetadata) {
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
  outputFrame() {
    for (let i = 0, l = this.nextOps.length; i < l; i++)
      this.nextOps[i].processFrame(this.frameTime, this.frameData, this.frameMetadata);
  }
}

export default BaseLfo;

