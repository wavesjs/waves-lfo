'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var Lfo = require('../core/lfo-base');

// var isPowerOfTwo = function(number) {
//   while ((number % 2 === 0) && number > 1) {
//     number = number / 2;
//   }

//   return number === 1;
// }

var Framer = (function (_Lfo) {
  _inherits(Framer, _Lfo);

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
})(Lfo);

module.exports = Framer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvZnJhbWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7Ozs7Ozs7OztBQUViLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDOzs7Ozs7Ozs7O0lBVWhDLE1BQU07WUFBTixNQUFNOztBQUNDLFdBRFAsTUFBTSxDQUNFLE9BQU8sRUFBRTswQkFEakIsTUFBTTs7QUFFUixRQUFJLFFBQVEsR0FBRztBQUNiLGVBQVMsRUFBRSxHQUFHOztBQUVkLHFCQUFlLEVBQUUsS0FBSztLQUN2QixDQUFDOztBQUVGLCtCQVJFLE1BQU0sNkNBUUYsT0FBTyxFQUFFLFFBQVEsRUFBRTs7QUFFekIsUUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7Ozs7OztHQU1yQjs7ZUFoQkcsTUFBTTs7V0FrQkssMkJBQUc7O0FBRWhCLFVBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRTtBQUN4QixZQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztPQUM3Qzs7QUFFRCxVQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztBQUNwRCxVQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztLQUN2Rjs7Ozs7V0FHSSxpQkFBRztBQUNOLFVBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO0FBQ3BCLGlDQS9CRSxNQUFNLHVDQStCTTtLQUNmOzs7V0FFTyxvQkFBRzs7O0FBR1QsV0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMs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bnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgTGZvID0gcmVxdWlyZSgnLi4vY29yZS9sZm8tYmFzZScpO1xuXG4vLyB2YXIgaXNQb3dlck9mVHdvID0gZnVuY3Rpb24obnVtYmVyKSB7XG4vLyAgIHdoaWxlICgobnVtYmVyICUgMiA9PT0gMCkgJiYgbnVtYmVyID4gMSkge1xuLy8gICAgIG51bWJlciA9IG51bWJlciAvIDI7XG4vLyAgIH1cblxuLy8gICByZXR1cm4gbnVtYmVyID09PSAxO1xuLy8gfVxuXG5jbGFzcyBGcmFtZXIgZXh0ZW5kcyBMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgZnJhbWVTaXplOiA1MTIsXG4gICAgICAvLyBkZWZpbmUgYSBnb29kIG5hbWUgY2YuIE5vYmVydFxuICAgICAgY2VudGVyZWRUaW1lVGFnOiBmYWxzZVxuICAgIH07XG5cbiAgICBzdXBlcihvcHRpb25zLCBkZWZhdWx0cyk7XG5cbiAgICB0aGlzLmZyYW1lSW5kZXggPSAwO1xuXG4gICAgLy8gdGhyb3cgZXJyb3IgaWYgZnJhbWVTaXplIGlzIG5vdCBhIHBvd2VyIG9mIDIgP1xuICAgIC8vIGlmICghaXNQb3dlck9mVHdvKHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSkpIHtcbiAgICAvLyAgIC8vIHRocm93IEVycm9yKCkgP1xuICAgIC8vIH1cbiAgfVxuXG4gIGNvbmZpZ3VyZVN0cmVhbSgpIHtcbiAgICAvLyBkZWZhdWx0cyB0byBgaG9wU2l6ZWAgPT09IGBmcmFtZVNpemVgXG4gICAgaWYgKCF0aGlzLnBhcmFtcy5ob3BTaXplKSB7XG4gICAgICB0aGlzLnBhcmFtcy5ob3BTaXplID0gdGhpcy5wYXJhbXMuZnJhbWVTaXplO1xuICAgIH1cblxuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IHRoaXMucGFyYW1zLmZyYW1lU2l6ZTtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVJhdGUgPSB0aGlzLnN0cmVhbVBhcmFtcy5ibG9ja1NhbXBsZVJhdGUgLyB0aGlzLnBhcmFtcy5ob3BTaXplO1xuICB9XG5cbiAgLy8gQE5PVEUgbXVzdCBiZSB0ZXN0ZWRcbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5mcmFtZUluZGV4ID0gMDtcbiAgICBzdXBlci5yZXNldCgpO1xuICB9XG5cbiAgZmluYWxpemUoKSB7XG4gICAgLy8gQE5PVEUgd2hhdCBhYm91dCB0aW1lID9cbiAgICAvLyBmaWxsIHRoZSBvbmdvaW5nIGJ1ZmZlciB3aXRoIDBcbiAgICBmb3IgKGxldCBpID0gdGhpcy5mcmFtZUluZGV4LCBsID0gdGhpcy5vdXRGcmFtZS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHRoaXMub3V0RnJhbWVbaV0gPSAwO1xuICAgIH1cbiAgICAvLyBvdXRwdXQgaXRcbiAgICB0aGlzLm91dHB1dCgpO1xuXG4gICAgc3VwZXIuZmluYWxpemUoKTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgYmxvY2ssIG1ldGFEYXRhKSB7XG4gICAgdmFyIHNhbXBsZVJhdGUgPSB0aGlzLnN0cmVhbVBhcmFtcy5ibG9ja1NhbXBsZVJhdGU7XG4gICAgdmFyIHNhbXBsZVBlcmlvZCA9IDEgLyBzYW1wbGVSYXRlO1xuXG4gICAgdmFyIGZyYW1lSW5kZXggPSB0aGlzLmZyYW1lSW5kZXg7XG4gICAgdmFyIGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICB2YXIgYmxvY2tTaXplID0gYmxvY2subGVuZ3RoO1xuICAgIHZhciBibG9ja0luZGV4ID0gMDtcbiAgICB2YXIgaG9wU2l6ZSA9IHRoaXMucGFyYW1zLmhvcFNpemU7XG5cbiAgICB2YXIgb3V0RnJhbWUgPSB0aGlzLm91dEZyYW1lO1xuXG4gICAgd2hpbGUgKGJsb2NrSW5kZXggPCBibG9ja1NpemUpIHtcbiAgICAgIHZhciBudW1Ta2lwID0gMDtcblxuICAgICAgLy8gc2tpcCBibG9jayBzYW1wbGVzIGZvciBuZWdhdGl2ZSBmcmFtZUluZGV4XG4gICAgICBpZiAoZnJhbWVJbmRleCA8IDApIHtcbiAgICAgICAgbnVtU2tpcCA9IC1mcmFtZUluZGV4O1xuICAgICAgfVxuXG4gICAgICBpZiAobnVtU2tpcCA8IGJsb2NrU2l6ZSkge1xuICAgICAgICBibG9ja0luZGV4ICs9IG51bVNraXA7IC8vIHNraXAgYmxvY2sgc2VnbWVudFxuICAgICAgICAvLyBjYW4gY29weSBhbGwgdGhlIHJlc3Qgb2YgdGhlIGluY29taW5nIGJsb2NrXG4gICAgICAgIHZhciBudW1Db3B5ID0gYmxvY2tTaXplIC0gYmxvY2tJbmRleDtcbiAgICAgICAgLy8gY29ubm90IGNvcHkgbW9yZSB0aGFuIHdoYXQgZml0cyBpbnRvIHRoZSBmcmFtZVxuICAgICAgICB2YXIgbWF4Q29weSA9IGZyYW1lU2l6ZSAtIGZyYW1lSW5kZXg7XG5cbiAgICAgICAgaWYgKG51bUNvcHkgPj0gbWF4Q29weSkge1xuICAgICAgICAgIG51bUNvcHkgPSBtYXhDb3B5O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY29weSBibG9jayBzZWdtZW50IGludG8gZnJhbWVcbiAgICAgICAgdmFyIGNvcHkgPSBibG9jay5zdWJhcnJheShibG9ja0luZGV4LCBibG9ja0luZGV4ICsgbnVtQ29weSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGJsb2NrSW5kZXgsIGZyYW1lSW5kZXgsIG51bUNvcHkpO1xuICAgICAgICBvdXRGcmFtZS5zZXQoY29weSwgZnJhbWVJbmRleCk7XG5cbiAgICAgICAgLy8gYWR2YW5jZSBibG9jayBhbmQgZnJhbWUgaW5kZXhcbiAgICAgICAgYmxvY2tJbmRleCArPSBudW1Db3B5O1xuICAgICAgICBmcmFtZUluZGV4ICs9IG51bUNvcHk7XG5cbiAgICAgICAgLy8gc2VuZCBmcmFtZSB3aGVuIGNvbXBsZXRlZFxuICAgICAgICBpZiAoZnJhbWVJbmRleCA9PT0gZnJhbWVTaXplKSB7XG4gICAgICAgICAgLy8gZGVmaW5lIHRpbWUgdGFnIGZvciB0aGUgb3V0RnJhbWUgYWNjb3JkaW5nIHRvIGNvbmZpZ3VyYXRpb25cbiAgICAgICAgICBpZiAodGhpcy5wYXJhbXMuY2VudGVyZWRUaW1lVGFnKSB7XG4gICAgICAgICAgICB0aGlzLnRpbWUgPSB0aW1lICsgKGJsb2NrSW5kZXggLSBmcmFtZVNpemUgLyAyKSAqIHNhbXBsZVBlcmlvZDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50aW1lID0gdGltZSArIChibG9ja0luZGV4IC0gZnJhbWVTaXplKSAqIHNhbXBsZVBlcmlvZDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBmb3J3YXJkIG1ldGFEYXRhID9cbiAgICAgICAgICB0aGlzLm1ldGFEYXRhID0gbWV0YURhdGE7XG5cbiAgICAgICAgICAvLyBmb3J3YXJkIHRvIG5leHQgbm9kZXNcbiAgICAgICAgICB0aGlzLm91dHB1dCgpO1xuXG4gICAgICAgICAgLy8gc2hpZnQgZnJhbWUgbGVmdFxuICAgICAgICAgIGlmIChob3BTaXplIDwgZnJhbWVTaXplKSB7XG4gICAgICAgICAgICBvdXRGcmFtZS5zZXQob3V0RnJhbWUuc3ViYXJyYXkoaG9wU2l6ZSwgZnJhbWVTaXplKSwgMCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZnJhbWVJbmRleCAtPSBob3BTaXplOyAvLyBob3AgZm9yd2FyZFxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBza2lwIGVudGlyZSBibG9ja1xuICAgICAgICB2YXIgYmxvY2tSZXN0ID0gYmxvY2tTaXplIC0gYmxvY2tJbmRleDtcbiAgICAgICAgZnJhbWVJbmRleCArPSBibG9ja1Jlc3Q7XG4gICAgICAgIGJsb2NrSW5kZXggKz0gYmxvY2tSZXN0O1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuZnJhbWVJbmRleCA9IGZyYW1lSW5kZXg7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBGcmFtZXI7XG4iXX0=