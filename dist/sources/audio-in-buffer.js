'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _baseLfo = require('../core/base-lfo');

var _baseLfo2 = _interopRequireDefault(_baseLfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var workerCode = '\nself.addEventListener(\'message\', function process(e) {\n  var blockSize = e.data.blockSize;\n  var bufferSource = e.data.buffer;\n  var buffer = new Float32Array(bufferSource);\n  var length = buffer.length;\n  var index = 0;\n\n  while (index < length) {\n    var copySize = Math.min(length - index, blockSize);\n    var block = buffer.subarray(index, index + copySize);\n    var sendBlock = new Float32Array(block);\n\n    postMessage({\n      command: \'process\',\n      index: index,\n      buffer: sendBlock.buffer,\n    }, [sendBlock.buffer]);\n\n    index += copySize;\n  }\n\n  postMessage({\n    command: \'finalize\',\n    index: index,\n    buffer: bufferSource,\n  }, [bufferSource]);\n}, false)';

var _PseudoWorker = function () {
  function _PseudoWorker() {
    (0, _classCallCheck3.default)(this, _PseudoWorker);

    this._callback = null;
  }

  (0, _createClass3.default)(_PseudoWorker, [{
    key: 'postMessage',
    value: function postMessage(e) {
      var blockSize = e.blockSize;
      var bufferSource = e.buffer;
      var buffer = new Float32Array(bufferSource);
      var length = buffer.length;
      var that = this;
      var index = 0;

      (function slice() {
        if (index < length) {
          var copySize = Math.min(length - index, blockSize);
          var block = buffer.subarray(index, index + copySize);
          var sendBlock = new Float32Array(block);

          that._send({
            command: 'process',
            index: index,
            buffer: sendBlock.buffer
          });

          index += copySize;
          setTimeout(slice, 0);
        } else {
          that._send({
            command: 'finalize',
            index: index,
            buffer: buffer
          });
        }
      })();
    }
  }, {
    key: 'addListener',
    value: function addListener(callback) {
      this._callback = callback;
    }
  }, {
    key: '_send',
    value: function _send(msg) {
      this._callback({ data: msg });
    }
  }]);
  return _PseudoWorker;
}();

/**
 * AudioBuffer as source, sliced it in blocks through a worker
 */


var AudioInBuffer = function (_BaseLfo) {
  (0, _inherits3.default)(AudioInBuffer, _BaseLfo);

  function AudioInBuffer() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    (0, _classCallCheck3.default)(this, AudioInBuffer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(AudioInBuffer).call(this, {
      frameSize: 512,
      channel: 0,
      ctx: null,
      buffer: null,
      useWorker: true
    }, options));

    _this.buffer = _this.params.buffer;
    _this.endTime = 0;

    if (!_this.params.ctx || !(_this.params.ctx instanceof AudioContext)) throw new Error('Missing audio context parameter (ctx)');

    if (!_this.params.buffer || !(_this.params.buffer instanceof AudioBuffer)) throw new Error('Missing audio buffer parameter (buffer)');

    _this.blob = new Blob([workerCode], { type: "text/javascript" });
    _this.worker = null;

    _this.process = _this.process.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(AudioInBuffer, [{
    key: 'setupStream',
    value: function setupStream() {
      this.outFrame = null;
    }
  }, {
    key: 'initialize',
    value: function initialize() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(AudioInBuffer.prototype), 'initialize', this).call(this, {
        frameSize: this.params.frameSize,
        frameRate: this.buffer.sampleRate / this.params.frameSize,
        sourceSampleRate: this.buffer.sampleRate
      });
    }
  }, {
    key: 'start',
    value: function start() {
      this.initialize();
      this.reset();

      if (this.params.useWorker) {
        this.worker = new Worker(window.URL.createObjectURL(this.blob));
        this.worker.addEventListener('message', this.process, false);
      } else {
        this.worker = new _PseudoWorker();
        this.worker.addListener(this.process);
      }

      this.endTime = 0;

      var buffer = this.buffer.getChannelData(this.params.channel).buffer;
      var sendBuffer = buffer;

      if (this.params.useWorker) sendBuffer = buffer.slice(0);

      this.worker.postMessage({
        blockSize: this.streamParams.frameSize,
        buffer: sendBuffer
      }, [sendBuffer]);
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.worker.terminate();
      this.worker = null;

      this.finalize(this.endTime);
    }

    // worker callback

  }, {
    key: 'process',
    value: function process(e) {
      var sourceSampleRate = this.streamParams.sourceSampleRate;
      var command = e.data.command;
      var index = e.data.index;
      var buffer = e.data.buffer;
      var time = index / sourceSampleRate;

      if (command === 'finalize') {
        this.finalize(time);
      } else {
        this.outFrame = new Float32Array(buffer);
        this.time = time;
        this.output();

        this.endTime = this.time + this.outFrame.length / sourceSampleRate;
      }
    }
  }]);
  return AudioInBuffer;
}(_baseLfo2.default);

