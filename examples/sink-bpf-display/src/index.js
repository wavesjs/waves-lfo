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
let index = 0;
const dt = 0.1;

(function generateData() {
  eventIn.process(time, [Math.random() * 2 - 1, Math.random() * 2 - 1]);
  time += dt;

  setTimeout(generateData, dt * 1000);
}());

const controls = controllers.create('#controllers', [{
  id: 'radius',
  label: 'radius',
  type: 'slider',
  min: 0,
  max: 10,
  step: 1,
  default: 0,
  size: 'default',
}, {
  id: 'line',
  label: 'line',
  type: 'toggle',
  active: true,
}, {
  id: 'min',
  label: 'min',
  type: 'slider',
  min: -10,
  max: 0,
  step: 0.01,
  default: -1,
  size: 'default',
}, {
  id: 'max',
  label: 'max',
  type: 'slider',
  min: 0,
  max: 10,
  step: 0.01,
  default: 1,
  size: 'default',
}, {
  id: 'duration',
  label: 'duration',
  type: 'slider',
  min: 1,
  max: 20,
  step: 0.1,
  default: 3,
  size: 'default',
}, {
  id: 'width',
  label: 'width',
  type: 'slider',
  min: 300,
  max: 400,
  step: 1,
  default: 300,
  size: 'default',
}, {
  id: 'height',
  label: 'height',
  type: 'slider',
  min: 150,
  max: 200,
  step: 1,
  default: 150,
  size: 'default',
}]);

controls.addListener((id, value) => bpf.params.set(id, value));
