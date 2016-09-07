## Notes on floating point errors

some tests (cf moving-median) do hardcore clipping to test values, after convertion to 32bits, this leads to a fake impression of incorrectness when casting values.

```
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
```

The following test code outputs stats like:

> mean error - -2.1322863176465033e-11
> min error  - 0
> max error  - 2.9802322387695312e-8 
