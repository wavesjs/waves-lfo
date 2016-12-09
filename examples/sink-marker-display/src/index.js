import * as lfo from 'waves-lfo/client';
import * as controllers from 'basic-controllers';

const valueController = new controllers.Text({
  label: 'frame.data[0]',
  default: '',
  readonly: true,
  container: '#controllers'
});

// Markers
const eventIn = new lfo.source.EventIn({
  frameType: 'scalar',
  frameRate: 1,
});

const markerDisplay = new lfo.sink.MarkerDisplay({
  canvas: '#marker',
  duration: 5,
});

const bridge = new lfo.sink.Bridge({
  processFrame: (frame) => valueController.value = frame.data[0],
});

eventIn.connect(markerDisplay);
eventIn.connect(bridge);
eventIn.start();

let time = 0;
const period = 1;

(function generateData() {
  eventIn.process(time, Math.random());
  time += period;

  setTimeout(generateData, period * 1000);
}());

new controllers.Slider({
  label: 'threshold',
  min: 0,
  max: 1,
  step: 0.001,
  default: 0,
  size: 'default',
  container: '#controllers',
  callback: (value) => markerDisplay.params.set('threshold', value),
});

new controllers.Slider({
  label: 'duration',
  min: 1,
  max: 20,
  step: 0.1,
  default: 1,
  size: 'default',
  container: '#controllers',
  callback: (value) => markerDisplay.params.set('duration', value),
});

new controllers.Slider({
  label: 'width',
  min: 300,
  max: 400,
  step: 1,
  default: 300,
  size: 'default',
  container: '#controllers',
  callback: (value) => markerDisplay.params.set('width', value),
});

new controllers.Slider({
  label: 'height',
  min: 150,
  max: 200,
  step: 1,
  default: 150,
  size: 'default',
  container: '#controllers',
  callback: (value) => markerDisplay.params.set('height', value),
});
