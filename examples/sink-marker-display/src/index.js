import * as lfo from 'waves-lfo/client';
import * as controllers from 'waves-basic-controllers';

const valueController = new controllers.Text('frame.data[0]', '', true, '#controllers');

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
  callback: (frame) => valueController.value = frame.data[0],
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


new controllers.Slider('threshold', 0, 1, 0.001, 0, '', 'default', '#controllers', (value) => {
  markerDisplay.params.set('threshold', value);
});

new controllers.Slider('duration', 1, 20, 0.1, 1, '', 'default', '#controllers', (value) => {
  markerDisplay.params.set('duration', value);
});

new controllers.Slider('width', 300, 400, 1, 300, '', 'default', '#controllers', (value) => {
  markerDisplay.params.set('width', value);
});

new controllers.Slider('height', 150, 200, 1, 150, '', 'default', '#controllers', (value) => {
  markerDisplay.params.set('height', value);
});
