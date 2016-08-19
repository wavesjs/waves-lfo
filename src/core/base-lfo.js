let id = 0;


const min = Math.min;
const max = Math.max;

function clip(value, lower, upper) {
  return max(lower, min(upper), value);
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
    if (kind === 'dynamic')
      this._node.initialize();
  }
}

/**
 * Parameter representing a `boolean` value.
 * @private
 */
class BooleanParam extends Param {
  constructor(name, value, kind, node) {
    super(name, 'boolean', value, kind, node);
  }

  set value(value) {
    this._value = !!value;
    this.onUpdate();
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
    this._uppper = upper;
  }

  set value(value) {
    this._value = clip(parseInt(value, 10), this._lower, this._upper);
    this.onUpdate();
    return this._value;
  }
}

/**
 * Parameter representing a `float` value.
 * @private
 */
class FloatParam extends Param {
  constructor(name, min, max, value, kind, node) {
    super(name, 'float', value, kind, node);

    this._lower = lower;
    this._uppper = upper;
  }

  set value(value) {
    this._value = clip(value * 1, this.min, this.max);
    this.onUpdate();
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
    this._value = value + '';
    this.onUpdate();
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
    if (list.indexOf(value) === -1) {
      if (!this._value)
        this._value = this._list[0];
    } else {
      this._value = value;
    }
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
    this._value = value;
    this.onUpdate();
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
     * Parameters of the stream from the point of vue of the current node.
     * Set to `null` when the node is destroyed.
     * @type {Object}
     * @property {Number} frameSize - Frame size at the output of the node.
     * @property {Number} frameRate - Frame rate at the output of the node.
     * @property {Number} sourceSampleRate - Sample rate of the source of the signal.
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
     * At each frame, the node forward its `time`, `outFrame` and `metaData` to
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
     * @name metaData
     * @instance
     * @memberof BaseLfo
     */
    this.metaData = {};

    this._initParams = Object.assign({}, defaults, options);
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
   * @param {Number} lower - Minimum possible value.
   * @param {Number} upper - Maximum possible value.
   * @param {String} kind - Define if the parameter is either `static` or
   *  `dynamic`.
   */
  addIntegerParam(name, lower, upper, kind) {
    const param = new IntegerParam(name, lower, upper, this._initParams[name], kind, this);
    this.params[name] = param;
  }

  /**
   * Add a parameter of type `integer` to the node.
   * The value of the parameter should be defined in `defaults` or in the
   * `options` given at instanciation.
   *
   * @param {String} name - Name of the parameter.
   * @param {Number} lower - Minimum possible value.
   * @param {Number} upper - Maximum possible value.
   * @param {String} kind - Define if the parameter is either `static` or
   *  `dynamic`.
   */
  addFloatParam(name, lower, upper, kind) {
    const param = new IntegerParam(name, lower, upper, this._initParams[name], kind, this);
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
    const param = new StringParam(name, list, this._initParams[name], kind, this);
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
    const param = new StringParam(name, this._initParams[name], kind, this);
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
    return this.params[name].value = value;
  }

  /**
   * Return the current value of a given parameter.
   *
   * @param {String} name - Name of the parameter.
   * @return {Mixed}
   */
  getParam(name) {
    return this.params[name].value;
  }

  /**
   * Connect the node (aka `parent`) to another node (aka `child`). A given node
   * can be connected to several children to which the stream is forwarded once
   * the logic defined `process` is applied. This method allows to create lfo
   * graphs.
   *
   * @param {BaseLfo} child - Next node in the graph.
   */
  connect(child) {
    if (this.streamParams === null || child.streamParams === null)
      throw new Error('cannot connect a dead lfo node');

    this.children.push(child);
    child.parent = this;
  }

  /**
   * Remove the `lfo` from its parent's children. Children of the current node
   * are still connected, thus allow to connect all the subgraph from the
   * current node to another parent.
   *
   * @todo - confirm it is the desired behavior in all cases.
   */
  disconnect() {
    const index = this.parent.children.indexOf(this);
    this.parent.children.splice(index, 1);
  }

  /**
   * Initialize the current node `streamParams` and `outFrame` buffer,
   * propagates the computed stream attributes of the node to all its children.
   * This method is internally called when a `lfo` source is started or when a
   * `dynamic` parameter is updated.
   *
   * @param {Object} [inStreamParams={}] - Stream parameters of the parent node.
   * @param {Object} [outStreamParams={}] - Optionnal parameters that can override
   *  the ones given by the parent.
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
   * Destroy all the nodes in the sub-graph starting from the current node.
   * When detroyed, the `streamParams` of the object are set to `null`, this
   * prevent to use it again in a graph.
   *
   * @see {BaseLfo.connect}
   */
  destroy() {
    // destroy all chidren
    let index = this.children.length;

    while (index--)
      this.children[index].destroy();

    // delete itself from the parent node
    if (this.parent) {
      const index =  this.parent.children.indexOf(this);
      this.parent.children.splice(index, 1);
    }

    // cannot use a dead object as parent
    this.streamParams = null;
    // clean it's own references / disconnect audio nodes if needed
  }

  /**
   * Create the `outFrame` buffer according to the defined `streamParams`.
   * This buffer should be reused at each call of the `process` method to
   * prevent memory allocation.
   *
   * @see {BaseLfo.process}
   */
  setupStream() {
    const frameSize = this.streamParams.frameSize;

    if (frameSize > 0)
      this.outFrame = new Float32Array(frameSize);
  }

  /**
   * Set all the values `outframe` buffer to 0.
   * This method first propagate to all the children of the node, the stream is
   * thus reset from the bottom to the top of the graph.
   * `reset` is automatically called when a source is started, just after
   * `initialize`.
   *
   * @see {BaseLfo.initialize}
   * @todo - Check perfs of `Float32Array.fill` against `for` loop.
   */
  reset() {
    for (let i = 0, l = this.children.length; i < l; i++)
      this.children[i].reset();

    // sinks have no `outFrame`
    if (!this.outFrame)
      return;

    // this.outFrame.fill(0); // probably better but doesn't work yet
    for (let i = 0, l = this.outFrame.length; i < l; i++)
      this.outFrame[i] = 0;
  }

  /**
   * Finalize the stream. This method is automatically called when a source is
   * stopped with the corresponding logical time.
   *
   * @param {Number} endTime - Logical time at which the graph is stopped.
   */
  finalize(endTime) {
    for (let i = 0, l = this.children.length; i < l; i++)
      this.children[i].finalize(endTime);
  }

  /**
   * Forward the current frame along with the current time and metadatas to
   * the children of the node. This method should be called at the end of the
   * process if the node is not a `sink` node.
   *
   * @param {Number} [time=this.time] - Time corresponding to the current frame.
   * @param {Float32Array} [outFrame=this.outFrame] - Current frame.
   * @param {Object} [metaData=this.metaData] - Associated metadatas.
   */
  output(time = this.time, outFrame = this.outFrame, metaData = this.metaData) {
    for (let i = 0, l = this.children.length; i < l; i++)
      this.children[i].process(time, outFrame, metaData);
  }

  /**
   * The main function to override to create a new node, this is where the
   * particular logic of a node the stream should be implemented.
   * The implementation **must** update `this.time`, `this.frame` (optionnaly
   * `this.metadata`) and call `process` on all the node's children (if the
   * node is not a sink).
   *
   * @param {Number} time - Time of the current frame as given by the parent node.
   * @param {Float32Array} frame - Current frame as given by the parent node.
   * @param {object} metaData - Metadatas forwarded by the parent node.
   */
  process(time, frame, metaData) {
    this.time = time;
    this.outFrame = frame;
    this.metaData = metaData;

    this.output();
  }
}

export default BaseLfo;

