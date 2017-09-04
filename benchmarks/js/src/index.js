import * as Benchmark from 'benchmark';
import * as loaders from 'waves-loaders';

import { runSequence, flatten } from './utils';
// banchmark files
import { getFftSuites } from './benchFft';
import { getRmsSuites } from './benchRms';
import { getMfccSuites } from './benchMfcc';

window.Benchmark = Benchmark;

const audioContext = new AudioContext();

const loader = new loaders.AudioBufferLoader();

loader
  .load('assets/drum-loop-extract-1s.wav')
  .then(init)
  .catch(err => console.error(err.stack));

function init(audioBuffer) {
  const buffer = audioBuffer.getChannelData(0);
  const bufferLength = buffer.length;
  const sampleRate = audioContext.sampleRate;
  const logStack = [];
  const stack = [];

  const fftSuites = getFftSuites(buffer, bufferLength, sampleRate, logStack);
  stack.push(fftSuites);
  const rmsSuites = getRmsSuites(buffer, bufferLength, sampleRate, logStack);
  stack.push(rmsSuites);
  const mfccSuites = getMfccSuites(buffer, bufferLength, sampleRate, logStack);
  stack.push(mfccSuites);

  const suites = flatten(stack);

  suites.push(() => {
    const str = logStack.join('\n');
    document.querySelector('#results').textContent = logStack.join('\n');
  });

  runSequence(suites);
}

