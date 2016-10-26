import * as lfo from 'waves-lfo/client';
import * as controllers from 'waves-basic-controllers';

const AudioContext = (window.AudioContext ||  window.webkitAudioContext);
const audioContext = new AudioContext();

navigator.mediaDevices
  .getUserMedia({ audio: true })
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

  new controllers.Buttons('', ['start', 'stop'], '#controllers', (value) => {
    if (value === 'start')
      audioInNode.start();
    else
      audioInNode.stop();
  });

  new controllers.Toggle('rms', true, '#controllers', (value) => {
    waveformDisplay.params.set('rms', value);
  });

  new controllers.Slider('min', -10, 0, 0.01, -1, '', 'default', '#controllers', (value) => {
    waveformDisplay.params.set('min', value);
  });

  new controllers.Slider('max', 0, 10, 0.01, 1, '', 'default', '#controllers', (value) => {
    waveformDisplay.params.set('max', value);
  });

  new controllers.Slider('duration', 1, 10, 0.1, 4, '', 'default', '#controllers', (value) => {
    waveformDisplay.params.set('duration', value);
  });

  new controllers.Slider('width', 300, 400, 1, 300, '', 'default', '#controllers', (value) => {
    waveformDisplay.params.set('width', value);
  });

  new controllers.Slider('height', 150, 200, 1, 150, '', 'default', '#controllers', (value) => {
    waveformDisplay.params.set('height', value);
  });
}
