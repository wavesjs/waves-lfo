'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _audioIn = require('./audio-in');

var _audioIn2 = _interopRequireDefault(_audioIn);

/**
 *  Use a WebAudio node as a source
 */

var AudioInNode = (function (_AudioIn) {
  _inherits(AudioInNode, _AudioIn);

  function AudioInNode() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, AudioInNode);

    _get(Object.getPrototypeOf(AudioInNode.prototype), 'constructor', this).call(this, options, {
      timeType: 'absolute'
    });
  }

  _createClass(AudioInNode, [{
    key: 'configureStream',
    value: function configureStream() {
      this.streamParams.frameSize = this.params.frameSize;
      this.streamParams.frameRate = this.ctx.sampleRate / this.params.frameSize;
      this.streamParams.sourceSampleRate = this.ctx.sampleRate;
    }
  }, {
    key: 'initialize',
    value: function initialize() {
      _get(Object.getPrototypeOf(AudioInNode.prototype), 'initialize', this).call(this);

      var blockSize = this.streamParams.frameSize;
      this.scriptProcessor = this.ctx.createScriptProcessor(blockSize, 1, 1);
      // prepare audio graph
      this.scriptProcessor.onaudioprocess = this.process.bind(this);
      this.src.connect(this.scriptProcessor);
    }

    // connect the audio nodes to start streaming
  }, {
    key: 'start',
    value: function start() {
      if (this.params.timeType === 'relative') {
        this.time = 0;
      }

      this.initialize();
      this.reset();
      // start "the patch" ;)
      this.scriptProcessor.connect(this.ctx.destination);
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.finalize();
      this.scriptProcessor.disconnect();
    }

    // is basically the `scriptProcessor.onaudioprocess` callback
  }, {
    key: 'process',
    value: function process(e) {
      var block = e.inputBuffer.getChannelData(this.params.channel);

      if (!this.blockDuration) this.blockDuration = block.length / this.streamParams.sourceSampleRate;

      this.time += this.blockDuration;
      this.outFrame = block;
      this.output();
    }
  }]);

  return AudioInNode;
})(_audioIn2['default']);

exports['default'] = AudioInNode;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL2F1ZGlvLWluLW5vZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozt1QkFBb0IsWUFBWTs7Ozs7Ozs7SUFLWCxXQUFXO1lBQVgsV0FBVzs7QUFFbkIsV0FGUSxXQUFXLEdBRUo7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQUZMLFdBQVc7O0FBRzVCLCtCQUhpQixXQUFXLDZDQUd0QixPQUFPLEVBQUU7QUFDYixjQUFRLEVBQUUsVUFBVTtLQUNyQixFQUFFO0dBQ0o7O2VBTmtCLFdBQVc7O1dBUWYsMkJBQUc7QUFDaEIsVUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7QUFDcEQsVUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7QUFDMUUsVUFBSSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQztLQUMxRDs7O1dBRVMsc0JBQUc7QUFDWCxpQ0FmaUIsV0FBVyw0Q0FlVDs7QUFFbkIsVUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUM7QUFDNUMsVUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRXZFLFVBQUksQ0FBQyxlQUFlLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlELFVBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztLQUN4Qzs7Ozs7V0FHSSxpQkFBRztBQUNOLFVBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEtBQUssVUFBVSxFQUFFO0FBQUUsWUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7T0FBRTs7QUFFM0QsVUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ2xCLFVBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQzs7QUFFYixVQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0tBQ3BEOzs7V0FFRyxnQkFBRztBQUNMLFVBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUNoQixVQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxDQUFDO0tBQ25DOzs7OztXQUdNLGlCQUFDLENBQUMsRUFBRTtBQUNULFVBQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRWhFLFVBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUNyQixJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQzs7QUFFekUsVUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDO0FBQ2hDLFVBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0FBQ3RCLFVBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUNmOzs7U0FqRGtCLFdBQVc7OztxQkFBWCxXQUFXIiwiZmlsZSI6ImVzNi9zb3VyY2VzL2F1ZGlvLWluLW5vZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQXVkaW9JbiBmcm9tICcuL2F1ZGlvLWluJztcblxuLyoqXG4gKiAgVXNlIGEgV2ViQXVkaW8gbm9kZSBhcyBhIHNvdXJjZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdWRpb0luTm9kZSBleHRlbmRzIEF1ZGlvSW4ge1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMsIHtcbiAgICAgIHRpbWVUeXBlOiAnYWJzb2x1dGUnLFxuICAgIH0pO1xuICB9XG5cbiAgY29uZmlndXJlU3RyZWFtKCkge1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IHRoaXMucGFyYW1zLmZyYW1lU2l6ZTtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVJhdGUgPSB0aGlzLmN0eC5zYW1wbGVSYXRlIC8gdGhpcy5wYXJhbXMuZnJhbWVTaXplO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGUgPSB0aGlzLmN0eC5zYW1wbGVSYXRlO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG5cbiAgICB2YXIgYmxvY2tTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIHRoaXMuc2NyaXB0UHJvY2Vzc29yID0gdGhpcy5jdHguY3JlYXRlU2NyaXB0UHJvY2Vzc29yKGJsb2NrU2l6ZSwgMSwgMSk7XG4gICAgLy8gcHJlcGFyZSBhdWRpbyBncmFwaFxuICAgIHRoaXMuc2NyaXB0UHJvY2Vzc29yLm9uYXVkaW9wcm9jZXNzID0gdGhpcy5wcm9jZXNzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zcmMuY29ubmVjdCh0aGlzLnNjcmlwdFByb2Nlc3Nvcik7XG4gIH1cblxuICAvLyBjb25uZWN0IHRoZSBhdWRpbyBub2RlcyB0byBzdGFydCBzdHJlYW1pbmdcbiAgc3RhcnQoKSB7XG4gICAgaWYgKHRoaXMucGFyYW1zLnRpbWVUeXBlID09PSAncmVsYXRpdmUnKSB7IHRoaXMudGltZSA9IDA7IH1cblxuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMucmVzZXQoKTtcbiAgICAvLyBzdGFydCBcInRoZSBwYXRjaFwiIDspXG4gICAgdGhpcy5zY3JpcHRQcm9jZXNzb3IuY29ubmVjdCh0aGlzLmN0eC5kZXN0aW5hdGlvbik7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMuZmluYWxpemUoKTtcbiAgICB0aGlzLnNjcmlwdFByb2Nlc3Nvci5kaXNjb25uZWN0KCk7XG4gIH1cblxuICAvLyBpcyBiYXNpY2FsbHkgdGhlIGBzY3JpcHRQcm9jZXNzb3Iub25hdWRpb3Byb2Nlc3NgIGNhbGxiYWNrXG4gIHByb2Nlc3MoZSkge1xuICAgIGNvbnN0IGJsb2NrID0gZS5pbnB1dEJ1ZmZlci5nZXRDaGFubmVsRGF0YSh0aGlzLnBhcmFtcy5jaGFubmVsKTtcblxuICAgIGlmICghdGhpcy5ibG9ja0R1cmF0aW9uKVxuICAgICAgdGhpcy5ibG9ja0R1cmF0aW9uID0gYmxvY2subGVuZ3RoIC8gdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZTtcblxuICAgIHRoaXMudGltZSArPSB0aGlzLmJsb2NrRHVyYXRpb247XG4gICAgdGhpcy5vdXRGcmFtZSA9IGJsb2NrO1xuICAgIHRoaXMub3V0cHV0KCk7XG4gIH1cbn1cbiJdfQ==