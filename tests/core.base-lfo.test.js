import BaseLfo from '../src/core/base-lfo';
import tape from 'tape';


tape('BaseLfo', (t) => {

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
  t.comment('constructor');

  t.deepEqual(parent.getParam('test'), true, 'should override defaults with options');

  t.comment('getParam / setParam');
  t.deepEqual(parent.setParam('test', false), false, '`setParam` should return the new value');
  t.throws(() => parent.getParam('dontexists'), '`getParam` should throw an error if invalid param name');
  t.throws(() => parent.setParam('dontexists'), '`setParam` should throw an error if invalid param name');


  // --------------------------------------------------
  t.comment('connect');

  t.throws(() => parent.connect({}), 'should throw error if child is not a `BaseLfo` instance');

  const aliveChild = new ChildNode();
  parent.connect(aliveChild);
  t.notDeepEqual(parent.children.indexOf(aliveChild), -1, 'should add child node to `children` attribute');
  t.deepEqual(aliveChild.parent, parent, 'should be defined as the parent of the child node');

  const deadChild = new ChildNode();
  deadChild.streamParams = null;
  t.throws(() => parent.connect(deadChild), 'should throw an error if trying to connect to a dead node');


  // --------------------------------------------------
  t.comment('disconnect');

  aliveChild.disconnect();
  t.deepEqual(parent.children.indexOf(aliveChild), -1, 'should remove child node from parent\'s `children` attribute');
  t.deepEqual(parent.parent, null, 'should set `parent` attribute to null');


  // --------------------------------------------------
  t.comment('initialize');

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

  t.deepEqual(child.initializedCalled, true, 'should call `initialize` on children');
  t.deepEqual(parent.setupStreamCalled, true, 'should call `setupStream`');

  t.deepEqual(parent.streamParams.frameSize, outStreamParams.frameSize, 'should merge inStreamParams and outStreamParams');
  t.deepEqual(parent.streamParams.frameRate, outStreamParams.frameRate, 'should merge inStreamParams and outStreamParams');
  t.deepEqual(parent.streamParams.sourceSampleRate, inStreamParams.sourceSampleRate, 'should merge inStreamParams and outStreamParams');

  t.deepEqual(child.streamParams.frameSize,outStreamParams.frameSize, 'should propagate streamParams to children');
  t.deepEqual(child.streamParams.frameRate, outStreamParams.frameRate, 'should propagate streamParams to children');
  t.deepEqual(child.streamParams.sourceSampleRate, inStreamParams.sourceSampleRate, 'should propagate streamParams to children');

  // clean object
  parent.setupStream = oldSetupStream;
  parent.setupStremaCalled = undefined;

  // --------------------------------------------------
  t.comment('setupStream');

  parent.setupStream();

  t.deepEqual((parent.outFrame instanceof Float32Array), true, 'should create the `outFrame` buffer');
  t.deepEqual(parent.outFrame.length, parent.streamParams.frameSize, 'length of  `outFrame` buffer should be equal to `streamParams.frameSize`');


  // --------------------------------------------------
  t.comment('reset');
  const length = parent.outFrame.length;
  const expected = new Float32Array(length);

  for (let i = 0; i < length; i++) {
    parent.outFrame[i] = Math.random();
    expected[i] = 0;
  }

  parent.reset();

  t.deepEqual(child.resetCalled, true, 'should call `reset` on children');
  t.deepLooseEqual(parent.outFrame, expected, 'should fill `outFrame` with 0');


  // --------------------------------------------------
  t.comment('finalize');
  const endTime = 1234;
  parent.finalize(endTime);

  t.deepEqual(child.finalizeCalled, endTime, 'should propagate `endTime` to children');

  // --------------------------------------------------
  t.comment('output');
  const time = 1234;
  const frame = [2];
  const metadata = {};

  parent.output(time, frame, metadata);

  t.deepEqual(child.time, time, 'should call children `process` with time');
  t.deepEqual(child.frame, frame, 'should call children `process` with frame');
  t.deepEqual(child.metadata, metadata, 'should call children `process` with metadata');

  // --------------------------------------------------
  t.comment('process');

  const oldInitialize = parent.initialize;
  const oldReset = parent.reset;

  parent.initialize = () => { parent.initializedCalled = true; }
  parent.reset = () => { parent.resetCalled = true; }

  parent.reinit = true;
  parent.process();

  t.deepEqual(parent.initializedCalled, true, 'should call `initialize` if a dynamic param changed');
  t.deepEqual(parent.resetCalled, true, 'should call `reset` if a dynamic param changed');
  t.deepEqual(parent.reinit, false, 'should reset `reinit` to false');


  // restore object state
  parent.initialize = oldInitialize;
  parent.reset = oldReset;

  // --------------------------------------------------
  t.comment('destroy');

  parent.destroy();

  t.deepEqual(child.destroyCalled, true, 'should call `destroy` on children');
  t.deepEqual(parent.streamParams, null, 'should set `streamParams` to null');

  t.end();
});
