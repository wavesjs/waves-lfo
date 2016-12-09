import * as lfo from 'waves-lfo/client';
import * as controllers from 'basic-controllers';

const _2PI = Math.PI * 2;
const $scene = document.querySelector('#scene');
const ctx = $scene.getContext('2d');
const width = window.innerWidth;
const height = window.innerHeight;
const halfWidth = width * 0.5;
const halfHeight = height * 0.5;

ctx.canvas.width = width;
ctx.canvas.height = height;

const eventIn = new lfo.source.EventIn({
  frameType: 'vector',
  frameSize: 2,
  frameRate: 0,
});

const movingAverage = new lfo.operator.MovingAverage({
  order: 20,
});

const bridge = new lfo.sink.Bridge();

eventIn.connect(movingAverage);
movingAverage.connect(bridge);

eventIn.start();

// push values into graph on event
$scene.addEventListener('mousemove', (e) => {
  const now = new Date().getTime();
  const x = e.clientX - halfWidth;
  const y = e.clientY - halfHeight;

  eventIn.process(now, [x, y]);
});

let simpleDisplay = true;
// cheap resampler
const smooth = new lfo.operator.MovingAverage({ order: 10 });
smooth.initStream({ frameSize: 2, frameType: 'vector' });

// pull values from graph at `requestAnimationFrame` interval
(function draw() {
  const smoothedValues = smooth.inputVector(bridge.frame.data);
  const x = smoothedValues[0];
  const y = smoothedValues[1];
  const opacity = simpleDisplay ? 0.2 : 1;

  ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.translate(halfWidth, halfHeight);

  if (simpleDisplay)
    ctx.beginPath();

  ctx.fillStyle = 'white';
  ctx.arc(x, y, 5, 0, _2PI, true);
  ctx.fill();

  if (simpleDisplay)
    ctx.closePath();

  ctx.restore();

  requestAnimationFrame(draw);
}());

new controllers.Toggle({
  label: 'alternative display',
  default: false,
  container: '#controllers',
  callback: (value) => simpleDisplay = !value,
});



