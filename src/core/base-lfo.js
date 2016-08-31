let id = 0;


const min = Math.min;
const max = Math.max;

function clip(value, lower, upper) {
  return max(lower, min(upper, value));
}

/**
 * Abstraction defining a node parameter.
 *
 * @param {String} name - Name of the parameter.
 * @param {String} type - Type of the parameter.
 * @param {Mixed} value - Value of the parameter.
 * @param {String} kind - Define if the graph is dependent on the value of the
 *  parameter or if is local to the node. Possible values are `'static'` or
 *  `'dynamic'`.
 * @param {BaseLfo} node - Pointer to the node which the parameter belongs to.
 * @private
 */
class Param {
  constructor(name, type, value, kind, node) {
    this._name = name;
    this._type = type;
    this._value = value;
    this._kind = kind;
    this._node = node;
  }

  set value(value) {}

  get value() {
    return this._value;
  }

  /**
   * If a dyncamic parameter is updated, re-initialize the node and
   * propagate changes in the subgraph.
   * @private
   * @note - Maybe just setting a flag to true that would be checked in the
   *  begining of `node.process` would be safer...
   */
  onUpdate() {
    if (this._kind === 'dynamic')
      this._node.paramUpdated = true;
  }
}

/**
 * Parameter representing a `boolean` value.
 * @private
 */
class BooleanParam extends Param {
  constructor(name, value, kind, node) {
    value = !!value;
    super(name, 'boolean', value, kind, node);
  }

  set value(value) {
    value = !!value;

    if (this._value !== value) {
      this._value = value;
      this.onUpdate();
    }

    return this._value;
  }

  get value() {
    return this._value;
  }
}

/**
 * Parameter representing a `integer` value.
 * @private
 */
class IntegerParam extends Param {
  constructor(name, lower, upper, value, kind, node) {
    super(name, 'integer', value, kind, node);

    this._lower = lower;
    this._upper = upper;
  }

  set value(value) {
    value = clip(parseInt(value, 10), this._lower, this._upper);

    if (this._value !== value) {
      this._value = value;
      this.onUpdate();
    }

    return this._value;
  }

  get value() {
    return this._value;
  }
}

/**
 * Parameter representing a `float` value.
 * @private
 */
class FloatParam extends Param {
  constructor(name, lower, upper, value, kind, node) {
    super(name, 'float', value, kind, node);

    this._lower = lower;
    this._upper = upper;
  }

  set value(value) {
    value = clip(value * 1, this._lower, this._upper);

    if (this._value !== value) {
      this._value = value;
      this.onUpdate();
    }

    return this._value;
  }

  get value() {
    return this._value;
  }
}

/**
 * Parameter representing a `string` value.
 * @private
 */
class StringParam extends Param {
  constructor(name, value, kind, node) {
    super(name, 'string', value, kind, node);
  }

  set value(value) {
    value = value + '';

    if (this._value !== value) {
      this._value = value;
      this.onUpdate();
    }

    return this._value;
  }

  get value() {
    return this._value;
  }
}

/**
 * Parameter representing a `boolean` value.
 * @private
 */
class EnumParam extends Param {
  constructor(name, list, value, kind, node) {
    super(name, 'enum', value, kind, node);

    this._list = list;
  }

  set value(value) {
    if (this._list.indexOf(value) === -1)
      throw new Error(`Invalid value for param "${this._name}" (valid values: ${this._list})`);

    if (this._value !== value) {
      this._value = value;
      this.onUpdate();
    }

    return this._value;
  }

  get value() {
    return this._value;
  }
}

/**
 * Parameter representing `any` value.
 * @private
 */
class AnyParam extends Param {
  constructor(name, value, kind, node) {
    super(name, 'any', value, kind, node);
  }

  set value(value) {
    if (this._value !== value) {
      this._value = value;
      this.onUpdate();
    }

    return this._value;
  }

  get value() {
    return this._value;
  }
}


