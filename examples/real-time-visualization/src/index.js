import * as lfo from 'waves-lfo/client';

const AudioContext = (window.AudioContext || window.webkitAudioContext);
const audioContext = new AudioContext();

// dot drawing
const $dot = document.querySelector('#dot');
const dotCtx = $dot.getContext('2d');
const size = 40;
let active = false;
let numFrameActive = 0;
dotCtx.canvas.width = size;
dotCtx.canvas.height = size;
dotCtx.canvas.style.width = `${size}px`;
dotCtx.canvas.style.height = `${size}px`;

function render() {
  if (active) {
    console.log(active);
    numFrameActive += 1;
  }

  if (numFrameActive > 3) {
    numFrameActive = 0;
    active = false;
  }

  dotCtx.clearRect(0, 0, size, size);

  dotCtx.save();
  dotCtx.translate(size / 2, size / 2);

  if (active) {
    dotCtx.beginPath();
    dotCtx.fillStyle = 'red';
    dotCtx.arc(0, 0, size / 2 - 3, 0, Math.PI * 2, false);
    dotCtx.closePath();
    dotCtx.fill();
  }

  dotCtx.beginPath();
  dotCtx.strokeStyle = '#cdcdcd';
  dotCtx.lineWidth = 4;
  dotCtx.arc(0, 0, size / 2 - 3, 0, Math.PI * 2, false);
  dotCtx.closePath();
  dotCtx.stroke();

  dotCtx.restore();
}

navigator.mediaDevices
  .getUserMedia({ audio: true })
  .then(init)
  .catch((err) => console.error(err.stack));

function init(stream) {
  const source = audioContext.createMediaStreamSource(stream);

  const frameSize = Math.floor(0.020 * audioContext.sampleRate);
  const hopSize = Math.floor(0.005 * audioContext.sampleRate);

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

  const waveformDisplay = new lfo.sink.WaveformDisplay({
    canvas: '#waveform',
  });

  const markerDisplay = new lfo.sink.MarkerDisplay({
    canvas: '#markers',
  });

  const bridge = new lfo.sink.Bridge({
    processFrame: () => active = true,
  });

  const vuMeter = new lfo.sink.VuMeterDisplay({
    canvas: '#vu-meter',
    width: 10,
    height: 152,
  });

  new lfo.utils.DisplaySync(waveformDisplay, markerDisplay);

  audioInNode.connect(slicer);
  audioInNode.connect(waveformDisplay);
  audioInNode.connect(vuMeter);
  slicer.connect(power);
  power.connect(segmenter);
  segmenter.connect(markerDisplay);
  segmenter.connect(bridge);

  audioInNode.start();

  function loop() {
    requestAnimationFrame(loop);
    render();
  }

  requestAnimationFrame(loop);
}
