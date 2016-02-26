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

    _get(Object.getPrototypeOf(Fft.prototype), 'constructor', this).call(this, {
      fftSize: 1024,
      windowName: 'hann',
      outType: 'magnitude'
    }, options);

    this.windowSize = this.params.fftSize;

    if (!isPowerOfTwo(this.params.fftSize)) {
      throw new Error('fftSize must be a power of two');
    }
  }

  _createClass(Fft, [{
    key: 'initialize',
    value: function initialize(inStreamParams) {
      // set output frameSize
      _get(Object.getPrototypeOf(Fft.prototype), 'initialize', this).call(this, inStreamParams, {
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
      this.complexFrame = new _jsfftLibComplex_array2['default'].ComplexArray(fftSize);

      (0, _utilsFftWindows2['default'])(this.params.windowName, this.window, // buffer to populate with the window
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
      var _this = this;

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

      this.output(time);
    }
  }]);

  return Fft;
})(_coreBaseLfo2['default']);

exports['default'] = Fft;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvZmZ0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7MkJBQW9CLGtCQUFrQjs7OztxQkFDcEIsT0FBTzs7OztxQ0FDQSx5QkFBeUI7Ozs7K0JBQzNCLHNCQUFzQjs7Ozs7OztBQUs3QyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDOztBQUV2QixJQUFNLFlBQVksR0FBRyxTQUFmLFlBQVksQ0FBWSxNQUFNLEVBQUU7QUFDcEMsU0FBTyxBQUFDLE1BQU0sR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFLLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDdkMsVUFBTSxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUM7R0FDckI7O0FBRUQsU0FBTyxNQUFNLEtBQUssQ0FBQyxDQUFDO0NBQ3JCLENBQUE7O0lBRW9CLEdBQUc7WUFBSCxHQUFHOztBQUNYLFdBRFEsR0FBRyxDQUNWLE9BQU8sRUFBRTswQkFERixHQUFHOztBQUVwQiwrQkFGaUIsR0FBRyw2Q0FFZDtBQUNKLGFBQU8sRUFBRSxJQUFJO0FBQ2IsZ0JBQVUsRUFBRSxNQUFNO0FBQ2xCLGFBQU8sRUFBRSxXQUFXO0tBQ3JCLEVBQUUsT0FBTyxFQUFFOztBQUVaLFFBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7O0FBRXRDLFFBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUN0QyxZQUFNLElBQUksS0FBSyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7S0FDbkQ7R0FDRjs7ZUFia0IsR0FBRzs7V0FlWixvQkFBQyxjQUFjLEVBQUU7O0FBRXpCLGlDQWpCaUIsR0FBRyw0Q0FpQkgsY0FBYyxFQUFFO0FBQy9CLGlCQUFTLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUM7T0FDdkMsRUFBRTs7QUFFSCxVQUFNLFdBQVcsR0FB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QUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDMUQsWUFBTSxJQUFJLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9ELFlBQU0sSUFBSSxHQUFHLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFL0QsWUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQSxHQUFJLEtBQUssQ0FBQztPQUN4RDs7OztBQUlELFVBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEtBQUssV0FBVyxFQUFFO0FBQ3ZDLGFBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDckMsY0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzNDO09BQ0Y7O0FBRUQsVUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNuQjs7O1NBeEdrQixHQUFHOzs7cUJBQUgsR0FBRyIsImZpbGUiOiJlczYvb3BlcmF0b3JzL2ZmdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvYmFzZS1sZm8nO1xuaW1wb3J0IGpzZmZ0IGZyb20gJ2pzZmZ0JztcbmltcG9ydCBjb21wbGV4QXJyYXkgZnJvbSAnanNmZnQvbGliL2NvbXBsZXhfYXJyYXknO1xuaW1wb3J0IGluaXRXaW5kb3cgZnJvbSAnLi4vdXRpbHMvZmZ0LXdpbmRvd3MnO1xuXG4vLyBjb25zdCBQSSAgID0gTWF0aC5QSTtcbi8vIGNvbnN0IGNvcyAgPSBNYXRoLmNvcztcbi8vIGNvbnN0IHNpbiAgPSBNYXRoLnNpbjtcbmNvbnN0IHNxcnQgPSBNYXRoLnNxcnQ7XG5cbmNvbnN0IGlzUG93ZXJPZlR3byA9IGZ1bmN0aW9uKG51bWJlcikge1xuICB3aGlsZSAoKG51bWJlciAlIDIgPT09IDApICYmIG51bWJlciA+IDEpIHtcbiAgICBudW1iZXIgPSBudW1iZXIgLyAyO1xuICB9XG5cbiAgcmV0dXJuIG51bWJlciA9PT0gMTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmZ0IGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcih7XG4gICAgICBmZnRTaXplOiAxMDI0LFxuICAgICAgd2luZG93TmFtZTogJ2hhbm4nLFxuICAgICAgb3V0VHlwZTogJ21hZ25pdHVkZSdcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIHRoaXMud2luZG93U2l6ZSA9IHRoaXMucGFyYW1zLmZmdFNpemU7XG5cbiAgICBpZiAoIWlzUG93ZXJPZlR3byh0aGlzLnBhcmFtcy5mZnRTaXplKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdmZnRTaXplIG11c3QgYmUgYSBwb3dlciBvZiB0d28nKTtcbiAgICB9XG4gIH1cblxuICBpbml0aWFsaXplKGluU3RyZWFtUGFyYW1zKSB7XG4gICAgLy8gc2V0IG91dHB1dCBmcmFtZVNpemVcbiAgICBzdXBlci5pbml0aWFsaXplKGluU3RyZWFtUGFyYW1zLCB7XG4gICAgICBmcmFtZVNpemU6IHRoaXMucGFyYW1zLmZmdFNpemUgLyAyICsgMSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGluRnJhbWVTaXplID0gaW5TdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIGNvbnN0IGZmdFNpemUgPSB0aGlzLnBhcmFtcy5mZnRTaXplO1xuXG4gICAgdGhpcy53aW5kb3dTaXplID0gZmZ0U2l6ZTtcblxuICAgIGlmKGluRnJhbWVTaXplIDwgZmZ0U2l6ZSlcbiAgICAgIHRoaXMud2luZG93U2l6ZSA9IGluRnJhbWVTaXplO1xuXG4gICAgLy8gcmVmZXJlbmNlcyB0byBwb3B1bGF0ZSBpbiB3aW5kb3cgZnVuY3Rpb25zXG4gICAgdGhpcy5ub3JtYWxpemVDb2VmcyA9IHsgbGluZWFyOiAwLCBwb3dlcjogMCB9O1xuICAgIHRoaXMud2luZG93ID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLndpbmRvd1NpemUpO1xuXG4gICAgLy8gaW5pdCB0aGUgY29tcGxleCBhcnJheSB0byByZXVzZSBmb3IgdGhlIEZGVFxuICAgIHRoaXMuY29tcGxleEZyYW1lID0gbmV3IGNvbXBsZXhBcnJheS5Db21wbGV4QXJyYXkoZmZ0U2l6ZSk7XG5cbiAgICBpbml0V2luZG93KFxuICAgICAgdGhpcy5wYXJhbXMud2luZG93TmFtZSxcbiAgICAgIHRoaXMud2luZG93LCAvLyBidWZmZXIgdG8gcG9wdWxhdGUgd2l0aCB0aGUgd2luZG93XG4gICAgICB0aGlzLndpbmRvd1NpemUsIC8vIGJ1ZmZlci5sZW5ndGhcbiAgICAgIHRoaXMubm9ybWFsaXplQ29lZnMgLy8gYW4gb2JqZWN0IHRvIHBvcHVsYXRlIHdpdGggdGhlIG5vcm1hbGl6YXRpb24gY29lZnNcbiAgICApO1xuXG4gICAgLy8gQXJyYXlCdWZmZXJzIHRvIHJldXNlIGluIHByb2Nlc3NcbiAgICB0aGlzLndpbmRvd2VkRnJhbWUgPSBuZXcgRmxvYXQzMkFycmF5KGZmdFNpemUpO1xuICB9XG5cbiAgLyoqXG4gICAqIHRoZSBmaXJzdCBjYWxsIG9mIHRoaXMgbWV0aG9kIGNhbiBiZSBxdWl0ZSBsb25nICh+NG1zKSxcbiAgICogdGhlIHN1YnNlcXVlbnQgb25lcyBhcmUgZmFzdGVyICh+MC41bXMpIGZvciBmZnRTaXplID0gMTAyNFxuICAgKi9cbiAgcHJvY2Vzcyh0aW1lLCBmcmFtZSwgbWV0YURhdGEpIHtcbiAgICBjb25zdCB3aW5kb3dTaXplID0gdGhpcy53aW5kb3dTaXplO1xuICAgIGNvbnN0IG91dEZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICBjb25zdCBmZnRTaXplID0gdGhpcy5wYXJhbXMuZmZ0U2l6ZTtcblxuICAgIC8vIGFwcGx5IHdpbmRvdyBvbiBmcmFtZVxuICAgIC8vID0+IGB0aGlzLndpbmRvd2AgYW5kIGBmcmFtZWAgaGF2ZSB0aGUgc2FtZSBsZW5ndGhcbiAgICAvLyA9PiBpZiBgdGhpcy53aW5kb3dlZEZyYW1lYCBpcyBiaWdnZXIsIGl0J3MgZmlsbGVkIHdpdGggemVyb1xuICAgIC8vIGFuZCB3aW5kb3cgZG9uJ3QgYXBwbHkgdGhlcmVcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHdpbmRvd1NpemU7IGkrKylcbiAgICAgIHRoaXMud2luZG93ZWRGcmFtZVtpXSA9IGZyYW1lW2ldICogdGhpcy53aW5kb3dbaV07XG5cbiAgICBpZih3aW5kb3dTaXplIDwgZmZ0U2l6ZSlcbiAgICAgIHRoaXMud2luZG93ZWRGcmFtZS5maWxsKDAsIHdpbmRvd1NpemUpO1xuXG4gICAgLy8gRkZUXG4gICAgLy8gdGhpcy5jb21wbGV4RnJhbWUgPSBuZXcgY29tcGxleEFycmF5LkNvbXBsZXhBcnJheShmZnRTaXplKTtcbiAgICAvLyByZXVzZSB0aGUgc2FtZSBjb21wbGV4RnJhbWVcbiAgICB0aGlzLmNvbXBsZXhGcmFtZS5tYXAoKHZhbHVlLCBpKSA9PiB7XG4gICAgICB2YWx1ZS5yZWFsID0gdGhpcy53aW5kb3dlZEZyYW1lW2ldO1xuICAgICAgdmFsdWUuaW1hZyA9IDA7XG4gICAgfSk7XG5cbiAgICBjb25zdCBjb21wbGV4U3BlY3RydW0gPSB0aGlzLmNvbXBsZXhGcmFtZS5GRlQoKTtcbiAgICBjb25zdCBzY2FsZSA9IDEgLyBmZnRTaXplO1xuXG4gICAgLy8gREMgaW5kZXhcbiAgICBjb25zdCByZWFsRGMgPSBjb21wbGV4U3BlY3RydW0ucmVhbFswXTtcbiAgICBjb25zdCBpbWFnRGMgPSBjb21wbGV4U3BlY3RydW0uaW1hZ1swXTtcbiAgICB0aGlzLm91dEZyYW1lWzBdID0gKHJlYWxEYyAqIHJlYWxEYyArIGltYWdEYyAqIGltYWdEYykgKiBzY2FsZTtcblxuICAgIC8vIE5xdXlzdCBpbmRleFxuICAgIGNvbnN0IHJlYWxOeSA9IGNvbXBsZXhTcGVjdHJ1bS5yZWFsW2ZmdFNpemUgLyAyXTtcbiAgICBjb25zdCBpbWFnTnkgPSBjb21wbGV4U3BlY3RydW0uaW1hZ1tmZnRTaXplIC8gMl07XG4gICAgdGhpcy5vdXRGcmFtZVtmZnRTaXplIC8gMl0gPSAocmVhbE55ICogcmVhbE55ICsgaW1hZ055ICogaW1hZ055KSAqIHNjYWxlO1xuXG4gICAgLy8gcG93ZXIgc3BlY3RydW1cbiAgICBmb3IgKGxldCBpID0gMSwgaiA9IGZmdFNpemUgLSAxOyBpIDwgZmZ0U2l6ZSAvIDI7IGkrKywgai0tKSB7XG4gICAgICBjb25zdCByZWFsID0gY29tcGxleFNwZWN0cnVtLnJlYWxbaV0gKyBjb21wbGV4U3BlY3RydW0ucmVhbFtqXTtcbiAgICAgIGNvbnN0IGltYWcgPSBjb21wbGV4U3BlY3RydW0uaW1hZ1tpXSAtIGNvbXBsZXhTcGVjdHJ1bS5pbWFnW2pdO1xuXG4gICAgICB0aGlzLm91dEZyYW1lW2ldID0gKHJlYWwgKiByZWFsICsgaW1hZyAqIGltYWcpICogc2NhbGU7XG4gICAgfVxuXG4gICAgLy8gbWFnbml0dWRlIHNwZWN0cnVtXG4gICAgLy8gQE5PVEUgbWF5YmUgY2hlY2sgaG93IHRvIHJlbW92ZSB0aGlzIGxvb3AgcHJvcGVybHlcbiAgICBpZiAodGhpcy5wYXJhbXMub3V0VHlwZSA9PT0gJ21hZ25pdHVkZScpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3V0RnJhbWVTaXplOyBpKyspIHtcbiAgICAgICAgdGhpcy5vdXRGcmFtZVtpXSA9IHNxcnQodGhpcy5vdXRGcmFtZVtpXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5vdXRwdXQodGltZSk7XG4gIH1cbn1cbiJdfQ==