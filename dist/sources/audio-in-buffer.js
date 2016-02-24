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

var worker = '\nself.addEventListener(\'message\', function process(e) {\n  var blockSize = e.data.options.blockSize;\n  var sampleRate = e.data.options.sampleRate;\n  var buffer = new Float32Array(e.data.buffer);\n\n  var length = buffer.length;\n  // var block = new Float32Array(blockSize);\n\n  for (var index = 0; index < length; index += blockSize) {\n    var copySize = length - index;\n    if (copySize > blockSize) { copySize = blockSize; }\n\n    var block = buffer.subarray(index, index + copySize);\n    block = new Float32Array(block);\n\n    postMessage({ buffer: block.buffer, time: index / sampleRate }, [block.buffer]);\n  }\n}, false)';

/**
 * AudioBuffer as source, sliced it in blocks through a worker
 */

var AudioInBuffer = (function (_AudioIn) {
  _inherits(AudioInBuffer, _AudioIn);

  function AudioInBuffer() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, AudioInBuffer);

    _get(Object.getPrototypeOf(AudioInBuffer.prototype), 'constructor', this).call(this, options, {});
    this.metaData = {};

    if (!this.params.src || !(this.params.src instanceof AudioBuffer)) {
      throw new Error('An AudioBuffer source must be given');
    }
  }

  _createClass(AudioInBuffer, [{
    key: 'configureStream',
    value: function configureStream() {
      this.streamParams.frameSize = this.params.frameSize;
      this.streamParams.frameRate = this.params.src.sampleRate / this.params.frameSize;
      this.streamParams.sourceSampleRate = this.params.src.sampleRate;
    }
  }, {
    key: 'initialize',
    value: function initialize() {
      _get(Object.getPrototypeOf(AudioInBuffer.prototype), 'initialize', this).call(this);
      // init worker
      // @NOTE: could be done once in constructor ?
      var blob = new Blob([worker], { type: "text/javascript" });
      this.worker = new Worker(window.URL.createObjectURL(blob));
      this.worker.addEventListener('message', this.process.bind(this), false);
    }
  }, {
    key: 'start',
    value: function start() {
      // propagate to the whole chain
      this.initialize();
      this.reset();

      var buffer = this.src.getChannelData(this.channel).buffer;

      this.worker.postMessage({
        options: {
          sampleRate: this.streamParams.sourceSampleRate,
          blockSize: this.streamParams.frameSize
        },
        buffer: buffer
      }, [buffer]);
    }
  }, {
    key: 'stop',
    value: function stop() {
      // propagate to the whole chain
      this.finalize();
    }

    // callback of the worker
  }, {
    key: 'process',
    value: function process(e) {
      var block = new Float32Array(e.data.buffer);
      this.outFrame.set(block, 0);
      this.time = e.data.time;

      this.output();
    }
  }]);

  return AudioInBuffer;
})(_audioIn2['default']);