/**
 * Base `lfo` class to be extended in order to create new nodes. In most cases
 * the methods to override / extend are:
 * - the **`constructor`** to define the parameters of the new lfo node.
 * - the **`initialize`** method to define how the node modify the stream attributes
 *   (e.g. by changing the frame size)
 * - the **`process`** method to define the operations that the node apply on the
 *   stream.
 *
 * The nodes are divided in 3 categories:
 * - **`sources`** are responsible for acquering a signal and its properties
 *   (frameRate, frameSize, etc.)
 * - **`sinks`** are endpoints of the graph, such nodes can be recorders,
 *   visualizers, etc.
 * - **`operators`** are used to make computation on the input signal and
 *   forward the results below in the graph.
 *
 * _This class should be considered abstract._
 *
 * @param {String} name - Name of the node.
 * @param {Object} defaults - Default values for the parameters of the `lfo` node.
 * @param {Object} options - Values of parameters as defined during instanciation.
 */
class BaseLfo {
  constructor(defaults = {}, options = {}) {
    this.cid = id++;

    /**
     * Parameter bag containing parameter instances.
     * @type {Object}
     * @name params
     * @instance
     * @memberof BaseLfo
     */
    this.params = {};

    /**
     * Define if a `dynamic` parameter has been changed since the last input
     * frame. When set to `true` the sub-graph starting at the current node
     * is reinitialized.
     * @type {Boolean}
     * @name paramUpdated
     * @instance
     * @memberof BaseLfo
     * @private
     */
    this.paramUpdated = false;

    /**
     * Parameters of the stream from the point of vue of the current node.
     * Set to `null` when the node is destroyed.
     * @type {Object}
     * @property {Number} frameSize - Frame size at the output of the node.
     * @property {Number} frameRate - Frame rate at the output of the node.
     * @property {Number} sourceSampleRate - Sample rate of the source of the graph.
     *  _This value should be defined by the sources and never modified later_.
     * @name streamParams
     * @instance
     * @memberof BaseLfo
     */
    this.streamParams = {
      frameSize: 1,
      frameRate: 0,
      sourceSampleRate: 0,
    };

    /**
     * List of nodes connected to the ouput of the node (lower in the graph).
     * At each frame, the node forward its `time`, `outFrame` and `metadata` to
     * to all its children.
     * @type {Array<BaseLfo>}
     * @name children
     * @instance
     * @memberof BaseLfo
     */
    this.children = [];

    /**
     * The node at which the current node is connected (upper in the graph) and
     * from which it receives frames to process at each cycle.
     * For `sources`, this attribute is `null`.
     * @type {BaseLfo}
     * @name parent
     * @instance
     * @memberof BaseLfo
     */
    this.parent = null;

    // stream data

    /**
     * _Stream_ - Time of the current frame.
     * @type {Number}
     * @name time
     * @instance
     * @memberof BaseLfo
     */
    this.time = 0;

    /**
     * _Stream_ - Data of the current frame.
     * @type {Float32Array}
     * @name output
     * @instance
     * @memberof BaseLfo
     */
    this.outFrame = null;

    /**
     * _Stream_ - Metadata associated to the current frame.
     * @type {Float32Array}
     * @name metadata
     * @instance
     * @memberof BaseLfo
     */
    this.metadata = {};

    this._initParams = Object.assign({}, defaults, options);
  }


  /**
   * Check param name availability and if a default value is provided.
   * @param {String} name - Name of the parameter.
   * @rpivate
   */
  _checkParamName(name) {
    if (this.params[name] !== undefined)
      throw new Error('Param "${name}" already defined');

    if (Object.keys(this._initParams).indexOf(name) === -1)
      throw new Error('Undefined default value for param "${name}"');
  }

  /**
   * Add a parameter of type `boolean` to the node.
   * The value of the parameter should be defined in `defaults` or in the
   * `options` given at instanciation.
   *
   * @param {String} name - Name of the parameter.
   * @param {String} kind - Define if the parameter is either `static` or
   *  `dynamic`.
   */
  addBooleanParam(name, kind) {
    const param = new BooleanParam(name, this._initParams[name], kind, this);
    this.params[name] = param;
  }

  /**
   * Add a parameter of type `integer` to the node.
   * The value of the parameter should be defined in `defaults` or in the
   * `options` given at instanciation.
   *
   * @param {String} name - Name of the parameter.
   * @param {Number} lower - Minimum value.
   * @param {Number} upper - Maximum value.
   * @param {String} kind - Define if the parameter is either `static` or
   *  `dynamic`.
   */
  addIntegerParam(name, lower, upper, kind) {
    this._checkParamName(name);
    const param = new IntegerParam(name, lower, upper, this._initParams[name], kind, this);
    this.params[name] = param;
  }

