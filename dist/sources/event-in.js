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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EventIn = function (_BaseLfo) {
  (0, _inherits3.default)(EventIn, _BaseLfo);

  function EventIn(options) {
    (0, _classCallCheck3.default)(this, EventIn);


    // test AudioContext for use in node environment

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(EventIn).call(this, {
      absoluteTime: false
    }, options));

    if (!_this.params.ctx && typeof process === 'undefined') {
      _this.params.ctx = new AudioContext();
    }

    _this._isStarted = false;
    _this._startTime = undefined;
    return _this;
  }

  (0, _createClass3.default)(EventIn, [{
    key: 'initialize',
    value: function initialize() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(EventIn.prototype), 'initialize', this).call(this, {
        frameSize: this.params.frameSize,
        frameRate: this.params.frameRate,
        sourceSampleRate: this.params.frameRate
      });
    }
  }, {
    key: 'start',
    value: function start() {
      this.initialize();
      this.reset();

      var currentTime = this.params.ctx.currentTime;

      // should be setted in the first process call
      this._isStarted = true;
      this._startTime = undefined;
      this._lastTime = undefined;
    }
  }, {
    key: 'stop',
    value: function stop() {
      if (this._isStarted && this._startTime) {
        var currentTime = this.params.ctx.currentTime;
        var endTime = this.time + (currentTime - this._lastTime);

        this.finalize(endTime);
      }
    }
  }, {
    key: 'process',
    value: function process(time, frame) {
      var metaData = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      if (!this._isStarted) return;

      var currentTime = this.params.ctx.currentTime;
      // if no time provided, use audioContext.currentTime
      time = !isNaN(parseFloat(time)) && isFinite(time) ? time : currentTime;

      // set `startTime` if first call after a `start`
      if (!this._startTime) this._startTime = time;

      // handle time according to config
      if (this.params.absoluteTime === false) time = time - this._startTime;

      // if scalar, create a vector
      if (frame.length === undefined) frame = [frame];

      // works if frame is an array
      this.outFrame.set(frame, 0);
      this.time = time;
      this.metaData = metaData;
      this._lastTime = currentTime;

      this.output();
    }
  }]);
  return EventIn;
}(_baseLfo2.default);

exports.default = EventIn;


