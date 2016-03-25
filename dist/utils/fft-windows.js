'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

// shortcuts / helpers
var PI = Math.PI;
var cos = Math.cos;
var sin = Math.sin;
var sqrt = Math.sqrt;

// window creation functions
function initHannWindow(buffer, size, normCoefs) {
  var linSum = 0;
  var powSum = 0;
  var step = 2 * PI / size;

  for (var i = 0; i < size; i++) {
    var phi = i * step;
    var value = 0.5 - 0.5 * cos(phi);

    buffer[i] = value;

    linSum += value;
    powSum += value * value;
  }

  normCoefs.linear = size / linSum;
  normCoefs.power = sqrt(size / powSum);
}

function initHammingWindow(buffer, size, normCoefs) {
  var linSum = 0;
  var powSum = 0;
  var step = 2 * PI / size;

  for (var i = 0; i < size; i++) {
    var phi = i * step;
    var value = 0.54 - 0.46 * cos(phi);

    buffer[i] = value;

    linSum += value;
    powSum += value * value;
  }

  normCoefs.linear = size / linSum;
  normCoefs.power = sqrt(size / powSum);
}

function initBlackmanWindow(buffer, size, normCoefs) {
  var linSum = 0;
  var powSum = 0;
  var step = 2 * PI / size;

  for (var i = 0; i < size; i++) {
    var phi = i * step;
    var value = 0.42 - 0.5 * cos(phi) + 0.08 * cos(2 * phi);

    buffer[i] = value;

    linSum += value;
    powSum += value * value;
  }

  normCoefs.linear = size / linSum;
  normCoefs.power = sqrt(size / powSum);
}

function initBlackmanHarrisWindow(buffer, size, normCoefs) {
  var linSum = 0;
  var powSum = 0;
  var a0 = 0.35875;
  var a1 = 0.48829;
  var a2 = 0.14128;
  var a3 = 0.01168;
  var step = 2 * PI / size;

  for (var i = 0; i < size; i++) {
    var phi = i * step;
    var value = a0 - a1 * cos(phi) + a2 * cos(2 * phi);-a3 * cos(3 * phi);

    buffer[i] = value;

    linSum += value;
    powSum += value * value;
  }

  normCoefs.linear = size / linSum;
  normCoefs.power = sqrt(size / powSum);
}

function initSineWindow(buffer, size, normCoefs) {
  var linSum = 0;
  var powSum = 0;
  var step = PI / size;

  for (var i = 0; i < size; i++) {
    var phi = i * step;
    var value = sin(phi);

    buffer[i] = value;

    linSum += value;
    powSum += value * value;
  }

  normCoefs.linear = size / linSum;
  normCoefs.power = sqrt(size / powSum);
}

function initRectangleWindow(buffer, size, normCoefs) {
  // @TODO normCoefs
  for (var i = 0; i < size; i++) {
    buffer[i] = 1;
  }
}

