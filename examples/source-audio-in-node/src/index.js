import * as lfo from 'waves-lfo/client';
import * as controllers from 'basic-controllers';

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

new controllers.TriggerButtons({
  label: '',
  options: ['start', 'stop'],
  container: '#controllers',
  callback: (value) => {
    if (value === 'start')
      audioInNode.start();
    else
      audioInNode.stop();
  }
});

new controllers.Slider({
  label: 'frequency',
  min: 1,
  max: 50,
  step: 1,
  default: 2,
  size: 'medium',
  container: '#controllers',
  callback: (value) => sine.frequency.value = value,
});

new controllers.Slider({
  label: 'min',
  min: -10,
  max: 0,
  step: 0.01,
  default:  -1,
  size: 'medium',
  container: '#controllers',
  callback: (value) => signalDisplay.params.set('min', value),
});

new controllers.Slider({
  label: 'max',
  min: 0,
  max: 10,
  step: 0.01,
  default: 1,
  size: 'medium',
  container: '#controllers',
  callback: (value) => signalDisplay.params.set('max', value),
});

new controllers.Slider({
  label: 'duration',
  min: 1,
  max: 10,
  step: 0.1,
  default: 1,
  size: 'medium',
  container: '#controllers',
  callback: (value) => signalDisplay.params.set('duration', value),
});

new controllers.Slider({
  label: 'width',
  min: 300,
  max: 400,
  step: 1,
  default: 300,
  size: 'medium',
  container: '#controllers',
  callback: (value) => signalDisplay.params.set('width', value),
});

new controllers.Slider({
  label: 'height',
  min: 150,
  max: 200,
  step: 1,
  default: 150,
  size: 'medium',
  container: '#controllers',
  callback: (value) => signalDisplay.params.set('height', value),
});
