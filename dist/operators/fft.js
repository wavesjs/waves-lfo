'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreBaseLfo = require('../core/base-lfo');

var _coreBaseLfo2 = _interopRequireDefault(_coreBaseLfo);

var _jsfft = require('jsfft');

var _jsfft2 = _interopRequireDefault(_jsfft);

var _jsfftLibComplex_array = require('jsfft/lib/complex_array');

var _jsfftLibComplex_array2 = _interopRequireDefault(_jsfftLibComplex_array);

var _utilsFftWindows = require('../utils/fft-windows');

// const PI   = Math.PI;
// const cos  = Math.cos;
// const sin  = Math.sin;

var _utilsFftWindows2 = _interopRequireDefault(_utilsFftWindows);

var sqrt = Math.sqrt;

var isPowerOfTwo = function isPowerOfTwo(number) {
  while (number % 2 === 0 && number > 1) {
    number = number / 2;
  }

  return number === 1;
};

var Fft = (function (_BaseLfo) {
  _inherits(Fft, _BaseLfo);

  function Fft(options) {
    _classCallCheck(this, Fft);

    var defaults = {
      fftSize: 1024,
      windowName: 'hann',
      outType: 'magnitude'
    };

    _get(Object.getPrototypeOf(Fft.prototype), 'constructor', this).call(this, options, defaults);

    if (!isPowerOfTwo(this.params.fftSize)) {
      throw new Error('fftSize must be a power of two');
    }
  }

  _createClass(Fft, [{
    key: 'initialize',
    value: function initialize() {
      _get(Object.getPrototypeOf(Fft.prototype), 'initialize', this).call(this);

      var inFrameSize = this.parent.streamParams.frameSize;
      var fftSize = this.params.fftSize;
      // keep of the window size to be applied
      this.appliedWindowSize = inFrameSize < fftSize ? inFrameSize : fftSize;
      // references to populate in window functions
      this.normalizeCoefs = { linear: 0, power: 0 };
      this.window = new Float32Array(this.appliedWindowSize);
      // init the complex array to reuse for the FFT
      this.complexFrame = new _jsfftLibComplex_array2['default'].ComplexArray(fftSize);

      (0, _utilsFftWindows2['default'])(this.params.windowName, this.window, // buffer to populate with the window
      this.appliedWindowSize, // buffer.length
      this.normalizeCoefs // an object to populate with the normalization coefs
      );

      // ArrayBuffers to reuse in process
      this.windowedFrame = new Float32Array(fftSize);
    }
  }, {
    key: 'configureStream',
    value: function configureStream() {
      this.streamParams.frameSize = this.params.fftSize / 2 + 1;
    }

    /**
     * the first call of this method can be quite long (~4ms),
     * the subsequent ones are faster (~0.5ms) for fftSize = 1024
     */
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      var _this = this;

      var inFrameSize = this.parent.streamParams.frameSize;
      var outFrameSize = this.streamParams.frameSize;
      var sampleRate = this.streamParams.sourceSampleRate;
      var fftSize = this.params.fftSize;
      // clip frame if bigger than fftSize
      frame = inFrameSize > fftSize ? frame.subarray(0, fftSize) : frame;

      // apply window on frame
      // => `this.window` and `frame` have the same length
      // => if `this.windowedFrame` is bigger, it's filled with zero
      // and window don't apply there
      for (var i = 0; i < this.appliedWindowSize; i++) {
        this.windowedFrame[i] = frame[i] * this.window[i];
      }

      // FFT
      // this.complexFrame = new complexArray.ComplexArray(fftSize);
      // reuse the same complexFrame
      this.complexFrame.map(function (value, i) {
        value.real = _this.windowedFrame[i];
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
      for (var i = 1, j = fftSize - 1; i < fftSize / 2; i++, j--) {
        var real = complexSpectrum.real[i] + complexSpectrum.real[j];
        var imag = complexSpectrum.imag[i] - complexSpectrum.imag[j];

        this.outFrame[i] = (real * real + imag * imag) * scale;
      }

      // magnitude spectrum
      // @NOTE maybe check how to remove this loop properly
      if (this.params.outType === 'magnitude') {
        for (var i = 0; i < outFrameSize; i++) {
          this.outFrame[i] = sqrt(this.outFrame[i]);
        }
      }

      // @NOTE what shall we do with `this.normalizeCoefs` ?
      // time is centered on the frame ?
      this.time = time + inFrameSize / sampleRate / 2;

      this.output();
    }
  }]);

  return Fft;
})(_coreBaseLfo2['default']);

exports['default'] = Fft;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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QUEsR0FBSSxLQUFLLENBQUM7OztBQUd6RSxXQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUMxRCxZQUFNLElBQUksR0FBRyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0QsWUFBTSxJQUFJLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUUvRCxZQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFBLEdBQUksS0FBSyxDQUFDO09BQ3hEOzs7O0FBSUQsVUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sS0FBSyxXQUFXLEVBQUU7QUFDdkMsYUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFlBQVksRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNyQyxjQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDM0M7T0FDRjs7OztBQUlELFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFJLFdBQVcsR0FBRyxVQUFVLEdBQUcsQ0FBQyxBQUFDLENBQUM7O0FBRWxELFVBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUNmOzs7U0F2R2tCLEdBQUc7OztxQkFBSCxHQUFHIiwiZmlsZSI6ImVzNi9vcGVyYXRvcnMvZmZ0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vY29yZS9iYXNlLWxmbyc7XG5pbXBvcnQganNmZnQgZnJvbSAnanNmZnQnO1xuaW1wb3J0IGNvbXBsZXhBcnJheSBmcm9tICdqc2ZmdC9saWIvY29tcGxleF9hcnJheSc7XG5pbXBvcnQgaW5pdFdpbmRvdyBmcm9tICcuLi91dGlscy9mZnQtd2luZG93cyc7XG5cblxuLy8gY29uc3QgUEkgICA9IE1hdGguUEk7XG4vLyBjb25zdCBjb3MgID0gTWF0aC5jb3M7XG4vLyBjb25zdCBzaW4gID0gTWF0aC5zaW47XG5jb25zdCBzcXJ0ID0gTWF0aC5zcXJ0O1xuXG5jb25zdCBpc1Bvd2VyT2ZUd28gPSBmdW5jdGlvbihudW1iZXIpIHtcbiAgd2hpbGUgKChudW1iZXIgJSAyID09PSAwKSAmJiBudW1iZXIgPiAxKSB7XG4gICAgbnVtYmVyID0gbnVtYmVyIC8gMjtcbiAgfVxuXG4gIHJldHVybiBudW1iZXIgPT09IDE7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZmdCBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBmZnRTaXplOiAxMDI0LFxuICAgICAgd2luZG93TmFtZTogJ2hhbm4nLFxuICAgICAgb3V0VHlwZTogJ21hZ25pdHVkZSdcbiAgICB9O1xuXG4gICAgc3VwZXIob3B0aW9ucywgZGVmYXVsdHMpO1xuXG4gICAgaWYgKCFpc1Bvd2VyT2ZUd28odGhpcy5wYXJhbXMuZmZ0U2l6ZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignZmZ0U2l6ZSBtdXN0IGJlIGEgcG93ZXIgb2YgdHdvJyk7XG4gICAgfVxuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG5cbiAgICBjb25zdCBpbkZyYW1lU2l6ZSA9IHRoaXMucGFyZW50LnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgY29uc3QgZmZ0U2l6ZSA9IHRoaXMucGFyYW1zLmZmdFNpemU7XG4gICAgLy8ga2VlcCBvZiB0aGUgd2luZG93IHNpemUgdG8gYmUgYXBwbGllZFxuICAgIHRoaXMuYXBwbGllZFdpbmRvd1NpemUgPSBpbkZyYW1lU2l6ZSA8IGZmdFNpemUgPyBpbkZyYW1lU2l6ZSA6IGZmdFNpemU7XG4gICAgLy8gcmVmZXJlbmNlcyB0byBwb3B1bGF0ZSBpbiB3aW5kb3cgZnVuY3Rpb25zXG4gICAgdGhpcy5ub3JtYWxpemVDb2VmcyA9IHsgbGluZWFyOiAwLCBwb3dlcjogMCB9O1xuICAgIHRoaXMud2luZG93ID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLmFwcGxpZWRXaW5kb3dTaXplKTtcbiAgICAvLyBpbml0IHRoZSBjb21wbGV4IGFycmF5IHRvIHJldXNlIGZvciB0aGUgRkZUXG4gICAgdGhpcy5jb21wbGV4RnJhbWUgPSBuZXcgY29tcGxleEFycmF5LkNvbXBsZXhBcnJheShmZnRTaXplKTtcblxuICAgIGluaXRXaW5kb3coXG4gICAgICB0aGlzLnBhcmFtcy53aW5kb3dOYW1lLFxuICAgICAgdGhpcy53aW5kb3csIC8vIGJ1ZmZlciB0byBwb3B1bGF0ZSB3aXRoIHRoZSB3aW5kb3dcbiAgICAgIHRoaXMuYXBwbGllZFdpbmRvd1NpemUsIC8vIGJ1ZmZlci5sZW5ndGhcbiAgICAgIHRoaXMubm9ybWFsaXplQ29lZnMgLy8gYW4gb2JqZWN0IHRvIHBvcHVsYXRlIHdpdGggdGhlIG5vcm1hbGl6YXRpb24gY29lZnNcbiAgICApO1xuXG4gICAgLy8gQXJyYXlCdWZmZXJzIHRvIHJldXNlIGluIHByb2Nlc3NcbiAgICB0aGlzLndpbmRvd2VkRnJhbWUgPSBuZXcgRmxvYXQzMkFycmF5KGZmdFNpemUpO1xuICB9XG5cbiAgY29uZmlndXJlU3RyZWFtKCkge1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IHRoaXMucGFyYW1zLmZmdFNpemUgLyAyICsgMTtcbiAgfVxuXG4gIC8qKlxuICAgKiB0aGUgZmlyc3QgY2FsbCBvZiB0aGlzIG1ldGhvZCBjYW4gYmUgcXVpdGUgbG9uZyAofjRtcyksXG4gICAqIHRoZSBzdWJzZXF1ZW50IG9uZXMgYXJlIGZhc3RlciAofjAuNW1zKSBmb3IgZmZ0U2l6ZSA9IDEwMjRcbiAgICovXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgY29uc3QgaW5GcmFtZVNpemUgPSB0aGlzLnBhcmVudC5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIGNvbnN0IG91dEZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICBjb25zdCBzYW1wbGVSYXRlID0gdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZTtcbiAgICBjb25zdCBmZnRTaXplID0gdGhpcy5wYXJhbXMuZmZ0U2l6ZTtcbiAgICAvLyBjbGlwIGZyYW1lIGlmIGJpZ2dlciB0aGFuIGZmdFNpemVcbiAgICBmcmFtZSA9IChpbkZyYW1lU2l6ZSA+IGZmdFNpemUpID8gZnJhbWUuc3ViYXJyYXkoMCwgZmZ0U2l6ZSkgOiBmcmFtZTtcblxuICAgIC8vIGFwcGx5IHdpbmRvdyBvbiBmcmFtZVxuICAgIC8vID0+IGB0aGlzLndpbmRvd2AgYW5kIGBmcmFtZWAgaGF2ZSB0aGUgc2FtZSBsZW5ndGhcbiAgICAvLyA9PiBpZiBgdGhpcy53aW5kb3dlZEZyYW1lYCBpcyBiaWdnZXIsIGl0J3MgZmlsbGVkIHdpdGggemVyb1xuICAgIC8vIGFuZCB3aW5kb3cgZG9uJ3QgYXBwbHkgdGhlcmVcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYXBwbGllZFdpbmRvd1NpemU7IGkrKykge1xuICAgICAgdGhpcy53aW5kb3dlZEZyYW1lW2ldID0gZnJhbWVbaV0gKiB0aGlzLndpbmRvd1tpXTtcbiAgICB9XG5cbiAgICAvLyBGRlRcbiAgICAvLyB0aGlzLmNvbXBsZXhGcmFtZSA9IG5ldyBjb21wbGV4QXJyYXkuQ29tcGxleEFycmF5KGZmdFNpemUpO1xuICAgIC8vIHJldXNlIHRoZSBzYW1lIGNvbXBsZXhGcmFtZVxuICAgIHRoaXMuY29tcGxleEZyYW1lLm1hcCgodmFsdWUsIGkpID0+IHtcbiAgICAgIHZhbHVlLnJlYWwgPSB0aGlzLndpbmRvd2VkRnJhbWVbaV07XG4gICAgICB2YWx1ZS5pbWFnID0gMDtcbiAgICB9KTtcblxuICAgIGNvbnN0IGNvbXBsZXhTcGVjdHJ1bSA9IHRoaXMuY29tcGxleEZyYW1lLkZGVCgpO1xuICAgIGNvbnN0IHNjYWxlID0gMSAvIGZmdFNpemU7XG4gICAgLy8gREMgaW5kZXhcbiAgICBjb25zdCByZWFsRGMgPSBjb21wbGV4U3BlY3RydW0ucmVhbFswXTtcbiAgICBjb25zdCBpbWFnRGMgPSBjb21wbGV4U3BlY3RydW0uaW1hZ1swXTtcbiAgICB0aGlzLm91dEZyYW1lWzBdID0gKHJlYWxEYyAqIHJlYWxEYyArIGltYWdEYyAqIGltYWdEYykgKiBzY2FsZTtcbiAgICAvLyBOcXV5c3QgaW5kZXhcbiAgICBjb25zdCByZWFsTnkgPSBjb21wbGV4U3BlY3RydW0ucmVhbFtmZnRTaXplIC8gMl07XG4gICAgY29uc3QgaW1hZ055ID0gY29tcGxleFNwZWN0cnVtLmltYWdbZmZ0U2l6ZSAvIDJdO1xuICAgIHRoaXMub3V0RnJhbWVbZmZ0U2l6ZSAvIDJdID0gKHJlYWxOeSAqIHJlYWxOeSArIGltYWdOeSAqIGltYWdOeSkgKiBzY2FsZTtcblxuICAgIC8vIHBvd2VyIHNwZWN0cnVtXG4gICAgZm9yIChsZXQgaSA9IDEsIGogPSBmZnRTaXplIC0gMTsgaSA8IGZmdFNpemUgLyAyOyBpKyssIGotLSkge1xuICAgICAgY29uc3QgcmVhbCA9IGNvbXBsZXhTcGVjdHJ1bS5yZWFsW2ldICsgY29tcGxleFNwZWN0cnVtLnJlYWxbal07XG4gICAgICBjb25zdCBpbWFnID0gY29tcGxleFNwZWN0cnVtLmltYWdbaV0gLSBjb21wbGV4U3BlY3RydW0uaW1hZ1tqXTtcblxuICAgICAgdGhpcy5vdXRGcmFtZVtpXSA9IChyZWFsICogcmVhbCArIGltYWcgKiBpbWFnKSAqIHNjYWxlO1xuICAgIH1cblxuICAgIC8vIG1hZ25pdHVkZSBzcGVjdHJ1bVxuICAgIC8vIEBOT1RFIG1heWJlIGNoZWNrIGhvdyB0byByZW1vdmUgdGhpcyBsb29wIHByb3Blcmx5XG4gICAgaWYgKHRoaXMucGFyYW1zLm91dFR5cGUgPT09ICdtYWduaXR1ZGUnKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG91dEZyYW1lU2l6ZTsgaSsrKSB7XG4gICAgICAgIHRoaXMub3V0RnJhbWVbaV0gPSBzcXJ0KHRoaXMub3V0RnJhbWVbaV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEBOT1RFIHdoYXQgc2hhbGwgd2UgZG8gd2l0aCBgdGhpcy5ub3JtYWxpemVDb2Vmc2AgP1xuICAgIC8vIHRpbWUgaXMgY2VudGVyZWQgb24gdGhlIGZyYW1lID9cbiAgICB0aGlzLnRpbWUgPSB0aW1lICsgKGluRnJhbWVTaXplIC8gc2FtcGxlUmF0ZSAvIDIpO1xuXG4gICAgdGhpcy5vdXRwdXQoKTtcbiAgfVxufVxuXG5cblxuXG5cbiJdfQ==