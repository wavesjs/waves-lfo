"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _require = require("../core/lfo-base");

var Lfo = _require.Lfo;

var isPowerOfTwo = function isPowerOfTwo(number) {
  while (number % 2 === 0 && number > 1) {
    number = number / 2;
  }

  return number === 1;
};

var Framer = (function (_Lfo) {
  function Framer(previous, options) {
    _classCallCheck(this, Framer);

    var defaults = {
      frameSize: 512,
      // define a good name cf. Nobert
      centeredTimeTag: false // ('start'||'center')
    };

    _get(_core.Object.getPrototypeOf(Framer.prototype), "constructor", this).call(this, previous, options, defaults);

    this.frameIndex = 0;

    if (!this.params.hopSize) {
      this.params.hopSize = this.params.frameSize;
    }

    // setup stream
    this.setupStream({
      frameSize: this.params.frameSize,
      frameRate: this.streamParams.blockSampleRate / this.params.hopSize
    });

    // throw error if frameSize is not a power of 2 ?
    if (!isPowerOfTwo(this.streamParams.frameSize)) {}

    // console.log(this.streamParams);
  }

  _inherits(Framer, _Lfo);

  _createClass(Framer, {
    process: {
      value: function process(time, block, metadata) {
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
    }
  });

  return Framer;
})(Lfo);

module.exports = Framer;

// throw Error() ?
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvZnJhbWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztlQUVjLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQzs7SUFBbkMsR0FBRyxZQUFILEdBQUc7O0FBRVQsSUFBSSxZQUFZLEdBQUcsc0JBQVMsTUFBTSxFQUFFO0FBQ2xDLFNBQU8sQUFBQyxNQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ3ZDLFVBQU0sR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0dBQ3JCOztBQUVELFNBQU8sTUFBTSxLQUFLLENBQUMsQ0FBQztDQUNyQixDQUFBOztJQUVLLE1BQU07QUFDQyxXQURQLE1BQU0sQ0FDRSxRQUFRLEVBQUUsT0FBTyxFQUFFOzBCQUQzQixNQUFNOztBQUVSLFFBQUksUUFBUSxHQUFHO0FBQ2IsZUFBUyxFQUFFLEdBQUc7O0FBRWQscUJBQWUsRUFBRSxLQUFLO0FBQUEsS0FDdkIsQ0FBQzs7QUFFRixxQ0FSRSxNQUFNLDZDQVFGLFFBQVEsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFOztBQUVuQyxRQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQzs7QUFFcEIsUUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFO0FBQ3hCLFVBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO0tBQzdDOzs7QUFHRCxRQUFJLENBQUMsV0FBVyxDQUFDO0FBQ2YsZUFBUyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUztBQUNoQyxlQUFTLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPO0tBQ25FLENBQUMsQ0FBQzs7O0FBR0gsUUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBRS9DOzs7QUFBQSxHQUdGOztZQTVCRyxNQUFNOztlQUFOLE1BQU07QUE4QlYsV0FBTzthQUFBLGlCQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO0FBQzdCLFlBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDO0FBQ25ELFlBQUksWUFBWSxHQUFHLENBQUMsR0FBRyxVQUFVLENBQUM7O0FBRWxDLFlBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7QUFDakMsWUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUM7QUFDNUMsWUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztBQUM3QixZQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7QUFDbkIsWUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7O0FBRWxDLFlBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7O0FBRTdCLGVBQU8sVUFBVSxHQUFHLFNBQVMsRUFBRTtBQUM3QixjQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7OztBQUdoQixjQUFJLFVBQVUsR0FBRyxDQUFDLEVBQUU7QUFDbEIsbUJBQU8sR0FBRyxDQUFDLFVBQVUsQ0FBQztXQUN2Qjs7QUFFRCxjQUFJLE9BQU8sR0FBRyxTQUFTLEVBQUU7QUFDdkIsc0JBQVUsSUFBSSxPQUFPLENBQUM7O0FBRXRCLGdCQUFJLE9BQU8sR0FBRyxTQUFTLEdBQUcsVUFBVSxDQUFDOztBQUVyQyxnQkFBSSxPQUFPLEdBQUcsU0FBUyxHQUFHLFVBQVUsQ0FBQzs7QUFFckMsZ0JBQUksT0FBTyxJQUFJLE9BQU8sRUFBRTtBQUN0QixxQkFBTyxHQUFHLE9BQU8sQ0FBQzthQUNuQjs7O0FBR0QsZ0JBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLFVBQVUsR0FBRyxPQUFPLENBQUMsQ0FBQzs7QUFFNUQsb0JBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDOzs7QUFHL0Isc0JBQVUsSUFBSSxPQUFPLENBQUM7QUFDdEIsc0JBQVUsSUFBSSxPQUFPLENBQUM7OztBQUd0QixnQkFBSSxVQUFVLEtBQUssU0FBUyxFQUFFOztBQUU1QixrQkFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRTtBQUMvQixvQkFBSSxDQUFDLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLEdBQUcsU0FBUyxHQUFHLENBQUMsQ0FBQSxHQUFJLFlBQVksQ0FBQztlQUNoRSxNQUFNO0FBQ0wsb0JBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQSxHQUFJLFlBQVksQ0FBQztlQUM1RDs7O0FBR0Qsa0JBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQzs7O0FBR2Qsa0JBQUksT0FBTyxHQUFHLFNBQVMsRUFBRTtBQUN2Qix3QkFBUSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztlQUN4RDs7QUFFRCx3QkFBVSxJQUFJLE9BQU8sQ0FBQzthQUN2QjtXQUNGLE1BQU07O0FBRUwsZ0JBQUksU0FBUyxHQUFHLFNBQVMsR0FBRyxVQUFVLENBQUM7QUFDdkMsc0JBQVUsSUFBSSxTQUFTLENBQUM7QUFDeEIsc0JBQVUsSUFBSSxTQUFTLENBQUM7V0FDekI7U0FDRjs7QUFFRCxZQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztPQUM5Qjs7OztTQWxHRyxNQUFNO0dBQVMsR0FBRzs7QUFxR3hCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDIiwiZmlsZSI6ImVzNi9vcGVyYXRvcnMvZnJhbWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgeyBMZm8gfSA9IHJlcXVpcmUoJy4uL2NvcmUvbGZvLWJhc2UnKTtcblxudmFyIGlzUG93ZXJPZlR3byA9IGZ1bmN0aW9uKG51bWJlcikge1xuICB3aGlsZSAoKG51bWJlciAlIDIgPT09IDApICYmIG51bWJlciA+IDEpIHtcbiAgICBudW1iZXIgPSBudW1iZXIgLyAyO1xuICB9XG5cbiAgcmV0dXJuIG51bWJlciA9PT0gMTtcbn1cblxuY2xhc3MgRnJhbWVyIGV4dGVuZHMgTGZvIHtcbiAgY29uc3RydWN0b3IocHJldmlvdXMsIG9wdGlvbnMpIHtcbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICBmcmFtZVNpemU6IDUxMixcbiAgICAgIC8vIGRlZmluZSBhIGdvb2QgbmFtZSBjZi4gTm9iZXJ0XG4gICAgICBjZW50ZXJlZFRpbWVUYWc6IGZhbHNlIC8vICgnc3RhcnQnfHwnY2VudGVyJylcbiAgICB9O1xuXG4gICAgc3VwZXIocHJldmlvdXMsIG9wdGlvbnMsIGRlZmF1bHRzKTtcblxuICAgIHRoaXMuZnJhbWVJbmRleCA9IDA7XG5cbiAgICBpZiAoIXRoaXMucGFyYW1zLmhvcFNpemUpIHtcbiAgICAgIHRoaXMucGFyYW1zLmhvcFNpemUgPSB0aGlzLnBhcmFtcy5mcmFtZVNpemU7XG4gICAgfVxuXG4gICAgLy8gc2V0dXAgc3RyZWFtXG4gICAgdGhpcy5zZXR1cFN0cmVhbSh7XG4gICAgICBmcmFtZVNpemU6IHRoaXMucGFyYW1zLmZyYW1lU2l6ZSxcbiAgICAgIGZyYW1lUmF0ZTogdGhpcy5zdHJlYW1QYXJhbXMuYmxvY2tTYW1wbGVSYXRlIC8gdGhpcy5wYXJhbXMuaG9wU2l6ZVxuICAgIH0pO1xuXG4gICAgLy8gdGhyb3cgZXJyb3IgaWYgZnJhbWVTaXplIGlzIG5vdCBhIHBvd2VyIG9mIDIgP1xuICAgIGlmICghaXNQb3dlck9mVHdvKHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSkpIHtcbiAgICAgIC8vIHRocm93IEVycm9yKCkgP1xuICAgIH1cblxuICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuc3RyZWFtUGFyYW1zKTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgYmxvY2ssIG1ldGFkYXRhKSB7XG4gICAgdmFyIHNhbXBsZVJhdGUgPSB0aGlzLnN0cmVhbVBhcmFtcy5ibG9ja1NhbXBsZVJhdGU7XG4gICAgdmFyIHNhbXBsZVBlcmlvZCA9IDEgLyBzYW1wbGVSYXRlO1xuXG4gICAgdmFyIGZyYW1lSW5kZXggPSB0aGlzLmZyYW1lSW5kZXg7XG4gICAgdmFyIGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICB2YXIgYmxvY2tTaXplID0gYmxvY2subGVuZ3RoO1xuICAgIHZhciBibG9ja0luZGV4ID0gMDtcbiAgICB2YXIgaG9wU2l6ZSA9IHRoaXMucGFyYW1zLmhvcFNpemU7XG5cbiAgICB2YXIgb3V0RnJhbWUgPSB0aGlzLm91dEZyYW1lO1xuXG4gICAgd2hpbGUgKGJsb2NrSW5kZXggPCBibG9ja1NpemUpIHtcbiAgICAgIHZhciBudW1Ta2lwID0gMDtcblxuICAgICAgLy8gc2tpcCBibG9jayBzYW1wbGVzIGZvciBuZWdhdGl2ZSBmcmFtZUluZGV4XG4gICAgICBpZiAoZnJhbWVJbmRleCA8IDApIHtcbiAgICAgICAgbnVtU2tpcCA9IC1mcmFtZUluZGV4O1xuICAgICAgfVxuXG4gICAgICBpZiAobnVtU2tpcCA8IGJsb2NrU2l6ZSkge1xuICAgICAgICBibG9ja0luZGV4ICs9IG51bVNraXA7IC8vIHNraXAgYmxvY2sgc2VnbWVudFxuICAgICAgICAvLyBjYW4gY29weSBhbGwgdGhlIHJlc3Qgb2YgdGhlIGluY29taW5nIGJsb2NrXG4gICAgICAgIHZhciBudW1Db3B5ID0gYmxvY2tTaXplIC0gYmxvY2tJbmRleDtcbiAgICAgICAgLy8gY29ubm90IGNvcHkgbW9yZSB0aGFuIHdoYXQgZml0cyBpbnRvIHRoZSBmcmFtZVxuICAgICAgICB2YXIgbWF4Q29weSA9IGZyYW1lU2l6ZSAtIGZyYW1lSW5kZXg7XG5cbiAgICAgICAgaWYgKG51bUNvcHkgPj0gbWF4Q29weSkge1xuICAgICAgICAgIG51bUNvcHkgPSBtYXhDb3B5O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY29weSBibG9jayBzZWdtZW50IGludG8gZnJhbWVcbiAgICAgICAgdmFyIGNvcHkgPSBibG9jay5zdWJhcnJheShibG9ja0luZGV4LCBibG9ja0luZGV4ICsgbnVtQ29weSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGJsb2NrSW5kZXgsIGZyYW1lSW5kZXgsIG51bUNvcHkpO1xuICAgICAgICBvdXRGcmFtZS5zZXQoY29weSwgZnJhbWVJbmRleCk7XG5cbiAgICAgICAgLy8gYWR2YW5jZSBibG9jayBhbmQgZnJhbWUgaW5kZXhcbiAgICAgICAgYmxvY2tJbmRleCArPSBudW1Db3B5O1xuICAgICAgICBmcmFtZUluZGV4ICs9IG51bUNvcHk7XG5cbiAgICAgICAgLy8gc2VuZCBmcmFtZSB3aGVuIGNvbXBsZXRlZFxuICAgICAgICBpZiAoZnJhbWVJbmRleCA9PT0gZnJhbWVTaXplKSB7XG4gICAgICAgICAgLy8gZGVmaW5lIHRpbWUgdGFnIGZvciB0aGUgb3V0RnJhbWUgYWNjb3JkaW5nIHRvIGNvbmZpZ3VyYXRpb25cbiAgICAgICAgICBpZiAodGhpcy5wYXJhbXMuY2VudGVyZWRUaW1lVGFnKSB7XG4gICAgICAgICAgICB0aGlzLnRpbWUgPSB0aW1lICsgKGJsb2NrSW5kZXggLSBmcmFtZVNpemUgLyAyKSAqIHNhbXBsZVBlcmlvZDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50aW1lID0gdGltZSArIChibG9ja0luZGV4IC0gZnJhbWVTaXplKSAqIHNhbXBsZVBlcmlvZDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBmb3J3YXJkIHRvIG5leHQgbm9kZXNcbiAgICAgICAgICB0aGlzLm91dHB1dCgpO1xuXG4gICAgICAgICAgLy8gc2hpZnQgZnJhbWUgbGVmdFxuICAgICAgICAgIGlmIChob3BTaXplIDwgZnJhbWVTaXplKSB7XG4gICAgICAgICAgICBvdXRGcmFtZS5zZXQob3V0RnJhbWUuc3ViYXJyYXkoaG9wU2l6ZSwgZnJhbWVTaXplKSwgMCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZnJhbWVJbmRleCAtPSBob3BTaXplOyAvLyBob3AgZm9yd2FyZFxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBza2lwIGVudGlyZSBibG9ja1xuICAgICAgICB2YXIgYmxvY2tSZXN0ID0gYmxvY2tTaXplIC0gYmxvY2tJbmRleDtcbiAgICAgICAgZnJhbWVJbmRleCArPSBibG9ja1Jlc3Q7XG4gICAgICAgIGJsb2NrSW5kZXggKz0gYmxvY2tSZXN0O1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuZnJhbWVJbmRleCA9IGZyYW1lSW5kZXg7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBGcmFtZXI7Il19