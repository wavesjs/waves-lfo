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

/**
 *  Use a WebAudio node as a source
 */

var AudioInNode = function (_BaseLfo) {
  (0, _inherits3.default)(AudioInNode, _BaseLfo);

  function AudioInNode() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    (0, _classCallCheck3.default)(this, AudioInNode);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(AudioInNode).call(this, {
      frameSize: 512,
      channel: 0,
      ctx: null,
      src: null
    }, options));

    if (!_this.params.ctx || !(_this.params.ctx instanceof AudioContext)) {
      throw new Error('Missing audio context parameter (ctx)');
    }

    if (!_this.params.src || !(_this.params.src instanceof AudioNode)) {
      throw new Error('Missing audio source node parameter (src)');
    }
    return _this;
  }

  (0, _createClass3.default)(AudioInNode, [{
    key: 'initialize',
    value: function initialize() {
      var ctx = this.params.ctx;

      (0, _get3.default)((0, _getPrototypeOf2.default)(AudioInNode.prototype), 'initialize', this).call(this, {
        frameSize: this.params.frameSize,
        frameRate: ctx.sampleRate / this.params.frameSize,
        sourceSampleRate: ctx.sampleRate
      });

      var blockSize = this.streamParams.frameSize;
      this.scriptProcessor = ctx.createScriptProcessor(blockSize, 1, 1);

      // prepare audio graph
      this.scriptProcessor.onaudioprocess = this.process.bind(this);
      this.params.src.connect(this.scriptProcessor);
    }

    // connect the audio nodes to start streaming

  }, {
    key: 'start',
    value: function start() {
      this.initialize();
      this.reset();
      this.time = 0;
      this.scriptProcessor.connect(this.params.ctx.destination);
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.finalize(this.time);
      this.scriptProcessor.disconnect();
    }

    // is basically the `scriptProcessor.onaudioprocess` callback

  }, {
    key: 'process',
    value: function process(e) {
      var block = e.inputBuffer.getChannelData(this.params.channel);

      if (!this.blockDuration) this.blockDuration = block.length / this.streamParams.sourceSampleRate;

      this.outFrame = block;
      this.output();

      this.time += this.blockDuration;
    }
  }]);
  return AudioInNode;
}(_baseLfo2.default);

