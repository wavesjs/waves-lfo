
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
export class BooleanParam extends Param {
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
export class IntegerParam extends Param {
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
export class FloatParam extends Param {
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
export class StringParam extends Param {
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
export class EnumParam extends Param {
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
export class AnyParam extends Param {
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


