import MeanStddev from '../src/common/operator/MeanStddev';
import tape from 'tape';

tape('MeanStddev', (t) => {
  const tolerance = 5e-4;
  t.comment(`tolerance: ${tolerance}`);

  t.comment('process two periods of a sine wave (1000 samples)');
  const length = 1000;
  const signal = new Float32Array(length);

  const meanStddev = new MeanStddev();
  meanStddev.initStream({ frameSize: length, frameType: 'signal' });

  const freq = 2;
  const _2PI = Math.PI * 2;

  for (let i = 0; i < length; i++)
    signal[i] = Math.sin(_2PI * freq * (i / length));

  const result = meanStddev.inputSignal(signal);

  const meanError = result[0] - 0;
  // Vpp = σ * 2sqrt(2) <=> σ = 1 / sqrt(2)
  const stddevError = Math.abs(result[1] - (1 / Math.sqrt(2)));

  t.assert(meanError < tolerance, 'should have proper mean');
  t.assert(stddevError < tolerance, 'should have proper stddev');

  t.comment(`meanError: ${meanError}`);
  t.comment(`stddevError: ${stddevError}`);

  t.end();
});
