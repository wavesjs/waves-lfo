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

  audioInNode.start();



  new controllers.TriggerButtons({
    label: '',
    options: ['start', 'stop'], container: '#controllers',
    callback: (value) => {
      if (value === 'start')
        audioInNode.start();
      else
        audioInNode.stop();
    }
  });

  new controllers.Slider({
    label: 'min',
    min: -10,
    max: 0,
    default: 0.01,
    default: -1,
    size: 'default',
    container: '#controllers',
    callback: (value) => signalDisplay.params.set('min', value),
  });

  new controllers.Slider({
    label: 'max',
    min: 0,
    max: 10,
    default: 0.01,
    default: 1,
    size: 'default',
    container: '#controllers',
    callback: (value) => signalDisplay.params.set('max', value),
  });

  new controllers.Slider({
    label: 'duration',
    min: 1,
    max: 10,
    default: 0.1,
    default: 4,
    size: 'default',
    container: '#controllers',
    callback: (value) => signalDisplay.params.set('duration', value),
  });

  new controllers.Slider({
    label: 'width',
    min: 300,
    max: 400,
    default: 1,
    default: 300,
    size: 'default',
    container: '#controllers',
    callback: (value) => signalDisplay.params.set('width', value),
  });

  new controllers.Slider({
    label: 'height',
    min: 150,
    max: 200,
    default: 1,
    default: 150,
    size: 'default',
    container: '#controllers',
    callback: (value) => signalDisplay.params.set('height', value),
  });
}
