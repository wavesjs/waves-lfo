import * as lfo from 'waves-lfo/client';
import * as ui from 'waves-ui';
import Dot from './Dot';

const AudioContext = (window.AudioContext || window.webkitAudioContext);
const audioContext = new AudioContext();

navigator.mediaDevices
  .getUserMedia({ audio: true })
  .then(init)
  .catch((err) => console.error(err.stack));

function init(stream) {
  const source = audioContext.createMediaStreamSource(stream);
  const frameSize = Math.floor(0.020 * audioContext.sampleRate);
  const hopSize = Math.floor(0.005 * audioContext.sampleRate);

  // real-time segmentation
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
    threshold: 7,
    offThreshold: -Infinity,
    minInter: 0.100,
    maxDuration: 0.020,
  });

  const dot = new Dot();
  dot.render();

  const bridge = new lfo.sink.Bridge({
    processFrame: () => dot.active = true,
  });

  const vuMeter = new lfo.sink.VuMeterDisplay({
    canvas: '#vu-meter',
    width: 10,
    height: 150,
  });

  audioInNode.connect(vuMeter);
  audioInNode.connect(slicer);
  slicer.connect(power);
  power.connect(segmenter);
  segmenter.connect(bridge);

  audioInNode.start();

  // offline segmentation
  const $track = document.querySelector('#track');
  const width = 800;
  const height = 150;
  const pixelsPerSecond = width / 3;
  const timeline = new ui.core.Timeline(pixelsPerSecond, width);

  let segmentLayer = null;

  const recorder = new lfo.sink.SignalRecorder({
    duration: 3,
    ignoreLeadingZeros: true,
    audioContext: audioContext,
    retrieveAudioBuffer: true,
    callback: analyseBuffer,
  });

  const waveformData = new Float32Array(audioContext.sampleRate * 3);
  const waveformLayer = new ui.core.Layer('entity', waveformData, {
    height: 150,
    yDomain: [-1, 1],
  });

  // waveformLayer.set
  waveformLayer.configureShape(ui.shapes.Waveform, {}, {
    sampleRate: audioContext.sampleRate,
    color: 'steelblue',
    renderingStrategy: 'svg',
  });

  timeline.createTrack($track, height, 'main');
  timeline.addLayer(waveformLayer, 'main');

  const triggerRender = new lfo.sink.Bridge({
    processFrame: () => {
      if (recorder.isRecording) {
        waveformData.set(recorder._buffer);
        waveformLayer.update();
      }
    },
  });

  audioInNode.connect(recorder);
  audioInNode.connect(triggerRender);

  const $record = document.querySelector('#record');
  $record.addEventListener('click', record);

  function record() {
    $record.setAttribute('disabled', true);

    waveformData.fill(0);

    if (segmentLayer !== null) {
      timeline.removeLayer(segmentLayer);
      segmentLayer.destroy();
    }

    recorder.start();
  }

  function analyseBuffer(audioBuffer) {
    $record.removeAttribute('disabled');

    const audioInBuffer = new lfo.source.AudioInBuffer({
      audioBuffer: audioBuffer,
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
      callback: (data) => displaySegments(audioBuffer, data),
    });

    audioInBuffer.connect(slicer);
    slicer.connect(power);
    power.connect(segmenter);
    segmenter.connect(dataRecorder);

    audioInBuffer.start();
    dataRecorder.start();
  }

  function displaySegments(audioBuffer, data) {
    segmentLayer = new ui.helpers.MarkerLayer(data, {
      height: height,
      displayHandlers: false,
      color: 'red',
    }, {
      x: (d) => d.time,
    });

    timeline.addLayer(segmentLayer, 'main');
  }
}
