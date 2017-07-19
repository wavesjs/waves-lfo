import * as Benchmark from 'benchmark';
import av from 'av';
import path from 'path';

import { runSequence, flatten } from './utils';
// banchmark files
import { getFftSuites } from './benchFft';
import { getRmsSuites } from './benchRms';
import { getMfccSuites } from './benchMfcc';

global.Benchmark = Benchmark;

const asset = av.Asset.fromFile(path.join(process.cwd(), 'assets/drum-loop-extract-1s.wav'));
asset.on('error', (err) => console.log(err.stack));
asset.decodeToBuffer(init);

function init(buffer) {
  const bufferLength = buffer.length;
  const sampleRate = asset.format.sampleRate;
  const logStack = [];
  const stack = [];

  const fftSuites = getFftSuites(buffer, bufferLength, sampleRate, logStack);
  stack.push(fftSuites);
  const rmsSuites = getRmsSuites(buffer, bufferLength, sampleRate, logStack);
  stack.push(rmsSuites);
  const mfccSuites = getMfccSuites(buffer, bufferLength, sampleRate, logStack);
  stack.push(mfccSuites);

  const suites = flatten(stack);
  suites.push(() => console.log(logStack.join('\n')));

  runSequence(suites);
}
