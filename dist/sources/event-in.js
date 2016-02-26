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

var EventIn = (function (_BaseLfo) {
  _inherits(EventIn, _BaseLfo);

  function EventIn(options) {
    _classCallCheck(this, EventIn);

    _get(Object.getPrototypeOf(EventIn.prototype), 'constructor', this).call(this, {
      absoluteTime: false
    }, options);

    // test AudioContext for use in node environment
    if (!this.params.ctx && typeof process === 'undefined') {
      this.params.ctx = new AudioContext();
    }

    this._isStarted = false;
    this._startTime = undefined;
  }

  _createClass(EventIn, [{
    key: 'initialize',
    value: function initialize() {
      _get(Object.getPrototypeOf(EventIn.prototype), 'initialize', this).call(this, {
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
})(_coreBaseLfo2['default']);

exports['default'] = EventIn;

module.exports = EventIn;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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O0FBRXpCLFVBQUksQ0FBQyxTQUFTLEdBQUcsV0FBVyxDQUFDOztBQUU3QixVQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDZjs7O1NBeEVrQixPQUFPOzs7cUJBQVAsT0FBTzs7QUEyRTVCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDIiwiZmlsZSI6ImVzNi9zb3VyY2VzL2V2ZW50LWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vY29yZS9iYXNlLWxmbyc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRJbiBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIoe1xuICAgICAgYWJzb2x1dGVUaW1lOiBmYWxzZSxcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIC8vIHRlc3QgQXVkaW9Db250ZXh0IGZvciB1c2UgaW4gbm9kZSBlbnZpcm9ubWVudFxuICAgIGlmICghdGhpcy5wYXJhbXMuY3R4ICYmICh0eXBlb2YgcHJvY2VzcyA9PT0gJ3VuZGVmaW5lZCcpKSB7XG4gICAgICB0aGlzLnBhcmFtcy5jdHggPSBuZXcgQXVkaW9Db250ZXh0KCk7XG4gICAgfVxuXG4gICAgdGhpcy5faXNTdGFydGVkID0gZmFsc2U7XG4gICAgdGhpcy5fc3RhcnRUaW1lID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKHtcbiAgICAgIGZyYW1lU2l6ZTogdGhpcy5wYXJhbXMuZnJhbWVTaXplLFxuICAgICAgZnJhbWVSYXRlOiB0aGlzLnBhcmFtcy5mcmFtZVJhdGUsXG4gICAgICBzb3VyY2VTYW1wbGVSYXRlOiB0aGlzLnBhcmFtcy5mcmFtZVJhdGUsXG4gICAgfSk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnJlc2V0KCk7XG5cbiAgICBjb25zdCBjdXJyZW50VGltZSA9IHRoaXMucGFyYW1zLmN0eC5jdXJyZW50VGltZTtcblxuICAgIC8vIHNob3VsZCBiZSBzZXR0ZWQgaW4gdGhlIGZpcnN0IHByb2Nlc3MgY2FsbFxuICAgIHRoaXMuX2lzU3RhcnRlZCA9IHRydWU7XG4gICAgdGhpcy5fc3RhcnRUaW1lID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX2xhc3RUaW1lID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICBpZiAodGhpcy5faXNTdGFydGVkICYmIHRoaXMuX3N0YXJ0VGltZSkge1xuICAgICAgY29uc3QgY3VycmVudFRpbWUgPSB0aGlzLnBhcmFtcy5jdHguY3VycmVudFRpbWU7XG4gICAgICBjb25zdCBlbmRUaW1lID0gdGhpcy50aW1lICsgKGN1cnJlbnRUaW1lIC0gdGhpcy5fbGFzdFRpbWUpO1xuXG4gICAgICB0aGlzLmZpbmFsaXplKGVuZFRpbWUpO1xuICAgIH1cbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhID0ge30pIHtcbiAgICBpZiAoIXRoaXMuX2lzU3RhcnRlZCkgcmV0dXJuO1xuXG4gICAgY29uc3QgY3VycmVudFRpbWUgPSB0aGlzLnBhcmFtcy5jdHguY3VycmVudFRpbWU7XG4gICAgLy8gaWYgbm8gdGltZSBwcm92aWRlZCwgdXNlIGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZVxuICAgIHZhciBmcmFtZVRpbWUgPSAhaXNOYU4ocGFyc2VGbG9hdCh0aW1lKSkgJiYgaXNGaW5pdGUodGltZSkgP1xuICAgICAgdGltZSA6IGN1cnJlbnRUaW1lO1xuXG4gICAgLy8gc2V0IGBzdGFydFRpbWVgIGlmIGZpcnN0IGNhbGwgYWZ0ZXIgYSBgc3RhcnRgXG4gICAgaWYgKCF0aGlzLl9zdGFydFRpbWUpXG4gICAgICB0aGlzLl9zdGFydFRpbWUgPSBmcmFtZVRpbWU7XG5cbiAgICAvLyBoYW5kbGUgdGltZSBhY2NvcmRpbmcgdG8gY29uZmlnXG4gICAgaWYgKHRoaXMucGFyYW1zLmFic29sdXRlVGltZSA9PT0gZmFsc2UpXG4gICAgICBmcmFtZVRpbWUgPSB0aW1lIC0gdGhpcy5fc3RhcnRUaW1lO1xuXG4gICAgLy8gaWYgc2NhbGFyLCBjcmVhdGUgYSB2ZWN0b3JcbiAgICBpZiAoZnJhbWUubGVuZ3RoID09PSB1bmRlZmluZWQpXG4gICAgICBmcmFtZSA9IFtmcmFtZV07XG5cbiAgICAvLyB3b3JrcyBpZiBmcmFtZSBpcyBhbiBhcnJheVxuICAgIHRoaXMub3V0RnJhbWUuc2V0KGZyYW1lLCAwKTtcbiAgICB0aGlzLnRpbWUgPSBmcmFtZVRpbWU7XG4gICAgdGhpcy5tZXRhRGF0YSA9IG1ldGFEYXRhO1xuXG4gICAgdGhpcy5fbGFzdFRpbWUgPSBjdXJyZW50VGltZTtcblxuICAgIHRoaXMub3V0cHV0KCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEluO1xuIl19