exports['default'] = AudioInBuffer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL2F1ZGlvLWluLWJ1ZmZlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3VCQUFvQixZQUFZOzs7O0FBRWhDLElBQU0sTUFBTSxtb0JBa0JGLENBQUM7Ozs7OztJQUtVLGFBQWE7WUFBYixhQUFhOztBQUNyQixXQURRLGFBQWEsR0FDTjtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBREwsYUFBYTs7QUFFOUIsK0JBRmlCLGFBQWEsNkNBRXhCLE9BQU8sRUFBRSxFQUFFLEVBQUU7QUFDbkIsUUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7O0FBRW5CLFFBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxZQUFZLFdBQVcsQ0FBQSxBQUFDLEVBQUU7QUFDakUsWUFBTSxJQUFJLEtBQUssQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO0tBQ3hEO0dBQ0Y7O2VBUmtCLGFBQWE7O1dBVWpCLDJCQUFHO0FBQ2hCLFVBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ3BELFVBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztBQUNqRixVQUFJLENBQUMsWUFBWSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQztLQUNqRTs7O1dBRVMsc0JBQUc7QUFDWCxpQ0FqQmlCLGFBQWEsNENBaUJYOzs7QUFHbkIsVUFBTSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRSxDQUFDLENBQUM7QUFDN0QsVUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzNELFVBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQ3pFOzs7V0FFSSxpQkFBRzs7QUFFTixVQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDbEIsVUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDOztBQUViLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUE7O0FBRTNELFVBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO0FBQ3RCLGVBQU8sRUFBRTtBQUNQLG9CQUFVLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0I7QUFDOUMsbUJBQVMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVM7U0FDdkM7QUFDRCxjQUFNLEVBQUUsTUFBTTtPQUNmLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0tBQ2Q7OztXQUVHLGdCQUFHOztBQUVMLFVBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztLQUNqQjs7Ozs7V0FHTSxpQkFBQyxDQUFDLEVBQUU7QUFDVCxVQUFNLEtBQUssR0FBRyxJQUFJLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzlDLFVBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM1QixVQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDOztBQUV4QixVQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDZjs7O1NBckRrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiJlczYvc291cmNlcy9hdWRpby1pbi1idWZmZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQXVkaW9JbiBmcm9tICcuL2F1ZGlvLWluJztcblxuY29uc3Qgd29ya2VyID0gYFxuc2VsZi5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gcHJvY2VzcyhlKSB7XG4gIHZhciBibG9ja1NpemUgPSBlLmRhdGEub3B0aW9ucy5ibG9ja1NpemU7XG4gIHZhciBzYW1wbGVSYXRlID0gZS5kYXRhLm9wdGlvbnMuc2FtcGxlUmF0ZTtcbiAgdmFyIGJ1ZmZlciA9IG5ldyBGbG9hdDMyQXJyYXkoZS5kYXRhLmJ1ZmZlcik7XG5cbiAgdmFyIGxlbmd0aCA9IGJ1ZmZlci5sZW5ndGg7XG4gIC8vIHZhciBibG9jayA9IG5ldyBGbG9hdDMyQXJyYXkoYmxvY2tTaXplKTtcblxuICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCArPSBibG9ja1NpemUpIHtcbiAgICB2YXIgY29weVNpemUgPSBsZW5ndGggLSBpbmRleDtcbiAgICBpZiAoY29weVNpemUgPiBibG9ja1NpemUpIHsgY29weVNpemUgPSBibG9ja1NpemU7IH1cblxuICAgIHZhciBibG9jayA9IGJ1ZmZlci5zdWJhcnJheShpbmRleCwgaW5kZXggKyBjb3B5U2l6ZSk7XG4gICAgYmxvY2sgPSBuZXcgRmxvYXQzMkFycmF5KGJsb2NrKTtcblxuICAgIHBvc3RNZXNzYWdlKHsgYnVmZmVyOiBibG9jay5idWZmZXIsIHRpbWU6IGluZGV4IC8gc2FtcGxlUmF0ZSB9LCBbYmxvY2suYnVmZmVyXSk7XG4gIH1cbn0sIGZhbHNlKWA7XG5cbi8qKlxuICogQXVkaW9CdWZmZXIgYXMgc291cmNlLCBzbGljZWQgaXQgaW4gYmxvY2tzIHRocm91Z2ggYSB3b3JrZXJcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXVkaW9JbkJ1ZmZlciBleHRlbmRzIEF1ZGlvSW4ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLCB7fSk7XG4gICAgdGhpcy5tZXRhRGF0YSA9IHt9O1xuXG4gICAgaWYgKCF0aGlzLnBhcmFtcy5zcmMgfHwgISh0aGlzLnBhcmFtcy5zcmMgaW5zdGFuY2VvZiBBdWRpb0J1ZmZlcikpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQW4gQXVkaW9CdWZmZXIgc291cmNlIG11c3QgYmUgZ2l2ZW4nKTtcbiAgICB9XG4gIH1cblxuICBjb25maWd1cmVTdHJlYW0oKSB7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gdGhpcy5wYXJhbXMuZnJhbWVTaXplO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lUmF0ZSA9IHRoaXMucGFyYW1zLnNyYy5zYW1wbGVSYXRlIC8gdGhpcy5wYXJhbXMuZnJhbWVTaXplO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGUgPSB0aGlzLnBhcmFtcy5zcmMuc2FtcGxlUmF0ZTtcbiAgfVxuXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIC8vIGluaXQgd29ya2VyXG4gICAgLy8gQE5PVEU6IGNvdWxkIGJlIGRvbmUgb25jZSBpbiBjb25zdHJ1Y3RvciA/XG4gICAgY29uc3QgYmxvYiA9IG5ldyBCbG9iKFt3b3JrZXJdLCB7IHR5cGU6IFwidGV4dC9qYXZhc2NyaXB0XCIgfSk7XG4gICAgdGhpcy53b3JrZXIgPSBuZXcgV29ya2VyKHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpKTtcbiAgICB0aGlzLndvcmtlci5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgdGhpcy5wcm9jZXNzLmJpbmQodGhpcyksIGZhbHNlKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIC8vIHByb3BhZ2F0ZSB0byB0aGUgd2hvbGUgY2hhaW5cbiAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnJlc2V0KCk7XG5cbiAgICBjb25zdCBidWZmZXIgPSB0aGlzLnNyYy5nZXRDaGFubmVsRGF0YSh0aGlzLmNoYW5uZWwpLmJ1ZmZlclxuXG4gICAgdGhpcy53b3JrZXIucG9zdE1lc3NhZ2Uoe1xuICAgICAgb3B0aW9uczoge1xuICAgICAgICBzYW1wbGVSYXRlOiB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlLFxuICAgICAgICBibG9ja1NpemU6IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZVxuICAgICAgfSxcbiAgICAgIGJ1ZmZlcjogYnVmZmVyXG4gICAgfSwgW2J1ZmZlcl0pO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICAvLyBwcm9wYWdhdGUgdG8gdGhlIHdob2xlIGNoYWluXG4gICAgdGhpcy5maW5hbGl6ZSgpO1xuICB9XG5cbiAgLy8gY2FsbGJhY2sgb2YgdGhlIHdvcmtlclxuICBwcm9jZXNzKGUpIHtcbiAgICBjb25zdCBibG9jayA9IG5ldyBGbG9hdDMyQXJyYXkoZS5kYXRhLmJ1ZmZlcik7XG4gICAgdGhpcy5vdXRGcmFtZS5zZXQoYmxvY2ssIDApO1xuICAgIHRoaXMudGltZSA9IGUuZGF0YS50aW1lO1xuXG4gICAgdGhpcy5vdXRwdXQoKTtcbiAgfVxufVxuIl19