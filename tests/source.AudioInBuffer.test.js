import tape from 'tape';
import av from 'av';
import path from 'path';

import BaseLfo from '../src/common/core/BaseLfo';
import AudioInBuffer from '../src/client/source/AudioInBuffer';

// compare output of the AudioInBuffer against manual slicing of the buffer
class Asserter extends BaseLfo {
  constructor(asserter, sampleRate, frameSize, buffer) {
    super();

    this.asserter = asserter;
    this.sampleRate = sampleRate;
    this.frameSize = frameSize;
    this.buffer = buffer;

    this.frameIndex = 0;
    this.expectedTime = 0;
  }

  processSignal(frame) {
    const time = frame.time;
    const data = frame.data;

    const sampleIndex = this.frameIndex * this.frameSize;
    const extract = this.buffer.subarray(sampleIndex, sampleIndex + this.frameSize);
    const expectedValues = new Float32Array(this.frameSize);
    expectedValues.set(extract);
    const expectedTime = sampleIndex / this.sampleRate;

    this.asserter.equal(time.toFixed(9), this.expectedTime.toFixed(9), 'Should have same time');
    this.asserter.looseEqual(data, expectedValues, 'Should have same data');

    this.expectedTime += this.frameSize / this.sampleRate;
    this.frameIndex += 1;
  }
}

tape('AudioInBuffer', (t) => {
  t.plan(2444);

  // ----------------------------------------------------
  // simple test
  // ----------------------------------------------------

  t.comment('frame size 2');

  const buffer = new Float32Array([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  const frameSize = 2;

  const audioBuffer = {
    sampleRate: 44100,
    getChannelData: () => buffer,
  };

  const audioInBuffer = new AudioInBuffer({
    audioBuffer: audioBuffer,
    frameSize: frameSize,
  });

  const asserter = new Asserter(t, 44100, frameSize, buffer);

  audioInBuffer.connect(asserter);
  audioInBuffer.start();

  // ----------------------------------------------------
  // test real audio file
  // ----------------------------------------------------

  const file = './audio/drum-loop.wav';
  const asset = av.Asset.fromFile(path.join(__dirname, file));
  asset.on('error', (err) => console.log(err.stack));

  asset.decodeToBuffer((buffer) => {
    // mimic AudioBuffer interface
    const audioBuffer = {
      sampleRate: asset.format.sampleRate,
      getChannelData: () => buffer,
    };

    let frameSize;
    let audioInBuffer;
    let asserter;

    t.comment('frame size 512');

    frameSize = 512;
    const nbrFrames = Math.ceil(buffer.length / frameSize);
    let i = 0;

    audioInBuffer = new AudioInBuffer({
      audioBuffer: audioBuffer,
      frameSize: frameSize,
      progressCallback: (ratio) => {
        i += 1;
        t.equal(i / nbrFrames, ratio, 'should call progressCallback with proper ratio');
      }
    });

    asserter = new Asserter(t, audioBuffer.sampleRate, frameSize, buffer);

    audioInBuffer.connect(asserter);
    audioInBuffer.start();


    t.comment('frame size 200');

    frameSize = 200;

    audioInBuffer = new AudioInBuffer({
      audioBuffer: audioBuffer,
      frameSize: frameSize,
    });

    asserter = new Asserter(t, audioBuffer.sampleRate, frameSize, buffer);

    audioInBuffer.connect(asserter);
    audioInBuffer.start();
  });
});
