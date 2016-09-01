
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
    this.name = name;
    this.type = type;
    this.kind = kind;
    this.node = node;
    this._value = value;
  }

  set value(value) {}
  get value() { return this._value; }
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
    if (this.kind === 'constant')
      throw new Error(`Cannot update constant param "${this.name}"`);

    value = !!value;

    if (this._value !== value) {
      this._value = value;
      this.node.onParamUpdate(this.kind, this.name, value);
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
    value = clip(parseInt(value, 10), lower, upper);

    super(name, 'integer', value, kind, node);

    this._lower = lower;
    this._upper = upper;
  }

  set value(value) {
    if (this.kind === 'constant')
      throw new Error(`Cannot update constant param "${this.name}"`);

    value = clip(parseInt(value, 10), this._lower, this._upper);

    if (this._value !== value) {
      this._value = value;
      this.node.onParamUpdate(this.kind, this.name, value);
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
    value = clip(value * 1, lower, upper);

    super(name, 'float', value, kind, node);

    this._lower = lower;
    this._upper = upper;
  }

  set value(value) {
    if (this.kind === 'constant')
      throw new Error(`Cannot update constant param "${this.name}"`);

    value = clip(value * 1, this._lower, this._upper);

    if (this._value !== value) {
      this._value = value;
      this.node.onParamUpdate(this.kind, this.name, value);
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
    value = value + '';

    super(name, 'string', value, kind, node);
  }

  set value(value) {
    if (this.kind === 'constant')
      throw new Error(`Cannot update constant param "${this.name}"`);

    value = value + '';

    if (this._value !== value) {
      this._value = value;
      this.node.onParamUpdate(this.kind, this.name, value);
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
    if (list.indexOf(value) === -1)
      throw new Error(`Invalid value for param "${name}" (valid values: ${list})`);

    super(name, 'enum', value, kind, node);

    this.list = list;
  }

  set value(value) {
    if (this.kind === 'constant')
      throw new Error(`Cannot update constant param "${this.name}"`);

    if (this.list.indexOf(value) === -1)
      throw new Error(`Invalid value for param "${this.name}" (valid values: ${this.list})`);

    if (this._value !== value) {
      this._value = value;
      this.node.onParamUpdate(this.kind, this.name, value);
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
    if (this.kind === 'constant')
      throw new Error(`Cannot update constant param "${this.name}"`);

    if (this._value !== value) {
      this._value = value;
      this.node.onParamUpdate(this.kind, this.name, value);
    }

    return this._value;
  }

  get value() {
    return this._value;
  }
}

