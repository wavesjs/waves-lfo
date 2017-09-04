import * as Benchmark from 'benchmark';
import * as lfo from 'waves-lfo/common';
import * as Meyda from 'meyda';


export function getRmsSuites(buffer, bufferLength, sampleRate, log) {

  const suites = [256, 1024, 4096].map((frameSize) => {

    return function(next) {
      const numFrames = Math.floor(bufferLength / frameSize);
      const suite = new Benchmark.Suite();

      const rms = new lfo.operator.Rms();
      rms.initStream({
        frameSize: frameSize,
        frameType: 'signal',
        sourceSampleRate: sampleRate,
      });

      suite.add(`lfo:rms\t\tframeSize: ${frameSize}\t`, {
        fn: function() {
          for (let i = 0; i < numFrames; i++) {
            const start = i * frameSize;
            const end = start + frameSize;
            const frame = buffer.subarray(start, end);
            const res = rms.inputSignal(frame);
          }
        },
      });

      Meyda.bufferSize = frameSize;
      Meyda.sampleRate = sampleRate;
      // #todo - windowing function should be 'rect' to skip windowing...
      // https://github.com/meyda/meyda/blob/master/src/utilities.js#L27

      suite.add(`meyda:rms\tframeSize: ${frameSize}\t`, {
        fn: function() {
          for (let i = 0; i < numFrames; i++) {
            const start = i * frameSize;
            const end = start + frameSize;
            const frame = buffer.subarray(start, end);
            const res = Meyda.extract('rms', frame);
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