exports.default = AudioInNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF1ZGlvLWluLW5vZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7SUFLcUI7OztBQUVuQixXQUZtQixXQUVuQixHQUEwQjtRQUFkLGdFQUFVLGtCQUFJO3dDQUZQLGFBRU87OzZGQUZQLHdCQUdYO0FBQ0osaUJBQVcsR0FBWDtBQUNBLGVBQVMsQ0FBVDtBQUNBLFdBQUssSUFBTDtBQUNBLFdBQUssSUFBTDtPQUNDLFVBTnFCOztBQVF4QixRQUFJLENBQUMsTUFBSyxNQUFMLENBQVksR0FBWixJQUFtQixFQUFFLE1BQUssTUFBTCxDQUFZLEdBQVosWUFBMkIsWUFBM0IsQ0FBRixFQUE0QztBQUNsRSxZQUFNLElBQUksS0FBSixDQUFVLHVDQUFWLENBQU4sQ0FEa0U7S0FBcEU7O0FBSUEsUUFBSSxDQUFDLE1BQUssTUFBTCxDQUFZLEdBQVosSUFBbUIsRUFBRSxNQUFLLE1BQUwsQ0FBWSxHQUFaLFlBQTJCLFNBQTNCLENBQUYsRUFBeUM7QUFDL0QsWUFBTSxJQUFJLEtBQUosQ0FBVSwyQ0FBVixDQUFOLENBRCtEO0tBQWpFO2lCQVp3QjtHQUExQjs7NkJBRm1COztpQ0FtQk47QUFDWCxVQUFNLE1BQU0sS0FBSyxNQUFMLENBQVksR0FBWixDQUREOztBQUdYLHVEQXRCaUIsdURBc0JBO0FBQ2YsbUJBQVcsS0FBSyxNQUFMLENBQVksU0FBWjtBQUNYLG1CQUFXLElBQUksVUFBSixHQUFpQixLQUFLLE1BQUwsQ0FBWSxTQUFaO0FBQzVCLDBCQUFrQixJQUFJLFVBQUo7UUFIcEIsQ0FIVzs7QUFTWCxVQUFJLFlBQVksS0FBSyxZQUFMLENBQWtCLFNBQWxCLENBVEw7QUFVWCxXQUFLLGVBQUwsR0FBdUIsSUFBSSxxQkFBSixDQUEwQixTQUExQixFQUFxQyxDQUFyQyxFQUF3QyxDQUF4QyxDQUF2Qjs7O0FBVlcsVUFhWCxDQUFLLGVBQUwsQ0FBcUIsY0FBckIsR0FBc0MsS0FBSyxPQUFMLENBQWEsSUFBYixDQUFrQixJQUFsQixDQUF0QyxDQWJXO0FBY1gsV0FBSyxNQUFMLENBQVksR0FBWixDQUFnQixPQUFoQixDQUF3QixLQUFLLGVBQUwsQ0FBeEIsQ0FkVzs7Ozs7Ozs0QkFrQkw7QUFDTixXQUFLLFVBQUwsR0FETTtBQUVOLFdBQUssS0FBTCxHQUZNO0FBR04sV0FBSyxJQUFMLEdBQVksQ0FBWixDQUhNO0FBSU4sV0FBSyxlQUFMLENBQXFCLE9BQXJCLENBQTZCLEtBQUssTUFBTCxDQUFZLEdBQVosQ0FBZ0IsV0FBaEIsQ0FBN0IsQ0FKTTs7OzsyQkFPRDtBQUNMLFdBQUssUUFBTCxDQUFjLEtBQUssSUFBTCxDQUFkLENBREs7QUFFTCxXQUFLLGVBQUwsQ0FBcUIsVUFBckIsR0FGSzs7Ozs7Ozs0QkFNQyxHQUFHO0FBQ1QsVUFBTSxRQUFRLEVBQUUsV0FBRixDQUFjLGNBQWQsQ0FBNkIsS0FBSyxNQUFMLENBQVksT0FBWixDQUFyQyxDQURHOztBQUdULFVBQUksQ0FBQyxLQUFLLGFBQUwsRUFDSCxLQUFLLGFBQUwsR0FBcUIsTUFBTSxNQUFOLEdBQWUsS0FBSyxZQUFMLENBQWtCLGdCQUFsQixDQUR0Qzs7QUFHQSxXQUFLLFFBQUwsR0FBZ0IsS0FBaEIsQ0FOUztBQU9ULFdBQUssTUFBTCxHQVBTOztBQVNULFdBQUssSUFBTCxJQUFhLEtBQUssYUFBTCxDQVRKOzs7U0FsRFEiLCJmaWxlIjoiYXVkaW8taW4tbm9kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvYmFzZS1sZm8nO1xuXG4vKipcbiAqICBVc2UgYSBXZWJBdWRpbyBub2RlIGFzIGEgc291cmNlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF1ZGlvSW5Ob2RlIGV4dGVuZHMgQmFzZUxmbyB7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoe1xuICAgICAgZnJhbWVTaXplOiA1MTIsXG4gICAgICBjaGFubmVsOiAwLFxuICAgICAgY3R4OiBudWxsLFxuICAgICAgc3JjOiBudWxsLFxuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgaWYgKCF0aGlzLnBhcmFtcy5jdHggfHwgISh0aGlzLnBhcmFtcy5jdHggaW5zdGFuY2VvZiBBdWRpb0NvbnRleHQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgYXVkaW8gY29udGV4dCBwYXJhbWV0ZXIgKGN0eCknKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMucGFyYW1zLnNyYyB8fCAhKHRoaXMucGFyYW1zLnNyYyBpbnN0YW5jZW9mIEF1ZGlvTm9kZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBhdWRpbyBzb3VyY2Ugbm9kZSBwYXJhbWV0ZXIgKHNyYyknKTtcbiAgICB9XG4gIH1cblxuICBpbml0aWFsaXplKCkge1xuICAgIGNvbnN0IGN0eCA9IHRoaXMucGFyYW1zLmN0eDtcblxuICAgIHN1cGVyLmluaXRpYWxpemUoe1xuICAgICAgZnJhbWVTaXplOiB0aGlzLnBhcmFtcy5mcmFtZVNpemUsXG4gICAgICBmcmFtZVJhdGU6IGN0eC5zYW1wbGVSYXRlIC8gdGhpcy5wYXJhbXMuZnJhbWVTaXplLFxuICAgICAgc291cmNlU2FtcGxlUmF0ZTogY3R4LnNhbXBsZVJhdGUsXG4gICAgfSk7XG5cbiAgICB2YXIgYmxvY2tTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIHRoaXMuc2NyaXB0UHJvY2Vzc29yID0gY3R4LmNyZWF0ZVNjcmlwdFByb2Nlc3NvcihibG9ja1NpemUsIDEsIDEpO1xuXG4gICAgLy8gcHJlcGFyZSBhdWRpbyBncmFwaFxuICAgIHRoaXMuc2NyaXB0UHJvY2Vzc29yLm9uYXVkaW9wcm9jZXNzID0gdGhpcy5wcm9jZXNzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5wYXJhbXMuc3JjLmNvbm5lY3QodGhpcy5zY3JpcHRQcm9jZXNzb3IpO1xuICB9XG5cbiAgLy8gY29ubmVjdCB0aGUgYXVkaW8gbm9kZXMgdG8gc3RhcnQgc3RyZWFtaW5nXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMucmVzZXQoKTtcbiAgICB0aGlzLnRpbWUgPSAwO1xuICAgIHRoaXMuc2NyaXB0UHJvY2Vzc29yLmNvbm5lY3QodGhpcy5wYXJhbXMuY3R4LmRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5maW5hbGl6ZSh0aGlzLnRpbWUpO1xuICAgIHRoaXMuc2NyaXB0UHJvY2Vzc29yLmRpc2Nvbm5lY3QoKTtcbiAgfVxuXG4gIC8vIGlzIGJhc2ljYWxseSB0aGUgYHNjcmlwdFByb2Nlc3Nvci5vbmF1ZGlvcHJvY2Vzc2AgY2FsbGJhY2tcbiAgcHJvY2VzcyhlKSB7XG4gICAgY29uc3QgYmxvY2sgPSBlLmlucHV0QnVmZmVyLmdldENoYW5uZWxEYXRhKHRoaXMucGFyYW1zLmNoYW5uZWwpO1xuXG4gICAgaWYgKCF0aGlzLmJsb2NrRHVyYXRpb24pXG4gICAgICB0aGlzLmJsb2NrRHVyYXRpb24gPSBibG9jay5sZW5ndGggLyB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlO1xuXG4gICAgdGhpcy5vdXRGcmFtZSA9IGJsb2NrO1xuICAgIHRoaXMub3V0cHV0KCk7XG5cbiAgICB0aGlzLnRpbWUgKz0gdGhpcy5ibG9ja0R1cmF0aW9uO1xuICB9XG59XG4iXX0=