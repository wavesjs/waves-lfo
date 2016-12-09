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

  const signalRecorder = new lfo.sink.SignalRecorder({
    duration: Infinity,
    retrieveAudioBuffer: true,
    audioContext: audioContext,
    callback: (buffer) => {
      const bufferSource = audioContext.createBufferSource();
      bufferSource.buffer = buffer;

      bufferSource.connect(audioContext.destination);
      bufferSource.start();
    }
  });

  const vuMeterDisplay = new lfo.sink.VuMeterDisplay({
    canvas: '#vu-meter',
  });

  audioInNode.connect(signalRecorder);
  audioInNode.connect(vuMeterDisplay);
  audioInNode.start();

  new controllers.TriggerButtons({
    label: '',
    options: ['record', 'stop'],
    container: '#controllers',
    callback: (value) => {
      if (value === 'record')
        signalRecorder.start();
      else
        signalRecorder.stop();
    }
  });
}
