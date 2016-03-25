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
      var frameTime = !isNaN(parseFloat(time)) && isFinite(time) ? time : currentTime;

      // set `startTime` if first call after a `start`
      if (!this._startTime) this._startTime = frameTime;

      // handle time according to config
      if (this.params.absoluteTime === false) frameTime = time - this._startTime;

      // if scalar, create a vector
      if (frame.length === undefined) frame = [frame];

      // works if frame is an array
      this.outFrame.set(frame, 0);
      this.time = frameTime;
      this.metaData = metaData;

      this._lastTime = currentTime;

      this.output();
    }
  }]);
  return EventIn;
}(_baseLfo2.default);

exports.default = EventIn;


module.exports = EventIn;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV2ZW50LWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7SUFHcUI7OztBQUNuQixXQURtQixPQUNuQixDQUFZLE9BQVosRUFBcUI7d0NBREYsU0FDRTs7Ozs7NkZBREYsb0JBRVg7QUFDSixvQkFBYyxLQUFkO09BQ0MsVUFIZ0I7O0FBTW5CLFFBQUksQ0FBQyxNQUFLLE1BQUwsQ0FBWSxHQUFaLElBQW9CLE9BQU8sT0FBUCxLQUFtQixXQUFuQixFQUFpQztBQUN4RCxZQUFLLE1BQUwsQ0FBWSxHQUFaLEdBQWtCLElBQUksWUFBSixFQUFsQixDQUR3RDtLQUExRDs7QUFJQSxVQUFLLFVBQUwsR0FBa0IsS0FBbEIsQ0FWbUI7QUFXbkIsVUFBSyxVQUFMLEdBQWtCLFNBQWxCLENBWG1COztHQUFyQjs7NkJBRG1COztpQ0FlTjtBQUNYLHVEQWhCaUIsbURBZ0JBO0FBQ2YsbUJBQVcsS0FBSyxNQUFMLENBQVksU0FBWjtBQUNYLG1CQUFXLEtBQUssTUFBTCxDQUFZLFNBQVo7QUFDWCwwQkFBa0IsS0FBSyxNQUFMLENBQVksU0FBWjtRQUhwQixDQURXOzs7OzRCQVFMO0FBQ04sV0FBSyxVQUFMLEdBRE07QUFFTixXQUFLLEtBQUwsR0FGTTs7QUFJTixVQUFNLGNBQWMsS0FBSyxNQUFMLENBQVksR0FBWixDQUFnQixXQUFoQjs7O0FBSmQsVUFPTixDQUFLLFVBQUwsR0FBa0IsSUFBbEIsQ0FQTTtBQVFOLFdBQUssVUFBTCxHQUFrQixTQUFsQixDQVJNO0FBU04sV0FBSyxTQUFMLEdBQWlCLFNBQWpCLENBVE07Ozs7MkJBWUQ7QUFDTCxVQUFJLEtBQUssVUFBTCxJQUFtQixLQUFLLFVBQUwsRUFBaUI7QUFDdEMsWUFBTSxjQUFjLEtBQUssTUFBTCxDQUFZLEdBQVosQ0FBZ0IsV0FBaEIsQ0FEa0I7QUFFdEMsWUFBTSxVQUFVLEtBQUssSUFBTCxJQUFhLGNBQWMsS0FBSyxTQUFMLENBQTNCLENBRnNCOztBQUl0QyxhQUFLLFFBQUwsQ0FBYyxPQUFkLEVBSnNDO09BQXhDOzs7OzRCQVFNLE1BQU0sT0FBc0I7VUFBZixpRUFBVyxrQkFBSTs7QUFDbEMsVUFBSSxDQUFDLEtBQUssVUFBTCxFQUFpQixPQUF0Qjs7QUFFQSxVQUFNLGNBQWMsS0FBSyxNQUFMLENBQVksR0FBWixDQUFnQixXQUFoQjs7QUFIYyxVQUs5QixZQUFZLENBQUMsTUFBTSxXQUFXLElBQVgsQ0FBTixDQUFELElBQTRCLFNBQVMsSUFBVCxDQUE1QixHQUNkLElBRGMsR0FDUCxXQURPOzs7QUFMa0IsVUFTOUIsQ0FBQyxLQUFLLFVBQUwsRUFDSCxLQUFLLFVBQUwsR0FBa0IsU0FBbEIsQ0FERjs7O0FBVGtDLFVBYTlCLEtBQUssTUFBTCxDQUFZLFlBQVosS0FBNkIsS0FBN0IsRUFDRixZQUFZLE9BQU8sS0FBSyxVQUFMLENBRHJCOzs7QUFia0MsVUFpQjlCLE1BQU0sTUFBTixLQUFpQixTQUFqQixFQUNGLFFBQVEsQ0FBQyxLQUFELENBQVIsQ0FERjs7O0FBakJrQyxVQXFCbEMsQ0FBSyxRQUFMLENBQWMsR0FBZCxDQUFrQixLQUFsQixFQUF5QixDQUF6QixFQXJCa0M7QUFzQmxDLFdBQUssSUFBTCxHQUFZLFNBQVosQ0F0QmtDO0FBdUJsQyxXQUFLLFFBQUwsR0FBZ0IsUUFBaEIsQ0F2QmtDOztBQXlCbEMsV0FBSyxTQUFMLEdBQWlCLFdBQWpCLENBekJrQzs7QUEyQmxDLFdBQUssTUFBTCxHQTNCa0M7OztTQTVDakI7Ozs7OztBQTJFckIsT0FBTyxPQUFQLEdBQWlCLE9BQWpCIiwiZmlsZSI6ImV2ZW50LWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vY29yZS9iYXNlLWxmbyc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRJbiBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIoe1xuICAgICAgYWJzb2x1dGVUaW1lOiBmYWxzZSxcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIC8vIHRlc3QgQXVkaW9Db250ZXh0IGZvciB1c2UgaW4gbm9kZSBlbnZpcm9ubWVudFxuICAgIGlmICghdGhpcy5wYXJhbXMuY3R4ICYmICh0eXBlb2YgcHJvY2VzcyA9PT0gJ3VuZGVmaW5lZCcpKSB7XG4gICAgICB0aGlzLnBhcmFtcy5jdHggPSBuZXcgQXVkaW9Db250ZXh0KCk7XG4gICAgfVxuXG4gICAgdGhpcy5faXNTdGFydGVkID0gZmFsc2U7XG4gICAgdGhpcy5fc3RhcnRUaW1lID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKHtcbiAgICAgIGZyYW1lU2l6ZTogdGhpcy5wYXJhbXMuZnJhbWVTaXplLFxuICAgICAgZnJhbWVSYXRlOiB0aGlzLnBhcmFtcy5mcmFtZVJhdGUsXG4gICAgICBzb3VyY2VTYW1wbGVSYXRlOiB0aGlzLnBhcmFtcy5mcmFtZVJhdGUsXG4gICAgfSk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnJlc2V0KCk7XG5cbiAgICBjb25zdCBjdXJyZW50VGltZSA9IHRoaXMucGFyYW1zLmN0eC5jdXJyZW50VGltZTtcblxuICAgIC8vIHNob3VsZCBiZSBzZXR0ZWQgaW4gdGhlIGZpcnN0IHByb2Nlc3MgY2FsbFxuICAgIHRoaXMuX2lzU3RhcnRlZCA9IHRydWU7XG4gICAgdGhpcy5fc3RhcnRUaW1lID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX2xhc3RUaW1lID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICBpZiAodGhpcy5faXNTdGFydGVkICYmIHRoaXMuX3N0YXJ0VGltZSkge1xuICAgICAgY29uc3QgY3VycmVudFRpbWUgPSB0aGlzLnBhcmFtcy5jdHguY3VycmVudFRpbWU7XG4gICAgICBjb25zdCBlbmRUaW1lID0gdGhpcy50aW1lICsgKGN1cnJlbnRUaW1lIC0gdGhpcy5fbGFzdFRpbWUpO1xuXG4gICAgICB0aGlzLmZpbmFsaXplKGVuZFRpbWUpO1xuICAgIH1cbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhID0ge30pIHtcbiAgICBpZiAoIXRoaXMuX2lzU3RhcnRlZCkgcmV0dXJuO1xuXG4gICAgY29uc3QgY3VycmVudFRpbWUgPSB0aGlzLnBhcmFtcy5jdHguY3VycmVudFRpbWU7XG4gICAgLy8gaWYgbm8gdGltZSBwcm92aWRlZCwgdXNlIGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZVxuICAgIHZhciBmcmFtZVRpbWUgPSAhaXNOYU4ocGFyc2VGbG9hdCh0aW1lKSkgJiYgaXNGaW5pdGUodGltZSkgP1xuICAgICAgdGltZSA6IGN1cnJlbnRUaW1lO1xuXG4gICAgLy8gc2V0IGBzdGFydFRpbWVgIGlmIGZpcnN0IGNhbGwgYWZ0ZXIgYSBgc3RhcnRgXG4gICAgaWYgKCF0aGlzLl9zdGFydFRpbWUpXG4gICAgICB0aGlzLl9zdGFydFRpbWUgPSBmcmFtZVRpbWU7XG5cbiAgICAvLyBoYW5kbGUgdGltZSBhY2NvcmRpbmcgdG8gY29uZmlnXG4gICAgaWYgKHRoaXMucGFyYW1zLmFic29sdXRlVGltZSA9PT0gZmFsc2UpXG4gICAgICBmcmFtZVRpbWUgPSB0aW1lIC0gdGhpcy5fc3RhcnRUaW1lO1xuXG4gICAgLy8gaWYgc2NhbGFyLCBjcmVhdGUgYSB2ZWN0b3JcbiAgICBpZiAoZnJhbWUubGVuZ3RoID09PSB1bmRlZmluZWQpXG4gICAgICBmcmFtZSA9IFtmcmFtZV07XG5cbiAgICAvLyB3b3JrcyBpZiBmcmFtZSBpcyBhbiBhcnJheVxuICAgIHRoaXMub3V0RnJhbWUuc2V0KGZyYW1lLCAwKTtcbiAgICB0aGlzLnRpbWUgPSBmcmFtZVRpbWU7XG4gICAgdGhpcy5tZXRhRGF0YSA9IG1ldGFEYXRhO1xuXG4gICAgdGhpcy5fbGFzdFRpbWUgPSBjdXJyZW50VGltZTtcblxuICAgIHRoaXMub3V0cHV0KCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEluO1xuIl19