'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _baseLfo = require('../core/base-lfo');

var _baseLfo2 = _interopRequireDefault(_baseLfo);

var _jsfft = require('jsfft');

var _jsfft2 = _interopRequireDefault(_jsfft);

var _complex_array = require('jsfft/lib/complex_array');

var _complex_array2 = _interopRequireDefault(_complex_array);

var _fftWindows = require('../utils/fft-windows');

var _fftWindows2 = _interopRequireDefault(_fftWindows);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const PI   = Math.PI;
// const cos  = Math.cos;
// const sin  = Math.sin;
var sqrt = Math.sqrt;

var isPowerOfTwo = function isPowerOfTwo(number) {
  while (number % 2 === 0 && number > 1) {
    number = number / 2;
  }

  return number === 1;
};

var Fft = function (_BaseLfo) {
  (0, _inherits3.default)(Fft, _BaseLfo);

  function Fft(options) {
    (0, _classCallCheck3.default)(this, Fft);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Fft).call(this, {
      fftSize: 1024,
      windowName: 'hann',
      outType: 'magnitude'
    }, options));

    _this.windowSize = _this.params.fftSize;

    if (!isPowerOfTwo(_this.params.fftSize)) {
      throw new Error('fftSize must be a power of two');
    }
    return _this;
  }

  (0, _createClass3.default)(Fft, [{
    key: 'initialize',
    value: function initialize(inStreamParams) {
      // set output frameSize
      (0, _get3.default)((0, _getPrototypeOf2.default)(Fft.prototype), 'initialize', this).call(this, inStreamParams, {
        frameSize: this.params.fftSize / 2 + 1
      });

      var inFrameSize = inStreamParams.frameSize;
      var fftSize = this.params.fftSize;

      this.windowSize = fftSize;

      if (inFrameSize < fftSize) this.windowSize = inFrameSize;

      // references to populate in window functions
      this.normalizeCoefs = { linear: 0, power: 0 };
      this.window = new Float32Array(this.windowSize);

      // init the complex array to reuse for the FFT
      this.complexFrame = new _complex_array2.default.ComplexArray(fftSize);

      (0, _fftWindows2.default)(this.params.windowName, this.window, // buffer to populate with the window
      this.windowSize, // buffer.length
      this.normalizeCoefs // an object to populate with the normalization coefs
      );

      // ArrayBuffers to reuse in process
      this.windowedFrame = new Float32Array(fftSize);
    }

    /**
     * the first call of this method can be quite long (~4ms),
     * the subsequent ones are faster (~0.5ms) for fftSize = 1024
     */

  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      var _this2 = this;

      var windowSize = this.windowSize;
      var outFrameSize = this.streamParams.frameSize;
      var fftSize = this.params.fftSize;

      // apply window on frame
      // => `this.window` and `frame` have the same length
      // => if `this.windowedFrame` is bigger, it's filled with zero
      // and window don't apply there
      for (var i = 0; i < windowSize; i++) {
        this.windowedFrame[i] = frame[i] * this.window[i];
      }if (windowSize < fftSize) this.windowedFrame.fill(0, windowSize);

      // FFT
      // this.complexFrame = new complexArray.ComplexArray(fftSize);
      // reuse the same complexFrame
      this.complexFrame.map(function (value, i) {
        value.real = _this2.windowedFrame[i];
        value.imag = 0;
      });

      var complexSpectrum = this.complexFrame.FFT();
      var scale = 1 / fftSize;

      // DC index
      var realDc = complexSpectrum.real[0];
      var imagDc = complexSpectrum.imag[0];
      this.outFrame[0] = (realDc * realDc + imagDc * imagDc) * scale;

      // Nquyst index
      var realNy = complexSpectrum.real[fftSize / 2];
      var imagNy = complexSpectrum.imag[fftSize / 2];
      this.outFrame[fftSize / 2] = (realNy * realNy + imagNy * imagNy) * scale;

      // power spectrum
      for (var _i = 1, j = fftSize - 1; _i < fftSize / 2; _i++, j--) {
        var real = complexSpectrum.real[_i] + complexSpectrum.real[j];
        var imag = complexSpectrum.imag[_i] - complexSpectrum.imag[j];

        this.outFrame[_i] = (real * real + imag * imag) * scale;
      }

      // magnitude spectrum
      // @NOTE maybe check how to remove this loop properly
      if (this.params.outType === 'magnitude') {
        for (var _i2 = 0; _i2 < outFrameSize; _i2++) {
          this.outFrame[_i2] = sqrt(this.outFrame[_i2]);
        }
      }

      this.output(time);
    }
  }]);
  return Fft;
}(_baseLfo2.default);

