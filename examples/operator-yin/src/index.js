import * as lfo from 'waves-lfo/client';

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

  const slicer = new lfo.operator.Slicer({
    frameSize: 2048,
    hopSize: 2048,
  });

  const yin = new lfo.operator.Yin();

  const select = new lfo.operator.Select({
    index: 0,
  });

  const bpfDisplay = new lfo.sink.BpfDisplay({
    canvas: '#yin',
    min: 0,
    max: 2000,
    duration: 10,
  });

  audioInNode.connect(slicer);
  slicer.connect(yin);
  yin.connect(select);
  select.connect(bpfDisplay);

  audioInNode.start();
}
