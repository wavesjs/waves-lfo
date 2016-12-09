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
      this.prepareStreamParams(prevStreamParams);

      this.frame.data = new Float32Array(this.streamParams.frameSize);
      this.processStreamParamsCalled = true;
    }

    resetStream() {
      super.resetStream();
      this.resetCalled = true;
    }

    destroy() {
      super.destroy();
      this.destroyCalled = true;
    }

    finalizeStream(endTime) {
      super.finalizeStream(endTime);
      this.finalizeCalled = endTime;
    }

    processFrame(frame) {
      this.frame = frame;
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
  t.comment('resetStream');

  const length = parent.frame.data.length;
  const expected = new Float32Array(length);

  for (let i = 0; i < length; i++) {
    parent.frame.data[i] = Math.random();
    expected[i] = 0;
  }

  parent.resetStream();

  t.deepEqual(child.resetCalled, true, 'should call `reset` on children');
  t.deepLooseEqual(parent.frame.data, expected, 'should fill `frameData` with 0');


  // --------------------------------------------------
  t.comment('finalizeStream');

  const endTime = 1234;
  parent.finalizeStream(endTime);

  t.deepEqual(child.finalizeCalled, endTime, 'should propagate `endTime` to children');

  // --------------------------------------------------
  t.comment('propagateFrame');

  parent.frame.time = 1234;
  parent.frame.data = [2];
  parent.frame.metadata = {};

  parent.propagateFrame();

  t.deepEqual(child.frame.time, parent.frame.time, 'should call children `processFrame` with frameTime');
  t.deepEqual(child.frame.data, parent.frame.data, 'should call children `processFrame` with frameData');
  t.deepEqual(child.frame.metadata, parent.frame.metadata, 'should call children `processFrame` with frameMetadata');

  // --------------------------------------------------
  t.comment('processFrame');

  const oldProcessStreamParams = parent.processStreamParams;
  const oldResetStream = parent.resetStream;

  let processStreamParamsCalled = null;
  let resetCalled = null;

  parent.processStreamParams = () => { processStreamParamsCalled = true; }
  parent.resetStream = () => { resetCalled = true; }
  parent._reinit = true;

  parent.processFrame({});

  t.deepEqual(processStreamParamsCalled, true, 'should call `initialize` if a dynamic param changed');
  t.deepEqual(resetCalled, true, 'should call `resetStream` if a dynamic param changed');
  t.deepEqual(parent._reinit, false, 'should reset `_reinit` to false');


  // restore object state
  parent.processStreamParams = oldProcessStreamParams;
  parent.resetStream = oldResetStream;

  // --------------------------------------------------
  t.comment('destroy');

  parent.destroy();

  t.deepEqual(child.destroyCalled, true, 'should call `destroy` on children');
  t.deepEqual(parent.streamParams, null, 'should set `streamParams` to null');

  t.end();
});