exports.default = Fft;
//# sourceMappingURL=data:application/json;base64,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QyxFQUF1QztBQUNyQyxlQUFLLFFBQUwsQ0FBYyxHQUFkLElBQW1CLEtBQUssS0FBSyxRQUFMLENBQWMsR0FBZCxDQUFMLENBQW5CLENBRHFDO1NBQXZDO09BREY7O0FBTUEsV0FBSyxNQUFMLENBQVksSUFBWixFQXBENkI7OztTQW5EWiIsImZpbGUiOiJmZnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi9jb3JlL2Jhc2UtbGZvJztcbmltcG9ydCBqc2ZmdCBmcm9tICdqc2ZmdCc7XG5pbXBvcnQgY29tcGxleEFycmF5IGZyb20gJ2pzZmZ0L2xpYi9jb21wbGV4X2FycmF5JztcbmltcG9ydCBpbml0V2luZG93IGZyb20gJy4uL3V0aWxzL2ZmdC13aW5kb3dzJztcblxuLy8gY29uc3QgUEkgICA9IE1hdGguUEk7XG4vLyBjb25zdCBjb3MgID0gTWF0aC5jb3M7XG4vLyBjb25zdCBzaW4gID0gTWF0aC5zaW47XG5jb25zdCBzcXJ0ID0gTWF0aC5zcXJ0O1xuXG5jb25zdCBpc1Bvd2VyT2ZUd28gPSBmdW5jdGlvbihudW1iZXIpIHtcbiAgd2hpbGUgKChudW1iZXIgJSAyID09PSAwKSAmJiBudW1iZXIgPiAxKSB7XG4gICAgbnVtYmVyID0gbnVtYmVyIC8gMjtcbiAgfVxuXG4gIHJldHVybiBudW1iZXIgPT09IDE7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZmdCBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIoe1xuICAgICAgZmZ0U2l6ZTogMTAyNCxcbiAgICAgIHdpbmRvd05hbWU6ICdoYW5uJyxcbiAgICAgIG91dFR5cGU6ICdtYWduaXR1ZGUnXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLndpbmRvd1NpemUgPSB0aGlzLnBhcmFtcy5mZnRTaXplO1xuXG4gICAgaWYgKCFpc1Bvd2VyT2ZUd28odGhpcy5wYXJhbXMuZmZ0U2l6ZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignZmZ0U2l6ZSBtdXN0IGJlIGEgcG93ZXIgb2YgdHdvJyk7XG4gICAgfVxuICB9XG5cbiAgaW5pdGlhbGl6ZShpblN0cmVhbVBhcmFtcykge1xuICAgIC8vIHNldCBvdXRwdXQgZnJhbWVTaXplXG4gICAgc3VwZXIuaW5pdGlhbGl6ZShpblN0cmVhbVBhcmFtcywge1xuICAgICAgZnJhbWVTaXplOiB0aGlzLnBhcmFtcy5mZnRTaXplIC8gMiArIDEsXG4gICAgfSk7XG5cbiAgICBjb25zdCBpbkZyYW1lU2l6ZSA9IGluU3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICBjb25zdCBmZnRTaXplID0gdGhpcy5wYXJhbXMuZmZ0U2l6ZTtcblxuICAgIHRoaXMud2luZG93U2l6ZSA9IGZmdFNpemU7XG5cbiAgICBpZihpbkZyYW1lU2l6ZSA8IGZmdFNpemUpXG4gICAgICB0aGlzLndpbmRvd1NpemUgPSBpbkZyYW1lU2l6ZTtcblxuICAgIC8vIHJlZmVyZW5jZXMgdG8gcG9wdWxhdGUgaW4gd2luZG93IGZ1bmN0aW9uc1xuICAgIHRoaXMubm9ybWFsaXplQ29lZnMgPSB7IGxpbmVhcjogMCwgcG93ZXI6IDAgfTtcbiAgICB0aGlzLndpbmRvdyA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy53aW5kb3dTaXplKTtcblxuICAgIC8vIGluaXQgdGhlIGNvbXBsZXggYXJyYXkgdG8gcmV1c2UgZm9yIHRoZSBGRlRcbiAgICB0aGlzLmNvbXBsZXhGcmFtZSA9IG5ldyBjb21wbGV4QXJyYXkuQ29tcGxleEFycmF5KGZmdFNpemUpO1xuXG4gICAgaW5pdFdpbmRvdyhcbiAgICAgIHRoaXMucGFyYW1zLndpbmRvd05hbWUsXG4gICAgICB0aGlzLndpbmRvdywgLy8gYnVmZmVyIHRvIHBvcHVsYXRlIHdpdGggdGhlIHdpbmRvd1xuICAgICAgdGhpcy53aW5kb3dTaXplLCAvLyBidWZmZXIubGVuZ3RoXG4gICAgICB0aGlzLm5vcm1hbGl6ZUNvZWZzIC8vIGFuIG9iamVjdCB0byBwb3B1bGF0ZSB3aXRoIHRoZSBub3JtYWxpemF0aW9uIGNvZWZzXG4gICAgKTtcblxuICAgIC8vIEFycmF5QnVmZmVycyB0byByZXVzZSBpbiBwcm9jZXNzXG4gICAgdGhpcy53aW5kb3dlZEZyYW1lID0gbmV3IEZsb2F0MzJBcnJheShmZnRTaXplKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB0aGUgZmlyc3QgY2FsbCBvZiB0aGlzIG1ldGhvZCBjYW4gYmUgcXVpdGUgbG9uZyAofjRtcyksXG4gICAqIHRoZSBzdWJzZXF1ZW50IG9uZXMgYXJlIGZhc3RlciAofjAuNW1zKSBmb3IgZmZ0U2l6ZSA9IDEwMjRcbiAgICovXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgY29uc3Qgd2luZG93U2l6ZSA9IHRoaXMud2luZG93U2l6ZTtcbiAgICBjb25zdCBvdXRGcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgY29uc3QgZmZ0U2l6ZSA9IHRoaXMucGFyYW1zLmZmdFNpemU7XG5cbiAgICAvLyBhcHBseSB3aW5kb3cgb24gZnJhbWVcbiAgICAvLyA9PiBgdGhpcy53aW5kb3dgIGFuZCBgZnJhbWVgIGhhdmUgdGhlIHNhbWUgbGVuZ3RoXG4gICAgLy8gPT4gaWYgYHRoaXMud2luZG93ZWRGcmFtZWAgaXMgYmlnZ2VyLCBpdCdzIGZpbGxlZCB3aXRoIHplcm9cbiAgICAvLyBhbmQgd2luZG93IGRvbid0IGFwcGx5IHRoZXJlXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3aW5kb3dTaXplOyBpKyspXG4gICAgICB0aGlzLndpbmRvd2VkRnJhbWVbaV0gPSBmcmFtZVtpXSAqIHRoaXMud2luZG93W2ldO1xuXG4gICAgaWYod2luZG93U2l6ZSA8IGZmdFNpemUpXG4gICAgICB0aGlzLndpbmRvd2VkRnJhbWUuZmlsbCgwLCB3aW5kb3dTaXplKTtcblxuICAgIC8vIEZGVFxuICAgIC8vIHRoaXMuY29tcGxleEZyYW1lID0gbmV3IGNvbXBsZXhBcnJheS5Db21wbGV4QXJyYXkoZmZ0U2l6ZSk7XG4gICAgLy8gcmV1c2UgdGhlIHNhbWUgY29tcGxleEZyYW1lXG4gICAgdGhpcy5jb21wbGV4RnJhbWUubWFwKCh2YWx1ZSwgaSkgPT4ge1xuICAgICAgdmFsdWUucmVhbCA9IHRoaXMud2luZG93ZWRGcmFtZVtpXTtcbiAgICAgIHZhbHVlLmltYWcgPSAwO1xuICAgIH0pO1xuXG4gICAgY29uc3QgY29tcGxleFNwZWN0cnVtID0gdGhpcy5jb21wbGV4RnJhbWUuRkZUKCk7XG4gICAgY29uc3Qgc2NhbGUgPSAxIC8gZmZ0U2l6ZTtcblxuICAgIC8vIERDIGluZGV4XG4gICAgY29uc3QgcmVhbERjID0gY29tcGxleFNwZWN0cnVtLnJlYWxbMF07XG4gICAgY29uc3QgaW1hZ0RjID0gY29tcGxleFNwZWN0cnVtLmltYWdbMF07XG4gICAgdGhpcy5vdXRGcmFtZVswXSA9IChyZWFsRGMgKiByZWFsRGMgKyBpbWFnRGMgKiBpbWFnRGMpICogc2NhbGU7XG5cbiAgICAvLyBOcXV5c3QgaW5kZXhcbiAgICBjb25zdCByZWFsTnkgPSBjb21wbGV4U3BlY3RydW0ucmVhbFtmZnRTaXplIC8gMl07XG4gICAgY29uc3QgaW1hZ055ID0gY29tcGxleFNwZWN0cnVtLmltYWdbZmZ0U2l6ZSAvIDJdO1xuICAgIHRoaXMub3V0RnJhbWVbZmZ0U2l6ZSAvIDJdID0gKHJlYWxOeSAqIHJlYWxOeSArIGltYWdOeSAqIGltYWdOeSkgKiBzY2FsZTtcblxuICAgIC8vIHBvd2VyIHNwZWN0cnVtXG4gICAgZm9yIChsZXQgaSA9IDEsIGogPSBmZnRTaXplIC0gMTsgaSA8IGZmdFNpemUgLyAyOyBpKyssIGotLSkge1xuICAgICAgY29uc3QgcmVhbCA9IGNvbXBsZXhTcGVjdHJ1bS5yZWFsW2ldICsgY29tcGxleFNwZWN0cnVtLnJlYWxbal07XG4gICAgICBjb25zdCBpbWFnID0gY29tcGxleFNwZWN0cnVtLmltYWdbaV0gLSBjb21wbGV4U3BlY3RydW0uaW1hZ1tqXTtcblxuICAgICAgdGhpcy5vdXRGcmFtZVtpXSA9IChyZWFsICogcmVhbCArIGltYWcgKiBpbWFnKSAqIHNjYWxlO1xuICAgIH1cblxuICAgIC8vIG1hZ25pdHVkZSBzcGVjdHJ1bVxuICAgIC8vIEBOT1RFIG1heWJlIGNoZWNrIGhvdyB0byByZW1vdmUgdGhpcyBsb29wIHByb3Blcmx5XG4gICAgaWYgKHRoaXMucGFyYW1zLm91dFR5cGUgPT09ICdtYWduaXR1ZGUnKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG91dEZyYW1lU2l6ZTsgaSsrKSB7XG4gICAgICAgIHRoaXMub3V0RnJhbWVbaV0gPSBzcXJ0KHRoaXMub3V0RnJhbWVbaV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMub3V0cHV0KHRpbWUpO1xuICB9XG59XG4iXX0=