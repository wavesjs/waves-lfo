// import EventIn from '../src/sources/EventIn';
// import Logger from '../src/sinks/Logger';

// const eventIn = new EventIn({
//   frameType: 'scalar',
// });

// const logger = new Logger({
//   streamParams: true,
//   frameTime: true,
//   frameData: true,
// });

// eventIn.connect(logger);
// eventIn.start();

// let time = 0;

// (function loop() {
//   eventIn.processFrame(time, Math.random());
//   time += 1;

//   setTimeout(loop, 1000);
// }());

// import getMelBandWeights from '../src/utils/melBands';

// // console.time('test');
// const coefs = getMelBandWeights(513, 4, 44100, 0, 22050);
// // console.timeEnd('test');

// console.log(JSON.stringify(coefs));

import DCT from '../src/operator/DCT';


const N = 512;
const signal = new Float32Array(N);
const f = 2;

for (let i = 0; i < N; i++) {
  signal[i] = Math.cos(2 * Math.PI * f * (i / N))
}

// console.log(signal);
const dct = new DCT();
dct.processStreamParams({ frameSize: N });
dct.resetStream();

const res = dct.inputSignal(signal);
console.log(res);

// Float32Array {
//   '0': -8.968952869281566e-8,
//   '1': 0.0833304151892662,
//   '2': 15.999690055847168,
//   '3': -0.04999657720327377,
//   '4': 1.9034401077533403e-7,
//   '5': -0.011904423125088215,
//   '6': 3.0627083447143377e-7,
//   '7': -0.00555430818349123,
//   '8': 8.867655942879082e-9,
//   '9': -0.003246566280722618,
//   '10': -7.465692419827974e-7,
//   '11': -0.0021364567801356316 }
