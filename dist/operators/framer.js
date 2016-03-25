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

var Framer = function (_BaseLfo) {
  (0, _inherits3.default)(Framer, _BaseLfo);

  function Framer(options) {
    (0, _classCallCheck3.default)(this, Framer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Framer).call(this, {
      frameSize: 512,
      centeredTimeTag: false
    }, options));

    _this.frameIndex = 0;
    return _this;
  }

  (0, _createClass3.default)(Framer, [{
    key: 'initialize',
    value: function initialize(inStreamParams) {
      if (!this.params.hopSize) this.params.hopSize = this.params.frameSize; // hopSize defaults to frameSize

      (0, _get3.default)((0, _getPrototypeOf2.default)(Framer.prototype), 'initialize', this).call(this, inStreamParams, {
        frameSize: this.params.frameSize,
        frameRate: inStreamParams.sourceSampleRate / this.params.hopSize
      });
    }

    // @NOTE must be tested

  }, {
    key: 'reset',
    value: function reset() {
      this.frameIndex = 0;
      (0, _get3.default)((0, _getPrototypeOf2.default)(Framer.prototype), 'reset', this).call(this);
    }
  }, {
    key: 'finalize',
    value: function finalize(endTime) {
      if (this.frameIndex > 0) {
        this.outFrame.fill(0, this.frameIndex);
        this.output();
      }

      (0, _get3.default)((0, _getPrototypeOf2.default)(Framer.prototype), 'finalize', this).call(this, endTime);
    }
  }, {
    key: 'process',
    value: function process(time, block, metaData) {
      var outFrame = this.outFrame;
      var sampleRate = this.streamParams.sourceSampleRate;
      var samplePeriod = 1 / sampleRate;
      var frameSize = this.streamParams.frameSize;
      var blockSize = block.length;
      var hopSize = this.params.hopSize;
      var frameIndex = this.frameIndex;
      var blockIndex = 0;

      while (blockIndex < blockSize) {
        var numSkip = 0;

        // skip block samples for negative frameIndex
        if (frameIndex < 0) {
          numSkip = -frameIndex;
        }

        if (numSkip < blockSize) {
          blockIndex += numSkip; // skip block segment

          // can copy all the rest of the incoming block
          var numCopy = blockSize - blockIndex;

          // connot copy more than what fits into the frame
          var maxCopy = frameSize - frameIndex;

          if (numCopy >= maxCopy) {
            numCopy = maxCopy;
          }

          // copy block segment into frame
          var copy = block.subarray(blockIndex, blockIndex + numCopy);

          outFrame.set(copy, frameIndex);

          // advance block and frame index
          blockIndex += numCopy;
          frameIndex += numCopy;

          // send frame when completed
          if (frameIndex === frameSize) {
            // define time tag for the outFrame according to configuration
            if (this.params.centeredTimeTag) {
              this.time = time + (blockIndex - frameSize / 2) * samplePeriod;
            } else {
              this.time = time + (blockIndex - frameSize) * samplePeriod;
            }

            // forward metaData ?
            this.metaData = metaData;

            // forward to next nodes
            this.output();

            // shift frame left
            if (hopSize < frameSize) {
              outFrame.set(outFrame.subarray(hopSize, frameSize), 0);
            }

            frameIndex -= hopSize; // hop forward
          }
        } else {
            // skip entire block
            var blockRest = blockSize - blockIndex;
            frameIndex += blockRest;
            blockIndex += blockRest;
          }
      }

      this.frameIndex = frameIndex;
    }
  }]);
  return Framer;
}(_baseLfo2.default);

