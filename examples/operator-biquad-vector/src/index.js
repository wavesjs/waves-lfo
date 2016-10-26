import * as lfo from 'waves-lfo/client';

const eventIn = new lfo.source.EventIn({
  frameType: 'vector',
  frameSize: 3,
  frameRate: 20,
});

const bpfRaw = new lfo.sink.BpfDisplay({
  canvas: '#sensors-raw',
  min: -10,
  max: 10,
  duration: 10,
});


const biquad = new lfo.operator.Biquad({
  type: 'lowpass',
  f0: 0.5,
});

const bpfFiltered = new lfo.sink.BpfDisplay({
  canvas: '#sensors-filtered',
  min: -10,
  max: 10,
  duration: 10,
});

eventIn.connect(bpfRaw);
eventIn.connect(biquad);
biquad.connect(bpfFiltered);
eventIn.start();

window.addEventListener('devicemotion', (e) => {
  // console.log(e);
  const { x, y, z } = e.accelerationIncludingGravity;
  // console.log(x, y, z);
  eventIn.process(null, [x, y, z]);
}, false);