  /**
   * Add a parameter of type `integer` to the node.
   * The value of the parameter should be defined in `defaults` or in the
   * `options` given at instanciation.
   *
   * @param {String} name - Name of the parameter.
   * @param {Number} lower - Minimum value.
   * @param {Number} upper - Maximum value.
   * @param {String} kind - Define if the parameter is either `static` or
   *  `dynamic`.
   */
  addFloatParam(name, lower, upper, kind) {
    this._checkParamName(name);
    const param = new FloatParam(name, lower, upper, this._initParams[name], kind, this);
    this.params[name] = param;
  }

  /**
   * Add a parameter of type `integer` to the node.
   * The value of the parameter should be defined in `defaults` or in the
   * `options` given at instanciation.
   *
   * @param {String} name - Name of the parameter.
   * @param {String} kind - Define if the parameter is either `static` or
   *  `dynamic`.
   */
  addStringParam(name, kind) {
    this._checkParamName(name);
    const param = new StringParam(name, this._initParams[name], kind, this);
    this.params[name] = param;
  }

  /**
   * Add a parameter of type `enum` to the node.
   * The value of the parameter should be defined in `defaults` or in the
   * `options` given at instanciation.
   *
   * @param {String} name - Name of the parameter.
   * @param {Array} list - Set of possible values for the parameter.
   * @param {String} kind - Define if the parameter is either `static` or
   *  `dynamic`.
   */
  addEnumParam(name, list, kind) {
    this._checkParamName(name);
    const param = new EnumParam(name, list, this._initParams[name], kind, this);
    this.params[name] = param;
  }

  /**
   * Add a parameter of `any` type to the node.
   * The value of the parameter should be defined in `defaults` or in the
   * `options` given at instanciation.
   *
   * @param {String} name - Name of the parameter.
   * @param {String} kind - Define if the parameter is either `static` or
   *  `dynamic`.
   */
  addAnyParam(name, kind) {
    this._checkParamName(name);
    const param = new AnyParam(name, this._initParams[name], kind, this);
    this.params[name] = param;
  }

  /**
   * Update the value of a given parameter. If the parameter is of `kind`:
   * `'dynamic'`, it triggers the initialize method of the node, thus recreate
   * the `outputFrame` and propagate the change in the subgraph.
   *
   * @param {String} name - Name of the parameter.
   * @param {Mixed} value - New value of the parameter.
   */
  setParam(name, value) {
    if (!this.params[name])
      throw new Error(`Undefined parameter "${name}"`);

    this.params[name].value = value;
    // use the value cast done by the Param
    return this.params[name].value;
  }

  /**
   * Return the current value of a given parameter.
   *
   * @param {String} name - Name of the parameter.
   * @return {Mixed}
   */
  getParam(name) {
    if (!this.params[name])
      throw new Error(`Undefined parameter "${name}"`);

    return this.params[name].value;
  }

  /**
   * Connect the current node (the `parent`) to another node (the `child`).
   * A given node can be connected to several children to which the stream
   * is forwarded on each `process` call.
   *
   * @param {BaseLfo} child - Child node.
   * @see {@link BaseLfo#process}
   * @see {@link BaseLfo#disconnect}
   */
  connect(child) {
    if (!(child instanceof BaseLfo))
      throw new Error('Child node is not an instance of `BaseLfo`');

    if (this.streamParams === null || child.streamParams === null)
      throw new Error('cannot connect a dead lfo node');

    this.children.push(child);
    child.parent = this;
  }

  /**
   * Remove the `lfo` from its parent's children.
   * @todo Confirm it is the desired behavior in all cases, maybe we want to
   *  destroy all the node of the sub-graph.
   */
  disconnect() {
    const index = this.parent.children.indexOf(this);
    this.parent.children.splice(index, 1);
    this.parent = null;
  }

