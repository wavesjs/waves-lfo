import path from 'path';
import tape from 'tape';
import av from 'av';

import AudioInFile from '../src/node/source/AudioInFile';
import Logger from '../src/common/sink/Logger';

// class Asserter extends BaseLfo {
//   constructor(asserter, sampleRate, frameSize, buffer) {
//     super();

//     this.asserter = asserter;
//     this.sampleRate = sampleRate;
//     this.frameSize = frameSize;
//     this.buffer = buffer;

//     this.frameIndex = 0;
//     this.expectedTime = 0;
//   }

//   processSignal(frame) {
//     const time = frame.time;
//     const data = frame.data;

//     const sampleIndex = this.frameIndex * this.frameSize;
//     const extract = this.buffer.subarray(sampleIndex, sampleIndex + this.frameSize);
//     const expectedValues = new Float32Array(this.frameSize);
//     expectedValues.set(extract);
//     const expectedTime = sampleIndex / this.sampleRate;

//     this.asserter.equal(time.toFixed(9), this.expectedTime.toFixed(9), 'Should have same time');
//     this.asserter.looseEqual(data, expectedValues, 'Should have same data');

//     this.expectedTime += this.frameSize / this.sampleRate;
//     this.frameIndex += 1;
//   }
// }

tape('AudioInFile', (t) => {
  t.comment('implement proper test');
  t.comment('particularly with `channels`');

  const filename = path.join(__dirname, './audio/sine-172.265625-44.1kHz-1sec.wav');
  const frameSize = 512;
  const nbrSamples = 44100;
  const nbrFrames = Math.ceil(nbrSamples / frameSize);
  let i = 0;

  const audioInFile = new AudioInFile({
    filename: filename,
    frameSize: frameSize,
    progressCallback: (ratio) => {
      i += 1;
      t.equal(i / nbrFrames, ratio, 'should call progressCallback with proper ratio');
    }
  });

  const logger = new Logger({ data: true, });

  // last frame should contain 68 non zero samples
  audioInFile.connect(logger);
  audioInFile.start();

  t.end();
});
