import * as Benchmark from 'benchmark';
import * as lfo from 'waves-lfo/common';
import * as Meyda from 'meyda/dist/node/main';


export function getFftSuites(buffer, bufferLength, sampleRate, log) {

  const suites = [256, 1024, 4096].map((frameSize) => {

    return function(next) {
      const numFrames = Math.floor(bufferLength / frameSize);
      const suite = new Benchmark.Suite();

      const fft = new lfo.operator.Fft({
        window: 'hamming',
        mode: 'magnitude',
        size: frameSize,
      });

      fft.initStream({
        frameSize: frameSize,
        frameType: 'signal',
        sourceSampleRate: sampleRate,
      });

      suite.add(`lfo:fft - frameSize: ${frameSize}`, {
        fn: function() {
          for (let i = 0; i < numFrames; i++) {
            const start = i * frameSize;
            const end = start + frameSize;
            const frame = buffer.subarray(start, end);
            const res = fft.inputSignal(frame);
          }
        },
      });

      Meyda.bufferSize = frameSize;
      Meyda.sampleRate = sampleRate;

      suite.add(`meyda:fft - frameSize: ${frameSize}`, {
        fn: function() {
          for (let i = 0; i < numFrames; i++) {
            const start = i * frameSize;
            const end = start + frameSize;
            const frame = buffer.subarray(start, end);
            const res = Meyda.extract('amplitudeSpectrum', frame);
          }
        },
      });

      suite.on('cycle', function(event) {
        log.push(String(event.target));
      });

      suite.on('complete', function() {
        log.push('==> Fastest is ' + this.filter('fastest').map('name'));
        next();
      });

      suite.run({ async: false });
    }

  });

  return suites;
}