exports.default = AudioInBuffer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF1ZGlvLWluLWJ1ZmZlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBRUEsSUFBTSx1dEJBQU47O0lBOEJNO0FBQ0osV0FESSxhQUNKLEdBQWM7d0NBRFYsZUFDVTs7QUFDWixTQUFLLFNBQUwsR0FBaUIsSUFBakIsQ0FEWTtHQUFkOzs2QkFESTs7Z0NBS1EsR0FBRztBQUNiLFVBQU0sWUFBWSxFQUFFLFNBQUYsQ0FETDtBQUViLFVBQU0sZUFBZSxFQUFFLE1BQUYsQ0FGUjtBQUdiLFVBQU0sU0FBUyxJQUFJLFlBQUosQ0FBaUIsWUFBakIsQ0FBVCxDQUhPO0FBSWIsVUFBTSxTQUFTLE9BQU8sTUFBUCxDQUpGO0FBS2IsVUFBTSxPQUFPLElBQVAsQ0FMTztBQU1iLFVBQUksUUFBUSxDQUFSLENBTlM7O0FBUWIsT0FBQyxTQUFTLEtBQVQsR0FBaUI7QUFDaEIsWUFBSSxRQUFRLE1BQVIsRUFBZ0I7QUFDbEIsY0FBSSxXQUFXLEtBQUssR0FBTCxDQUFTLFNBQVMsS0FBVCxFQUFnQixTQUF6QixDQUFYLENBRGM7QUFFbEIsY0FBSSxRQUFRLE9BQU8sUUFBUCxDQUFnQixLQUFoQixFQUF1QixRQUFRLFFBQVIsQ0FBL0IsQ0FGYztBQUdsQixjQUFJLFlBQVksSUFBSSxZQUFKLENBQWlCLEtBQWpCLENBQVosQ0FIYzs7QUFLbEIsZUFBSyxLQUFMLENBQVc7QUFDVCxxQkFBUyxTQUFUO0FBQ0EsbUJBQU8sS0FBUDtBQUNBLG9CQUFRLFVBQVUsTUFBVjtXQUhWLEVBTGtCOztBQVdsQixtQkFBUyxRQUFULENBWGtCO0FBWWxCLHFCQUFXLEtBQVgsRUFBa0IsQ0FBbEIsRUFaa0I7U0FBcEIsTUFhTztBQUNMLGVBQUssS0FBTCxDQUFXO0FBQ1QscUJBQVMsVUFBVDtBQUNBLG1CQUFPLEtBQVA7QUFDQSxvQkFBUSxNQUFSO1dBSEYsRUFESztTQWJQO09BREQsR0FBRCxDQVJhOzs7O2dDQWdD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Ozs7OzRCQVFDLEdBQUc7QUFDVCxVQUFNLG1CQUFtQixLQUFLLFlBQUwsQ0FBa0IsZ0JBQWxCLENBRGhCO0FBRVQsVUFBTSxVQUFVLEVBQUUsSUFBRixDQUFPLE9BQVAsQ0FGUDtBQUdULFVBQU0sUUFBUSxFQUFFLElBQUYsQ0FBTyxLQUFQLENBSEw7QUFJVCxVQUFNLFNBQVMsRUFBRSxJQUFGLENBQU8sTUFBUCxDQUpOO0FBS1QsVUFBTSxPQUFPLFFBQVEsZ0JBQVIsQ0FMSjs7QUFPVCxVQUFJLFlBQVksVUFBWixFQUF3QjtBQUMxQixhQUFLLFFBQUwsQ0FBYyxJQUFkLEVBRDBCO09BQTVCLE1BRU87QUFDTCxhQUFLLFFBQUwsR0FBZ0IsSUFBSSxZQUFKLENBQWlCLE1BQWpCLENBQWhCLENBREs7QUFFTCxhQUFLLElBQUwsR0FBWSxJQUFaLENBRks7QUFHTCxhQUFLLE1BQUwsR0FISzs7QUFLTCxhQUFLLE9BQUwsR0FBZSxLQUFLLElBQUwsR0FBWSxLQUFLLFFBQUwsQ0FBYyxNQUFkLEdBQXVCLGdCQUF2QixDQUx0QjtPQUZQOzs7U0E5RWlCIiwiZmlsZSI6ImF1ZGlvLWluLWJ1ZmZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvYmFzZS1sZm8nO1xuXG5jb25zdCB3b3JrZXJDb2RlID0gYFxuc2VsZi5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gcHJvY2VzcyhlKSB7XG4gIHZhciBibG9ja1NpemUgPSBlLmRhdGEuYmxvY2tTaXplO1xuICB2YXIgYnVmZmVyU291cmNlID0gZS5kYXRhLmJ1ZmZlcjtcbiAgdmFyIGJ1ZmZlciA9IG5ldyBGbG9hdDMyQXJyYXkoYnVmZmVyU291cmNlKTtcbiAgdmFyIGxlbmd0aCA9IGJ1ZmZlci5sZW5ndGg7XG4gIHZhciBpbmRleCA9IDA7XG5cbiAgd2hpbGUgKGluZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGNvcHlTaXplID0gTWF0aC5taW4obGVuZ3RoIC0gaW5kZXgsIGJsb2NrU2l6ZSk7XG4gICAgdmFyIGJsb2NrID0gYnVmZmVyLnN1YmFycmF5KGluZGV4LCBpbmRleCArIGNvcHlTaXplKTtcbiAgICB2YXIgc2VuZEJsb2NrID0gbmV3IEZsb2F0MzJBcnJheShibG9jayk7XG5cbiAgICBwb3N0TWVzc2FnZSh7XG4gICAgICBjb21tYW5kOiAncHJvY2VzcycsXG4gICAgICBpbmRleDogaW5kZXgsXG4gICAgICBidWZmZXI6IHNlbmRCbG9jay5idWZmZXIsXG4gICAgfSwgW3NlbmRCbG9jay5idWZmZXJdKTtcblxuICAgIGluZGV4ICs9IGNvcHlTaXplO1xuICB9XG5cbiAgcG9zdE1lc3NhZ2Uoe1xuICAgIGNvbW1hbmQ6ICdmaW5hbGl6ZScsXG4gICAgaW5kZXg6IGluZGV4LFxuICAgIGJ1ZmZlcjogYnVmZmVyU291cmNlLFxuICB9LCBbYnVmZmVyU291cmNlXSk7XG59LCBmYWxzZSlgO1xuXG5cbmNsYXNzIF9Qc2V1ZG9Xb3JrZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9jYWxsYmFjayA9IG51bGw7XG4gIH1cblxuICBwb3N0TWVzc2FnZShlKSB7XG4gICAgY29uc3QgYmxvY2tTaXplID0gZS5ibG9ja1NpemU7XG4gICAgY29uc3QgYnVmZmVyU291cmNlID0gZS5idWZmZXI7XG4gICAgY29uc3QgYnVmZmVyID0gbmV3IEZsb2F0MzJBcnJheShidWZmZXJTb3VyY2UpO1xuICAgIGNvbnN0IGxlbmd0aCA9IGJ1ZmZlci5sZW5ndGg7XG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgbGV0IGluZGV4ID0gMDtcblxuICAgIChmdW5jdGlvbiBzbGljZSgpIHtcbiAgICAgIGlmIChpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICB2YXIgY29weVNpemUgPSBNYXRoLm1pbihsZW5ndGggLSBpbmRleCwgYmxvY2tTaXplKTtcbiAgICAgICAgdmFyIGJsb2NrID0gYnVmZmVyLnN1YmFycmF5KGluZGV4LCBpbmRleCArIGNvcHlTaXplKTtcbiAgICAgICAgdmFyIHNlbmRCbG9jayA9IG5ldyBGbG9hdDMyQXJyYXkoYmxvY2spO1xuXG4gICAgICAgIHRoYXQuX3NlbmQoe1xuICAgICAgICAgIGNvbW1hbmQ6ICdwcm9jZXNzJyxcbiAgICAgICAgICBpbmRleDogaW5kZXgsXG4gICAgICAgICAgYnVmZmVyOiBzZW5kQmxvY2suYnVmZmVyLFxuICAgICAgICB9KTtcblxuICAgICAgICBpbmRleCArPSBjb3B5U2l6ZTtcbiAgICAgICAgc2V0VGltZW91dChzbGljZSwgMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGF0Ll9zZW5kKHtcbiAgICAgICAgICBjb21tYW5kOiAnZmluYWxpemUnLFxuICAgICAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgICAgICBidWZmZXI6IGJ1ZmZlcixcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSgpKTtcbiAgfVxuXG4gIGFkZExpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgfVxuXG4gIF9zZW5kKG1zZykge1xuICAgIHRoaXMuX2NhbGxiYWNrKHsgZGF0YTogbXNnIH0pO1xuICB9XG59XG5cbi8qKlxuICogQXVkaW9CdWZmZXIgYXMgc291cmNlLCBzbGljZWQgaXQgaW4gYmxvY2tzIHRocm91Z2ggYSB3b3JrZXJcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXVkaW9JbkJ1ZmZlciBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcih7XG4gICAgICBmcmFtZVNpemU6IDUxMixcbiAgICAgIGNoYW5uZWw6IDAsXG4gICAgICBjdHg6IG51bGwsXG4gICAgICBidWZmZXI6IG51bGwsXG4gICAgICB1c2VXb3JrZXI6IHRydWUsXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmJ1ZmZlciA9IHRoaXMucGFyYW1zLmJ1ZmZlcjtcbiAgICB0aGlzLmVuZFRpbWUgPSAwO1xuXG4gICAgaWYgKCF0aGlzLnBhcmFtcy5jdHggfHwgISh0aGlzLnBhcmFtcy5jdHggaW5zdGFuY2VvZiBBdWRpb0NvbnRleHQpKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIGF1ZGlvIGNvbnRleHQgcGFyYW1ldGVyIChjdHgpJyk7XG5cbiAgICBpZiAoIXRoaXMucGFyYW1zLmJ1ZmZlciB8fCAhKHRoaXMucGFyYW1zLmJ1ZmZlciBpbnN0YW5jZW9mIEF1ZGlvQnVmZmVyKSlcbiAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBhdWRpbyBidWZmZXIgcGFyYW1ldGVyIChidWZmZXIpJyk7XG5cbiAgICB0aGlzLmJsb2IgPSBuZXcgQmxvYihbd29ya2VyQ29kZV0sIHsgdHlwZTogXCJ0ZXh0L2phdmFzY3JpcHRcIiB9KTtcbiAgICB0aGlzLndvcmtlciA9IG51bGw7XG5cbiAgICB0aGlzLnByb2Nlc3MgPSB0aGlzLnByb2Nlc3MuYmluZCh0aGlzKTtcbiAgfVxuXG4gIHNldHVwU3RyZWFtKCkge1xuICAgIHRoaXMub3V0RnJhbWUgPSBudWxsO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKHtcbiAgICAgIGZyYW1lU2l6ZTogdGhpcy5wYXJhbXMuZnJhbWVTaXplLFxuICAgICAgZnJhbWVSYXRlOiB0aGlzLmJ1ZmZlci5zYW1wbGVSYXRlIC8gdGhpcy5wYXJhbXMuZnJhbWVTaXplLFxuICAgICAgc291cmNlU2FtcGxlUmF0ZTogdGhpcy5idWZmZXIuc2FtcGxlUmF0ZSxcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMucmVzZXQoKTtcblxuICAgIGlmICh0aGlzLnBhcmFtcy51c2VXb3JrZXIpIHtcbiAgICAgIHRoaXMud29ya2VyID0gbmV3IFdvcmtlcih3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTCh0aGlzLmJsb2IpKTtcbiAgICAgIHRoaXMud29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCB0aGlzLnByb2Nlc3MsIGZhbHNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy53b3JrZXIgPSBuZXcgX1BzZXVkb1dvcmtlcigpO1xuICAgICAgdGhpcy53b3JrZXIuYWRkTGlzdGVuZXIodGhpcy5wcm9jZXNzKTtcbiAgICB9XG5cbiAgICB0aGlzLmVuZFRpbWUgPSAwO1xuXG4gICAgY29uc3QgYnVmZmVyID0gdGhpcy5idWZmZXIuZ2V0Q2hhbm5lbERhdGEodGhpcy5wYXJhbXMuY2hhbm5lbCkuYnVmZmVyO1xuICAgIGxldCBzZW5kQnVmZmVyID0gYnVmZmVyO1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLnVzZVdvcmtlcilcbiAgICAgIHNlbmRCdWZmZXIgPSBidWZmZXIuc2xpY2UoMCk7XG5cbiAgICB0aGlzLndvcmtlci5wb3N0TWVzc2FnZSh7XG4gICAgICBibG9ja1NpemU6IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSxcbiAgICAgIGJ1ZmZlcjogc2VuZEJ1ZmZlcixcbiAgICB9LCBbc2VuZEJ1ZmZlcl0pO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICB0aGlzLndvcmtlci50ZXJtaW5hdGUoKTtcbiAgICB0aGlzLndvcmtlciA9IG51bGw7XG5cbiAgICB0aGlzLmZpbmFsaXplKHRoaXMuZW5kVGltZSk7XG4gIH1cblxuICAvLyB3b3JrZXIgY2FsbGJhY2tcbiAgcHJvY2VzcyhlKSB7XG4gICAgY29uc3Qgc291cmNlU2FtcGxlUmF0ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGU7XG4gICAgY29uc3QgY29tbWFuZCA9IGUuZGF0YS5jb21tYW5kO1xuICAgIGNvbnN0IGluZGV4ID0gZS5kYXRhLmluZGV4O1xuICAgIGNvbnN0IGJ1ZmZlciA9IGUuZGF0YS5idWZmZXI7XG4gICAgY29uc3QgdGltZSA9IGluZGV4IC8gc291cmNlU2FtcGxlUmF0ZTtcblxuICAgIGlmIChjb21tYW5kID09PSAnZmluYWxpemUnKSB7XG4gICAgICB0aGlzLmZpbmFsaXplKHRpbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm91dEZyYW1lID0gbmV3IEZsb2F0MzJBcnJheShidWZmZXIpO1xuICAgICAgdGhpcy50aW1lID0gdGltZTtcbiAgICAgIHRoaXMub3V0cHV0KCk7XG5cbiAgICAgIHRoaXMuZW5kVGltZSA9IHRoaXMudGltZSArIHRoaXMub3V0RnJhbWUubGVuZ3RoIC8gc291cmNlU2FtcGxlUmF0ZTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==