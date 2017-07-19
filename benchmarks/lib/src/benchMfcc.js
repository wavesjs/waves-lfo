import * as Benchmark from 'benchmark';
import * as lfo from 'waves-lfo/common';
import * as Meyda from 'meyda';


export function getMfccSuites(buffer, bufferLength, sampleRate, log) {

  const suites = [256, 1024, 4096].map((frameSize) => {

    return function(next) {
      const numFrames = Math.floor(bufferLength / frameSize);
      const suite = new Benchmark.Suite();

      const mfcc = new lfo.operator.Mfcc({
        nbrCoefs: 13,
      });

      mfcc.initStream({
        frameSize: frameSize,
        frameType: 'signal',
        sourceSampleRate: sampleRate,
      });

      suite.add(`lfo:mfcc\tframeSize: ${frameSize}\t`, {
        fn: function() {
          for (let i = 0; i < numFrames; i++) {
            const start = i * frameSize;
            const end = start + frameSize;
            const frame = buffer.subarray(start, end);
            const res = mfcc.inputSignal(frame);
          }
        },
      });

      Meyda.bufferSize = frameSize;
      Meyda.sampleRate = sampleRate;

      suite.add(`meyda:mfcc\tframeSize: ${frameSize}\t`, {
        fn: function() {
          for (let i = 0; i < numFrames; i++) {
            const start = i * frameSize;
            const end = start + frameSize;
            const frame = buffer.subarray(start, end);
            const res = Meyda.extract('mfcc', frame);
          }
        },
      });

      suite.on('cycle', function(event) {
        log.push(String(event.target));
      });

      suite.on('complete', function() {
        log.push('==> Fastest is ' + this.filter('fastest').map('name') + '\n');
        next();
      });

      suite.run({ async: false });
    }
  });

  return suites;
}
