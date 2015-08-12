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

    _classCallCheck(this, AudioIn);

    // defaults
    var defaults = {
      frameSize: 512,
      channel: 0
    };

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL2F1ZGlvLWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7MkJBQW9CLGtCQUFrQjs7OztBQUV0QyxJQUFJLFlBQVksWUFBQSxDQUFDOztJQUVJLE9BQU87WUFBUCxPQUFPOztBQUVmLFdBRlEsT0FBTyxHQUVBO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFGTCxPQUFPOzs7QUFJeEIsUUFBTSxRQUFRLEdBQUc7QUFDZixlQUFTLEVBQUUsR0FBRztBQUNkLGFBQU8sRUFBRSxDQUFDO0tBQ1gsQ0FBQzs7QUFFRiwrQkFUaUIsT0FBTyw2Q0FTbEIsT0FBTyxFQUFFLFFBQVEsRUFBRTs7O0FBR3pCLFFBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRTtBQUNwQixVQUFJLENBQUMsWUFBWSxFQUFFO0FBQ2pCLG9CQUFZLEdBQUcsSUFBSSxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7T0FDMUM7O0FBRUQsVUFBSSxDQUFDLEdBQUcsR0FBRyxZQUFZLENBQUM7S0FDekIsTUFBTTtBQUNMLFVBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7S0FDNUI7O0FBRUQsUUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztBQUMzQixRQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztBQUNkLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0dBQ3BCOztlQXpCa0IsT0FBTzs7V0EyQnJCLGlCQUFHLEVBQUU7OztXQUNOLGdCQUFHLEVBQUU7OztTQTVCVSxPQUFPOzs7cUJBQVAsT0FBTzs7QUErQjVCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDIiwiZmlsZSI6ImVzNi9zb3VyY2VzL2F1ZGlvLWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vY29yZS9iYXNlLWxmbyc7XG5cbmxldCBhdWRpb0NvbnRleHQ7IC8vIGZvciBsYXp5IGF1ZGlvQ29udGV4dCBjcmVhdGlvblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdWRpb0luIGV4dGVuZHMgQmFzZUxmbyB7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgLy8gZGVmYXVsdHNcbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGZyYW1lU2l6ZTogNTEyLFxuICAgICAgY2hhbm5lbDogMCxcbiAgICB9O1xuXG4gICAgc3VwZXIob3B0aW9ucywgZGVmYXVsdHMpO1xuXG4gICAgLy8gcHJpdmF0ZVxuICAgIGlmICghdGhpcy5wYXJhbXMuY3R4KSB7XG4gICAgICBpZiAoIWF1ZGlvQ29udGV4dCkge1xuICAgICAgICBhdWRpb0NvbnRleHQgPSBuZXcgd2luZG93LkF1ZGlvQ29udGV4dCgpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmN0eCA9IGF1ZGlvQ29udGV4dDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jdHggPSB0aGlzLnBhcmFtcy5jdHg7XG4gICAgfVxuXG4gICAgdGhpcy5zcmMgPSB0aGlzLnBhcmFtcy5zcmM7XG4gICAgdGhpcy50aW1lID0gMDtcbiAgICB0aGlzLm1ldGFEYXRhID0ge307XG4gIH1cblxuICBzdGFydCgpIHt9XG4gIHN0b3AoKSB7fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEF1ZGlvSW47XG4iXX0=