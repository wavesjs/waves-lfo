import * as lfo from 'waves-lfo/client';
import * as controllers from 'waves-basic-controllers';
import * as loaders from 'waves-loaders';

const AudioContext = (window.AudioContext || window.webkitAudioContext);
const audioContext = new AudioContext();

// const loader = new loaders.AudioBufferLoader();
// loader
//   .load('./assets/dirac-1-sample-impulse-44.1hkz-1sec.wav')
//   .then(init)
//   .catch((err) => console.error(err.stack));

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
