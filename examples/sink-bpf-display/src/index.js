import * as lfo from 'waves-lfo/client';
import * as controllers from 'basic-controllers';

const eventIn = new lfo.source.EventIn({
  frameSize: 2,
  frameRate: 0.1,
  frameType: 'vector'
});

const bpf = new lfo.sink.BpfDisplay({
  canvas: '#bpf',
  duration: 3,
});

eventIn.connect(bpf);
eventIn.start();

let time = 0;
const dt = 0.1;
let index = 0;

(function generateData() {
  eventIn.process(time, [Math.random() * 2 - 1, Math.random() * 2 - 1]);
  time += dt;

  setTimeout(generateData, dt * 1000);
}());


new controllers.Slider({
  label: 'radius',
  min: 0,
  max: 10,
  step: 1,
  default: 0,
  size: 'default',
  container: '#controllers',
  callback: (value) => bpf.params.set('radius', value),
});

new controllers.Toggle({
  label: 'line',
  active: true,
  container: '#controllers',
  callback: (value) => bpf.params.set('line', value),
});

new controllers.Slider({
  label: 'min',
  min: -10,
  max: 0,
  step: 0.01,
  default: -1,
  size: 'default',
  container: '#controllers',
  callback: (value) => bpf.params.set('min', value),
});

new controllers.Slider({
  label: 'max',
  min: 0,
  max: 10,
  step: 0.01,
  default: 1,
  size: 'default',
  container: '#controllers',
  callback: (value) => bpf.params.set('max', value),
});

new controllers.Slider({
  label: 'duration',
  min: 1,
  max: 20,
  step: 0.1,
  default: 3,
  size: 'default',
  container: '#controllers',
  callback: (value) => bpf.params.set('duration', value),
});

new controllers.Slider({
  label: 'width',
  min: 300,
  max: 400,
  step: 1,
  default: 300,
  size: 'default',
  container: '#controllers',
  callback: (value) => bpf.params.set('width', value),
});

new controllers.Slider({
  label: 'height',
  min: 150,
  max: 200,
  step: 1,
  default: 150,
  size: 'default',
  container: '#controllers',
  callback: (value) => bpf.params.set('height', value),
});
