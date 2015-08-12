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

// var isPowerOfTwo = function(number) {
//   while ((number % 2 === 0) && number > 1) {
//     number = number / 2;
//   }

//   return number === 1;
// }

var _coreBaseLfo2 = _interopRequireDefault(_coreBaseLfo);

var Framer = (function (_BaseLfo) {
  _inherits(Framer, _BaseLfo);

  function Framer(options) {
    _classCallCheck(this, Framer);

    var defaults = {
      frameSize: 512,
      // define a good name cf. Nobert
      centeredTimeTag: false
    };

    _get(Object.getPrototypeOf(Framer.prototype), 'constructor', this).call(this, options, defaults);

    this.frameIndex = 0;

    // throw error if frameSize is not a power of 2 ?
    // if (!isPowerOfTwo(this.streamParams.frameSize)) {
    //   // throw Error() ?
    // }
  }

  _createClass(Framer, [{
    key: 'configureStream',
    value: function configureStream() {
      // defaults to `hopSize` === `frameSize`
      if (!this.params.hopSize) {
        this.params.hopSize = this.params.frameSize;
      }

      this.streamParams.frameSize = this.params.frameSize;
      this.streamParams.frameRate = this.streamParams.blockSampleRate / this.params.hopSize;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvZnJhbWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7MkJBQW9CLGtCQUFrQjs7Ozs7Ozs7Ozs7O0lBVWpCLE1BQU07WUFBTixNQUFNOztBQUNkLFdBRFEsTUFBTSxDQUNiLE9BQU8sRUFBRTswQkFERixNQUFNOztBQUV2QixRQUFJLFFBQVEsR0FBRztBQUNiLGVBQVMsRUFBRSxHQUFHOztBQUVkLHFCQUFlLEVBQUUsS0FBSztLQUN2QixDQUFDOztBQUVGLCtCQVJpQixNQUFNLDZDQVFqQixPQUFPLEVBQUUsUUFBUSxFQUFFOztBQUV6QixRQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQzs7Ozs7O0dBTXJCOztlQWhCa0IsTUFBTTs7V0FrQlYsMkJBQUc7O0FBRWhCLFVBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRTtBQUN4QixZQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztPQUM3Qzs7QUFFRCxVQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztBQUNwRCxVQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztLQUN2Rjs7Ozs7V0FHSSxpQkFBRztBQUNOLFVBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO0FBQ3BCLGlDQS9CaUIsTUFBTSx1Q0ErQlQ7S0FDZjs7O1dBRU8sb0JBQUc7OztBQUdULFdBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNsRSxZQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztPQUN0Qjs7QUFFRCxVQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7O0FBRWQsaUNBM0NpQixNQUFNLDBDQTJDTjtLQUNsQjs7O1dBRU0saUJBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7QUFDN0IsVUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUM7QUFDbkQsVUFBSSxZQUFZLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQzs7QUFFbEMsVUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztBQUNqQyxVQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQztBQUM1QyxVQUFJLFNBQVMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO0FBQzdCLFVBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztBQUNuQixVQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQzs7QUFFbEMsVUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQzs7QUFFN0IsYUFBTyxVQUFVLEdBQUcsU0FBUyxFQUFFO0FBQzdCLFlBQUksT0FBTyxHQUFHLENBQUMsQ0FBQzs7O0FBR2hCLFlBQUksVUFBVSxHQUFHLENBQUMsRUFBRTtBQUNsQixpQkFBTyxHQUFHLENBQUMsVUFBVSxDQUFDO1NBQ3ZCOztBQUVELFlBQUksT0FBTyxHQUFHLFNBQVMsRUFBRTtBQUN2QixvQkFBVSxJQUFJLE9BQU8sQ0FBQzs7QUFFdEIsY0FBSSxPQUFPLEdBQUcsU0FBUyxHQUFHLFVBQVUsQ0FBQzs7QUFFckMsY0FBSSxPQUFPLEdBQUcsU0FBUyxHQUFHLFVBQVUsQ0FBQzs7QUFFckMsY0FBSSxPQUFPLElBQUksT0FBTyxFQUFFO0FBQ3RCLG1CQUFPLEdBQUcsT0FBTyxDQUFDO1dBQ25COzs7QUFHRCxjQUFJLElBQUksR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxVQUFVLEdBQUcsT0FBTyxDQUFDLENBQUM7O0FBRTVELGtCQUFRLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQzs7O0FBRy9CLG9CQUFVLElBQUksT0FBTyxDQUFDO0FBQ3RCLG9CQUFVLElBQUksT0FBTyxDQUFDOzs7QUFHdEIsY0FBSSxVQUFVLEtBQUssU0FBUyxFQUFFOztBQUU1QixnQkFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRTtBQUMvQixrQkFBSSxDQUFDLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLEdBQUcsU0FBUyxHQUFHLENBQUMsQ0FBQSxHQUFJLFlBQVksQ0FBQzthQUNoRSxNQUFNO0FBQ0wsa0JBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQSxHQUFJLFlBQVksQ0FBQzthQUM1RDs7O0FBR0QsZ0JBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDOzs7QUFHekIsZ0JBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQzs7O0FBR2QsZ0JBQUksT0FBTyxHQUFHLFNBQVMsRUFBRTtBQUN2QixzQkFBUSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUN4RDs7QUFFRCxzQkFBVSxJQUFJLE9BQU8sQ0FBQztXQUN2QjtTQUNGLE1BQU07O0FBRUwsZ0JBQUksU0FBUyxHQUFHLFNBQVMsR0FBRyxVQUFVLENBQUM7QUFDdkMsc0JBQVUsSUFBSSxTQUFTLENBQUM7QUFDeEIsc0JBQVUsSUFBSSxTQUFTLENBQUM7V0FDekI7T0FDRjs7QUFFRCxVQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztLQUM5Qjs7O1NBckhrQixNQUFNOzs7cUJBQU4sTUFBTSIsImZpbGUiOiJlczYvb3BlcmF0b3JzL2ZyYW1lci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvYmFzZS1sZm8nO1xuXG4vLyB2YXIgaXNQb3dlck9mVHdvID0gZnVuY3Rpb24obnVtYmVyKSB7XG4vLyAgIHdoaWxlICgobnVtYmVyICUgMiA9PT0gMCkgJiYgbnVtYmVyID4gMSkge1xuLy8gICAgIG51bWJlciA9IG51bWJlciAvIDI7XG4vLyAgIH1cblxuLy8gICByZXR1cm4gbnVtYmVyID09PSAxO1xuLy8gfVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGcmFtZXIgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgIGZyYW1lU2l6ZTogNTEyLFxuICAgICAgLy8gZGVmaW5lIGEgZ29vZCBuYW1lIGNmLiBOb2JlcnRcbiAgICAgIGNlbnRlcmVkVGltZVRhZzogZmFsc2VcbiAgICB9O1xuXG4gICAgc3VwZXIob3B0aW9ucywgZGVmYXVsdHMpO1xuXG4gICAgdGhpcy5mcmFtZUluZGV4ID0gMDtcblxuICAgIC8vIHRocm93IGVycm9yIGlmIGZyYW1lU2l6ZSBpcyBub3QgYSBwb3dlciBvZiAyID9cbiAgICAvLyBpZiAoIWlzUG93ZXJPZlR3byh0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUpKSB7XG4gICAgLy8gICAvLyB0aHJvdyBFcnJvcigpID9cbiAgICAvLyB9XG4gIH1cblxuICBjb25maWd1cmVTdHJlYW0oKSB7XG4gICAgLy8gZGVmYXVsdHMgdG8gYGhvcFNpemVgID09PSBgZnJhbWVTaXplYFxuICAgIGlmICghdGhpcy5wYXJhbXMuaG9wU2l6ZSkge1xuICAgICAgdGhpcy5wYXJhbXMuaG9wU2l6ZSA9IHRoaXMucGFyYW1zLmZyYW1lU2l6ZTtcbiAgICB9XG5cbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSB0aGlzLnBhcmFtcy5mcmFtZVNpemU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVSYXRlID0gdGhpcy5zdHJlYW1QYXJhbXMuYmxvY2tTYW1wbGVSYXRlIC8gdGhpcy5wYXJhbXMuaG9wU2l6ZTtcbiAgfVxuXG4gIC8vIEBOT1RFIG11c3QgYmUgdGVzdGVkXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuZnJhbWVJbmRleCA9IDA7XG4gICAgc3VwZXIucmVzZXQoKTtcbiAgfVxuXG4gIGZpbmFsaXplKCkge1xuICAgIC8vIEBOT1RFIHdoYXQgYWJvdXQgdGltZSA/XG4gICAgLy8gZmlsbCB0aGUgb25nb2luZyBidWZmZXIgd2l0aCAwXG4gICAgZm9yIChsZXQgaSA9IHRoaXMuZnJhbWVJbmRleCwgbCA9IHRoaXMub3V0RnJhbWUubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB0aGlzLm91dEZyYW1lW2ldID0gMDtcbiAgICB9XG4gICAgLy8gb3V0cHV0IGl0XG4gICAgdGhpcy5vdXRwdXQoKTtcblxuICAgIHN1cGVyLmZpbmFsaXplKCk7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGJsb2NrLCBtZXRhRGF0YSkge1xuICAgIHZhciBzYW1wbGVSYXRlID0gdGhpcy5zdHJlYW1QYXJhbXMuYmxvY2tTYW1wbGVSYXRlO1xuICAgIHZhciBzYW1wbGVQZXJpb2QgPSAxIC8gc2FtcGxlUmF0ZTtcblxuICAgIHZhciBmcmFtZUluZGV4ID0gdGhpcy5mcmFtZUluZGV4O1xuICAgIHZhciBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgdmFyIGJsb2NrU2l6ZSA9IGJsb2NrLmxlbmd0aDtcbiAgICB2YXIgYmxvY2tJbmRleCA9IDA7XG4gICAgdmFyIGhvcFNpemUgPSB0aGlzLnBhcmFtcy5ob3BTaXplO1xuXG4gICAgdmFyIG91dEZyYW1lID0gdGhpcy5vdXRGcmFtZTtcblxuICAgIHdoaWxlIChibG9ja0luZGV4IDwgYmxvY2tTaXplKSB7XG4gICAgICB2YXIgbnVtU2tpcCA9IDA7XG5cbiAgICAgIC8vIHNraXAgYmxvY2sgc2FtcGxlcyBmb3IgbmVnYXRpdmUgZnJhbWVJbmRleFxuICAgICAgaWYgKGZyYW1lSW5kZXggPCAwKSB7XG4gICAgICAgIG51bVNraXAgPSAtZnJhbWVJbmRleDtcbiAgICAgIH1cblxuICAgICAgaWYgKG51bVNraXAgPCBibG9ja1NpemUpIHtcbiAgICAgICAgYmxvY2tJbmRleCArPSBudW1Ta2lwOyAvLyBza2lwIGJsb2NrIHNlZ21lbnRcbiAgICAgICAgLy8gY2FuIGNvcHkgYWxsIHRoZSByZXN0IG9mIHRoZSBpbmNvbWluZyBibG9ja1xuICAgICAgICB2YXIgbnVtQ29weSA9IGJsb2NrU2l6ZSAtIGJsb2NrSW5kZXg7XG4gICAgICAgIC8vIGNvbm5vdCBjb3B5IG1vcmUgdGhhbiB3aGF0IGZpdHMgaW50byB0aGUgZnJhbWVcbiAgICAgICAgdmFyIG1heENvcHkgPSBmcmFtZVNpemUgLSBmcmFtZUluZGV4O1xuXG4gICAgICAgIGlmIChudW1Db3B5ID49IG1heENvcHkpIHtcbiAgICAgICAgICBudW1Db3B5ID0gbWF4Q29weTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNvcHkgYmxvY2sgc2VnbWVudCBpbnRvIGZyYW1lXG4gICAgICAgIHZhciBjb3B5ID0gYmxvY2suc3ViYXJyYXkoYmxvY2tJbmRleCwgYmxvY2tJbmRleCArIG51bUNvcHkpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhibG9ja0luZGV4LCBmcmFtZUluZGV4LCBudW1Db3B5KTtcbiAgICAgICAgb3V0RnJhbWUuc2V0KGNvcHksIGZyYW1lSW5kZXgpO1xuXG4gICAgICAgIC8vIGFkdmFuY2UgYmxvY2sgYW5kIGZyYW1lIGluZGV4XG4gICAgICAgIGJsb2NrSW5kZXggKz0gbnVtQ29weTtcbiAgICAgICAgZnJhbWVJbmRleCArPSBudW1Db3B5O1xuXG4gICAgICAgIC8vIHNlbmQgZnJhbWUgd2hlbiBjb21wbGV0ZWRcbiAgICAgICAgaWYgKGZyYW1lSW5kZXggPT09IGZyYW1lU2l6ZSkge1xuICAgICAgICAgIC8vIGRlZmluZSB0aW1lIHRhZyBmb3IgdGhlIG91dEZyYW1lIGFjY29yZGluZyB0byBjb25maWd1cmF0aW9uXG4gICAgICAgICAgaWYgKHRoaXMucGFyYW1zLmNlbnRlcmVkVGltZVRhZykge1xuICAgICAgICAgICAgdGhpcy50aW1lID0gdGltZSArIChibG9ja0luZGV4IC0gZnJhbWVTaXplIC8gMikgKiBzYW1wbGVQZXJpb2Q7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudGltZSA9IHRpbWUgKyAoYmxvY2tJbmRleCAtIGZyYW1lU2l6ZSkgKiBzYW1wbGVQZXJpb2Q7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gZm9yd2FyZCBtZXRhRGF0YSA/XG4gICAgICAgICAgdGhpcy5tZXRhRGF0YSA9IG1ldGFEYXRhO1xuXG4gICAgICAgICAgLy8gZm9yd2FyZCB0byBuZXh0IG5vZGVzXG4gICAgICAgICAgdGhpcy5vdXRwdXQoKTtcblxuICAgICAgICAgIC8vIHNoaWZ0IGZyYW1lIGxlZnRcbiAgICAgICAgICBpZiAoaG9wU2l6ZSA8IGZyYW1lU2l6ZSkge1xuICAgICAgICAgICAgb3V0RnJhbWUuc2V0KG91dEZyYW1lLnN1YmFycmF5KGhvcFNpemUsIGZyYW1lU2l6ZSksIDApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGZyYW1lSW5kZXggLT0gaG9wU2l6ZTsgLy8gaG9wIGZvcndhcmRcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gc2tpcCBlbnRpcmUgYmxvY2tcbiAgICAgICAgdmFyIGJsb2NrUmVzdCA9IGJsb2NrU2l6ZSAtIGJsb2NrSW5kZXg7XG4gICAgICAgIGZyYW1lSW5kZXggKz0gYmxvY2tSZXN0O1xuICAgICAgICBibG9ja0luZGV4ICs9IGJsb2NrUmVzdDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmZyYW1lSW5kZXggPSBmcmFtZUluZGV4O1xuICB9XG59XG4iXX0=