import * as lfo from 'waves-lfo';
import * as controllers from 'waves-basic-controllers';
import * as loaders from 'waves-loaders';

const AudioContext = (window.AudioContext || window.webkitAudioContext);
const audioContext = new AudioContext();

const loader = new loaders.AudioBufferLoader();
loader
  .load('./assets/dirac-1-sample-impulse-44.1hkz-1sec.wav')
  .then(init)
  .catch((err) => console.error(err.stack));

// navigator.mediaDevices
//   .getUserMedia({ audio: true })
//   .then(init)
//   .catch((err) => console.error(err.stack));

function init(buffer) {
  // const source = audioContext.createMediaStreamSource(stream);
  console.log(audioContext.sampleRate);

  const audioInBuffer = new lfo.source.AudioInBuffer({
    audioBuffer: buffer,
  });

  const biquad = new lfo.operator.Biquad({
    type: 'lowpass',
    f0: 1000,
    gain: 6,
    q: 1,
  });

  const signalRecorder = new lfo.sink.SignalRecorder({
    ignoreLeadingZeros: false,
    retrieveAudioBuffer: false,
    audioContext: audioContext,
    duration: 1,
  });

  audioInBuffer.connect(biquad);
  biquad.connect(signalRecorder)
  // biquad.connect(spectrumDisplay);
  signalRecorder.retrieve().then((data) => {
    console.log(data)
    console.log(data.length);

    const extract = data.slice(22049, 22060);
    console.log(extract)
  });

  signalRecorder.start();
  audioInBuffer.start();
}


// a0 = 0.004730417412927451
// a1 = 0.009460834825854901
// a2 = 0.004730417412927451
// b1 = -1.8484969161333196
// b2 = 0.8674185857850294

// b0 = 0.02838250447756471
// b1 = 0.05676500895512942
// b2 = 0.02838250447756471
// a1 = -1.8484969161333196
// a2 = 0.8674185857850294
