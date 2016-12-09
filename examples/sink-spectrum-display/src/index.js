import * as lfo from 'waves-lfo/client';
import * as controllers from 'basic-controllers';

const AudioContext = (window.AudioContext || window.webkitAudioContext);
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

  const source = audioContext.createMediaStreamSource(stream);

  const audioInNode = new lfo.source.AudioInNode({
    audioContext: audioContext,
    sourceNode: source,
  });

  const spectrumDisplay = new lfo.sink.SpectrumDisplay({
    canvas: '#spectrum',
  });

  audioInNode.connect(spectrumDisplay);
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
    label: 'width',
    min: 300,
    max: 400,
    step: 1,
    default: 300,
    size: 'default',
    container: '#controllers',
    callback: (value) => spectrumDisplay.params.set('width', value),
  });

  new controllers.Slider({
    label: 'height',
    min: 150,
    max: 200,
    step: 1,
    default: 150,
    size: 'default',
    container: '#controllers',
    callback: (value) => spectrumDisplay.params.set('height', value),
  });
}
