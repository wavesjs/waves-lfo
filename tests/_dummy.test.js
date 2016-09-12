const length = 1e6;
const buf = new Float32Array(length);
const arr = [];
let err = 0;

let max = 0;
let min = +Infinity;

for (let i = 0; i < length; i++) {
  const value = Math.random();
  buf[i] = value;
  arr[i] = value;

  const val = buf[i];

  const diff = arr[i] - buf[i];

  const abs = Math.abs(diff);
  if (abs > max) max = abs;
  if (abs < min) min = abs;

  err += diff;
}

err /= length;

console.log('mean error', err);
console.log('min error', min);
console.log('max error', max);
