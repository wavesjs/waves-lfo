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

  const onOff = new lfo.operator.OnOff({
    state: 'on',
  });

  const vuMeter = new lfo.sink.VuMeterDisplay({
    canvas: '#vu-meter',
  });

  audioInNode.connect(onOff);
  onOff.connect(vuMeter);
  audioInNode.start();

  new controllers.Buttons('', ['start', 'stop'], '#controllers', (value) => {
    if (value === 'start')
      onOff.setState('on');
    else
      onOff.setState('off');
  });
}
