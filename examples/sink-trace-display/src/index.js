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
    sourceNode: source,
    audioContext: audioContext,
  });

  const meanStddev = new lfo.operator.MeanStddev();

  const traceDisplay = new lfo.sink.TraceDisplay({
    canvas: '#trace',
  });

  const logger = new lfo.sink.Logger({ data: true });

  audioInNode.connect(meanStddev);
  meanStddev.connect(traceDisplay);

  new controllers.Buttons('', ['start', 'stop'], '#controllers', (value) => {
    if (value === 'start')
      audioInNode.start();
    else
      audioInNode.stop();
  });

  new controllers.Slider('min', -10, 0, 0.01, -1, '', 'default', '#controllers', (value) => {
    signalDisplay.params.set('min', value);
  });

  new controllers.Slider('max', 0, 10, 0.01, 1, '', 'default', '#controllers', (value) => {
    signalDisplay.params.set('max', value);
  });

  new controllers.Slider('duration', 1, 10, 0.1, 4, '', 'default', '#controllers', (value) => {
    signalDisplay.params.set('duration', value);
  });

  new controllers.Slider('width', 300, 400, 1, 300, '', 'default', '#controllers', (value) => {
    signalDisplay.params.set('width', value);
  });

  new controllers.Slider('height', 150, 200, 1, 150, '', 'default', '#controllers', (value) => {
    signalDisplay.params.set('height', value);
  });
}
