import * as lfo from 'waves-lfo/client';
import * as loaders from 'waves-loaders';

// const size = 300;
// const $canvas = document.querySelector('#canvas');
// const ctx = $canvas.getContext('2d');
// ctx.canvas.width = size;
// ctx.canvas.height = size;

// const delta = new lfo.operator.Delta({ size: 100 });
// delta.processStreamParams({
//   frameSize: 1,
//   frameRate: 100,
// });

// const dots = [];

// const slope = 0.3;
// const offset = 0.4;

// for (let i = 0; i < 99; i++) {
//   const x = i / 100;
//   const noise = (Math.random() * 2 - 1) / 20
//   const y = slope * x + offset + noise;
//   delta.inputVector([y]);
//   dots.push([x, y]);
// }

// const res = delta.inputVector([1]);
// dots.push([1, 1]);

// console.log(res);



// function draw(dots, slope) {
//   ctx.clearRect(0, 0, size, size);

//   console.log(dots);

//   for (let i = 0; i < dots.length; i++) {
//     const dot = dots[i];
//     ctx.beginPath();
//     ctx.fillStyle = '#454545';
//     ctx.arc(dot[0] * size, size - dot[1] * size, 1, 0, Math.PI * 2, false);
//     ctx.fill();
//     // [1, 1] => [size, size];

//     ctx.closePath();
//   }

//   // draw slope
//   ctx.beginPath();
//   const x0 = 0;
//   const y0 = slope * x0;
//   const x1 = 1;
//   const y1 = slope * x1;

//   ctx.strokeStyle = 'red';
//   ctx.moveTo(x0 * size, size - y0 * size);
//   ctx.lineTo(x1 * size, size - y1 * size);
//   ctx.stroke();
//   ctx.closePath();
// }

// draw(dots, res);

const loader = new loaders.AudioBufferLoader();
loader.load('assets/sine-1hz-1sec.wav')
  .then(init)
  .catch(err => console.error(err.stack));

function init(buffer) {

  const audioInBuffer = new lfo.source.AudioInBuffer({
    audioBuffer: buffer,
    // async: true,
  });

  const bufferDisplay = new lfo.sink.SignalDisplay({
    canvas: '#buffer',
    duration: 1,
    min: -1,
    max: 1,
    width: 400,
    height: 200,
  });

  const slicer = new lfo.operator.Slicer({
    frameSize: 1,
  });

  const delta = new lfo.operator.Delta({
    size: 5,
    // useFrameRate: 1,
  });

  const aggregator = new lfo.operator.Slicer({
    frameSize: 512,
  });

  const scaler = new lfo.operator.Scaler({
    // factor: [44100 / (2 * Math.PI)],
    factor: [1 / (2 * Math.PI)],
  });

  const deltaDisplay = new lfo.sink.SignalDisplay({
    canvas: '#delta',
    duration: 1,
    min: -1,
    max: 1,
    width: 400,
    height: 200,
  })

  const logger = new lfo.sink.Logger({ time: true });

  audioInBuffer.connect(bufferDisplay);
  audioInBuffer.connect(slicer);
  slicer.connect(delta);
  delta.connect(aggregator);
  aggregator.connect(scaler);
  scaler.connect(deltaDisplay);

  audioInBuffer.init().then(() => {
    audioInBuffer.start();
    console.log(slicer.streamParams);
  });

}

