import * as controllers from 'basic-controllers';
import * as lfo from 'waves-lfo/client';
import * as loaders from 'waves-loaders';

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

  const biquad = new lfo.operator.Biquad({
    type: 'bandpass',
    f0: 2000,
    gain: 0,
    q: 12,
  });

  const spectrumDisplay = new lfo.sink.SpectrumDisplay({
    canvas: '#spectrum',
  });

  audioInNode.connect(biquad);
  biquad.connect(spectrumDisplay);

  audioInNode.start();
}
