'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseDraw = require('./base-draw');

var _baseDraw2 = _interopRequireDefault(_baseDraw);

var _utilsDrawUtils = require('../utils/draw-utils');

var Spectrogram = (function (_BaseDraw) {
  _inherits(Spectrogram, _BaseDraw);

  function Spectrogram(options) {
    _classCallCheck(this, Spectrogram);

    _get(Object.getPrototypeOf(Spectrogram.prototype), 'constructor', this).call(this, options, {
      min: 0,
      max: 1,
      scale: 1,
      color: (0, _utilsDrawUtils.getRandomColor)()
    });

    _get(Object.getPrototypeOf(Spectrogram.prototype), 'constructor', this).call(this, options, defaults);
  }

  _createClass(Spectrogram, [{
    key: 'drawCurve',
    value: function drawCurve(frame) {
      var nbrBins = frame.length;
      var width = this.params.width;
      var height = this.params.height;
      var binWidth = width / nbrBins;
      var scale = this.params.scale;
      var ctx = this.ctx;

      ctx.fillStyle = this.params.color;
      ctx.clearRect(0, 0, width, height);

      for (var i = 0; i < nbrBins; i++) {
        var x = Math.round(i / nbrBins * width);
        var y = this.getYPosition(frame[i] * scale);

        ctx.fillRect(x, y, binWidth, height - y);
      }
    }
  }, {
    key: 'scale',
    set: function set(value) {
      this.params.scale = value;
    },
    get: function get() {
      return this.params.scale;
    }
  }]);

  return Spectrogram;
})(_baseDraw2['default']);

exports['default'] = Spectrogram;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaW5rcy9zcGVjdHJvZ3JhbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3dCQUFxQixhQUFhOzs7OzhCQUNILHFCQUFxQjs7SUFFL0IsV0FBVztZQUFYLFdBQVc7O0FBQ25CLFdBRFEsV0FBVyxDQUNsQixPQUFPLEVBQUU7MEJBREYsV0FBVzs7QUFFNUIsK0JBRmlCLFdBQVcsNkNBRXRCLE9BQU8sRUFBRTtBQUNiLFNBQUcsRUFBRSxDQUFDO0FBQ04sU0FBRyxFQUFFLENBQUM7QUFDTixXQUFLLEVBQUUsQ0FBQztBQUNSLFdBQUssRUFBRSxxQ0FBZ0I7S0FDeEIsRUFBRTs7QUFFSCwrQkFUaUIsV0FBVyw2Q0FTdEIsT0FBTyxFQUFFLFFBQVEsRUFBRTtHQUMxQjs7ZUFWa0IsV0FBVzs7V0FvQnJCLG1CQUFDLEtBQUssRUFBRTtBQUNmLFVBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7QUFDN0IsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDaEMsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDbEMsVUFBTSxRQUFRLEdBQUcsS0FBSyxHQUFHLE9BQU8sQ0FBQztBQUNqQyxVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNoQyxVQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDOztBQUVyQixTQUFHLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ2xDLFNBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7O0FBRW5DLFdBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDaEMsWUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsT0FBTyxHQUFHLEtBQUssQ0FBQyxDQUFDO0FBQzFDLFlBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDOztBQUU5QyxXQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztPQUMxQztLQUNGOzs7U0F6QlEsYUFBQyxLQUFLLEVBQUU7QUFDZixVQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7S0FDM0I7U0FFUSxlQUFHO0FBQ1YsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztLQUMxQjs7O1NBbEJrQixXQUFXOzs7cUJBQVgsV0FBVyIsImZpbGUiOiJlczYvc2lua3Mvc3BlY3Ryb2dyYW0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZURyYXcgZnJvbSAnLi9iYXNlLWRyYXcnO1xuaW1wb3J0IHsgZ2V0UmFuZG9tQ29sb3IgfSBmcm9tICcuLi91dGlscy9kcmF3LXV0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3BlY3Ryb2dyYW0gZXh0ZW5kcyBCYXNlRHJhdyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihvcHRpb25zLCB7XG4gICAgICBtaW46IDAsXG4gICAgICBtYXg6IDEsXG4gICAgICBzY2FsZTogMSxcbiAgICAgIGNvbG9yOiBnZXRSYW5kb21Db2xvcigpLFxuICAgIH0pO1xuXG4gICAgc3VwZXIob3B0aW9ucywgZGVmYXVsdHMpO1xuICB9XG5cbiAgc2V0IHNjYWxlKHZhbHVlKSB7XG4gICAgdGhpcy5wYXJhbXMuc2NhbGUgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBzY2FsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJhbXMuc2NhbGU7XG4gIH1cblxuICBkcmF3Q3VydmUoZnJhbWUpIHtcbiAgICBjb25zdCBuYnJCaW5zID0gZnJhbWUubGVuZ3RoO1xuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5wYXJhbXMud2lkdGg7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuICAgIGNvbnN0IGJpbldpZHRoID0gd2lkdGggLyBuYnJCaW5zO1xuICAgIGNvbnN0IHNjYWxlID0gdGhpcy5wYXJhbXMuc2NhbGU7XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHg7XG5cbiAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5wYXJhbXMuY29sb3I7XG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmJyQmluczsgaSsrKSB7XG4gICAgICBjb25zdCB4ID0gTWF0aC5yb3VuZChpIC8gbmJyQmlucyAqIHdpZHRoKTtcbiAgICAgIGNvbnN0IHkgPSB0aGlzLmdldFlQb3NpdGlvbihmcmFtZVtpXSAqIHNjYWxlKTtcblxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIGJpbldpZHRoLCBoZWlnaHQgLSB5KTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==