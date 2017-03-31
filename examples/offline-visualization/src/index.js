import * as lfo from 'waves-lfo/client';
import * as ui from 'waves-ui';
import * as loaders from 'waves-loaders';

const AudioContext = (window.AudioContext || window.webkitAudioContext);
const audioContext = new AudioContext();

const loader = new loaders.AudioBufferLoader();
loader
  .load('assets/drum-loop.wav')
  .then(init)
  .catch((err) => console.error(err.stack));

function init(audioBuffer) {
  // ui
  const $track = document.querySelector('#track');
  const width = $track.getBoundingClientRect().width;
  const height = $track.getBoundingClientRect().height;
  const duration = audioBuffer.duration;
  const pixelsPerSecond = width / duration;
  const timeline = new ui.core.Timeline(pixelsPerSecond, width);

  timeline.createTrack($track, height, 'main');

  const waveformLayer = new ui.helpers.WaveformLayer(audioBuffer, { height });
  // insert the layer inside the 'main' track
  timeline.addLayer(waveformLayer, 'main');

  function displaySegments(data) {
    console.log(data);

    const markerLayer = new ui.helpers.MarkerLayer(data, {
      height: height,
      displayHandlers: false,
      color: 'red',
    }, {
      x: (d) => d.time,
    });

    // insert the layer inside the 'main' track
    timeline.addLayer(markerLayer, 'main');
  }

  // analysis
  const frameSize = Math.floor(0.020 * audioContext.sampleRate);
  const hopSize = Math.floor(0.005 * audioContext.sampleRate);

  const audioInBuffer = new lfo.source.AudioInBuffer({
    audioBuffer: audioBuffer,
    // progressCallback: (ratio) => console.log(ratio),
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
    threshold: 3,
    offThreshold: -Infinity,
    minInter: 0.100,
    maxDuration: 0.020,
  });

  const dataRecorder = new lfo.sink.DataRecorder({
    callback: displaySegments,
  });

  const logger = new lfo.sink.Logger({
    time: true,
  });

  audioInBuffer.connect(power);
  power.connect(segmenter);
  segmenter.connect(dataRecorder);
  // segmenter.connect(logger);

  audioInBuffer.start();
  dataRecorder.start();
}
