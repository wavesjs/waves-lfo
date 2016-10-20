import * as lfo from 'waves-lfo/client';
import * as controllers from 'waves-basic-controllers';

// @example-documentation
// const eventIn = new lfo.source.EventIn({
//   frameType: 'signal',
//   sampleRate: 8,
//   frameSize: 4,
// });

// const signalDisplay = new lfo.sink.SignalDisplay({
//   color: 'red',
//   canvas: '#signal',
//   duration: 1,
// });

// eventIn.connect(signalDisplay);
// eventIn.start();

// // should draw a triangle signal
// eventIn.process(0, [0, 0.5, 1, 0.5]);
// eventIn.process(0.5, [0, -0.5, -1, -0.5]);

function sineGenerator(frequency, sampleRate, blockSize, callback, nbrBlocks = Infinity) {
  const self = {};

  const block = new Float32Array(blockSize);
  const tIncr = frameSize / sampleRate;
  const _2PI = 2 * Math.PI;

  let pIncr = frequency / sampleRate;
  let phase = 0;
  let timeoutId = null;
  let time = 0;
  let counter = 0;

  self.frequency = (frequency) => {
    // mult = _2PI * frequency;
    pIncr = frequency / sampleRate;
  }

  self.start = () => {
    (function createBlock() {
      for (let i = 0; i < blockSize; i++) {
        const value = Math.sin(phase * _2PI);
        block[i] = value;
        phase = (phase + pIncr) % 1;
      }

      callback(time, block);

      time += tIncr;
      counter += 1;

      if (counter < nbrBlocks) {
        timeoutId = setTimeout(createBlock, tIncr * 1000);
        // timeoutId = setTimeout(createBlock, 2000);
      }
    }());
  }

  self.stop = () => {
    clearTimeout(timeoutId);
  }

  return self;
}


const frameSize = 100;
const sampleRate = 4000;

const eventIn = new lfo.source.EventIn({
  frameSize: frameSize,
  sampleRate: sampleRate,
  frameType: 'signal',
});

const signalDisplay = new lfo.sink.SignalDisplay({
  canvas: '#signal',
  duration: 1,
});

const logger = new lfo.sink.Logger({ time: true, data: true });

eventIn.connect(signalDisplay);

const generator = sineGenerator(1, sampleRate, frameSize, eventIn.process.bind(eventIn));
generator.start();

new controllers.Buttons('', ['start', 'stop'], '#controllers', (value) => {
  if (value === 'start')
    eventIn.start();
  else
    eventIn.stop();
});

new controllers.Slider('freq', 1, 10, 0.01, 1, 'Hz', 'default', '#controllers', (value) => {
  generator.frequency(value);
});

new controllers.Slider('min', -10, 0, 0.01, -1, '', 'default', '#controllers', (value) => {
  signalDisplay.params.set('min', value);
});

new controllers.Slider('max', 0, 10, 0.01, 1, '', 'default', '#controllers', (value) => {
  signalDisplay.params.set('max', value);
});

new controllers.Slider('duration', 1, 20, 0.1, 1, '', 'default', '#controllers', (value) => {
  signalDisplay.params.set('duration', value);
});

new controllers.Slider('width', 300, 400, 1, 300, '', 'default', '#controllers', (value) => {
  signalDisplay.params.set('width', value);
});

new controllers.Slider('height', 150, 200, 1, 150, '', 'default', '#controllers', (value) => {
  signalDisplay.params.set('height', value);
});

