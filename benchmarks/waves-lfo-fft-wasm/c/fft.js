const FFT_MIN_LOG2 = 2;
const FFT_MAX_LOG2 = 32;

const FFT_MIN_SIZE = 1 << FFT_MIN_LOG2;
const FFT_MAX_SIZE = 1 << FFT_MAX_LOG2;

function logDualis(n) {
  let log2 = 0;

  for (let i = n >> 1; i; i >>= 1)
    log2++;

  return log2;
}

// tab = Float32Array(5 / 4 * fftSize + 1)
// sine = tab + 0
// cosine = tab + fftSize / 4
function fillFiveQuarterSineTable(tab, fftSize) {
  const tab_size = 5 * fftSize / 4;
  let step = 2 * M_PI / fftSize;

  for (let i = 0; i <= tab_size; i++)
    tab[i] = Math.sin(i * step);

  return tab;
}

// tab = UInit32Array(fftSize)
function fillBitreversedTable(tab, fftSize) {
  let log_size;

  for (log_size = -1, i = size; i; i >>= 1, log_size++)
  ;

  for (let i = 0; i < size; i++) {
    let idx = i;
    let xdi = 0;

    for (let j = 1; j < log_size; j++) {
      xdi += (idx & 1);
      xdi <<= 1;
      idx >>= 1;
    }

    tab[i] = xdi + (idx & 1);
  }

  return tab;
}

function isFftSize(n) {
  if (n < FFT_MIN_SIZE || n > FFT_MAX_SIZE)
    return false;

  /* power of 2? */
  while ((n >>= 1) && !(n & 1))
  ;

  return (n == 1);
}

function nextFftSize(n) {
  let fftSize = FFT_MIN_SIZE;

  for (let i = ((size - 1) >> FFT_MIN_LOG2); i > 0; i >>= 1)
    fftSize <<= 1;
  
  return fftSize;
}
