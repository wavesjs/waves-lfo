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

// is it possible to do a ifft with only magnitude information ?

var _utilsFftWindows2 = _interopRequireDefault(_utilsFftWindows);

var Ifft = (function (_BaseLfo) {
  _inherits(Ifft, _BaseLfo);

  function Ifft(options) {
    _classCallCheck(this, Ifft);

    var defaults = {
      binLength: 513,
      dataType: 'magnitude'
    };

    _get(Object.getPrototypeOf(Ifft.prototype), 'constructor', this).call(this, options, defaults);
  }

  _createClass(Ifft, [{
    key: 'initialize',
    value: function initialize() {
      _get(Object.getPrototypeOf(Ifft.prototype), 'initialize', this).call(this);

      this.inFrame = new Float32Array(this.params.binLength);
    }
  }, {
    key: 'configureStream',
    value: function configureStream() {
      this.streamParams.frameSize = (this.params.binLength - 1) * 2;
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      var _this = this;

      var fftSize = this.streamParams.frameSize;
      var binLength = this.params.binLength;

      var scale = Math.sqrt(fftSize);

      for (var i = 0; i < binLength; i++) {
        var bin = this.params.outType === 'magnitude' ? frame[i] : Math.sqrt(frame[i]);
        this.inFrame[i] = bin * scale;
      }

      // populate complexData
      var complexFrame = new _jsfftLibComplex_array2['default'].ComplexArray(fftSize);
      // signal can't be the same as fft input as we have lost phase information
      complexFrame.map(function (value, index, length) {
        var nquiyst = fftSize / 2;
        if (index === 0 || index === nquiyst) {
          value.real = _this.inFrame[index];
          value.imag = 0; // use random phase between π and -π ?
        } else {
            var targetIndex = index < nquiyst ? index : fftSize - index;
            value.real = _this.inFrame[targetIndex] / 2;
            value.imag = 0;
          }
      });

      var signal = complexFrame.InvFFT().real;

      // apply normalizeCoefs from windowing here to scale the signal ?
    }
  }]);

  return Ifft;
})(_coreBaseLfo2['default']);

