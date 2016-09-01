import BaseLfo from '../src/core/base-lfo';
import tape from 'tape';


tape('BaseLfo', (test) => {

  class ParentNode extends BaseLfo {
    constructor(options) {
      super({
        test: false,
      }, options);

      this.addAnyParam('test', 'dynamic');
    }
  }

  class ChildNode extends BaseLfo {
    initialize(inStreamParams) {
      super.initialize(inStreamParams, {});
      this.initializedCalled = true;
    }

    reset() {
      super.reset();
      this.resetCalled = true;
    }

    destroy() {
      super.destroy();
      this.destroyCalled = true;
    }

    finalize(endTime) {
      super.finalize(endTime);
      this.finalizeCalled = endTime;
    }

    process(time, frame, metadata) {
      this.time = time;
      this.frame = frame;
      this.metadata = metadata;
    }
  }

  const parent = new ParentNode({ test: true });

  // --------------------------------------------------
  test.comment('constructor');

  test.deepEqual(parent.getParam('test'), true, 'should override defaults with options');

  test.comment('getParam / setParam');
  test.deepEqual(parent.setParam('test', false), false, '`setParam` should return the new value');
  test.throws(() => parent.getParam('dontexists'), '`getParam` should throw an error if invalid param name');
  test.throws(() => parent.setParam('dontexists'), '`setParam` should throw an error if invalid param name');


  // --------------------------------------------------
  test.comment('connect');

  test.throws(() => parent.connect({}), 'should throw error if child is not a `BaseLfo` instance');

  const aliveChild = new ChildNode();
  parent.connect(aliveChild);
  test.notDeepEqual(parent.children.indexOf(aliveChild), -1, 'should add child node to `children` attribute');
  test.deepEqual(aliveChild.parent, parent, 'should be defined as the parent of the child node');

  const deadChild = new ChildNode();
  deadChild.streamParams = null;
  test.throws(() => parent.connect(deadChild), 'should throw an error if trying to connect to a dead node');


  // --------------------------------------------------
  test.comment('disconnect');

  aliveChild.disconnect();
  test.deepEqual(parent.children.indexOf(aliveChild), -1, 'should remove child node from parent\'s `children` attribute');
  test.deepEqual(parent.parent, null, 'should set `parent` attribute to null');


  // --------------------------------------------------
  test.comment('initialize');

  // trace `setupStream` call
  const oldSetupStream = parent.setupStream;
  parent.setupStream = () => { parent.setupStreamCalled = true; };

  const child = new ChildNode();
  parent.connect(child);

  const inStreamParams = {
    frameSize: 3,
    frameRate: 50,
    sourceSampleRate: 50,
  }

  const outStreamParams = {
    frameSize: 2,
    frameRate: 10
  };

  parent.initialize(inStreamParams, outStreamParams);

  test.deepEqual(child.initializedCalled, true, 'should call `initialize` on children');
  test.deepEqual(parent.setupStreamCalled, true, 'should call `setupStream`');

  test.deepEqual(parent.streamParams.frameSize, outStreamParams.frameSize, 'should merge inStreamParams and outStreamParams');
  test.deepEqual(parent.streamParams.frameRate, outStreamParams.frameRate, 'should merge inStreamParams and outStreamParams');
  test.deepEqual(parent.streamParams.sourceSampleRate, inStreamParams.sourceSampleRate, 'should merge inStreamParams and outStreamParams');

  test.deepEqual(child.streamParams.frameSize,outStreamParams.frameSize, 'should propagate streamParams to children');
  test.deepEqual(child.streamParams.frameRate, outStreamParams.frameRate, 'should propagate streamParams to children');
  test.deepEqual(child.streamParams.sourceSampleRate, inStreamParams.sourceSampleRate, 'should propagate streamParams to children');

  // clean object
  parent.setupStream = oldSetupStream;
  parent.setupStremaCalled = undefined;

  // --------------------------------------------------
  test.comment('setupStream');

  parent.setupStream();

  test.deepEqual((parent.outFrame instanceof Float32Array), true, 'should create the `outFrame` buffer');
  test.deepEqual(parent.outFrame.length, parent.streamParams.frameSize, 'length of  `outFrame` buffer should be equal to `streamParams.frameSize`');


  // --------------------------------------------------
  test.comment('reset');
  const length = parent.outFrame.length;
  const expected = new Float32Array(length);

  for (let i = 0; i < length; i++) {
    parent.outFrame[i] = Math.random();
    expected[i] = 0;
  }

  parent.reset();

  test.deepEqual(child.resetCalled, true, 'should call `reset` on children');
  test.deepLooseEqual(parent.outFrame, expected, 'should fill `outFrame` with 0');


  // --------------------------------------------------
  test.comment('finalize');
  const endTime = 1234;
  parent.finalize(endTime);

  test.deepEqual(child.finalizeCalled, endTime, 'should propagate `endTime` to children');

  // --------------------------------------------------
  test.comment('output');
  const time = 1234;
  const frame = [2];
  const metadata = {};

  parent.output(time, frame, metadata);

  test.deepEqual(child.time, time, 'should call children `process` with time');
  test.deepEqual(child.frame, frame, 'should call children `process` with frame');
  test.deepEqual(child.metadata, metadata, 'should call children `process` with metadata');

  // --------------------------------------------------
  test.comment('process');

  const oldInitialize = parent.initialize;
  const oldReset = parent.reset;

  parent.initialize = () => { parent.initializedCalled = true; }
  parent.reset = () => { parent.resetCalled = true; }

  parent.paramUpdated = true;
  parent.process();

  test.deepEqual(parent.initializedCalled, true, 'should call `initialize` if a dynamic param changed');
  test.deepEqual(parent.resetCalled, true, 'should call `reset` if a dynamic param changed');
  test.deepEqual(parent.paramUpdated, false, 'should reset `paramUpdated` to false');


  // restore object state
  parent.initialize = oldInitialize;
  parent.reset = oldReset;

  // --------------------------------------------------
  test.comment('destroy');

  parent.destroy();

  test.deepEqual(child.destroyCalled, true, 'should call `destroy` on children');
  test.deepEqual(parent.streamParams, null, 'should set `streamParams` to null');

  test.end();
});
