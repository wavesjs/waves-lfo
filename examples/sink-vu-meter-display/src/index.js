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

  const onOff = new lfo.operator.OnOff({
    state: 'on',
  });

  const vuMeter = new lfo.sink.VuMeterDisplay({
    canvas: '#vu-meter',
  });

  audioInNode.connect(onOff);
  onOff.connect(vuMeter);
  audioInNode.start();

  new controllers.TriggerButtons({
    label:'',
    options: ['start', 'stop'],
    container: '#controllers',
    callback: (value) => {
      if (value === 'start')
        onOff.setState('on');
      else
        onOff.setState('off');
    }
  });
}
