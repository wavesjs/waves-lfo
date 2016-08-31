import tape from 'tape';
import BaseLfo from '../src/core/base-lfo';

tape('Param', (test) => {
  test.comment('Param definition');

  class FailParamDuplicate extends BaseLfo {
    constructor(options = {}) {
      super({
        test: 'test',
      }, options);

      this.addAnyParam('test', 'static');
      this.addAnyParam('test', 'static');
    }
  }

  test.throws(() => new FailParamDuplicate(), 'should throw an error if a parameter with same name is defined');

  class FailParamNoDefault extends BaseLfo {
    constructor(options = {}) {
      super({}, options);

      this.addAnyParam('test', 'static');
    }
  }

  test.throws(() => new FailParamNoDefault(), 'should throw an error if not default value defined');

  class ParamTest extends BaseLfo {
    constructor(options = {}) {
      super({
        staticBoolean: false,
        dynamicBoolean: false,
        staticInteger: 1,
        dynamicInteger: 0,
        staticFloat: 1.0,
        dynamicFloat: 0.0,
        staticString: 'a',
        dynamicString: 'a',
        staticEnum: 1,
        dynamicEnum: 1,
        staticAny: null,
        dynamicAny: null,
      }, options);

      this.addBooleanParam('staticBoolean', 'static');
      this.addBooleanParam('dynamicBoolean', 'dynamic');
      this.addIntegerParam('staticInteger', 0, 10, 'static');
      this.addIntegerParam('dynamicInteger', 0, 10, 'dynamic');
      this.addFloatParam('staticFloat', 0, 10, 'static');
      this.addFloatParam('dynamicFloat', 0, 10, 'dynamic');
      this.addStringParam('staticString', 'static');
      this.addStringParam('dynamicString', 'dynamic');
      this.addEnumParam('staticEnum', [1, 2, 3, 4], 'static');
      this.addEnumParam('dynamicEnum', [1, 2, 3, 4], 'dynamic');
      this.addAnyParam('staticAny', 'static');
      this.addAnyParam('dynamicAny', 'dynamic');
    }
  }

  const paramTest = new ParamTest();

  test.comment('BooleanParam');
  test.deepEqual(paramTest.getParam('staticBoolean'), false, 'should have proper default');
  test.deepEqual(paramTest.setParam('staticBoolean', true), true, 'should update properly');
  test.deepEqual(paramTest.setParam('staticBoolean', null), false, 'should cast to boolean');
  test.deepEqual(paramTest.paramUpdated, false, 'parent `paramUpdated` attribute stay `false` on `static` param update');

  test.comment('IntegerParam');
  test.deepEqual(paramTest.getParam('staticInteger'), 1, 'should have proper default');
  test.deepEqual(paramTest.setParam('staticInteger', 2), 2, 'should update properly');
  test.deepEqual(paramTest.setParam('staticInteger', '5'), 5, 'should cast to integer');
  test.deepEqual(paramTest.setParam('staticInteger', 12), 10, 'should clip to upper limit');
  test.deepEqual(paramTest.setParam('staticInteger', -2), 0, 'should clip to lower limit');
  test.deepEqual(paramTest.paramUpdated, false, 'parent `paramUpdated` attribute stay `false` on `static` param update');

  test.comment('FloatParam');
  test.deepEqual(paramTest.getParam('staticFloat'), 1.0, 'should have proper default');
  test.deepEqual(paramTest.setParam('staticFloat', Math.PI), Math.PI, 'should update properly');
  test.deepEqual(paramTest.setParam('staticFloat', '5.5'), 5.5, 'should cast to float');
  test.deepEqual(paramTest.setParam('staticFloat', 12), 10, 'should clip to upper limit');
  test.deepEqual(paramTest.setParam('staticFloat', -2), 0, 'should clip to lower limit');
  test.deepEqual(paramTest.paramUpdated, false, 'parent `paramUpdated` attribute stay `false` on `static` param update');

  test.comment('StringParam');
  test.deepEqual(paramTest.getParam('staticString'), 'a', 'should have proper default');
  test.deepEqual(paramTest.setParam('staticString', 'b'), 'b', 'should update properly');
  test.deepEqual(paramTest.setParam('staticString', 42), '42', 'should cast to string');
  test.deepEqual(paramTest.paramUpdated, false, 'parent `paramUpdated` attribute stay `false` on `static` param update');

  test.comment('EnumParam');
  test.deepEqual(paramTest.getParam('staticEnum'), 1, 'should have proper default');
  test.deepEqual(paramTest.setParam('staticEnum', 2), 2, 'should update properly');
  test.throws(() => paramTest.setParam('staticEnum', 42), 'should throw error if value not in list');
  test.deepEqual(paramTest.paramUpdated, false, 'parent `paramUpdated` attribute stay `false` on `static` param update');

  test.comment('AnyParam');
  const value = {};
  test.deepEqual(paramTest.getParam('staticAny'), null, 'should have proper default');
  test.deepEqual(paramTest.setParam('staticAny', value), value, 'should update properly');
  test.deepEqual(paramTest.paramUpdated, false, 'parent `paramUpdated` attribute stay `false` on `static` param update');


  test.comment('dynamic Params');

  paramTest.setParam('dynamicBoolean', true);
  test.deepEqual(paramTest.paramUpdated, true, 'parent `paramUpdated` attribute should be set to true on `dynamic` BooleanParam change');
  paramTest.paramUpdated = false; // reset
  paramTest.setParam('dynamicBoolean', true); // set to same value
  test.deepEqual(paramTest.paramUpdated, false, 'parent `paramUpdated` attribute should not be set to `true` if same value');

  paramTest.setParam('dynamicInteger', 42);
  test.deepEqual(paramTest.paramUpdated, true, 'parent `paramUpdated` attribute should be set to true on `dynamic` IntegerParam change');
  paramTest.paramUpdated = false; // reset
  paramTest.setParam('dynamicInteger', 42); // set to same value
  test.deepEqual(paramTest.paramUpdated, false, 'parent `paramUpdated` attribute should not be set to `true` if same value');

  paramTest.setParam('dynamicFloat', Math.PI);
  test.deepEqual(paramTest.paramUpdated, true, 'parent `paramUpdated` attribute should be set to true on `dynamic` FloatParam change');
  paramTest.paramUpdated = false; // reset
  paramTest.setParam('dynamicFloat', Math.PI); // set to same value
  test.deepEqual(paramTest.paramUpdated, false, 'parent `paramUpdated` attribute should not be set to `true` if same value');

  paramTest.setParam('dynamicString', '42');
  test.deepEqual(paramTest.paramUpdated, true, 'parent `paramUpdated` attribute should be set to true on `dynamic` StringParam change');
  paramTest.paramUpdated = false; // reset
  paramTest.setParam('dynamicString', '42'); // set to same value
  test.deepEqual(paramTest.paramUpdated, false, 'parent `paramUpdated` attribute should not be set to `true` if same value');

  paramTest.setParam('dynamicEnum', 2);
  test.deepEqual(paramTest.paramUpdated, true, 'parent `paramUpdated` attribute should be set to true on `dynamic` EnumParam change');
  paramTest.paramUpdated = false; // reset
  paramTest.setParam('dynamicEnum', 2); // set to same value
  test.deepEqual(paramTest.paramUpdated, false, 'parent `paramUpdated` attribute should not be set to `true` if same value');

  paramTest.setParam('dynamicAny', 42);
  test.deepEqual(paramTest.paramUpdated, true, 'parent `paramUpdated` attribute should be set to true on `dynamic` AnyParam change');
  paramTest.paramUpdated = false; // reset
  paramTest.setParam('dynamicAny', 42); // set to same value
  test.deepEqual(paramTest.paramUpdated, false, 'parent `paramUpdated` attribute should not be set to `true` if same value');

  test.end();
});
