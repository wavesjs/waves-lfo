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

var audioContext = undefined; // for lazy audioContext creation

var AudioIn = (function (_BaseLfo) {
  _inherits(AudioIn, _BaseLfo);

  function AudioIn() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var defaults = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, AudioIn);

    defaults.frameSize = 512;
    defaults.channel = 0;

    _get(Object.getPrototypeOf(AudioIn.prototype), 'constructor', this).call(this, options, defaults);

    // private
    if (!this.params.ctx) {
      if (!audioContext) {
        audioContext = new window.AudioContext();
      }

      this.ctx = audioContext;
    } else {
      this.ctx = this.params.ctx;
    }

    this.src = this.params.src;
    this.time = 0;
    this.metaData = {};
  }

  _createClass(AudioIn, [{
    key: 'start',
    value: function start() {}
  }, {
    key: 'stop',
    value: function stop() {}
  }]);

  return AudioIn;
})(_coreBaseLfo2['default']);

exports['default'] = AudioIn;

module.exports = AudioIn;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL2F1ZGlvLWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7MkJBQW9CLGtCQUFrQjs7OztBQUV0QyxJQUFJLFlBQVksWUFBQSxDQUFDOztJQUVJLE9BQU87WUFBUCxPQUFPOztBQUVmLFdBRlEsT0FBTyxHQUVlO1FBQTdCLE9BQU8seURBQUcsRUFBRTtRQUFFLFFBQVEseURBQUcsRUFBRTs7MEJBRnBCLE9BQU87O0FBR3hCLFlBQVEsQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO0FBQ3pCLFlBQVEsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDOztBQUVyQiwrQkFOaUIsT0FBTyw2Q0FNbEIsT0FBTyxFQUFFLFFBQVEsRUFBRTs7O0FBR3pCLFFBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRTtBQUNwQixVQUFJLENBQUMsWUFBWSxFQUFFO0FBQ2pCLG9CQUFZLEdBQUcsSUFBSSxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7T0FDMUM7O0FBRUQsVUFBSSxDQUFDLEdBQUcsR0FBRyxZQUFZLENBQUM7S0FDekIsTUFBTTtBQUNMLFVBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7S0FDNUI7O0FBRUQsUUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztBQUMzQixRQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztBQUNkLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0dBQ3BCOztlQXRCa0IsT0FBTzs7V0F3QnJCLGlCQUFHLEVBQUU7OztXQUNOLGdCQUFHLEVBQUU7OztTQXpCVSxPQUFPOzs7cUJBQVAsT0FBTzs7QUE0QjVCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDIiwiZmlsZSI6ImVzNi9zb3VyY2VzL2F1ZGlvLWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vY29yZS9iYXNlLWxmbyc7XG5cbmxldCBhdWRpb0NvbnRleHQ7IC8vIGZvciBsYXp5IGF1ZGlvQ29udGV4dCBjcmVhdGlvblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdWRpb0luIGV4dGVuZHMgQmFzZUxmbyB7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9LCBkZWZhdWx0cyA9IHt9KSB7XG4gICAgZGVmYXVsdHMuZnJhbWVTaXplID0gNTEyO1xuICAgIGRlZmF1bHRzLmNoYW5uZWwgPSAwO1xuICAgIFxuICAgIHN1cGVyKG9wdGlvbnMsIGRlZmF1bHRzKTtcblxuICAgIC8vIHByaXZhdGVcbiAgICBpZiAoIXRoaXMucGFyYW1zLmN0eCkge1xuICAgICAgaWYgKCFhdWRpb0NvbnRleHQpIHtcbiAgICAgICAgYXVkaW9Db250ZXh0ID0gbmV3IHdpbmRvdy5BdWRpb0NvbnRleHQoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jdHggPSBhdWRpb0NvbnRleHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY3R4ID0gdGhpcy5wYXJhbXMuY3R4O1xuICAgIH1cblxuICAgIHRoaXMuc3JjID0gdGhpcy5wYXJhbXMuc3JjO1xuICAgIHRoaXMudGltZSA9IDA7XG4gICAgdGhpcy5tZXRhRGF0YSA9IHt9O1xuICB9XG5cbiAgc3RhcnQoKSB7fVxuICBzdG9wKCkge31cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBdWRpb0luO1xuIl19