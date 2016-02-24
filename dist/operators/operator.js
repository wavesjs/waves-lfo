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

/**
 * apply a given function on each frame
 *
 * @SIGNATURE scalar callback
 * function(value, index, frame) {
 *   return doSomething(value)
 * }
 *
 * @SIGNATURE vector callback
 * function(time, inFrame, outFrame) {
 *   outFrame.set(inFrame, 0);
 *   return time + 1;
 * }
 *
 */

var _coreBaseLfo2 = _interopRequireDefault(_coreBaseLfo);

var Operator = (function (_BaseLfo) {
  _inherits(Operator, _BaseLfo);

  function Operator(options) {
    _classCallCheck(this, Operator);

    _get(Object.getPrototypeOf(Operator.prototype), 'constructor', this).call(this, options, {});

    this.params.type = this.params.type || 'scalar';

    if (this.params.onProcess) {
      this.callback = this.params.onProcess.bind(this);
    }
  }

  _createClass(Operator, [{
    key: 'configureStream',
    value: function configureStream() {
      if (this.params.type === 'vector' && this.params.frameSize) {
        this.streamParams.frameSize = this.params.frameSize;
      }
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      // apply the callback to the frame
      if (this.params.type === 'vector') {
        var outTime = this.callback(time, frame, this.outFrame);

        if (outTime !== undefined) {
          time = outTime;
        }
      } else {
        for (var i = 0, l = frame.length; i < l; i++) {
          this.outFrame[i] = this.callback(frame[i], i);
        }
      }

      this.time = time;
      this.metaData = metaData;

      this.output();
    }
  }]);

  return Operator;
})(_coreBaseLfo2['default']);

exports['default'] = Operator;
;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvb3BlcmF0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OzsyQkFBb0Isa0JBQWtCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWlCakIsUUFBUTtZQUFSLFFBQVE7O0FBRWhCLFdBRlEsUUFBUSxDQUVmLE9BQU8sRUFBRTswQkFGRixRQUFROztBQUd6QiwrQkFIaUIsUUFBUSw2Q0FHbkIsT0FBTyxFQUFFLEVBQUUsRUFBRTs7QUFFbkIsUUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksUUFBUSxDQUFDOztBQUVoRCxRQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFO0FBQ3pCLFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ2xEO0dBQ0Y7O2VBVmtCLFFBQVE7O1dBWVosMkJBQUc7QUFDaEIsVUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxRQUFRLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUU7QUFDMUQsWUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7T0FDckQ7S0FDRjs7O1dBRU0saUJBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7O0FBRTdCLFVBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFFO0FBQ2pDLFlBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRXhELFlBQUksT0FBTyxLQUFLLFNBQVMsRUFBRTtBQUN6QixjQUFJLEdBQUcsT0FBTyxDQUFDO1NBQ2hCO09BQ0YsTUFBTTtBQUNMLGFBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDNUMsY0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUMvQztPQUNGOztBQUVELFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLFVBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDOztBQUV6QixVQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDZjs7O1NBcENrQixRQUFROzs7cUJBQVIsUUFBUTtBQXFDNUIsQ0FBQyIsImZpbGUiOiJlczYvb3BlcmF0b3JzL29wZXJhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vY29yZS9iYXNlLWxmbyc7XG5cbi8qKlxuICogYXBwbHkgYSBnaXZlbiBmdW5jdGlvbiBvbiBlYWNoIGZyYW1lXG4gKlxuICogQFNJR05BVFVSRSBzY2FsYXIgY2FsbGJhY2tcbiAqIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgZnJhbWUpIHtcbiAqICAgcmV0dXJuIGRvU29tZXRoaW5nKHZhbHVlKVxuICogfVxuICpcbiAqIEBTSUdOQVRVUkUgdmVjdG9yIGNhbGxiYWNrXG4gKiBmdW5jdGlvbih0aW1lLCBpbkZyYW1lLCBvdXRGcmFtZSkge1xuICogICBvdXRGcmFtZS5zZXQoaW5GcmFtZSwgMCk7XG4gKiAgIHJldHVybiB0aW1lICsgMTtcbiAqIH1cbiAqXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE9wZXJhdG9yIGV4dGVuZHMgQmFzZUxmbyB7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKG9wdGlvbnMsIHt9KTtcblxuICAgIHRoaXMucGFyYW1zLnR5cGUgPSB0aGlzLnBhcmFtcy50eXBlIHx8wqAnc2NhbGFyJztcblxuICAgIGlmICh0aGlzLnBhcmFtcy5vblByb2Nlc3MpIHtcbiAgICAgIHRoaXMuY2FsbGJhY2sgPSB0aGlzLnBhcmFtcy5vblByb2Nlc3MuYmluZCh0aGlzKTtcbiAgICB9XG4gIH1cblxuICBjb25maWd1cmVTdHJlYW0oKSB7XG4gICAgaWYgKHRoaXMucGFyYW1zLnR5cGUgPT09ICd2ZWN0b3InICYmIHRoaXMucGFyYW1zLmZyYW1lU2l6ZSkge1xuICAgICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gdGhpcy5wYXJhbXMuZnJhbWVTaXplO1xuICAgIH1cbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgLy8gYXBwbHkgdGhlIGNhbGxiYWNrIHRvIHRoZSBmcmFtZVxuICAgIGlmICh0aGlzLnBhcmFtcy50eXBlID09PSAndmVjdG9yJykge1xuICAgICAgdmFyIG91dFRpbWUgPSB0aGlzLmNhbGxiYWNrKHRpbWUsIGZyYW1lLCB0aGlzLm91dEZyYW1lKTtcblxuICAgICAgaWYgKG91dFRpbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aW1lID0gb3V0VGltZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBmcmFtZS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdGhpcy5vdXRGcmFtZVtpXSA9IHRoaXMuY2FsbGJhY2soZnJhbWVbaV0sIGkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMudGltZSA9IHRpbWU7XG4gICAgdGhpcy5tZXRhRGF0YSA9IG1ldGFEYXRhO1xuXG4gICAgdGhpcy5vdXRwdXQoKTtcbiAgfVxufTtcbiJdfQ==