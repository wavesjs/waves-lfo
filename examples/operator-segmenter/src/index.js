import * as lfo from 'waves-lfo/client';

const AudioContext = (window.AudioContext || window.webkitAudioContext);
const audioContext = new AudioContext();

const frameSize = Math.floor(0.020 * audioContext.sampleRate);
const hopSize = Math.floor(0.005 * audioContext.sampleRate);

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
    frameSize: frameSize,
    hopSize: hopSize,
    centeredTimeTags: true
  });

  const power = new lfo.operator.Rms({
    power: true,
  });

  const segmenter = new lfo.operator.Segmenter({
    logInput: true,
    filterOrder: 5,
    threshold: 4,
    offThreshold: -Infinity,
    minInter: 0.100,
    maxDuration: 0.020,
  });

  const waveformDisplay = new lfo.sink.WaveformDisplay({
    canvas: '#waveform',
  });

  const markerDisplay = new lfo.sink.MarkerDisplay({
    canvas: '#markers',
  });

  new lfo.utils.DisplaySync(waveformDisplay, markerDisplay);

  audioInNode.connect(slicer);
  audioInNode.connect(waveformDisplay);
  slicer.connect(power);
  power.connect(segmenter);
  segmenter.connect(markerDisplay);

  audioInNode.start();
}
