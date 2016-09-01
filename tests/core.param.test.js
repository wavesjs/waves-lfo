import tape from 'tape';
import BaseLfo from '../src/core/base-lfo';


tape('Param', (t) => {
  t.comment('Param definition');

  class FailParamDuplicate extends BaseLfo {
    constructor(options = {}) {
      super({
        test: 'test',
      }, options);

      this.addAnyParam('test', 'static');
      this.addAnyParam('test', 'static');
    }
  }

  t.throws(() => new FailParamDuplicate(), 'should throw an error if a parameter with same name is defined');

  class FailParamNoDefault extends BaseLfo {
    constructor(options = {}) {
      super({}, options);

      this.addAnyParam('test', 'static');
    }
  }

  t.throws(() => new FailParamNoDefault(), 'should throw an error if not default value defined');

  class ParamTest extends BaseLfo {
    constructor(options = {}) {
      super({
        staticBoolean: false,
        dynamicBoolean: false,
        constantBoolean: false,
        staticInteger: 1,
        dynamicInteger: 0,
        constantInteger: 0,
        staticFloat: 1.0,
        dynamicFloat: 0.0,
        constantFloat: 0.0,
        staticString: 'a',
        dynamicString: 'a',
        constantString: 'a',
        staticEnum: 1,
        dynamicEnum: 1,
        constantEnum: 1,
        staticAny: null,
        dynamicAny: null,
        constantAny: null,
      }, options);

      this.addBooleanParam('staticBoolean', 'static');
      this.addBooleanParam('dynamicBoolean', 'dynamic');
      this.addBooleanParam('constantBoolean', 'constant');
      this.addIntegerParam('staticInteger', 0, 10, 'static');
      this.addIntegerParam('dynamicInteger', 0, 10, 'dynamic');
      this.addIntegerParam('constantInteger', 0, 10, 'constant');
      this.addFloatParam('staticFloat', 0, 10, 'static');
      this.addFloatParam('dynamicFloat', 0, 10, 'dynamic');
      this.addFloatParam('constantFloat', 0, 10, 'constant');
      this.addStringParam('staticString', 'static');
      this.addStringParam('dynamicString', 'dynamic');
      this.addStringParam('constantString', 'constant');
      this.addEnumParam('staticEnum', [1, 2, 3, 4], 'static');
      this.addEnumParam('dynamicEnum', [1, 2, 3, 4], 'dynamic');
      this.addEnumParam('constantEnum', [1, 2, 3, 4], 'constant');
      this.addAnyParam('staticAny', 'static');
      this.addAnyParam('dynamicAny', 'dynamic');
      this.addAnyParam('constantAny', 'constant');
    }
  }

  const paramTest = new ParamTest();

  t.comment('BooleanParam');
  t.deepEqual(paramTest.getParam('staticBoolean'), false, 'should have proper default');
  t.deepEqual(paramTest.setParam('staticBoolean', true), true, 'should update properly');
  t.deepEqual(paramTest.setParam('staticBoolean', null), false, 'should cast to boolean');
  t.deepEqual(paramTest.reinit, false, 'parent `reinit` attribute stay `false` on `static` param update');

  t.comment('IntegerParam');
  t.deepEqual(paramTest.getParam('staticInteger'), 1, 'should have proper default');
  t.deepEqual(paramTest.setParam('staticInteger', 2), 2, 'should update properly');
  t.deepEqual(paramTest.setParam('staticInteger', '5'), 5, 'should cast to integer');
  t.deepEqual(paramTest.setParam('staticInteger', 12), 10, 'should clip to upper limit');
  t.deepEqual(paramTest.setParam('staticInteger', -2), 0, 'should clip to lower limit');
  t.deepEqual(paramTest.reinit, false, 'parent `reinit` attribute stay `false` on `static` param update');

  t.comment('FloatParam');
  t.deepEqual(paramTest.getParam('staticFloat'), 1.0, 'should have proper default');
  t.deepEqual(paramTest.setParam('staticFloat', Math.PI), Math.PI, 'should update properly');
  t.deepEqual(paramTest.setParam('staticFloat', '5.5'), 5.5, 'should cast to float');
  t.deepEqual(paramTest.setParam('staticFloat', 12), 10, 'should clip to upper limit');
  t.deepEqual(paramTest.setParam('staticFloat', -2), 0, 'should clip to lower limit');
  t.deepEqual(paramTest.reinit, false, 'parent `reinit` attribute stay `false` on `static` param update');

  t.comment('StringParam');
  t.deepEqual(paramTest.getParam('staticString'), 'a', 'should have proper default');
  t.deepEqual(paramTest.setParam('staticString', 'b'), 'b', 'should update properly');
  t.deepEqual(paramTest.setParam('staticString', 42), '42', 'should cast to string');
  t.deepEqual(paramTest.reinit, false, 'parent `reinit` attribute stay `false` on `static` param update');

  t.comment('EnumParam');
  t.deepEqual(paramTest.getParam('staticEnum'), 1, 'should have proper default');
  t.deepEqual(paramTest.setParam('staticEnum', 2), 2, 'should update properly');
  t.throws(() => paramTest.setParam('staticEnum', 42), 'should throw error if value not in list');
  t.deepEqual(paramTest.reinit, false, 'parent `reinit` attribute stay `false` on `static` param update');

  t.comment('AnyParam');
  const value = {};
  t.deepEqual(paramTest.getParam('staticAny'), null, 'should have proper default');
  t.deepEqual(paramTest.setParam('staticAny', value), value, 'should update properly');
  t.deepEqual(paramTest.reinit, false, 'parent `reinit` attribute stay `false` on `static` param update');


  t.comment('dynamic Params');

  paramTest.setParam('dynamicBoolean', true);
  t.deepEqual(paramTest.reinit, true, 'parent `reinit` attribute should be set to true on `dynamic` BooleanParam change');
  paramTest.reinit = false; // reset
  paramTest.setParam('dynamicBoolean', true); // set to same value
  t.deepEqual(paramTest.reinit, false, 'parent `reinit` attribute should not be set to `true` if same value');

  paramTest.setParam('dynamicInteger', 42);
  t.deepEqual(paramTest.reinit, true, 'parent `reinit` attribute should be set to true on `dynamic` IntegerParam change');
  paramTest.reinit = false; // reset
  paramTest.setParam('dynamicInteger', 42); // set to same value
  t.deepEqual(paramTest.reinit, false, 'parent `reinit` attribute should not be set to `true` if same value');

  paramTest.setParam('dynamicFloat', Math.PI);
  t.deepEqual(paramTest.reinit, true, 'parent `reinit` attribute should be set to true on `dynamic` FloatParam change');
  paramTest.reinit = false; // reset
  paramTest.setParam('dynamicFloat', Math.PI); // set to same value
  t.deepEqual(paramTest.reinit, false, 'parent `reinit` attribute should not be set to `true` if same value');

  paramTest.setParam('dynamicString', '42');
  t.deepEqual(paramTest.reinit, true, 'parent `reinit` attribute should be set to true on `dynamic` StringParam change');
  paramTest.reinit = false; // reset
  paramTest.setParam('dynamicString', '42'); // set to same value
  t.deepEqual(paramTest.reinit, false, 'parent `reinit` attribute should not be set to `true` if same value');

  paramTest.setParam('dynamicEnum', 2);
  t.deepEqual(paramTest.reinit, true, 'parent `reinit` attribute should be set to true on `dynamic` EnumParam change');
  paramTest.reinit = false; // reset
  paramTest.setParam('dynamicEnum', 2); // set to same value
  t.deepEqual(paramTest.reinit, false, 'parent `reinit` attribute should not be set to `true` if same value');

  paramTest.setParam('dynamicAny', 42);
  t.deepEqual(paramTest.reinit, true, 'parent `reinit` attribute should be set to true on `dynamic` AnyParam change');
  paramTest.reinit = false; // reset
  paramTest.setParam('dynamicAny', 42); // set to same value
  t.deepEqual(paramTest.reinit, false, 'parent `reinit` attribute should not be set to `true` if same value');

  t.comment('constant Params');

  t.throws(() => paramTest.setParam('constantBoolean', true), 'should throw error when updating a `constant` parameter');
  t.throws(() => paramTest.setParam('constantInteger', 42), 'should throw error when updating a `constant` parameter');
  t.throws(() => paramTest.setParam('constantFloat', Math.PI), 'should throw error when updating a `constant` parameter');
  t.throws(() => paramTest.setParam('constantString', '42'), 'should throw error when updating a `constant` parameter');
  t.throws(() => paramTest.setParam('constantEnum', 2), 'should throw error when updating a `constant` parameter');
  t.throws(() => paramTest.setParam('constantAny', 42), 'should throw error when updating a `constant` parameter');

  t.end();
});