module.exports = EventIn;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV2ZW50LWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7SUFHcUI7OztBQUNuQixXQURtQixPQUNuQixDQUFZLE9BQVosRUFBcUI7d0NBREYsU0FDRTs7Ozs7NkZBREYsb0JBRVg7QUFDSixvQkFBYyxLQUFkO09BQ0MsVUFIZ0I7O0FBTW5CLFFBQUksQ0FBQyxNQUFLLE1BQUwsQ0FBWSxHQUFaLElBQW9CLE9BQU8sT0FBUCxLQUFtQixXQUFuQixFQUFpQztBQUN4RCxZQUFLLE1BQUwsQ0FBWSxHQUFaLEdBQWtCLElBQUksWUFBSixFQUFsQixDQUR3RDtLQUExRDs7QUFJQSxVQUFLLFVBQUwsR0FBa0IsS0FBbEIsQ0FWbUI7QUFXbkIsVUFBSyxVQUFMLEdBQWtCLFNBQWxCLENBWG1COztHQUFyQjs7NkJBRG1COztpQ0FlTjtBQUNYLHVEQWhCaUIsbURBZ0JBO0FBQ2YsbUJBQVcsS0FBSyxNQUFMLENBQVksU0FBWjtBQUNYLG1CQUFXLEtBQUssTUFBTCxDQUFZLFNBQVo7QUFDWCwwQkFBa0IsS0FBSyxNQUFMLENBQVksU0FBWjtRQUhwQixDQURXOzs7OzRCQVFMO0FBQ04sV0FBSyxVQUFMLEdBRE07QUFFTixXQUFLLEtBQUwsR0FGTTs7QUFJTixVQUFNLGNBQWMsS0FBSyxNQUFMLENBQVksR0FBWixDQUFnQixXQUFoQjs7O0FBSmQsVUFPTixDQUFLLFVBQUwsR0FBa0IsSUFBbEIsQ0FQTTtBQVFOLFdBQUssVUFBTCxHQUFrQixTQUFsQixDQVJNO0FBU04sV0FBSyxTQUFMLEdBQWlCLFNBQWpCLENBVE07Ozs7MkJBWUQ7QUFDTCxVQUFJLEtBQUssVUFBTCxJQUFtQixLQUFLLFVBQUwsRUFBaUI7QUFDdEMsWUFBTSxjQUFjLEtBQUssTUFBTCxDQUFZLEdBQVosQ0FBZ0IsV0FBaEIsQ0FEa0I7QUFFdEMsWUFBTSxVQUFVLEtBQUssSUFBTCxJQUFhLGNBQWMsS0FBSyxTQUFMLENBQTNCLENBRnNCOztBQUl0QyxhQUFLLFFBQUwsQ0FBYyxPQUFkLEVBSnNDO09BQXhDOzs7OzRCQVFNLE1BQU0sT0FBc0I7VUFBZixpRUFBVyxrQkFBSTs7QUFDbEMsVUFBSSxDQUFDLEtBQUssVUFBTCxFQUFpQixPQUF0Qjs7QUFFQSxVQUFNLGNBQWMsS0FBSyxNQUFMLENBQVksR0FBWixDQUFnQixXQUFoQjs7QUFIYyxVQUtsQyxHQUFPLENBQUMsTUFBTSxXQUFXLElBQVgsQ0FBTixDQUFELElBQTRCLFNBQVMsSUFBVCxDQUE1QixHQUNMLElBREssR0FDRSxXQURGOzs7QUFMMkIsVUFTOUIsQ0FBQyxLQUFLLFVBQUwsRUFDSCxLQUFLLFVBQUwsR0FBa0IsSUFBbEIsQ0FERjs7O0FBVGtDLFVBYTlCLEtBQUssTUFBTCxDQUFZLFlBQVosS0FBNkIsS0FBN0IsRUFDRixPQUFPLE9BQU8sS0FBSyxVQUFMLENBRGhCOzs7QUFia0MsVUFpQjlCLE1BQU0sTUFBTixLQUFpQixTQUFqQixFQUNGLFFBQVEsQ0FBQyxLQUFELENBQVIsQ0FERjs7O0FBakJrQyxVQXFCbEMsQ0FBSyxRQUFMLENBQWMsR0FBZCxDQUFrQixLQUFsQixFQUF5QixDQUF6QixFQXJCa0M7QUFzQmxDLFdBQUssSUFBTCxHQUFZLElBQVosQ0F0QmtDO0FBdUJsQyxXQUFLLFFBQUwsR0FBZ0IsUUFBaEIsQ0F2QmtDO0FBd0JsQyxXQUFLLFNBQUwsR0FBaUIsV0FBakIsQ0F4QmtDOztBQTBCbEMsV0FBSyxNQUFMLEdBMUJrQzs7O1NBNUNqQjs7Ozs7O0FBMEVyQixPQUFPLE9BQVAsR0FBaUIsT0FBakIiLCJmaWxlIjoiZXZlbnQtaW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi9jb3JlL2Jhc2UtbGZvJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFdmVudEluIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcih7XG4gICAgICBhYnNvbHV0ZVRpbWU6IGZhbHNlLFxuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgLy8gdGVzdCBBdWRpb0NvbnRleHQgZm9yIHVzZSBpbiBub2RlIGVudmlyb25tZW50XG4gICAgaWYgKCF0aGlzLnBhcmFtcy5jdHggJiYgKHR5cGVvZiBwcm9jZXNzID09PSAndW5kZWZpbmVkJykpIHtcbiAgICAgIHRoaXMucGFyYW1zLmN0eCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9pc1N0YXJ0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9zdGFydFRpbWUgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoe1xuICAgICAgZnJhbWVTaXplOiB0aGlzLnBhcmFtcy5mcmFtZVNpemUsXG4gICAgICBmcmFtZVJhdGU6IHRoaXMucGFyYW1zLmZyYW1lUmF0ZSxcbiAgICAgIHNvdXJjZVNhbXBsZVJhdGU6IHRoaXMucGFyYW1zLmZyYW1lUmF0ZSxcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMucmVzZXQoKTtcblxuICAgIGNvbnN0IGN1cnJlbnRUaW1lID0gdGhpcy5wYXJhbXMuY3R4LmN1cnJlbnRUaW1lO1xuXG4gICAgLy8gc2hvdWxkIGJlIHNldHRlZCBpbiB0aGUgZmlyc3QgcHJvY2VzcyBjYWxsXG4gICAgdGhpcy5faXNTdGFydGVkID0gdHJ1ZTtcbiAgICB0aGlzLl9zdGFydFRpbWUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fbGFzdFRpbWUgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIGlmICh0aGlzLl9pc1N0YXJ0ZWQgJiYgdGhpcy5fc3RhcnRUaW1lKSB7XG4gICAgICBjb25zdCBjdXJyZW50VGltZSA9IHRoaXMucGFyYW1zLmN0eC5jdXJyZW50VGltZTtcbiAgICAgIGNvbnN0IGVuZFRpbWUgPSB0aGlzLnRpbWUgKyAoY3VycmVudFRpbWUgLSB0aGlzLl9sYXN0VGltZSk7XG5cbiAgICAgIHRoaXMuZmluYWxpemUoZW5kVGltZSk7XG4gICAgfVxuICB9XG5cbiAgcHJvY2Vzcyh0aW1lLCBmcmFtZSwgbWV0YURhdGEgPSB7fSkge1xuICAgIGlmICghdGhpcy5faXNTdGFydGVkKSByZXR1cm47XG5cbiAgICBjb25zdCBjdXJyZW50VGltZSA9IHRoaXMucGFyYW1zLmN0eC5jdXJyZW50VGltZTtcbiAgICAvLyBpZiBubyB0aW1lIHByb3ZpZGVkLCB1c2UgYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lXG4gICAgdGltZSA9ICFpc05hTihwYXJzZUZsb2F0KHRpbWUpKSAmJiBpc0Zpbml0ZSh0aW1lKSA/XG4gICAgICB0aW1lIDogY3VycmVudFRpbWU7XG5cbiAgICAvLyBzZXQgYHN0YXJ0VGltZWAgaWYgZmlyc3QgY2FsbCBhZnRlciBhIGBzdGFydGBcbiAgICBpZiAoIXRoaXMuX3N0YXJ0VGltZSlcbiAgICAgIHRoaXMuX3N0YXJ0VGltZSA9IHRpbWU7XG5cbiAgICAvLyBoYW5kbGUgdGltZSBhY2NvcmRpbmcgdG8gY29uZmlnXG4gICAgaWYgKHRoaXMucGFyYW1zLmFic29sdXRlVGltZSA9PT0gZmFsc2UpXG4gICAgICB0aW1lID0gdGltZSAtIHRoaXMuX3N0YXJ0VGltZTtcblxuICAgIC8vIGlmIHNjYWxhciwgY3JlYXRlIGEgdmVjdG9yXG4gICAgaWYgKGZyYW1lLmxlbmd0aCA9PT0gdW5kZWZpbmVkKVxuICAgICAgZnJhbWUgPSBbZnJhbWVdO1xuXG4gICAgLy8gd29ya3MgaWYgZnJhbWUgaXMgYW4gYXJyYXlcbiAgICB0aGlzLm91dEZyYW1lLnNldChmcmFtZSwgMCk7XG4gICAgdGhpcy50aW1lID0gdGltZTtcbiAgICB0aGlzLm1ldGFEYXRhID0gbWV0YURhdGE7XG4gICAgdGhpcy5fbGFzdFRpbWUgPSBjdXJyZW50VGltZTtcblxuICAgIHRoaXMub3V0cHV0KCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEluO1xuIl19