exports.default = function () {
  // @NOTE implement some caching system (is this really usefull ?)
  var cache = {};

  return function (name, buffer, size, normCoefs) {
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
  };
}();
//# sourceMappingURL=data:application/json;base64,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IC8gaGVscGVyc1xuY29uc3QgUEkgICA9IE1hdGguUEk7XG5jb25zdCBjb3MgID0gTWF0aC5jb3M7XG5jb25zdCBzaW4gID0gTWF0aC5zaW47XG5jb25zdCBzcXJ0ID0gTWF0aC5zcXJ0O1xuXG4vLyB3aW5kb3cgY3JlYXRpb24gZnVuY3Rpb25zXG5mdW5jdGlvbiBpbml0SGFubldpbmRvdyhidWZmZXIsIHNpemUsIG5vcm1Db2Vmcykge1xuICBsZXQgbGluU3VtID0gMDtcbiAgbGV0IHBvd1N1bSA9IDA7XG4gIGNvbnN0IHN0ZXAgPSAyICogUEkgLyBzaXplO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgY29uc3QgcGhpID0gaSAqIHN0ZXA7XG4gICAgY29uc3QgdmFsdWUgPSAwLjUgLSAwLjUgKiBjb3MocGhpKTtcblxuICAgIGJ1ZmZlcltpXSA9IHZhbHVlO1xuXG4gICAgbGluU3VtICs9IHZhbHVlO1xuICAgIHBvd1N1bSArPSB2YWx1ZSAqIHZhbHVlO1xuICB9XG5cbiAgbm9ybUNvZWZzLmxpbmVhciA9IHNpemUgLyBsaW5TdW07XG4gIG5vcm1Db2Vmcy5wb3dlciA9IHNxcnQoc2l6ZSAvIHBvd1N1bSk7XG59XG5cbmZ1bmN0aW9uIGluaXRIYW1taW5nV2luZG93KGJ1ZmZlciwgc2l6ZSwgbm9ybUNvZWZzKSB7XG4gIGxldCBsaW5TdW0gPSAwO1xuICBsZXQgcG93U3VtID0gMDtcbiAgY29uc3Qgc3RlcCA9IDIgKiBQSSAvIHNpemU7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICBjb25zdCBwaGkgPSBpICogc3RlcDtcbiAgICBjb25zdCB2YWx1ZSA9IDAuNTQgLSAwLjQ2ICogY29zKHBoaSk7XG5cbiAgICBidWZmZXJbaV0gPSB2YWx1ZTtcblxuICAgIGxpblN1bSArPSB2YWx1ZTtcbiAgICBwb3dTdW0gKz0gdmFsdWUgKiB2YWx1ZTtcbiAgfVxuXG4gIG5vcm1Db2Vmcy5saW5lYXIgPSBzaXplIC8gbGluU3VtO1xuICBub3JtQ29lZnMucG93ZXIgPSBzcXJ0KHNpemUgLyBwb3dTdW0pO1xufVxuXG5mdW5jdGlvbiBpbml0QmxhY2ttYW5XaW5kb3coYnVmZmVyLCBzaXplLCBub3JtQ29lZnMpIHtcbiAgbGV0IGxpblN1bSA9IDA7XG4gIGxldCBwb3dTdW0gPSAwO1xuICBjb25zdCBzdGVwID0gMiAqIFBJIC8gc2l6ZTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgIGNvbnN0IHBoaSA9IGkgKiBzdGVwO1xuICAgIGNvbnN0IHZhbHVlID0gMC40MiAtIDAuNSAqIGNvcyhwaGkpICsgMC4wOCAqIGNvcygyICogcGhpKTtcblxuICAgIGJ1ZmZlcltpXSA9IHZhbHVlO1xuXG4gICAgbGluU3VtICs9IHZhbHVlO1xuICAgIHBvd1N1bSArPSB2YWx1ZSAqIHZhbHVlO1xuICB9XG5cbiAgbm9ybUNvZWZzLmxpbmVhciA9IHNpemUgLyBsaW5TdW07XG4gIG5vcm1Db2Vmcy5wb3dlciA9IHNxcnQoc2l6ZSAvIHBvd1N1bSk7XG59XG5cbmZ1bmN0aW9uIGluaXRCbGFja21hbkhhcnJpc1dpbmRvdyhidWZmZXIsIHNpemUsIG5vcm1Db2Vmcykge1xuICBsZXQgbGluU3VtID0gMDtcbiAgbGV0IHBvd1N1bSA9IDA7XG4gIGNvbnN0IGEwID0gMC4zNTg3NTtcbiAgY29uc3QgYTEgPSAwLjQ4ODI5O1xuICBjb25zdCBhMiA9IDAuMTQxMjg7XG4gIGNvbnN0IGEzID0gMC4wMTE2ODtcbiAgY29uc3Qgc3RlcCA9IDIgKiBQSSAvIHNpemU7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICBjb25zdCBwaGkgPSBpICogc3RlcDtcbiAgICBjb25zdCB2YWx1ZSA9IGEwIC0gYTEgKiBjb3MocGhpKSArIGEyICogY29zKDIgKiBwaGkpOyAtIGEzICogY29zKDMgKiBwaGkpO1xuXG4gICAgYnVmZmVyW2ldID0gdmFsdWU7XG5cbiAgICBsaW5TdW0gKz0gdmFsdWU7XG4gICAgcG93U3VtICs9IHZhbHVlICogdmFsdWU7XG4gIH1cblxuICBub3JtQ29lZnMubGluZWFyID0gc2l6ZSAvIGxpblN1bTtcbiAgbm9ybUNvZWZzLnBvd2VyID0gc3FydChzaXplIC8gcG93U3VtKTtcbn1cblxuZnVuY3Rpb24gaW5pdFNpbmVXaW5kb3coYnVmZmVyLCBzaXplLCBub3JtQ29lZnMpIHtcbiAgbGV0IGxpblN1bSA9IDA7XG4gIGxldCBwb3dTdW0gPSAwO1xuICBjb25zdCBzdGVwID0gUEkgLyBzaXplO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgY29uc3QgcGhpID0gaSAqIHN0ZXA7XG4gICAgY29uc3QgdmFsdWUgPSBzaW4ocGhpKTtcblxuICAgIGJ1ZmZlcltpXSA9IHZhbHVlO1xuXG4gICAgbGluU3VtICs9IHZhbHVlO1xuICAgIHBvd1N1bSArPSB2YWx1ZSAqIHZhbHVlO1xuICB9XG5cbiAgbm9ybUNvZWZzLmxpbmVhciA9IHNpemUgLyBsaW5TdW07XG4gIG5vcm1Db2Vmcy5wb3dlciA9IHNxcnQoc2l6ZSAvIHBvd1N1bSk7XG59XG5cbmZ1bmN0aW9uIGluaXRSZWN0YW5nbGVXaW5kb3coYnVmZmVyLCBzaXplLCBub3JtQ29lZnMpIHtcbiAgLy8gQFRPRE8gbm9ybUNvZWZzXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgYnVmZmVyW2ldID0gMTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCAoZnVuY3Rpb24oKSB7XG4gIC8vIEBOT1RFIGltcGxlbWVudCBzb21lIGNhY2hpbmcgc3lzdGVtIChpcyB0aGlzIHJlYWxseSB1c2VmdWxsID8pXG4gIGNvbnN0IGNhY2hlID0ge307XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKG5hbWUsIGJ1ZmZlciwgc2l6ZSwgbm9ybUNvZWZzKSB7XG4gICAgbmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKTtcblxuICAgIHN3aXRjaCAobmFtZSkge1xuICAgICAgY2FzZSAnaGFubic6XG4gICAgICBjYXNlICdoYW5uaW5nJzpcbiAgICAgICAgaW5pdEhhbm5XaW5kb3coYnVmZmVyLCBzaXplLCBub3JtQ29lZnMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2hhbW1pbmcnOlxuICAgICAgICBpbml0SGFtbWluZ1dpbmRvdyhidWZmZXIsIHNpemUsIG5vcm1Db2Vmcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYmxhY2ttYW4nOlxuICAgICAgICBpbml0QmxhY2ttYW5XaW5kb3coYnVmZmVyLCBzaXplLCBub3JtQ29lZnMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2JsYWNrbWFuaGFycmlzJzpcbiAgICAgICAgaW5pdEJsYWNrbWFuSGFycmlzV2luZG93KGJ1ZmZlciwgc2l6ZSwgbm9ybUNvZWZzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzaW5lJzpcbiAgICAgICAgaW5pdFNpbmVXaW5kb3coYnVmZmVyLCBzaXplLCBub3JtQ29lZnMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3JlY3RhbmdsZSc6XG4gICAgICAgIGluaXRSZWN0YW5nbGVXaW5kb3coYnVmZmVyLCBzaXplLCBub3JtQ29lZnMpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbn0oKSk7Il19