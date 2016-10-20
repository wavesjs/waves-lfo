import * as lfo from 'waves-lfo/client';
import * as controllers from 'waves-basic-controllers';

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


new controllers.Slider('radius', 0, 10, 1, 0, '', 'default', '#controllers', (value) => {
  bpf.params.set('radius', value);
});

new controllers.Toggle('line', true, '#controllers', (value) => {
  bpf.params.set('line', value);
});

new controllers.Slider('min', -10, 0, 0.01, -1, '', 'default', '#controllers', (value) => {
  bpf.params.set('min', value);
});

new controllers.Slider('max', 0, 10, 0.01, 1, '', 'default', '#controllers', (value) => {
  bpf.params.set('max', value);
});

new controllers.Slider('duration', 1, 20, 0.1, 3, '', 'default', '#controllers', (value) => {
  bpf.params.set('duration', value);
});

new controllers.Slider('width', 300, 400, 1, 300, '', 'default', '#controllers', (value) => {
  bpf.params.set('width', value);
});

new controllers.Slider('height', 150, 200, 1, 150, '', 'default', '#controllers', (value) => {
  bpf.params.set('height', value);
});
