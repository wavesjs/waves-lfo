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
        framesize: this.params.frameSize,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvZnJhbWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7MkJBQW9CLGtCQUFrQjs7OztJQUdqQixNQUFNO1lBQU4sTUFBTTs7QUFDZCxXQURRLE1BQU0sQ0FDYixPQUFPLEVBQUU7MEJBREYsTUFBTTs7QUFFdkIsK0JBRmlCLE1BQU0sNkNBRWpCO0FBQ0osZUFBUyxFQUFFLEdBQUc7QUFDZCxxQkFBZSxFQUFFLEtBQUs7S0FDdkIsRUFBRSxPQUFPLEVBQUU7O0FBRVosUUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7R0FDckI7O2VBUmtCLE1BQU07O1dBVWYsb0JBQUMsY0FBYyxFQUFFO0FBQ3pCLFVBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFDdEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7O0FBRTlDLGlDQWRpQixNQUFNLDRDQWNOLGNBQWMsRUFBRTtBQUMvQixpQkFBUyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUztBQUNoQyxpQkFBUyxFQUFFLGNBQWMsQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU87T0FDakUsRUFBRTtLQUNKOzs7OztXQUdJLGlCQUFHO0FBQ04sVUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7QUFDcEIsaUNBdkJpQixNQUFNLHVDQXVCVDtLQUNmOzs7V0FFTyxvQkFBRzs7O0FBR1QsV0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ2xFLFlBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQ3RCOztBQUVELFVBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQzs7QUFFZCxpQ0FuQ2lCLE1BQU0sMENBbUNOO0tBQ2xCOzs7V0FFTSxpQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtBQUM3QixVQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQy9CLFVBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUM7QUFDdEQsVUFBTSxZQUFZLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQztBQUNwQyxVQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQztBQUM5QyxVQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO0FBQy9CLFVBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO0FBQ3BDLFVBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7QUFDakMsVUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDOztBQUVuQixhQUFPLFVBQVUsR0FBRyxTQUFTLEVBQUU7QUFDN0IsWUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDOzs7QUFHaEIsWUFBSSxVQUFVLEdBQUcsQ0FBQyxFQUFFO0FBQ2xCLGlCQUFPLEdBQUcsQ0FBQyxVQUFVLENBQUM7U0FDdkI7O0FBRUQsWUFBSSxPQUFPLEdBQUcsU0FBUyxFQUFFO0FBQ3ZCLG9CQUFVLElBQUksT0FBTyxDQUFDOzs7QUFHdEIsY0FBSSxPQUFPLEdBQUcsU0FBUyxHQUFHLFVBQVUsQ0FBQzs7O0FBR3JDLGNBQU0sT0FBTyxHQUFHLFNBQVMsR0FBRyxVQUFVLENBQUM7O0FBRXZDLGNBQUksT0FBTyxJQUFJLE9BQU8sRUFBRTtBQUN0QixtQkFBTyxHQUFHLE9BQU8sQ0FBQztXQUNuQjs7O0FBR0QsY0FBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsVUFBVSxHQUFHLE9BQU8sQ0FBQyxDQUFDOzs7QUFHOUQsa0JBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDOzs7QUFHL0Isb0JBQVUsSUFBSSxPQUFPLENBQUM7QUFDdEIsb0JBQVUsSUFBSSxPQUFPLENBQUM7OztBQUd0QixjQUFJLFVBQVUsS0FBSyxTQUFTLEVBQUU7O0FBRTVCLGdCQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFO0FBQy9CLGtCQUFJLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLFVBQVUsR0FBRyxTQUFTLEdBQUcsQ0FBQyxDQUFBLEdBQUksWUFBWSxDQUFDO2FBQ2hFLE1BQU07QUFDTCxrQkFBSSxDQUFDLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFBLEdBQUksWUFBWSxDQUFDO2FBQzVEOzs7QUFHRCxnQkFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7OztBQUd6QixnQkFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDOzs7QUFHZCxnQkFBSSxPQUFPLEdBQUcsU0FBUyxFQUFFO0FBQ3ZCLHNCQUFRLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ3hEOztBQUVELHNCQUFVLElBQUksT0FBTyxDQUFDO1dBQ3ZCO1NBQ0YsTUFBTTs7QUFFTCxnQkFBTSxTQUFTLEdBQUcsU0FBUyxHQUFHLFVBQVUsQ0FBQztBQUN6QyxzQkFBVSxJQUFJLFNBQVMsQ0FBQztBQUN4QixzQkFBVSxJQUFJLFNBQVMsQ0FBQztXQUN6QjtPQUNGOztBQUVELFVBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0tBQzlCOzs7U0E5R2tCLE1BQU07OztxQkFBTixNQUFNIiwiZmlsZSI6ImVzNi9vcGVyYXRvcnMvZnJhbWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vY29yZS9iYXNlLWxmbyc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRnJhbWVyIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcih7XG4gICAgICBmcmFtZVNpemU6IDUxMixcbiAgICAgIGNlbnRlcmVkVGltZVRhZzogZmFsc2VcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIHRoaXMuZnJhbWVJbmRleCA9IDA7XG4gIH1cblxuICBpbml0aWFsaXplKGluU3RyZWFtUGFyYW1zKSB7XG4gICAgaWYgKCF0aGlzLnBhcmFtcy5ob3BTaXplKVxuICAgICAgdGhpcy5wYXJhbXMuaG9wU2l6ZSA9IHRoaXMucGFyYW1zLmZyYW1lU2l6ZTsgLy8gaG9wU2l6ZSBkZWZhdWx0cyB0byBmcmFtZVNpemVcblxuICAgIHN1cGVyLmluaXRpYWxpemUoaW5TdHJlYW1QYXJhbXMsIHtcbiAgICAgIGZyYW1lc2l6ZTogdGhpcy5wYXJhbXMuZnJhbWVTaXplLFxuICAgICAgZnJhbWVSYXRlOiBpblN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlIC8gdGhpcy5wYXJhbXMuaG9wU2l6ZSxcbiAgICB9KTtcbiAgfVxuXG4gIC8vIEBOT1RFIG11c3QgYmUgdGVzdGVkXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuZnJhbWVJbmRleCA9IDA7XG4gICAgc3VwZXIucmVzZXQoKTtcbiAgfVxuXG4gIGZpbmFsaXplKCkge1xuICAgIC8vIEBOT1RFIHdoYXQgYWJvdXQgdGltZSA/XG4gICAgLy8gZmlsbCB0aGUgb25nb2luZyBidWZmZXIgd2l0aCAwXG4gICAgZm9yIChsZXQgaSA9IHRoaXMuZnJhbWVJbmRleCwgbCA9IHRoaXMub3V0RnJhbWUubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB0aGlzLm91dEZyYW1lW2ldID0gMDtcbiAgICB9XG4gICAgLy8gb3V0cHV0IGl0XG4gICAgdGhpcy5vdXRwdXQoKTtcblxuICAgIHN1cGVyLmZpbmFsaXplKCk7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGJsb2NrLCBtZXRhRGF0YSkge1xuICAgIGNvbnN0IG91dEZyYW1lID0gdGhpcy5vdXRGcmFtZTtcbiAgICBjb25zdCBzYW1wbGVSYXRlID0gdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZTtcbiAgICBjb25zdCBzYW1wbGVQZXJpb2QgPSAxIC8gc2FtcGxlUmF0ZTtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgY29uc3QgYmxvY2tTaXplID0gYmxvY2subGVuZ3RoO1xuICAgIGNvbnN0IGhvcFNpemUgPSB0aGlzLnBhcmFtcy5ob3BTaXplO1xuICAgIGxldCBmcmFtZUluZGV4ID0gdGhpcy5mcmFtZUluZGV4O1xuICAgIGxldCBibG9ja0luZGV4ID0gMDtcblxuICAgIHdoaWxlIChibG9ja0luZGV4IDwgYmxvY2tTaXplKSB7XG4gICAgICBsZXQgbnVtU2tpcCA9IDA7XG5cbiAgICAgIC8vIHNraXAgYmxvY2sgc2FtcGxlcyBmb3IgbmVnYXRpdmUgZnJhbWVJbmRleFxuICAgICAgaWYgKGZyYW1lSW5kZXggPCAwKSB7XG4gICAgICAgIG51bVNraXAgPSAtZnJhbWVJbmRleDtcbiAgICAgIH1cblxuICAgICAgaWYgKG51bVNraXAgPCBibG9ja1NpemUpIHtcbiAgICAgICAgYmxvY2tJbmRleCArPSBudW1Ta2lwOyAvLyBza2lwIGJsb2NrIHNlZ21lbnRcblxuICAgICAgICAvLyBjYW4gY29weSBhbGwgdGhlIHJlc3Qgb2YgdGhlIGluY29taW5nIGJsb2NrXG4gICAgICAgIGxldCBudW1Db3B5ID0gYmxvY2tTaXplIC0gYmxvY2tJbmRleDtcblxuICAgICAgICAvLyBjb25ub3QgY29weSBtb3JlIHRoYW4gd2hhdCBmaXRzIGludG8gdGhlIGZyYW1lXG4gICAgICAgIGNvbnN0IG1heENvcHkgPSBmcmFtZVNpemUgLSBmcmFtZUluZGV4O1xuXG4gICAgICAgIGlmIChudW1Db3B5ID49IG1heENvcHkpIHtcbiAgICAgICAgICBudW1Db3B5ID0gbWF4Q29weTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNvcHkgYmxvY2sgc2VnbWVudCBpbnRvIGZyYW1lXG4gICAgICAgIGNvbnN0IGNvcHkgPSBibG9jay5zdWJhcnJheShibG9ja0luZGV4LCBibG9ja0luZGV4ICsgbnVtQ29weSk7XG5cbiAgICAgICAgLy8gY29uc29sZS5sb2coYmxvY2tJbmRleCwgZnJhbWVJbmRleCwgbnVtQ29weSk7XG4gICAgICAgIG91dEZyYW1lLnNldChjb3B5LCBmcmFtZUluZGV4KTtcblxuICAgICAgICAvLyBhZHZhbmNlIGJsb2NrIGFuZCBmcmFtZSBpbmRleFxuICAgICAgICBibG9ja0luZGV4ICs9IG51bUNvcHk7XG4gICAgICAgIGZyYW1lSW5kZXggKz0gbnVtQ29weTtcblxuICAgICAgICAvLyBzZW5kIGZyYW1lIHdoZW4gY29tcGxldGVkXG4gICAgICAgIGlmIChmcmFtZUluZGV4ID09PSBmcmFtZVNpemUpIHtcbiAgICAgICAgICAvLyBkZWZpbmUgdGltZSB0YWcgZm9yIHRoZSBvdXRGcmFtZSBhY2NvcmRpbmcgdG8gY29uZmlndXJhdGlvblxuICAgICAgICAgIGlmICh0aGlzLnBhcmFtcy5jZW50ZXJlZFRpbWVUYWcpIHtcbiAgICAgICAgICAgIHRoaXMudGltZSA9IHRpbWUgKyAoYmxvY2tJbmRleCAtIGZyYW1lU2l6ZSAvIDIpICogc2FtcGxlUGVyaW9kO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRpbWUgPSB0aW1lICsgKGJsb2NrSW5kZXggLSBmcmFtZVNpemUpICogc2FtcGxlUGVyaW9kO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIGZvcndhcmQgbWV0YURhdGEgP1xuICAgICAgICAgIHRoaXMubWV0YURhdGEgPSBtZXRhRGF0YTtcblxuICAgICAgICAgIC8vIGZvcndhcmQgdG8gbmV4dCBub2Rlc1xuICAgICAgICAgIHRoaXMub3V0cHV0KCk7XG5cbiAgICAgICAgICAvLyBzaGlmdCBmcmFtZSBsZWZ0XG4gICAgICAgICAgaWYgKGhvcFNpemUgPCBmcmFtZVNpemUpIHtcbiAgICAgICAgICAgIG91dEZyYW1lLnNldChvdXRGcmFtZS5zdWJhcnJheShob3BTaXplLCBmcmFtZVNpemUpLCAwKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmcmFtZUluZGV4IC09IGhvcFNpemU7IC8vIGhvcCBmb3J3YXJkXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHNraXAgZW50aXJlIGJsb2NrXG4gICAgICAgIGNvbnN0IGJsb2NrUmVzdCA9IGJsb2NrU2l6ZSAtIGJsb2NrSW5kZXg7XG4gICAgICAgIGZyYW1lSW5kZXggKz0gYmxvY2tSZXN0O1xuICAgICAgICBibG9ja0luZGV4ICs9IGJsb2NrUmVzdDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmZyYW1lSW5kZXggPSBmcmFtZUluZGV4O1xuICB9XG59XG4iXX0=