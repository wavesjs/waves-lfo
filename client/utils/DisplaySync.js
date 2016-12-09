"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Synchronize several display sinks to a common time.
 *
 * @param {...BaseDisplay} views - List of the display to synchronize.
 *
 * @memberof module:client.utils
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * const eventIn1 = new lfo.source.EventIn({
 *   frameType: 'scalar',
 *   frameSize: 1,
 * });
 *
 * const bpf1 = new lfo.sink.BpfDisplay({
 *   canvas: '#bpf-1',
 *   duration: 2,
 *   startTime: 0,
 *   min: 0,
 *   colors: ['steelblue'],
 * });
 *
 * eventIn1.connect(bpf1);
 *
 * const eventIn2 = new lfo.source.EventIn({
 *   frameType: 'scalar',
 *   frameSize: 1,
 * });
 *
 * const bpf2 = new lfo.sink.BpfDisplay({
 *   canvas: '#bpf-2',
 *   duration: 2,
 *   startTime: 7,
 *   min: 0,
 *   colors: ['orange'],
 * });
 *
 * const displaySync = new lfo.utils.DisplaySync(bpf1, bpf2);
 *
 * eventIn2.connect(bpf2);
 *
 * eventIn1.start();
 * eventIn2.start();
 *
 * let time = 0;
 * const period = 0.4;
 * const offset = 7.2;
 *
 * (function generateData() {
 *   const v = Math.random();
 *
 *   eventIn1.process(time, v);
 *   eventIn2.process(time + offset, v);
 *
 *   time += period;
 *
 *   setTimeout(generateData, period * 1000);
 * }());
 */
var DisplaySync = function () {
  function DisplaySync() {
    (0, _classCallCheck3.default)(this, DisplaySync);

    this.views = [];

    this.add.apply(this, arguments);
  }

  /** @private */


  (0, _createClass3.default)(DisplaySync, [{
    key: "add",
    value: function add() {
      var _this = this;

      for (var _len = arguments.length, views = Array(_len), _key = 0; _key < _len; _key++) {
        views[_key] = arguments[_key];
      }

      views.forEach(function (view) {
        return _this.install(view);
      });
    }

    /** @private */

  }, {
    key: "install",
    value: function install(view) {
      this.views.push(view);

      view.displaySync = this;
    }

    /** @private */

  }, {
    key: "shiftSiblings",
    value: function shiftSiblings(iShift, time, view) {
      this.views.forEach(function (display) {
        if (display !== view) display.shiftCanvas(iShift, time);
      });
    }
  }]);
  return DisplaySync;
}();

