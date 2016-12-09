import * as lfo from 'waves-lfo/client';
import * as controllers from 'basic-controllers';

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

eventIn.start();

new controllers.TriggerButtons({
  label: '',
  options: ['start', 'stop'],
  container: '#controllers',
  callback: (value) => {
    if (value === 'start')
      eventIn.start();
    else
      eventIn.stop();
  }
});

new controllers.Slider({
  label: 'freq',
  min: 1,
  max: 10,
  step: 0.01,
  default: 1,
  unit: 'Hz',
  size: 'default',
  container: '#controllers',
  callback: (value) => generator.frequency(value),
});

new controllers.Slider({
  label: 'min',
  min: -10,
  max: 0,
  step: 0.01,
  default: -1,
  unit: '',
  size:'default',
  container: '#controllers',
  callback: (value) => signalDisplay.params.set('min', value),
});

new controllers.Slider({
  label: 'max',
  min: 0,
  max: 10,
  step: 0.01,
  default: 1,
  unit: '',
  size:'default',
  container: '#controllers',
  callback: (value) => signalDisplay.params.set('max', value),
});

new controllers.Slider({
  label: 'duration',
  min: 1,
  max: 20,
  step: 0.1,
  default: 1,
  unit: '',
  size:'default',
  container: '#controllers',
  callback: (value) => signalDisplay.params.set('duration', value),
});

new controllers.Slider({
  label: 'width',
  min: 300,
  max: 400,
  step: 1,
  default: 300,
  unit: '',
  size:'default',
  container: '#controllers',
  callback: (value) => signalDisplay.params.set('width', value),
});

new controllers.Slider({
  label: 'height',
  min: 150,
  max: 200,
  step: 1,
  default: 150,
  unit: '',
  size:'default',
  container: '#controllers',
  callback: (value) => signalDisplay.params.set('height', value),
});

