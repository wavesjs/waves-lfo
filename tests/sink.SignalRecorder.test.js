import EventIn from '../src/common/source/EventIn';
import SignalRecorder from '../src/common/sink/SignalRecorder';
import tape from 'tape';


tape('SignalRecorder', (t) => {
  [1, Infinity].forEach((duration) => {
    const signal = [0, 0, 1, 2, 3, 4];
    const expected = [1, 2, 3, 4];

    const eventIn = new EventIn({
      frameType: 'signal',
      frameSize: 6,
      sampleRate: 6,
    });

    const recorder = new SignalRecorder({
      duration: duration,
      callback: (signal) => {
        t.looseEqual(signal, expected, 'should have recorded the signal without leading zeros');
      }
    });

    eventIn.connect(recorder);
    eventIn.start();

    // start recording
    recorder.start();
    eventIn.process(0, signal);
    recorder.stop();
  });

  t.end();
});
