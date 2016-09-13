import BaseLfo from '../src/core/BaseLfo';
import tape from 'tape';


tape('BaseLfo', (t) => {

  class ParentNode extends BaseLfo {
    constructor(options) {
      super();
    }
  }

  class ChildNode extends BaseLfo {
    processStreamParams(prevStreamParams) {
      Object.assign(this.streamParams, prevStreamParams);
      this.processStreamParamsCalled = true;
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

    processFrame(frameTime, frameData, frameMetadata) {
      this.frameTime = frameTime;
      this.frameData = frameData;
      this.frameMetadata = frameMetadata;
    }
  }

  const parent = new ParentNode();

  // --------------------------------------------------
  t.comment('constructor');

  // --------------------------------------------------
  t.comment('connect');

  t.throws(() => parent.connect({}), 'should throw error if child is not a `BaseLfo` instance');

  const aliveChild = new ChildNode();
  parent.connect(aliveChild);
  t.notDeepEqual(parent.nextOps.indexOf(aliveChild), -1, 'should add child node to `nextOps` attribute');
  t.deepEqual(aliveChild.prevOp, parent, 'should be defined as the `prevOp` of the child node');

  const deadChild = new ChildNode();
  deadChild.streamParams = null;
  t.throws(() => parent.connect(deadChild), 'should throw an error if trying to connect to a dead node');


  // --------------------------------------------------
  t.comment('disconnect');

  parent.disconnect(aliveChild);
  t.deepEqual(parent.nextOps.indexOf(aliveChild), -1, 'should remove child node from parent\'s `nextOps` attribute');
  t.deepEqual(aliveChild.prevOp, null, 'should set `prevOp` attribute to null');


  // --------------------------------------------------
  t.comment('processStreamParams');

  const child = new ChildNode();
  parent.connect(child);

  const streamParams = {
    frameSize: 2,
    frameRate: 10,
    sourceSampleRate: 50,
  };

  parent.processStreamParams(streamParams);

  t.deepEqual(child.processStreamParamsCalled, true, 'should call `processStreamParams` on children');

  t.deepEqual(parent.streamParams.frameSize, streamParams.frameSize, 'should merge streamParams');
  t.deepEqual(parent.streamParams.frameRate, streamParams.frameRate, 'should merge streamParams');
  t.deepEqual(parent.streamParams.sourceSampleRate, streamParams.sourceSampleRate, 'should merge streamParams');

  t.deepEqual(child.streamParams.frameSize, streamParams.frameSize, 'should propagate streamParams');
  t.deepEqual(child.streamParams.frameRate, streamParams.frameRate, 'should propagate streamParams');
  t.deepEqual(child.streamParams.sourceSampleRate, streamParams.sourceSampleRate, 'should propagate streamParams');

  // --------------------------------------------------
  t.comment('reset');

  const length = parent.frameData.length;
  const expected = new Float32Array(length);

  for (let i = 0; i < length; i++) {
    parent.frameData[i] = Math.random();
    expected[i] = 0;
  }

  parent.reset();

  t.deepEqual(child.resetCalled, true, 'should call `reset` on children');
  t.deepLooseEqual(parent.frameData, expected, 'should fill `frameData` with 0');


  // --------------------------------------------------
  t.comment('finalize');

  const endTime = 1234;
  parent.finalize(endTime);

  t.deepEqual(child.finalizeCalled, endTime, 'should propagate `endTime` to children');

  // --------------------------------------------------
  t.comment('outputFrame');

  parent.frameTime = 1234;
  parent.frameData = [2];
  parent.frameMetadata = {};

  parent.outputFrame();

  t.deepEqual(child.frameTime, parent.frameTime, 'should call children `processFrame` with frameTime');
  t.deepEqual(child.frameData, parent.frameData, 'should call children `processFrame` with frameData');
  t.deepEqual(child.frameMetadata, parent.frameMetadata, 'should call children `processFrame` with frameMetadata');

  // --------------------------------------------------
  t.comment('processFrame');

  const oldProcessStreamParams = parent.processStreamParams;
  const oldReset = parent.reset;

  parent.processStreamParams = () => { parent.processStreamParamsCalled = true; }
  parent.reset = () => { parent.resetCalled = true; }

  parent.reinit = true;
  parent.processFrame();

  t.deepEqual(parent.processStreamParamsCalled, true, 'should call `initialize` if a dynamic param changed');
  t.deepEqual(parent.resetCalled, true, 'should call `reset` if a dynamic param changed');
  t.deepEqual(parent.reinit, false, 'should reset `reinit` to false');


  // restore object state
  parent.processStreamParams = oldProcessStreamParams;
  parent.reset = oldReset;

  // --------------------------------------------------
  t.comment('destroy');

  parent.destroy();

  t.deepEqual(child.destroyCalled, true, 'should call `destroy` on children');
  t.deepEqual(parent.streamParams, null, 'should set `streamParams` to null');

  t.end();
});