exports.default = Framer;
//# sourceMappingURL=data:application/json;base64,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QVQsQ0FBYSxTQUFTLFFBQVQsQ0FBa0IsT0FBbEIsRUFBMkIsU0FBM0IsQ0FBYixFQUFvRCxDQUFwRCxFQUR1QjthQUF6Qjs7QUFJQSwwQkFBYyxPQUFkO0FBbkI0QixXQUE5QjtTQXZCRixNQTRDTzs7QUFFTCxnQkFBTSxZQUFZLFlBQVksVUFBWixDQUZiO0FBR0wsMEJBQWMsU0FBZCxDQUhLO0FBSUwsMEJBQWMsU0FBZCxDQUpLO1dBNUNQO09BUkY7O0FBNERBLFdBQUssVUFBTCxHQUFrQixVQUFsQixDQXRFNkI7OztTQW5DWiIsImZpbGUiOiJmcmFtZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi9jb3JlL2Jhc2UtbGZvJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGcmFtZXIgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKHtcbiAgICAgIGZyYW1lU2l6ZTogNTEyLFxuICAgICAgY2VudGVyZWRUaW1lVGFnOiBmYWxzZVxuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5mcmFtZUluZGV4ID0gMDtcbiAgfVxuXG4gIGluaXRpYWxpemUoaW5TdHJlYW1QYXJhbXMpIHtcbiAgICBpZiAoIXRoaXMucGFyYW1zLmhvcFNpemUpXG4gICAgICB0aGlzLnBhcmFtcy5ob3BTaXplID0gdGhpcy5wYXJhbXMuZnJhbWVTaXplOyAvLyBob3BTaXplIGRlZmF1bHRzIHRvIGZyYW1lU2l6ZVxuXG4gICAgc3VwZXIuaW5pdGlhbGl6ZShpblN0cmVhbVBhcmFtcywge1xuICAgICAgZnJhbWVTaXplOiB0aGlzLnBhcmFtcy5mcmFtZVNpemUsXG4gICAgICBmcmFtZVJhdGU6IGluU3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGUgLyB0aGlzLnBhcmFtcy5ob3BTaXplLFxuICAgIH0pO1xuICB9XG5cbiAgLy8gQE5PVEUgbXVzdCBiZSB0ZXN0ZWRcbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5mcmFtZUluZGV4ID0gMDtcbiAgICBzdXBlci5yZXNldCgpO1xuICB9XG5cbiAgZmluYWxpemUoZW5kVGltZSkge1xuICAgIGlmICh0aGlzLmZyYW1lSW5kZXggPiAwKSB7XG4gICAgICB0aGlzLm91dEZyYW1lLmZpbGwoMCwgdGhpcy5mcmFtZUluZGV4KTtcbiAgICAgIHRoaXMub3V0cHV0KCk7XG4gICAgfVxuXG4gICAgc3VwZXIuZmluYWxpemUoZW5kVGltZSk7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGJsb2NrLCBtZXRhRGF0YSkge1xuICAgIGNvbnN0IG91dEZyYW1lID0gdGhpcy5vdXRGcmFtZTtcbiAgICBjb25zdCBzYW1wbGVSYXRlID0gdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZTtcbiAgICBjb25zdCBzYW1wbGVQZXJpb2QgPSAxIC8gc2FtcGxlUmF0ZTtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgY29uc3QgYmxvY2tTaXplID0gYmxvY2subGVuZ3RoO1xuICAgIGNvbnN0IGhvcFNpemUgPSB0aGlzLnBhcmFtcy5ob3BTaXplO1xuICAgIGxldCBmcmFtZUluZGV4ID0gdGhpcy5mcmFtZUluZGV4O1xuICAgIGxldCBibG9ja0luZGV4ID0gMDtcblxuICAgIHdoaWxlIChibG9ja0luZGV4IDwgYmxvY2tTaXplKSB7XG4gICAgICBsZXQgbnVtU2tpcCA9IDA7XG5cbiAgICAgIC8vIHNraXAgYmxvY2sgc2FtcGxlcyBmb3IgbmVnYXRpdmUgZnJhbWVJbmRleFxuICAgICAgaWYgKGZyYW1lSW5kZXggPCAwKSB7XG4gICAgICAgIG51bVNraXAgPSAtZnJhbWVJbmRleDtcbiAgICAgIH1cblxuICAgICAgaWYgKG51bVNraXAgPCBibG9ja1NpemUpIHtcbiAgICAgICAgYmxvY2tJbmRleCArPSBudW1Ta2lwOyAvLyBza2lwIGJsb2NrIHNlZ21lbnRcblxuICAgICAgICAvLyBjYW4gY29weSBhbGwgdGhlIHJlc3Qgb2YgdGhlIGluY29taW5nIGJsb2NrXG4gICAgICAgIGxldCBudW1Db3B5ID0gYmxvY2tTaXplIC0gYmxvY2tJbmRleDtcblxuICAgICAgICAvLyBjb25ub3QgY29weSBtb3JlIHRoYW4gd2hhdCBmaXRzIGludG8gdGhlIGZyYW1lXG4gICAgICAgIGNvbnN0IG1heENvcHkgPSBmcmFtZVNpemUgLSBmcmFtZUluZGV4O1xuXG4gICAgICAgIGlmIChudW1Db3B5ID49IG1heENvcHkpIHtcbiAgICAgICAgICBudW1Db3B5ID0gbWF4Q29weTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNvcHkgYmxvY2sgc2VnbWVudCBpbnRvIGZyYW1lXG4gICAgICAgIGNvbnN0IGNvcHkgPSBibG9jay5zdWJhcnJheShibG9ja0luZGV4LCBibG9ja0luZGV4ICsgbnVtQ29weSk7XG5cbiAgICAgICAgb3V0RnJhbWUuc2V0KGNvcHksIGZyYW1lSW5kZXgpO1xuXG4gICAgICAgIC8vIGFkdmFuY2UgYmxvY2sgYW5kIGZyYW1lIGluZGV4XG4gICAgICAgIGJsb2NrSW5kZXggKz0gbnVtQ29weTtcbiAgICAgICAgZnJhbWVJbmRleCArPSBudW1Db3B5O1xuXG4gICAgICAgIC8vIHNlbmQgZnJhbWUgd2hlbiBjb21wbGV0ZWRcbiAgICAgICAgaWYgKGZyYW1lSW5kZXggPT09IGZyYW1lU2l6ZSkge1xuICAgICAgICAgIC8vIGRlZmluZSB0aW1lIHRhZyBmb3IgdGhlIG91dEZyYW1lIGFjY29yZGluZyB0byBjb25maWd1cmF0aW9uXG4gICAgICAgICAgaWYgKHRoaXMucGFyYW1zLmNlbnRlcmVkVGltZVRhZykge1xuICAgICAgICAgICAgdGhpcy50aW1lID0gdGltZSArIChibG9ja0luZGV4IC0gZnJhbWVTaXplIC8gMikgKiBzYW1wbGVQZXJpb2Q7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudGltZSA9IHRpbWUgKyAoYmxvY2tJbmRleCAtIGZyYW1lU2l6ZSkgKiBzYW1wbGVQZXJpb2Q7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gZm9yd2FyZCBtZXRhRGF0YSA/XG4gICAgICAgICAgdGhpcy5tZXRhRGF0YSA9IG1ldGFEYXRhO1xuXG4gICAgICAgICAgLy8gZm9yd2FyZCB0byBuZXh0IG5vZGVzXG4gICAgICAgICAgdGhpcy5vdXRwdXQoKTtcblxuICAgICAgICAgIC8vIHNoaWZ0IGZyYW1lIGxlZnRcbiAgICAgICAgICBpZiAoaG9wU2l6ZSA8IGZyYW1lU2l6ZSkge1xuICAgICAgICAgICAgb3V0RnJhbWUuc2V0KG91dEZyYW1lLnN1YmFycmF5KGhvcFNpemUsIGZyYW1lU2l6ZSksIDApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGZyYW1lSW5kZXggLT0gaG9wU2l6ZTsgLy8gaG9wIGZvcndhcmRcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gc2tpcCBlbnRpcmUgYmxvY2tcbiAgICAgICAgY29uc3QgYmxvY2tSZXN0ID0gYmxvY2tTaXplIC0gYmxvY2tJbmRleDtcbiAgICAgICAgZnJhbWVJbmRleCArPSBibG9ja1Jlc3Q7XG4gICAgICAgIGJsb2NrSW5kZXggKz0gYmxvY2tSZXN0O1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuZnJhbWVJbmRleCA9IGZyYW1lSW5kZXg7XG4gIH1cbn1cbiJdfQ==