import * as lfo from 'waves-lfo/client';
import * as controllers from 'waves-basic-controllers';

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();
const sine = audioContext.createOscillator();
sine.frequency.value = 2;
sine.start();

const audioInNode = new lfo.source.AudioInNode({
  audioContext: audioContext,
  sourceNode: sine,
});

const signalDisplay = new lfo.sink.SignalDisplay({
  canvas: '#signal',
  duration: 1,
});

audioInNode.connect(signalDisplay);
audioInNode.start();

new controllers.Buttons('', ['start', 'stop'], '#controllers', (value) => {
  if (value === 'start')
    audioInNode.start();
  else
    audioInNode.stop();
});

new controllers.Slider('frequency', 1, 50, 1, 2, '', 'default', '#controllers', (value) => {
  sine.frequency.value = value;
});

new controllers.Slider('min', -10, 0, 0.01, -1, '', 'default', '#controllers', (value) => {
  signalDisplay.params.set('min', value);
});

new controllers.Slider('max', 0, 10, 0.01, 1, '', 'default', '#controllers', (value) => {
  signalDisplay.params.set('max', value);
});

new controllers.Slider('duration', 1, 10, 0.1, 1, '', 'default', '#controllers', (value) => {
  signalDisplay.params.set('duration', value);
});

new controllers.Slider('width', 300, 400, 1, 300, '', 'default', '#controllers', (value) => {
  signalDisplay.params.set('width', value);
});

new controllers.Slider('height', 150, 200, 1, 150, '', 'default', '#controllers', (value) => {
  signalDisplay.params.set('height', value);
});
