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

var _utilsFftWindows2 = _interopRequireDefault(_utilsFftWindows);

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

var Fft = (function (_BaseLfo) {
  _inherits(Fft, _BaseLfo);

  function Fft(options) {
    _classCallCheck(this, Fft);

    _get(Object.getPrototypeOf(Fft.prototype), 'constructor', this).call(this, options, {
      fftSize: 1024,
      windowName: 'hann',
      outType: 'magnitude'
    });

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
//# sourceMappingURL=data:application/json;base64,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LENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDMUQsWUFBTSxJQUFJLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9ELFlBQU0sSUFBSSxHQUFHLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFL0QsWUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQSxHQUFJLEtBQUssQ0FBQztPQUN4RDs7OztBQUlELFVBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEtBQUssV0FBVyxFQUFFO0FBQ3ZDLGFBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDckMsY0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzNDO09BQ0Y7Ozs7QUFJRCxVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksR0FBSSxXQUFXLEdBQUcsVUFBVSxHQUFHLENBQUMsQUFBQyxDQUFDOztBQUVsRCxVQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDZjs7O1NBckdrQixHQUFHOzs7cUJBQUgsR0FBRyIsImZpbGUiOiJlczYvb3BlcmF0b3JzL2ZmdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvYmFzZS1sZm8nO1xuaW1wb3J0IGpzZmZ0IGZyb20gJ2pzZmZ0JztcbmltcG9ydCBjb21wbGV4QXJyYXkgZnJvbSAnanNmZnQvbGliL2NvbXBsZXhfYXJyYXknO1xuaW1wb3J0IGluaXRXaW5kb3cgZnJvbSAnLi4vdXRpbHMvZmZ0LXdpbmRvd3MnO1xuXG4vLyBjb25zdCBQSSAgID0gTWF0aC5QSTtcbi8vIGNvbnN0IGNvcyAgPSBNYXRoLmNvcztcbi8vIGNvbnN0IHNpbiAgPSBNYXRoLnNpbjtcbmNvbnN0IHNxcnQgPSBNYXRoLnNxcnQ7XG5cbmNvbnN0IGlzUG93ZXJPZlR3byA9IGZ1bmN0aW9uKG51bWJlcikge1xuICB3aGlsZSAoKG51bWJlciAlIDIgPT09IDApICYmIG51bWJlciA+IDEpIHtcbiAgICBudW1iZXIgPSBudW1iZXIgLyAyO1xuICB9XG5cbiAgcmV0dXJuIG51bWJlciA9PT0gMTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmZ0IGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihvcHRpb25zLCB7XG4gICAgICBmZnRTaXplOiAxMDI0LFxuICAgICAgd2luZG93TmFtZTogJ2hhbm4nLFxuICAgICAgb3V0VHlwZTogJ21hZ25pdHVkZSdcbiAgICB9KTtcblxuICAgIGlmICghaXNQb3dlck9mVHdvKHRoaXMucGFyYW1zLmZmdFNpemUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ZmdFNpemUgbXVzdCBiZSBhIHBvd2VyIG9mIHR3bycpO1xuICAgIH1cbiAgfVxuXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuXG4gICAgY29uc3QgaW5GcmFtZVNpemUgPSB0aGlzLnBhcmVudC5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIGNvbnN0IGZmdFNpemUgPSB0aGlzLnBhcmFtcy5mZnRTaXplO1xuICAgIC8vIGtlZXAgb2YgdGhlIHdpbmRvdyBzaXplIHRvIGJlIGFwcGxpZWRcbiAgICB0aGlzLmFwcGxpZWRXaW5kb3dTaXplID0gaW5GcmFtZVNpemUgPCBmZnRTaXplID8gaW5GcmFtZVNpemUgOiBmZnRTaXplO1xuICAgIC8vIHJlZmVyZW5jZXMgdG8gcG9wdWxhdGUgaW4gd2luZG93IGZ1bmN0aW9uc1xuICAgIHRoaXMubm9ybWFsaXplQ29lZnMgPSB7IGxpbmVhcjogMCwgcG93ZXI6IDAgfTtcbiAgICB0aGlzLndpbmRvdyA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5hcHBsaWVkV2luZG93U2l6ZSk7XG4gICAgLy8gaW5pdCB0aGUgY29tcGxleCBhcnJheSB0byByZXVzZSBmb3IgdGhlIEZGVFxuICAgIHRoaXMuY29tcGxleEZyYW1lID0gbmV3IGNvbXBsZXhBcnJheS5Db21wbGV4QXJyYXkoZmZ0U2l6ZSk7XG5cbiAgICBpbml0V2luZG93KFxuICAgICAgdGhpcy5wYXJhbXMud2luZG93TmFtZSxcbiAgICAgIHRoaXMud2luZG93LCAvLyBidWZmZXIgdG8gcG9wdWxhdGUgd2l0aCB0aGUgd2luZG93XG4gICAgICB0aGlzLmFwcGxpZWRXaW5kb3dTaXplLCAvLyBidWZmZXIubGVuZ3RoXG4gICAgICB0aGlzLm5vcm1hbGl6ZUNvZWZzIC8vIGFuIG9iamVjdCB0byBwb3B1bGF0ZSB3aXRoIHRoZSBub3JtYWxpemF0aW9uIGNvZWZzXG4gICAgKTtcblxuICAgIC8vIEFycmF5QnVmZmVycyB0byByZXVzZSBpbiBwcm9jZXNzXG4gICAgdGhpcy53aW5kb3dlZEZyYW1lID0gbmV3IEZsb2F0MzJBcnJheShmZnRTaXplKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZVN0cmVhbSgpIHtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSB0aGlzLnBhcmFtcy5mZnRTaXplIC8gMiArIDE7XG4gIH1cblxuICAvKipcbiAgICogdGhlIGZpcnN0IGNhbGwgb2YgdGhpcyBtZXRob2QgY2FuIGJlIHF1aXRlIGxvbmcgKH40bXMpLFxuICAgKiB0aGUgc3Vic2VxdWVudCBvbmVzIGFyZSBmYXN0ZXIgKH4wLjVtcykgZm9yIGZmdFNpemUgPSAxMDI0XG4gICAqL1xuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuICAgIGNvbnN0IGluRnJhbWVTaXplID0gdGhpcy5wYXJlbnQuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICBjb25zdCBvdXRGcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgY29uc3Qgc2FtcGxlUmF0ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGU7XG4gICAgY29uc3QgZmZ0U2l6ZSA9IHRoaXMucGFyYW1zLmZmdFNpemU7XG4gICAgLy8gY2xpcCBmcmFtZSBpZiBiaWdnZXIgdGhhbiBmZnRTaXplXG4gICAgZnJhbWUgPSAoaW5GcmFtZVNpemUgPiBmZnRTaXplKSA/IGZyYW1lLnN1YmFycmF5KDAsIGZmdFNpemUpIDogZnJhbWU7XG5cbiAgICAvLyBhcHBseSB3aW5kb3cgb24gZnJhbWVcbiAgICAvLyA9PiBgdGhpcy53aW5kb3dgIGFuZCBgZnJhbWVgIGhhdmUgdGhlIHNhbWUgbGVuZ3RoXG4gICAgLy8gPT4gaWYgYHRoaXMud2luZG93ZWRGcmFtZWAgaXMgYmlnZ2VyLCBpdCdzIGZpbGxlZCB3aXRoIHplcm9cbiAgICAvLyBhbmQgd2luZG93IGRvbid0IGFwcGx5IHRoZXJlXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmFwcGxpZWRXaW5kb3dTaXplOyBpKyspIHtcbiAgICAgIHRoaXMud2luZG93ZWRGcmFtZVtpXSA9IGZyYW1lW2ldICogdGhpcy53aW5kb3dbaV07XG4gICAgfVxuXG4gICAgLy8gRkZUXG4gICAgLy8gdGhpcy5jb21wbGV4RnJhbWUgPSBuZXcgY29tcGxleEFycmF5LkNvbXBsZXhBcnJheShmZnRTaXplKTtcbiAgICAvLyByZXVzZSB0aGUgc2FtZSBjb21wbGV4RnJhbWVcbiAgICB0aGlzLmNvbXBsZXhGcmFtZS5tYXAoKHZhbHVlLCBpKSA9PiB7XG4gICAgICB2YWx1ZS5yZWFsID0gdGhpcy53aW5kb3dlZEZyYW1lW2ldO1xuICAgICAgdmFsdWUuaW1hZyA9IDA7XG4gICAgfSk7XG5cbiAgICBjb25zdCBjb21wbGV4U3BlY3RydW0gPSB0aGlzLmNvbXBsZXhGcmFtZS5GRlQoKTtcbiAgICBjb25zdCBzY2FsZSA9IDEgLyBmZnRTaXplO1xuICAgIC8vIERDIGluZGV4XG4gICAgY29uc3QgcmVhbERjID0gY29tcGxleFNwZWN0cnVtLnJlYWxbMF07XG4gICAgY29uc3QgaW1hZ0RjID0gY29tcGxleFNwZWN0cnVtLmltYWdbMF07XG4gICAgdGhpcy5vdXRGcmFtZVswXSA9IChyZWFsRGMgKiByZWFsRGMgKyBpbWFnRGMgKiBpbWFnRGMpICogc2NhbGU7XG4gICAgLy8gTnF1eXN0IGluZGV4XG4gICAgY29uc3QgcmVhbE55ID0gY29tcGxleFNwZWN0cnVtLnJlYWxbZmZ0U2l6ZSAvIDJdO1xuICAgIGNvbnN0IGltYWdOeSA9IGNvbXBsZXhTcGVjdHJ1bS5pbWFnW2ZmdFNpemUgLyAyXTtcbiAgICB0aGlzLm91dEZyYW1lW2ZmdFNpemUgLyAyXSA9IChyZWFsTnkgKiByZWFsTnkgKyBpbWFnTnkgKiBpbWFnTnkpICogc2NhbGU7XG5cbiAgICAvLyBwb3dlciBzcGVjdHJ1bVxuICAgIGZvciAobGV0IGkgPSAxLCBqID0gZmZ0U2l6ZSAtIDE7IGkgPCBmZnRTaXplIC8gMjsgaSsrLCBqLS0pIHtcbiAgICAgIGNvbnN0IHJlYWwgPSBjb21wbGV4U3BlY3RydW0ucmVhbFtpXSArIGNvbXBsZXhTcGVjdHJ1bS5yZWFsW2pdO1xuICAgICAgY29uc3QgaW1hZyA9IGNvbXBsZXhTcGVjdHJ1bS5pbWFnW2ldIC0gY29tcGxleFNwZWN0cnVtLmltYWdbal07XG5cbiAgICAgIHRoaXMub3V0RnJhbWVbaV0gPSAocmVhbCAqIHJlYWwgKyBpbWFnICogaW1hZykgKiBzY2FsZTtcbiAgICB9XG5cbiAgICAvLyBtYWduaXR1ZGUgc3BlY3RydW1cbiAgICAvLyBATk9URSBtYXliZSBjaGVjayBob3cgdG8gcmVtb3ZlIHRoaXMgbG9vcCBwcm9wZXJseVxuICAgIGlmICh0aGlzLnBhcmFtcy5vdXRUeXBlID09PSAnbWFnbml0dWRlJykge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvdXRGcmFtZVNpemU7IGkrKykge1xuICAgICAgICB0aGlzLm91dEZyYW1lW2ldID0gc3FydCh0aGlzLm91dEZyYW1lW2ldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBATk9URSB3aGF0IHNoYWxsIHdlIGRvIHdpdGggYHRoaXMubm9ybWFsaXplQ29lZnNgID9cbiAgICAvLyB0aW1lIGlzIGNlbnRlcmVkIG9uIHRoZSBmcmFtZSA/XG4gICAgdGhpcy50aW1lID0gdGltZSArIChpbkZyYW1lU2l6ZSAvIHNhbXBsZVJhdGUgLyAyKTtcblxuICAgIHRoaXMub3V0cHV0KCk7XG4gIH1cbn1cbiJdfQ==