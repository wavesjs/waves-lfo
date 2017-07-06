import EventIn from '../src/common/source/EventIn';
import DataRecorder from '../src/common/sink/DataRecorder';
import tape from 'tape';

// doc example
// const eventIn = new lfo.source.EventIn({
//   frameType: 'vector',
//   frameSize: 2,
//   frameRate: 0,
// });

// const recorder = new lfo.sink.DataRecorder();

// eventIn.connect(recorder);
// eventIn.start();
// recorder.start();

// recorder.retrieve()
//   .then((result) => console.log(result))
//   .catch((err) => console.error(err.stack));

// eventIn.process(0, [0, 1]);
// eventIn.process(1, [1, 2]);

// recorder.stop();

tape('DataRecorder', (t) => {
  t.plan(9);

  const eventIn = new EventIn({
    frameType: 'vector',
    frameSize: 2,
    frameRate: 0,
  });

  const recorder1 = new DataRecorder({
    separateArrays: false,
    callback: (res) => {
      t.comment('separateArrays === false');

      res.forEach((datum, index) => {
        t.equal(frames[index].time, datum.time);
        t.looseEqual(frames[index].data, datum.data);
      });
    }
  });
  const recorder2 = new DataRecorder({
    separateArrays: true,
    callback: (res) => {
      t.comment('separateArrays === true');

      res.time.forEach((time, index) => {
        t.equal(frames[index].time, time);
      });

      res.data.forEach((datum, index) => {
        t.looseEqual(frames[index].data, datum);
      });
    }
  });

  const frames = [
    {
      time: 0,
      data: [0, 1],
    },
    {
      time: 0,
      data: [0, 1],
    },
  ];

  eventIn.connect(recorder1);
  eventIn.connect(recorder2);
  eventIn.init().then(() => {
    eventIn.start();

    t.throws(() => recorder1.retrieve(), 'should throw if retrieve called before start');

    // start recording
    recorder1.start();
    recorder2.start();

    eventIn.processFrame(frames[0]);
    eventIn.processFrame(frames[1]);

    recorder1.stop();
    recorder2.stop();

    t.end();
  });
});