exports.default = DisplaySync;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRpc3BsYXlTeW5jLmpzIl0sIm5hbWVzIjpbIkRpc3BsYXlTeW5jIiwidmlld3MiLCJhZGQiLCJmb3JFYWNoIiwiaW5zdGFsbCIsInZpZXciLCJwdXNoIiwiZGlzcGxheVN5bmMiLCJpU2hpZnQiLCJ0aW1lIiwiZGlzcGxheSIsInNoaWZ0Q2FudmFzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQTRETUEsVztBQUNKLHlCQUFzQjtBQUFBOztBQUNwQixTQUFLQyxLQUFMLEdBQWEsRUFBYjs7QUFFQSxTQUFLQyxHQUFMO0FBQ0Q7O0FBRUQ7Ozs7OzBCQUNjO0FBQUE7O0FBQUEsd0NBQVBELEtBQU87QUFBUEEsYUFBTztBQUFBOztBQUNaQSxZQUFNRSxPQUFOLENBQWM7QUFBQSxlQUFRLE1BQUtDLE9BQUwsQ0FBYUMsSUFBYixDQUFSO0FBQUEsT0FBZDtBQUNEOztBQUVEOzs7OzRCQUNRQSxJLEVBQU07QUFDWixXQUFLSixLQUFMLENBQVdLLElBQVgsQ0FBZ0JELElBQWhCOztBQUVBQSxXQUFLRSxXQUFMLEdBQW1CLElBQW5CO0FBQ0Q7O0FBRUQ7Ozs7a0NBQ2NDLE0sRUFBUUMsSSxFQUFNSixJLEVBQU07QUFDaEMsV0FBS0osS0FBTCxDQUFXRSxPQUFYLENBQW1CLFVBQVNPLE9BQVQsRUFBa0I7QUFDbkMsWUFBSUEsWUFBWUwsSUFBaEIsRUFDRUssUUFBUUMsV0FBUixDQUFvQkgsTUFBcEIsRUFBNEJDLElBQTVCO0FBQ0gsT0FIRDtBQUlEOzs7OztrQkFHWVQsVyIsImZpbGUiOiJEaXNwbGF5U3luYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3luY2hyb25pemUgc2V2ZXJhbCBkaXNwbGF5IHNpbmtzIHRvIGEgY29tbW9uIHRpbWUuXG4gKlxuICogQHBhcmFtIHsuLi5CYXNlRGlzcGxheX0gdmlld3MgLSBMaXN0IG9mIHRoZSBkaXNwbGF5IHRvIHN5bmNocm9uaXplLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6Y2xpZW50LnV0aWxzXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY2xpZW50JztcbiAqXG4gKiBjb25zdCBldmVudEluMSA9IG5ldyBsZm8uc291cmNlLkV2ZW50SW4oe1xuICogICBmcmFtZVR5cGU6ICdzY2FsYXInLFxuICogICBmcmFtZVNpemU6IDEsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBicGYxID0gbmV3IGxmby5zaW5rLkJwZkRpc3BsYXkoe1xuICogICBjYW52YXM6ICcjYnBmLTEnLFxuICogICBkdXJhdGlvbjogMixcbiAqICAgc3RhcnRUaW1lOiAwLFxuICogICBtaW46IDAsXG4gKiAgIGNvbG9yczogWydzdGVlbGJsdWUnXSxcbiAqIH0pO1xuICpcbiAqIGV2ZW50SW4xLmNvbm5lY3QoYnBmMSk7XG4gKlxuICogY29uc3QgZXZlbnRJbjIgPSBuZXcgbGZvLnNvdXJjZS5FdmVudEluKHtcbiAqICAgZnJhbWVUeXBlOiAnc2NhbGFyJyxcbiAqICAgZnJhbWVTaXplOiAxLFxuICogfSk7XG4gKlxuICogY29uc3QgYnBmMiA9IG5ldyBsZm8uc2luay5CcGZEaXNwbGF5KHtcbiAqICAgY2FudmFzOiAnI2JwZi0yJyxcbiAqICAgZHVyYXRpb246IDIsXG4gKiAgIHN0YXJ0VGltZTogNyxcbiAqICAgbWluOiAwLFxuICogICBjb2xvcnM6IFsnb3JhbmdlJ10sXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBkaXNwbGF5U3luYyA9IG5ldyBsZm8udXRpbHMuRGlzcGxheVN5bmMoYnBmMSwgYnBmMik7XG4gKlxuICogZXZlbnRJbjIuY29ubmVjdChicGYyKTtcbiAqXG4gKiBldmVudEluMS5zdGFydCgpO1xuICogZXZlbnRJbjIuc3RhcnQoKTtcbiAqXG4gKiBsZXQgdGltZSA9IDA7XG4gKiBjb25zdCBwZXJpb2QgPSAwLjQ7XG4gKiBjb25zdCBvZmZzZXQgPSA3LjI7XG4gKlxuICogKGZ1bmN0aW9uIGdlbmVyYXRlRGF0YSgpIHtcbiAqICAgY29uc3QgdiA9IE1hdGgucmFuZG9tKCk7XG4gKlxuICogICBldmVudEluMS5wcm9jZXNzKHRpbWUsIHYpO1xuICogICBldmVudEluMi5wcm9jZXNzKHRpbWUgKyBvZmZzZXQsIHYpO1xuICpcbiAqICAgdGltZSArPSBwZXJpb2Q7XG4gKlxuICogICBzZXRUaW1lb3V0KGdlbmVyYXRlRGF0YSwgcGVyaW9kICogMTAwMCk7XG4gKiB9KCkpO1xuICovXG5jbGFzcyBEaXNwbGF5U3luYyB7XG4gIGNvbnN0cnVjdG9yKC4uLnZpZXdzKSB7XG4gICAgdGhpcy52aWV3cyA9IFtdO1xuXG4gICAgdGhpcy5hZGQoLi4udmlld3MpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGFkZCguLi52aWV3cykge1xuICAgIHZpZXdzLmZvckVhY2godmlldyA9PiB0aGlzLmluc3RhbGwodmlldykpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGluc3RhbGwodmlldykge1xuICAgIHRoaXMudmlld3MucHVzaCh2aWV3KTtcblxuICAgIHZpZXcuZGlzcGxheVN5bmMgPSB0aGlzO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHNoaWZ0U2libGluZ3MoaVNoaWZ0LCB0aW1lLCB2aWV3KSB7XG4gICAgdGhpcy52aWV3cy5mb3JFYWNoKGZ1bmN0aW9uKGRpc3BsYXkpIHtcbiAgICAgIGlmIChkaXNwbGF5ICE9PSB2aWV3KVxuICAgICAgICBkaXNwbGF5LnNoaWZ0Q2FudmFzKGlTaGlmdCwgdGltZSk7XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRGlzcGxheVN5bmM7XG4iXX0=