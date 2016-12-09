import * as lfo from 'waves-lfo/client';
import * as controllers from 'basic-controllers';

const AudioContext = (window.AudioContext ||  window.webkitAudioContext);
const audioContext = new AudioContext();
let audioStream;

try {
  audioStream = navigator.mediaDevices.getUserMedia({ audio: true });
} catch (err) {
  const msg = `This navigator doesn't support getUserMedia or implement a deprecated API`;
  alert(msg);
  throw new Error(msg);
}

audioStream
  .then(init)
  .catch((err) => console.error(err.stack));

function init(stream) {

  const audioIn = audioContext.createMediaStreamSource(stream);

  const audioInNode = new lfo.source.AudioInNode({
    audioContext: audioContext,
    sourceNode: audioIn,
    frameSize: 512,
  });

  const waveformDisplay = new lfo.sink.WaveformDisplay({
    canvas: '#waveform',
    duration: 4,
    rms: true,
  });

  audioInNode.connect(waveformDisplay);
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

  new controllers.Toggle({
    label: 'rms',
    active: true,
    container: '#controllers',
    callback: (value) => waveformDisplay.params.set('rms', value),
  });

  new controllers.Slider({
    label: 'min',
    min: -10,
    max: 0,
    step: 0.01,
    default: -1,
    size: 'medium',
    container: '#controllers',
    callback: (value) => waveformDisplay.params.set('min', value),
  });

  new controllers.Slider({
    label: 'max',
    min: 0,
    max: 10,
    step: 0.01,
    default: 1,
    size: 'medium',
    container: '#controllers',
    callback: (value) => waveformDisplay.params.set('max', value),
  });

  new controllers.Slider({
    label: 'duration',
    min: 1,
    max: 10,
    step: 0.1,
    default: 4,
    size: 'medium',
    container: '#controllers',
    callback: (value) => waveformDisplay.params.set('duration', value),
  });

  new controllers.Slider({
    label: 'width',
    min: 300,
    max: 400,
    step: 1,
    default: 300,
    size: 'medium',
    container: '#controllers',
    callback: (value) => waveformDisplay.params.set('width', value),
  });

  new controllers.Slider({
    label: 'height',
    min: 150,
    max: 200,
    step: 1,
    default: 150,
    size: 'medium',
    container: '#controllers',
    callback: (value) => waveformDisplay.params.set('height', value),
  });
}
