import * as lfo from 'waves-lfo';
// import * as controllers from 'waves-basic-controllers';
import * as loaders from 'waves-loaders';

// import * as lfo from 'waves-lfo';

// const eventIn = new lfo.source.EventIn({
//   frameType: 'signal',
//   frameSize: 10,
//   sampleRate: 2,
// });

// const slicer = new lfo.operator.Slicer({
//   frameSize: 4,
//   hopSize: 2
// });

// const logger = new lfo.sink.Logger({ time: true, data: true });

// eventIn.connect(slicer);
// slicer.connect(logger);
// eventIn.start();

// eventIn.process(0, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
// // > { time: 0, data: [0, 1, 2, 3] }
// // > { time: 1, data: [2, 3, 4, 5] }
// // > { time: 2, data: [4, 5, 6, 7] }
// // > { time: 3, data: [6, 7, 8, 9] }

const loader = new loaders.AudioBufferLoader();

loader
  .load('./assets/1s-noise-1s-silence.wav')
  .then(init)
  .catch((err) => console.error(err.stack));

function init(audioBuffer) {

  const audioInBuffer = new lfo.source.AudioInBuffer({
    audioBuffer: audioBuffer,
    frameSize: 512,
  });

  const waveformDisplay = new lfo.sink.WaveformDisplay({
    canvas: '#waveform',
    duration: 2.5,
    color: 'steelblue',
    rms: true,
    width: 400,
    height: 200,
  });

  const eventIn = new lfo.source.EventIn({
    frameSize: 1,
    frameType: 'scalar',
    sampleRate: 1,
  });

  const markerDisplay = new lfo.sink.MarkerDisplay({
    canvas: '#marker',
    duration: 2.5,
    color: 'red',
    width: 400,
    height: 200,
  });


  const displaySync = new lfo.utils.DisplaySync(waveformDisplay, markerDisplay);

  audioInBuffer.connect(waveformDisplay);
  eventIn.connect(markerDisplay);

  audioInBuffer.start();
  eventIn.start();
  eventIn.process(0, 0);
  // eventIn.process(1, 0);

  setTimeout(() => eventIn.process(1, 0), 500);

};

