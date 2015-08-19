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

    var defaults = {
      frameSize: 512,
      centeredTimeTag: false
    };

    _get(Object.getPrototypeOf(Framer.prototype), 'constructor', this).call(this, options, defaults);

    this.frameIndex = 0;
  }

  _createClass(Framer, [{
    key: 'configureStream',
    value: function configureStream() {
      // defaults to `hopSize` === `frameSize`
      if (!this.params.hopSize) {
        this.params.hopSize = this.params.frameSize;
      }

      this.streamParams.frameSize = this.params.frameSize;
      this.streamParams.frameRate = this.streamParams.sourceSampleRate / this.params.hopSize;
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
    value: function finalize() {
      // @NOTE what about time ?
      // fill the ongoing buffer with 0
      for (var i = this.frameIndex, l = this.outFrame.length; i < l; i++) {
        this.outFrame[i] = 0;
      }
      // output it
      this.output();

      _get(Object.getPrototypeOf(Framer.prototype), 'finalize', this).call(this);
    }
  }, {
    key: 'process',
    value: function process(time, block, metaData) {
      var sampleRate = this.streamParams.blockSampleRate;
      var samplePeriod = 1 / sampleRate;

      var frameIndex = this.frameIndex;
      var frameSize = this.streamParams.frameSize;
      var blockSize = block.length;
      var blockIndex = 0;
      var hopSize = this.params.hopSize;

      var outFrame = this.outFrame;

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
          // console.log(blockIndex, frameIndex, numCopy);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvZnJhbWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7MkJBQW9CLGtCQUFrQjs7OztJQUdqQixNQUFNO1lBQU4sTUFBTTs7QUFDZCxXQURRLE1BQU0sQ0FDYixPQUFPLEVBQUU7MEJBREYsTUFBTTs7QUFFdkIsUUFBSSxRQUFRLEdBQUc7QUFDYixlQUFTLEVBQUUsR0FBRztBQUNkLHFCQUFlLEVBQUUsS0FBSztLQUN2QixDQUFDOztBQUVGLCtCQVBpQixNQUFNLDZDQU9qQixPQUFPLEVBQUUsUUFBUSxFQUFFOztBQUV6QixRQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztHQUNyQjs7ZUFWa0IsTUFBTTs7V0FZViwyQkFBRzs7QUFFaEIsVUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFO0FBQ3hCLFlBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO09BQzdDOztBQUVELFVBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ3BELFVBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7S0FDeEY7Ozs7O1dBR0ksaUJBQUc7QUFDTixVQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztBQUNwQixpQ0F6QmlCLE1BQU0sdUNBeUJUO0tBQ2Y7OztXQUVPLG9CQUFHOzs7QUFHVCxXQUFLLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDbEUsWUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7T0FDdEI7O0FBRUQsVUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDOztBQUVkLGlDQXJDaUIsTUFBTSwwQ0FxQ047S0FDbEI7OztXQUVNLGlCQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO0FBQzdCLFVBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDO0FBQ25ELFVBQUksWUFBWSxHQUFHLENBQUMsR0FBRyxVQUFVLENBQUM7O0FBRWxDLFVBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7QUFDakMsVUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUM7QUFDNUMsVUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztBQUM3QixVQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7QUFDbkIsVUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7O0FBRWxDLFVBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7O0FBRTdCLGFBQU8sVUFBVSxHQUFHLFNBQVMsRUFBRTtBQUM3QixZQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7OztBQUdoQixZQUFJLFVBQVUsR0FBRyxDQUFDLEVBQUU7QUFDbEIsaUJBQU8sR0FBRyxDQUFDLFVBQVUsQ0FBQztTQUN2Qjs7QUFFRCxZQUFJLE9BQU8sR0FBRyxTQUFTLEVBQUU7QUFDdkIsb0JBQVUsSUFBSSxPQUFPLENBQUM7O0FBRXRCLGNBQUksT0FBTyxHQUFHLFNBQVMsR0FBRyxVQUFVLENBQUM7O0FBRXJDLGNBQUksT0FBTyxHQUFHLFNBQVMsR0FBRyxVQUFVLENBQUM7O0FBRXJDLGNBQUksT0FBTyxJQUFJLE9BQU8sRUFBRTtBQUN0QixtQkFBTyxHQUFHLE9BQU8sQ0FBQztXQUNuQjs7O0FBR0QsY0FBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsVUFBVSxHQUFHLE9BQU8sQ0FBQyxDQUFDOztBQUU1RCxrQkFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7OztBQUcvQixvQkFBVSxJQUFJLE9BQU8sQ0FBQztBQUN0QixvQkFBVSxJQUFJLE9BQU8sQ0FBQzs7O0FBR3RCLGNBQUksVUFBVSxLQUFLLFNBQVMsRUFBRTs7QUFFNUIsZ0JBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUU7QUFDL0Isa0JBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsVUFBVSxHQUFHLFNBQVMsR0FBRyxDQUFDLENBQUEsR0FBSSxZQUFZLENBQUM7YUFDaEUsTUFBTTtBQUNMLGtCQUFJLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUEsR0FBSSxZQUFZLENBQUM7YUFDNUQ7OztBQUdELGdCQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQzs7O0FBR3pCLGdCQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7OztBQUdkLGdCQUFJLE9BQU8sR0FBRyxTQUFTLEVBQUU7QUFDdkIsc0JBQVEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDeEQ7O0FBRUQsc0JBQVUsSUFBSSxPQUFPLENBQUM7V0FDdkI7U0FDRixNQUFNOztBQUVMLGdCQUFJLFNBQVMsR0FBRyxTQUFTLEdBQUcsVUFBVSxDQUFDO0FBQ3ZDLHNCQUFVLElBQUksU0FBUyxDQUFDO0FBQ3hCLHNCQUFVLElBQUksU0FBUyxDQUFDO1dBQ3pCO09BQ0Y7O0FBRUQsVUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7S0FDOUI7OztTQS9Ha0IsTUFBTTs7O3FCQUFOLE1BQU0iLCJmaWxlIjoiZXM2L29wZXJhdG9ycy9mcmFtZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi9jb3JlL2Jhc2UtbGZvJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGcmFtZXIgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgIGZyYW1lU2l6ZTogNTEyLFxuICAgICAgY2VudGVyZWRUaW1lVGFnOiBmYWxzZVxuICAgIH07XG5cbiAgICBzdXBlcihvcHRpb25zLCBkZWZhdWx0cyk7XG5cbiAgICB0aGlzLmZyYW1lSW5kZXggPSAwO1xuICB9XG5cbiAgY29uZmlndXJlU3RyZWFtKCkge1xuICAgIC8vIGRlZmF1bHRzIHRvIGBob3BTaXplYCA9PT0gYGZyYW1lU2l6ZWBcbiAgICBpZiAoIXRoaXMucGFyYW1zLmhvcFNpemUpIHtcbiAgICAgIHRoaXMucGFyYW1zLmhvcFNpemUgPSB0aGlzLnBhcmFtcy5mcmFtZVNpemU7XG4gICAgfVxuXG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gdGhpcy5wYXJhbXMuZnJhbWVTaXplO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lUmF0ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGUgLyB0aGlzLnBhcmFtcy5ob3BTaXplO1xuICB9XG5cbiAgLy8gQE5PVEUgbXVzdCBiZSB0ZXN0ZWRcbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5mcmFtZUluZGV4ID0gMDtcbiAgICBzdXBlci5yZXNldCgpO1xuICB9XG5cbiAgZmluYWxpemUoKSB7XG4gICAgLy8gQE5PVEUgd2hhdCBhYm91dCB0aW1lID9cbiAgICAvLyBmaWxsIHRoZSBvbmdvaW5nIGJ1ZmZlciB3aXRoIDBcbiAgICBmb3IgKGxldCBpID0gdGhpcy5mcmFtZUluZGV4LCBsID0gdGhpcy5vdXRGcmFtZS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHRoaXMub3V0RnJhbWVbaV0gPSAwO1xuICAgIH1cbiAgICAvLyBvdXRwdXQgaXRcbiAgICB0aGlzLm91dHB1dCgpO1xuXG4gICAgc3VwZXIuZmluYWxpemUoKTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgYmxvY2ssIG1ldGFEYXRhKSB7XG4gICAgdmFyIHNhbXBsZVJhdGUgPSB0aGlzLnN0cmVhbVBhcmFtcy5ibG9ja1NhbXBsZVJhdGU7XG4gICAgdmFyIHNhbXBsZVBlcmlvZCA9IDEgLyBzYW1wbGVSYXRlO1xuXG4gICAgdmFyIGZyYW1lSW5kZXggPSB0aGlzLmZyYW1lSW5kZXg7XG4gICAgdmFyIGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICB2YXIgYmxvY2tTaXplID0gYmxvY2subGVuZ3RoO1xuICAgIHZhciBibG9ja0luZGV4ID0gMDtcbiAgICB2YXIgaG9wU2l6ZSA9IHRoaXMucGFyYW1zLmhvcFNpemU7XG5cbiAgICB2YXIgb3V0RnJhbWUgPSB0aGlzLm91dEZyYW1lO1xuXG4gICAgd2hpbGUgKGJsb2NrSW5kZXggPCBibG9ja1NpemUpIHtcbiAgICAgIHZhciBudW1Ta2lwID0gMDtcblxuICAgICAgLy8gc2tpcCBibG9jayBzYW1wbGVzIGZvciBuZWdhdGl2ZSBmcmFtZUluZGV4XG4gICAgICBpZiAoZnJhbWVJbmRleCA8IDApIHtcbiAgICAgICAgbnVtU2tpcCA9IC1mcmFtZUluZGV4O1xuICAgICAgfVxuXG4gICAgICBpZiAobnVtU2tpcCA8IGJsb2NrU2l6ZSkge1xuICAgICAgICBibG9ja0luZGV4ICs9IG51bVNraXA7IC8vIHNraXAgYmxvY2sgc2VnbWVudFxuICAgICAgICAvLyBjYW4gY29weSBhbGwgdGhlIHJlc3Qgb2YgdGhlIGluY29taW5nIGJsb2NrXG4gICAgICAgIHZhciBudW1Db3B5ID0gYmxvY2tTaXplIC0gYmxvY2tJbmRleDtcbiAgICAgICAgLy8gY29ubm90IGNvcHkgbW9yZSB0aGFuIHdoYXQgZml0cyBpbnRvIHRoZSBmcmFtZVxuICAgICAgICB2YXIgbWF4Q29weSA9IGZyYW1lU2l6ZSAtIGZyYW1lSW5kZXg7XG5cbiAgICAgICAgaWYgKG51bUNvcHkgPj0gbWF4Q29weSkge1xuICAgICAgICAgIG51bUNvcHkgPSBtYXhDb3B5O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY29weSBibG9jayBzZWdtZW50IGludG8gZnJhbWVcbiAgICAgICAgdmFyIGNvcHkgPSBibG9jay5zdWJhcnJheShibG9ja0luZGV4LCBibG9ja0luZGV4ICsgbnVtQ29weSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGJsb2NrSW5kZXgsIGZyYW1lSW5kZXgsIG51bUNvcHkpO1xuICAgICAgICBvdXRGcmFtZS5zZXQoY29weSwgZnJhbWVJbmRleCk7XG5cbiAgICAgICAgLy8gYWR2YW5jZSBibG9jayBhbmQgZnJhbWUgaW5kZXhcbiAgICAgICAgYmxvY2tJbmRleCArPSBudW1Db3B5O1xuICAgICAgICBmcmFtZUluZGV4ICs9IG51bUNvcHk7XG5cbiAgICAgICAgLy8gc2VuZCBmcmFtZSB3aGVuIGNvbXBsZXRlZFxuICAgICAgICBpZiAoZnJhbWVJbmRleCA9PT0gZnJhbWVTaXplKSB7XG4gICAgICAgICAgLy8gZGVmaW5lIHRpbWUgdGFnIGZvciB0aGUgb3V0RnJhbWUgYWNjb3JkaW5nIHRvIGNvbmZpZ3VyYXRpb25cbiAgICAgICAgICBpZiAodGhpcy5wYXJhbXMuY2VudGVyZWRUaW1lVGFnKSB7XG4gICAgICAgICAgICB0aGlzLnRpbWUgPSB0aW1lICsgKGJsb2NrSW5kZXggLSBmcmFtZVNpemUgLyAyKSAqIHNhbXBsZVBlcmlvZDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50aW1lID0gdGltZSArIChibG9ja0luZGV4IC0gZnJhbWVTaXplKSAqIHNhbXBsZVBlcmlvZDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBmb3J3YXJkIG1ldGFEYXRhID9cbiAgICAgICAgICB0aGlzLm1ldGFEYXRhID0gbWV0YURhdGE7XG5cbiAgICAgICAgICAvLyBmb3J3YXJkIHRvIG5leHQgbm9kZXNcbiAgICAgICAgICB0aGlzLm91dHB1dCgpO1xuXG4gICAgICAgICAgLy8gc2hpZnQgZnJhbWUgbGVmdFxuICAgICAgICAgIGlmIChob3BTaXplIDwgZnJhbWVTaXplKSB7XG4gICAgICAgICAgICBvdXRGcmFtZS5zZXQob3V0RnJhbWUuc3ViYXJyYXkoaG9wU2l6ZSwgZnJhbWVTaXplKSwgMCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZnJhbWVJbmRleCAtPSBob3BTaXplOyAvLyBob3AgZm9yd2FyZFxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBza2lwIGVudGlyZSBibG9ja1xuICAgICAgICB2YXIgYmxvY2tSZXN0ID0gYmxvY2tTaXplIC0gYmxvY2tJbmRleDtcbiAgICAgICAgZnJhbWVJbmRleCArPSBibG9ja1Jlc3Q7XG4gICAgICAgIGJsb2NrSW5kZXggKz0gYmxvY2tSZXN0O1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuZnJhbWVJbmRleCA9IGZyYW1lSW5kZXg7XG4gIH1cbn1cbiJdfQ==