import * as lfo from 'waves-lfo/client';
import * as controllers from 'waves-basic-controllers';

const AudioContext = (window.AudioContext || window.webkitAudioContext);
const audioContext = new AudioContext();

navigator.mediaDevices
  .getUserMedia({ audio: true })
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

  new controllers.Buttons('', ['start', 'stop'], '#controllers', (value) => {
    if (value === 'start')
      audioInNode.start();
    else
      audioInNode.stop();
  });

  new controllers.Slider('width', 300, 400, 1, 300, '', 'default', '#controllers', (value) => {
    spectrumDisplay.params.set('width', value);
  });

  new controllers.Slider('height', 150, 200, 1, 150, '', 'default', '#controllers', (value) => {
    spectrumDisplay.params.set('height', value);
  });
}
