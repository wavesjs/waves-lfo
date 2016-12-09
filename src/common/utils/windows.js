
// shortcuts / helpers
const PI   = Math.PI;
const cos  = Math.cos;
const sin  = Math.sin;
const sqrt = Math.sqrt;

// window creation functions
function initHannWindow(buffer, size, normCoefs) {
  let linSum = 0;
  let powSum = 0;
  const step = 2 * PI / size;

  for (let i = 0; i < size; i++) {
    const phi = i * step;
    const value = 0.5 - 0.5 * cos(phi);

    buffer[i] = value;

    linSum += value;
    powSum += value * value;
  }

  normCoefs.linear = size / linSum;
  normCoefs.power = sqrt(size / powSum);
}

function initHammingWindow(buffer, size, normCoefs) {
  let linSum = 0;
  let powSum = 0;
  const step = 2 * PI / size;

  for (let i = 0; i < size; i++) {
    const phi = i * step;
    const value = 0.54 - 0.46 * cos(phi);

    buffer[i] = value;

    linSum += value;
    powSum += value * value;
  }

  normCoefs.linear = size / linSum;
  normCoefs.power = sqrt(size / powSum);
}

function initBlackmanWindow(buffer, size, normCoefs) {
  let linSum = 0;
  let powSum = 0;
  const step = 2 * PI / size;

  for (let i = 0; i < size; i++) {
    const phi = i * step;
    const value = 0.42 - 0.5 * cos(phi) + 0.08 * cos(2 * phi);

    buffer[i] = value;

    linSum += value;
    powSum += value * value;
  }

  normCoefs.linear = size / linSum;
  normCoefs.power = sqrt(size / powSum);
}

function initBlackmanHarrisWindow(buffer, size, normCoefs) {
  let linSum = 0;
  let powSum = 0;
  const a0 = 0.35875;
  const a1 = 0.48829;
  const a2 = 0.14128;
  const a3 = 0.01168;
  const step = 2 * PI / size;

  for (let i = 0; i < size; i++) {
    const phi = i * step;
    const value = a0 - a1 * cos(phi) + a2 * cos(2 * phi); - a3 * cos(3 * phi);

    buffer[i] = value;

    linSum += value;
    powSum += value * value;
  }

  normCoefs.linear = size / linSum;
  normCoefs.power = sqrt(size / powSum);
}

function initSineWindow(buffer, size, normCoefs) {
  let linSum = 0;
  let powSum = 0;
  const step = PI / size;

  for (let i = 0; i < size; i++) {
    const phi = i * step;
    const value = sin(phi);

    buffer[i] = value;

    linSum += value;
    powSum += value * value;
  }

  normCoefs.linear = size / linSum;
  normCoefs.power = sqrt(size / powSum);
}

function initRectangleWindow(buffer, size, normCoefs) {
  for (let i = 0; i < size; i++)
    buffer[i] = 1;

  // @todo - check if these are proper values
  normCoefs.linear = 1;
  normCoefs.power = 1;
}

/**
 * Create a buffer with window signal.
 *
 * @memberof module:common.utils
 *
 * @param {String} name - Name of the window.
 * @param {Float32Array} buffer - Buffer to be populated with the window signal.
 * @param {Number} size - Size of the buffer.
 * @param {Object} normCoefs - Object to be populated with the normailzation
 *  coefficients.
 */
function initWindow(name, buffer, size, normCoefs) {
  name = name.toLowerCase();

  switch (name) {
    case 'hann':
    case 'hanning':
      initHannWindow(buffer, size, normCoefs);
      break;
    case 'hamming':
      initHammingWindow(buffer, size, normCoefs);
      break;
    case 'blackman':
      initBlackmanWindow(buffer, size, normCoefs);
      break;
    case 'blackmanharris':
      initBlackmanHarrisWindow(buffer, size, normCoefs);
      break;
    case 'sine':
      initSineWindow(buffer, size, normCoefs);
      break;
    case 'rectangle':
      initRectangleWindow(buffer, size, normCoefs);
      break;
  }
}

export default initWindow;