exports['default'] = Ifft;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvaWZmdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzJCQUFvQixrQkFBa0I7Ozs7cUJBQ3BCLE9BQU87Ozs7cUNBQ0EseUJBQXlCOzs7OytCQUMzQixzQkFBc0I7Ozs7OztJQUl4QixJQUFJO1lBQUosSUFBSTs7QUFDWixXQURRLElBQUksQ0FDWCxPQUFPLEVBQUU7MEJBREYsSUFBSTs7QUFFckIsUUFBTSxRQUFRLEdBQUc7QUFDZixlQUFTLEVBQUUsR0FBRztBQUNkLGNBQVEsRUFBRSxXQUFXO0tBQ3RCLENBQUE7O0FBRUQsK0JBUGlCLElBQUksNkNBT2YsT0FBTyxFQUFFLFFBQVEsRUFBRTtHQUMxQjs7ZUFSa0IsSUFBSTs7V0FVYixzQkFBRztBQUNYLGlDQVhpQixJQUFJLDRDQVdGOztBQUVuQixVQUFJLENBQUMsT0FBTyxHQUFHLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDeEQ7OztXQUVjLDJCQUFHO0FBQ2hCLFVBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFBLEdBQUksQ0FBQyxDQUFDO0tBQy9EOzs7V0FFTSxpQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTs7O0FBQzdCLFVBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDO0FBQzVDLFVBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDOztBQUV4QyxVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUVqQyxXQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ2xDLFlBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxLQUFLLFdBQVcsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqRixZQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUM7T0FDL0I7OztBQUdELFVBQU0sWUFBWSxHQUFHLElBQUksbUNBQWEsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUU1RCxrQkFBWSxDQUFDLEdBQUcsQ0FBQyxVQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFLO0FBQ3pDLFlBQU0sT0FBTyxHQUFHLE9BQU8sR0FBRyxDQUFDLENBQUM7QUFDNUIsWUFBSSxLQUFLLEtBQUssQ0FBQyxJQUFJLEtBQUssS0FBSyxPQUFPLEVBQUU7QUFDcEMsZUFBSyxDQUFDLElBQUksR0FBRyxNQUFLLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNqQyxlQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztTQUNoQixNQUFNO0FBQ0wsZ0JBQUksV0FBVyxHQUFHLEtBQUssR0FBRyxPQUFPLEdBQUcsS0FBSyxHQUFHLE9BQU8sR0FBRyxLQUFLLENBQUM7QUFDNUQsaUJBQUssQ0FBQyxJQUFJLEdBQUcsTUFBSyxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzNDLGlCQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztXQUNoQjtPQUNGLENBQUMsQ0FBQzs7QUFFSCxVQUFNLE1BQU0sR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDOzs7S0FHM0M7OztTQWpEa0IsSUFBSTs7O3FCQUFKLElBQUkiLCJmaWxlIjoiZXM2L29wZXJhdG9ycy9pZmZ0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vY29yZS9iYXNlLWxmbyc7XG5pbXBvcnQganNmZnQgZnJvbSAnanNmZnQnO1xuaW1wb3J0IGNvbXBsZXhBcnJheSBmcm9tICdqc2ZmdC9saWIvY29tcGxleF9hcnJheSc7XG5pbXBvcnQgaW5pdFdpbmRvdyBmcm9tICcuLi91dGlscy9mZnQtd2luZG93cyc7XG5cblxuLy8gaXMgaXQgcG9zc2libGUgdG8gZG8gYSBpZmZ0IHdpdGggb25seSBtYWduaXR1ZGUgaW5mb3JtYXRpb24gP1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSWZmdCBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBiaW5MZW5ndGg6IDUxMyxcbiAgICAgIGRhdGFUeXBlOiAnbWFnbml0dWRlJ1xuICAgIH1cblxuICAgIHN1cGVyKG9wdGlvbnMsIGRlZmF1bHRzKTtcbiAgfVxuXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuXG4gICAgdGhpcy5pbkZyYW1lID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLnBhcmFtcy5iaW5MZW5ndGgpO1xuICB9XG5cbiAgY29uZmlndXJlU3RyZWFtKCkge1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9ICh0aGlzLnBhcmFtcy5iaW5MZW5ndGggLSAxKSAqIDI7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuICAgIGNvbnN0IGZmdFNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgY29uc3QgYmluTGVuZ3RoID0gdGhpcy5wYXJhbXMuYmluTGVuZ3RoO1xuXG4gICAgY29uc3Qgc2NhbGUgPSBNYXRoLnNxcnQoZmZ0U2l6ZSk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJpbkxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBiaW4gPSB0aGlzLnBhcmFtcy5vdXRUeXBlID09PSAnbWFnbml0dWRlJyA/IGZyYW1lW2ldIDogTWF0aC5zcXJ0KGZyYW1lW2ldKTtcbiAgICAgIHRoaXMuaW5GcmFtZVtpXSA9IGJpbiAqIHNjYWxlO1xuICAgIH1cblxuICAgIC8vIHBvcHVsYXRlIGNvbXBsZXhEYXRhXG4gICAgY29uc3QgY29tcGxleEZyYW1lID0gbmV3IGNvbXBsZXhBcnJheS5Db21wbGV4QXJyYXkoZmZ0U2l6ZSk7XG4gICAgLy8gc2lnbmFsIGNhbid0IGJlIHRoZSBzYW1lIGFzIGZmdCBpbnB1dCBhcyB3ZSBoYXZlIGxvc3QgcGhhc2UgaW5mb3JtYXRpb25cbiAgICBjb21wbGV4RnJhbWUubWFwKCh2YWx1ZSwgaW5kZXgsIGxlbmd0aCkgPT4ge1xuICAgICAgY29uc3QgbnF1aXlzdCA9IGZmdFNpemUgLyAyO1xuICAgICAgaWYgKGluZGV4ID09PSAwIHx8wqBpbmRleCA9PT0gbnF1aXlzdCkge1xuICAgICAgICB2YWx1ZS5yZWFsID0gdGhpcy5pbkZyYW1lW2luZGV4XTtcbiAgICAgICAgdmFsdWUuaW1hZyA9IDA7IC8vIHVzZSByYW5kb20gcGhhc2UgYmV0d2VlbiDPgCBhbmQgLc+AID9cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCB0YXJnZXRJbmRleCA9IGluZGV4IDwgbnF1aXlzdCA/IGluZGV4IDogZmZ0U2l6ZSAtIGluZGV4O1xuICAgICAgICB2YWx1ZS5yZWFsID0gdGhpcy5pbkZyYW1lW3RhcmdldEluZGV4XSAvIDI7XG4gICAgICAgIHZhbHVlLmltYWcgPSAwO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3Qgc2lnbmFsID0gY29tcGxleEZyYW1lLkludkZGVCgpLnJlYWw7XG5cbiAgICAvLyBhcHBseSBub3JtYWxpemVDb2VmcyBmcm9tIHdpbmRvd2luZyBoZXJlIHRvIHNjYWxlIHRoZSBzaWduYWwgP1xuICB9XG59XG4iXX0=