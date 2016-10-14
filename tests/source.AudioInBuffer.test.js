import tape from 'tape';
import av from 'av';
import path from 'path';

import BaseLfo from '../src/core/BaseLfo';
import AudioInBuffer from '../src/source/AudioInBuffer';

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
    const expectedValues = this.buffer.subarray(sampleIndex, sampleIndex + this.frameSize);
    const expectedTime = sampleIndex / this.sampleRate;

    this.asserter.equal(time.toFixed(9), this.expectedTime.toFixed(9), 'Should have same time');
    this.asserter.looseEqual(data, expectedValues, 'Should have same data');

    this.expectedTime += this.frameSize / this.sampleRate;
    this.frameIndex += 1;
  }
}

tape('AudioInBuffer', (t) => {
  t.plan(2134);

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

    audioInBuffer = new AudioInBuffer({
      audioBuffer: audioBuffer,
      frameSize: frameSize,
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