  /**
   * Initialize the node `streamParams` attribute according to the paren's
   * `streamParams`. Propagates the `streamParam` values to the children.
   * Create the `outFrame` buffer according to the `streamParams` by calling
   * the `setupStream` method.
   * Is automatically called when a `lfo` source node is started or when a
   * `dynamic` parameter is updated.
   *
   * @param {Object} [inStreamParams={}] - Stream parameters of the parent node.
   * @param {Object} [outStreamParams={}] - Optionnal parameters that override
   *  the parameters given by the parent.
   *
   * @see {@link BaseLfo#setupStream}
   * @see {@link BaseLfo#streamParams}
   */
  initialize(inStreamParams = {}, outStreamParams = {}) {
    Object.assign(this.streamParams, inStreamParams, outStreamParams);
    // create the `outFrame` arrayBuffer
    this.setupStream();
    // propagate initialization in the graph
    for (let i = 0, l = this.children.length; i < l; i++)
      this.children[i].initialize(this.streamParams);
  }

  /**
   * Create the `outFrame` buffer according to the `streamParams`. To prevent
   * memory allocation, this buffer should be reused at each call of the
   * `process` method.
   *
   * @see {@link BaseLfo#initialize}
   * @see {@link BaseLfo#process}
   * @todo Define if it should be merged with `initialize`.
   */
  setupStream() {
    const frameSize = this.streamParams.frameSize;

    if (frameSize > 0)
      this.outFrame = new Float32Array(frameSize);
  }

  /**
   * Set all the values `outframe` buffer to 0.
   * This method first propagate to all the children of the node, the graph
   * then resets from bottom to top.
   * This method is automatically called when a source is started, just
   * after the call of `initialize`.
   *
   * @see {@link BaseLfo#initialize}
   */
  reset() {
    for (let i = 0, l = this.children.length; i < l; i++)
      this.children[i].reset();

    // sinks don't have any `outFrame`
    if (!this.outFrame)
      return;

    for (let i = 0, l = this.outFrame.length; i < l; i++)
      this.outFrame[i] = 0;
  }

  /**
   * Destroy all the nodes in the sub-graph starting from the current node.
   * When detroyed, the `streamParams` of the node are set to `null`, this
   * prevent to reconnect it to another node.
   *
   * @see {@link BaseLfo#connect}
   */
  destroy() {
    // destroy all chidren
    let index = this.children.length;

    while (index--)
      this.children[index].destroy();

    // delete itself from the parent node
    if (this.parent)
      this.disconnect();

    // mark the object as dead
    this.streamParams = null;
  }


  /**
   * Finalize the stream. This method is automatically called when a source is
   * stopped.
   *
   * @param {Number} endTime - Logical time at which the graph is stopped.
   */
  finalize(endTime) {
    for (let i = 0, l = this.children.length; i < l; i++)
      this.children[i].finalize(endTime);
  }

  /**
   * Forward the current `time`, `outFrame` and `metadata` to the children.
   * This method should be considered as a helper to be called at the end
   * of the `process` method.
   *
   * @param {Number} [time=this.time] - Time corresponding to the current frame.
   * @param {Float32Array} [outFrame=this.outFrame] - Current frame.
   * @param {Object} [metadata=this.metadata] - Associated metadatas.
   * @see {@link BaseLfo#process}
   */
  output(time = this.time, outFrame = this.outFrame, metadata = this.metadata) {
    for (let i = 0, l = this.children.length; i < l; i++)
      this.children[i].process(time, outFrame, metadata);
  }

  /**
   * Define the particular logic the derived node apply on the stream.
   * The implementation **must** update `this.time`, `this.frame` and
   * `this.metadata` according to the values forwarded by the parent.
   * If the node is not a `sink` node, the implemention **must** also
   * terminate the process with a call to `this.ouput()` to forward the current
   * values to all the children of the node.
   *
   * @param {Number} time - Time of the current frame as given by the parent node.
   * @param {Float32Array} frame - Current frame as given by the parent node.
   * @param {object} metadata - Metadatas as given by  by the parent node.
   * @example
   * // in the definition of a `DivideByTwo` lfo operator
   * process(time, frame, metadata) {
   *   super.process(time, frame, metadata);
   *
   *   const frameSize = this.streamParams.frameSize;
   *   for (let i = 0; i < frameSize; i++)
   *     this.outFrame[i] = frame[i] / 2;
   *
   *   this.time = time;
   *   this.metadata = metadata;
   *   this.output();
   * }
   */
  process(time, frame, metadata) {
    if (this.paramUpdated === true) {
      this.initialize();
      this.reset();
      this.paramUpdated = false;
    }

    // this.time = time;
    // this.outFrame = frame;
    // this.metadata = metadata;

    // this.output();
  }
}

export default BaseLfo;

