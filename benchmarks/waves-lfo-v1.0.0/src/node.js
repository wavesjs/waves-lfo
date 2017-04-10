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
  const log = [];

  const fftSuites = getFftSuites(buffer, bufferLength, sampleRate, log);
  const rmsSuites = getRmsSuites(buffer, bufferLength, sampleRate, log);
  const mfccSuites = getMfccSuites(buffer, bufferLength, sampleRate, log);

  const suites = flatten([fftSuites, rmsSuites, mfccSuites]);
  suites.push(() => console.log(log.join('\n')));

  runSequence(suites);
}
