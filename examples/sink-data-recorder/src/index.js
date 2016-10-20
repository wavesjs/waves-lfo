import * as lfo from 'waves-lfo/client';
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
  const eventIn = new lfo.source.EventIn({
    frameType: 'vector',
    frameSize: 2,
    frameRate: 0,
  });

  const recorder1 = new lfo.sink.DataRecorder({ separateArrays: false });
  const recorder2 = new lfo.sink.DataRecorder({ separateArrays: true });

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
  eventIn.start();

  // start recording
  recorder1.start();
  recorder2.start();

  eventIn.processFrame(frames[0]);
  eventIn.processFrame(frames[1]);

  recorder1.retrieve()
    .then((data) => {
      t.comment('separateArrays === false');

      data.forEach((datum, index) => {
        t.equal(frames[index].time, datum.time);
        t.looseEqual(frames[index].data, datum.data);
      });
    });

  recorder2.retrieve()
    .then((res) => {
      t.comment('separateArrays === true');

      res.time.forEach((time, index) => {
        t.equal(frames[index].time, time);
      });

      res.data.forEach((datum, index) => {
        t.looseEqual(frames[index].data, datum);
      });
    });

  recorder1.stop();
  recorder2.stop();
});

