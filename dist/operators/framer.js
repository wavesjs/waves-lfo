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

var Framer = (function (_BaseLfo) {
  _inherits(Framer, _BaseLfo);

  function Framer(options) {
    _classCallCheck(this, Framer);

    _get(Object.getPrototypeOf(Framer.prototype), 'constructor', this).call(this, {
      frameSize: 512,
      centeredTimeTag: false
    }, options);

    this.frameIndex = 0;
  }

  _createClass(Framer, [{
    key: 'initialize',
    value: function initialize(inStreamParams) {
      if (!this.params.hopSize) this.params.hopSize = this.params.frameSize; // hopSize defaults to frameSize

      _get(Object.getPrototypeOf(Framer.prototype), 'initialize', this).call(this, inStreamParams, {
        frameSize: this.params.frameSize,
        frameRate: inStreamParams.sourceSampleRate / this.params.hopSize
      });
    }

    // @NOTE must be tested
  }, {
    key: 'reset',
    value: function reset() {
      this.frameIndex = 0;
      _get(Object.getPrototypeOf(Framer.prototype), 'reset', this).call(this);
    }
  }, {
    key: 'finalize',
    value: function finalize(endTime) {
      if (this.frameIndex > 0) {
        this.outFrame.fill(0, this.frameIndex);
        this.output();
      }

      _get(Object.getPrototypeOf(Framer.prototype), 'finalize', this).call(this, endTime);
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
})(_coreBaseLfo2['default']);

exports['default'] = Framer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvZnJhbWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7MkJBQW9CLGtCQUFrQjs7OztJQUdqQixNQUFNO1lBQU4sTUFBTTs7QUFDZCxXQURRLE1BQU0sQ0FDYixPQUFPLEVBQUU7MEJBREYsTUFBTTs7QUFFdkIsK0JBRmlCLE1BQU0sNkNBRWpCO0FBQ0osZUFBUyxFQUFFLEdBQUc7QUFDZCxxQkFBZSxFQUFFLEtBQUs7S0FDdkIsRUFBRSxPQUFPLEVBQUU7O0FBRVosUUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7R0FDckI7O2VBUmtCLE1BQU07O1dBVWYsb0JBQUMsY0FBYyxFQUFFO0FBQ3pCLFVBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFDdEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7O0FBRTlDLGlDQWRpQixNQUFNLDRDQWNOLGNBQWMsRUFBRTtBQUMvQixpQkFBUyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUztBQUNoQyxpQkFBUyxFQUFFLGNBQWMsQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU87T0FDakUsRUFBRTtLQUNKOzs7OztXQUdJLGlCQUFHO0FBQ04sVUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7QUFDcEIsaUNBdkJpQixNQUFNLHVDQXVCVDtLQUNmOzs7V0FFTyxrQkFBQyxPQUFPLEVBQUU7QUFDaEIsVUFBSSxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRTtBQUN2QixZQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZDLFlBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztPQUNmOztBQUVELGlDQWhDaUIsTUFBTSwwQ0FnQ1IsT0FBTyxFQUFFO0tBQ3pCOzs7V0FFTSxpQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtBQUM3QixVQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQy9CLFVBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUM7QUFDdEQsVUFBTSxZQUFZLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQztBQUNwQyxVQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQztBQUM5QyxVQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO0FBQy9CLFVBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO0FBQ3BDLFVBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7QUFDakMsVUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDOztBQUVuQixhQUFPLFVBQVUsR0FBRyxTQUFTLEVBQUU7QUFDN0IsWUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDOzs7QUFHaEIsWUFBSSxVQUFVLEdBQUcsQ0FBQyxFQUFFO0FBQ2xCLGlCQUFPLEdBQUcsQ0FBQyxVQUFVLENBQUM7U0FDdkI7O0FBRUQsWUFBSSxPQUFPLEdBQUcsU0FBUyxFQUFFO0FBQ3ZCLG9CQUFVLElBQUksT0FBTyxDQUFDOzs7QUFHdEIsY0FBSSxPQUFPLEdBQUcsU0FBUyxHQUFHLFVBQVUsQ0FBQzs7O0FBR3JDLGNBQU0sT0FBTyxHQUFHLFNBQVMsR0FBRyxVQUFVLENBQUM7O0FBRXZDLGNBQUksT0FBTyxJQUFJLE9BQU8sRUFBRTtBQUN0QixtQkFBTyxHQUFHLE9BQU8sQ0FBQztXQUNuQjs7O0FBR0QsY0FBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsVUFBVSxHQUFHLE9BQU8sQ0FBQyxDQUFDOztBQUU5RCxrQkFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7OztBQUcvQixvQkFBVSxJQUFJLE9BQU8sQ0FBQztBQUN0QixvQkFBVSxJQUFJLE9BQU8sQ0FBQzs7O0FBR3RCLGNBQUksVUFBVSxLQUFLLFNBQVMsRUFBRTs7QUFFNUIsZ0JBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUU7QUFDL0Isa0JBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsVUFBVSxHQUFHLFNBQVMsR0FBRyxDQUFDLENBQUEsR0FBSSxZQUFZLENBQUM7YUFDaEUsTUFBTTtBQUNMLGtCQUFJLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUEsR0FBSSxZQUFZLENBQUM7YUFDNUQ7OztBQUdELGdCQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQzs7O0FBR3pCLGdCQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7OztBQUdkLGdCQUFJLE9BQU8sR0FBRyxTQUFTLEVBQUU7QUFDdkIsc0JBQVEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDeEQ7O0FBRUQsc0JBQVUsSUFBSSxPQUFPLENBQUM7V0FDdkI7U0FDRixNQUFNOztBQUVMLGdCQUFNLFNBQVMsR0FBRyxTQUFTLEdBQUcsVUFBVSxDQUFDO0FBQ3pDLHNCQUFVLElBQUksU0FBUyxDQUFDO0FBQ3hCLHNCQUFVLElBQUksU0FBUyxDQUFDO1dBQ3pCO09BQ0Y7O0FBRUQsVUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7S0FDOUI7OztTQTFHa0IsTUFBTTs7O3FCQUFOLE1BQU0iLCJmaWxlIjoiZXM2L29wZXJhdG9ycy9mcmFtZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi9jb3JlL2Jhc2UtbGZvJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGcmFtZXIgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKHtcbiAgICAgIGZyYW1lU2l6ZTogNTEyLFxuICAgICAgY2VudGVyZWRUaW1lVGFnOiBmYWxzZVxuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5mcmFtZUluZGV4ID0gMDtcbiAgfVxuXG4gIGluaXRpYWxpemUoaW5TdHJlYW1QYXJhbXMpIHtcbiAgICBpZiAoIXRoaXMucGFyYW1zLmhvcFNpemUpXG4gICAgICB0aGlzLnBhcmFtcy5ob3BTaXplID0gdGhpcy5wYXJhbXMuZnJhbWVTaXplOyAvLyBob3BTaXplIGRlZmF1bHRzIHRvIGZyYW1lU2l6ZVxuXG4gICAgc3VwZXIuaW5pdGlhbGl6ZShpblN0cmVhbVBhcmFtcywge1xuICAgICAgZnJhbWVTaXplOiB0aGlzLnBhcmFtcy5mcmFtZVNpemUsXG4gICAgICBmcmFtZVJhdGU6IGluU3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGUgLyB0aGlzLnBhcmFtcy5ob3BTaXplLFxuICAgIH0pO1xuICB9XG5cbiAgLy8gQE5PVEUgbXVzdCBiZSB0ZXN0ZWRcbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5mcmFtZUluZGV4ID0gMDtcbiAgICBzdXBlci5yZXNldCgpO1xuICB9XG5cbiAgZmluYWxpemUoZW5kVGltZSkge1xuICAgIGlmICh0aGlzLmZyYW1lSW5kZXggPiAwKSB7XG4gICAgICB0aGlzLm91dEZyYW1lLmZpbGwoMCwgdGhpcy5mcmFtZUluZGV4KTtcbiAgICAgIHRoaXMub3V0cHV0KCk7XG4gICAgfVxuXG4gICAgc3VwZXIuZmluYWxpemUoZW5kVGltZSk7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGJsb2NrLCBtZXRhRGF0YSkge1xuICAgIGNvbnN0IG91dEZyYW1lID0gdGhpcy5vdXRGcmFtZTtcbiAgICBjb25zdCBzYW1wbGVSYXRlID0gdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZTtcbiAgICBjb25zdCBzYW1wbGVQZXJpb2QgPSAxIC8gc2FtcGxlUmF0ZTtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgY29uc3QgYmxvY2tTaXplID0gYmxvY2subGVuZ3RoO1xuICAgIGNvbnN0IGhvcFNpemUgPSB0aGlzLnBhcmFtcy5ob3BTaXplO1xuICAgIGxldCBmcmFtZUluZGV4ID0gdGhpcy5mcmFtZUluZGV4O1xuICAgIGxldCBibG9ja0luZGV4ID0gMDtcblxuICAgIHdoaWxlIChibG9ja0luZGV4IDwgYmxvY2tTaXplKSB7XG4gICAgICBsZXQgbnVtU2tpcCA9IDA7XG5cbiAgICAgIC8vIHNraXAgYmxvY2sgc2FtcGxlcyBmb3IgbmVnYXRpdmUgZnJhbWVJbmRleFxuICAgICAgaWYgKGZyYW1lSW5kZXggPCAwKSB7XG4gICAgICAgIG51bVNraXAgPSAtZnJhbWVJbmRleDtcbiAgICAgIH1cblxuICAgICAgaWYgKG51bVNraXAgPCBibG9ja1NpemUpIHtcbiAgICAgICAgYmxvY2tJbmRleCArPSBudW1Ta2lwOyAvLyBza2lwIGJsb2NrIHNlZ21lbnRcblxuICAgICAgICAvLyBjYW4gY29weSBhbGwgdGhlIHJlc3Qgb2YgdGhlIGluY29taW5nIGJsb2NrXG4gICAgICAgIGxldCBudW1Db3B5ID0gYmxvY2tTaXplIC0gYmxvY2tJbmRleDtcblxuICAgICAgICAvLyBjb25ub3QgY29weSBtb3JlIHRoYW4gd2hhdCBmaXRzIGludG8gdGhlIGZyYW1lXG4gICAgICAgIGNvbnN0IG1heENvcHkgPSBmcmFtZVNpemUgLSBmcmFtZUluZGV4O1xuXG4gICAgICAgIGlmIChudW1Db3B5ID49IG1heENvcHkpIHtcbiAgICAgICAgICBudW1Db3B5ID0gbWF4Q29weTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNvcHkgYmxvY2sgc2VnbWVudCBpbnRvIGZyYW1lXG4gICAgICAgIGNvbnN0IGNvcHkgPSBibG9jay5zdWJhcnJheShibG9ja0luZGV4LCBibG9ja0luZGV4ICsgbnVtQ29weSk7XG5cbiAgICAgICAgb3V0RnJhbWUuc2V0KGNvcHksIGZyYW1lSW5kZXgpO1xuXG4gICAgICAgIC8vIGFkdmFuY2UgYmxvY2sgYW5kIGZyYW1lIGluZGV4XG4gICAgICAgIGJsb2NrSW5kZXggKz0gbnVtQ29weTtcbiAgICAgICAgZnJhbWVJbmRleCArPSBudW1Db3B5O1xuXG4gICAgICAgIC8vIHNlbmQgZnJhbWUgd2hlbiBjb21wbGV0ZWRcbiAgICAgICAgaWYgKGZyYW1lSW5kZXggPT09IGZyYW1lU2l6ZSkge1xuICAgICAgICAgIC8vIGRlZmluZSB0aW1lIHRhZyBmb3IgdGhlIG91dEZyYW1lIGFjY29yZGluZyB0byBjb25maWd1cmF0aW9uXG4gICAgICAgICAgaWYgKHRoaXMucGFyYW1zLmNlbnRlcmVkVGltZVRhZykge1xuICAgICAgICAgICAgdGhpcy50aW1lID0gdGltZSArIChibG9ja0luZGV4IC0gZnJhbWVTaXplIC8gMikgKiBzYW1wbGVQZXJpb2Q7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudGltZSA9IHRpbWUgKyAoYmxvY2tJbmRleCAtIGZyYW1lU2l6ZSkgKiBzYW1wbGVQZXJpb2Q7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gZm9yd2FyZCBtZXRhRGF0YSA/XG4gICAgICAgICAgdGhpcy5tZXRhRGF0YSA9IG1ldGFEYXRhO1xuXG4gICAgICAgICAgLy8gZm9yd2FyZCB0byBuZXh0IG5vZGVzXG4gICAgICAgICAgdGhpcy5vdXRwdXQoKTtcblxuICAgICAgICAgIC8vIHNoaWZ0IGZyYW1lIGxlZnRcbiAgICAgICAgICBpZiAoaG9wU2l6ZSA8IGZyYW1lU2l6ZSkge1xuICAgICAgICAgICAgb3V0RnJhbWUuc2V0KG91dEZyYW1lLnN1YmFycmF5KGhvcFNpemUsIGZyYW1lU2l6ZSksIDApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGZyYW1lSW5kZXggLT0gaG9wU2l6ZTsgLy8gaG9wIGZvcndhcmRcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gc2tpcCBlbnRpcmUgYmxvY2tcbiAgICAgICAgY29uc3QgYmxvY2tSZXN0ID0gYmxvY2tTaXplIC0gYmxvY2tJbmRleDtcbiAgICAgICAgZnJhbWVJbmRleCArPSBibG9ja1Jlc3Q7XG4gICAgICAgIGJsb2NrSW5kZXggKz0gYmxvY2tSZXN0O1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuZnJhbWVJbmRleCA9IGZyYW1lSW5kZXg7XG4gIH1cbn1cbiJdfQ==