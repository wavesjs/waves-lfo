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
      timeTagPosition: "start" // ('start'||'center')
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
              if (this.params.timeTagPosition === "center") {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvZnJhbWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztlQUVjLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQzs7SUFBbkMsR0FBRyxZQUFILEdBQUc7O0FBRVQsSUFBSSxZQUFZLEdBQUcsc0JBQVMsTUFBTSxFQUFFO0FBQ2xDLFNBQU8sQUFBQyxNQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ3ZDLFVBQU0sR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0dBQ3JCOztBQUVELFNBQU8sTUFBTSxLQUFLLENBQUMsQ0FBQztDQUNyQixDQUFBOztJQUVLLE1BQU07QUFDQyxXQURQLE1BQU0sQ0FDRSxRQUFRLEVBQUUsT0FBTyxFQUFFOzBCQUQzQixNQUFNOztBQUVSLFFBQUksUUFBUSxHQUFHO0FBQ2IsZUFBUyxFQUFFLEdBQUc7O0FBRWQscUJBQWUsRUFBRSxPQUFPO0FBQUEsS0FDekIsQ0FBQzs7QUFFRixxQ0FSRSxNQUFNLDZDQVFGLFFBQVEsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFOztBQUVuQyxRQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQzs7QUFFcEIsUUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFO0FBQ3hCLFVBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO0tBQzdDOzs7QUFHRCxRQUFJLENBQUMsV0FBVyxDQUFDO0FBQ2YsZUFBUyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUztBQUNoQyxlQUFTLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPO0tBQ25FLENBQUMsQ0FBQzs7O0FBR0gsUUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBRS9DOzs7QUFBQSxHQUdGOztZQTVCRyxNQUFNOztlQUFOLE1BQU07QUE4QlYsV0FBTzthQUFBLGlCQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO0FBQzdCLFlBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDO0FBQ25ELFlBQUksWUFBWSxHQUFHLENBQUMsR0FBRyxVQUFVLENBQUM7O0FBRWxDLFlBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7QUFDakMsWUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUM7QUFDNUMsWUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztBQUM3QixZQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7QUFDbkIsWUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7O0FBRWxDLFlBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7O0FBRTdCLGVBQU8sVUFBVSxHQUFHLFNBQVMsRUFBRTtBQUM3QixjQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7OztBQUdoQixjQUFJLFVBQVUsR0FBRyxDQUFDLEVBQUU7QUFDbEIsbUJBQU8sR0FBRyxDQUFDLFVBQVUsQ0FBQztXQUN2Qjs7QUFFRCxjQUFJLE9BQU8sR0FBRyxTQUFTLEVBQUU7QUFDdkIsc0JBQVUsSUFBSSxPQUFPLENBQUM7O0FBRXRCLGdCQUFJLE9BQU8sR0FBRyxTQUFTLEdBQUcsVUFBVSxDQUFDOztBQUVyQyxnQkFBSSxPQUFPLEdBQUcsU0FBUyxHQUFHLFVBQVUsQ0FBQzs7QUFFckMsZ0JBQUksT0FBTyxJQUFJLE9BQU8sRUFBRTtBQUN0QixxQkFBTyxHQUFHLE9BQU8sQ0FBQzthQUNuQjs7O0FBR0QsZ0JBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLFVBQVUsR0FBRyxPQUFPLENBQUMsQ0FBQzs7QUFFNUQsb0JBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDOzs7QUFHL0Isc0JBQVUsSUFBSSxPQUFPLENBQUM7QUFDdEIsc0JBQVUsSUFBSSxPQUFPLENBQUM7OztBQUd0QixnQkFBSSxVQUFVLEtBQUssU0FBUyxFQUFFOztBQUU1QixrQkFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsS0FBSyxRQUFRLEVBQUU7QUFDNUMsb0JBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsVUFBVSxHQUFHLFNBQVMsR0FBRyxDQUFDLENBQUEsR0FBSSxZQUFZLENBQUM7ZUFDaEUsTUFBTTtBQUNMLG9CQUFJLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUEsR0FBSSxZQUFZLENBQUM7ZUFDNUQ7OztBQUdELGtCQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7OztBQUdkLGtCQUFJLE9BQU8sR0FBRyxTQUFTLEVBQUU7QUFDdkIsd0JBQVEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7ZUFDeEQ7O0FBRUQsd0JBQVUsSUFBSSxPQUFPLENBQUM7YUFDdkI7V0FDRixNQUFNOztBQUVMLGdCQUFJLFNBQVMsR0FBRyxTQUFTLEdBQUcsVUFBVSxDQUFDO0FBQ3ZDLHNCQUFVLElBQUksU0FBUyxDQUFDO0FBQ3hCLHNCQUFVLElBQUksU0FBUyxDQUFDO1dBQ3pCO1NBQ0Y7O0FBRUQsWUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7T0FDOUI7Ozs7U0FsR0csTUFBTTtHQUFTLEdBQUc7O0FBcUd4QixNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyIsImZpbGUiOiJlczYvb3BlcmF0b3JzL2ZyYW1lci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIHsgTGZvIH0gPSByZXF1aXJlKCcuLi9jb3JlL2xmby1iYXNlJyk7XG5cbnZhciBpc1Bvd2VyT2ZUd28gPSBmdW5jdGlvbihudW1iZXIpIHtcbiAgd2hpbGUgKChudW1iZXIgJSAyID09PSAwKSAmJiBudW1iZXIgPiAxKSB7XG4gICAgbnVtYmVyID0gbnVtYmVyIC8gMjtcbiAgfVxuXG4gIHJldHVybiBudW1iZXIgPT09IDE7XG59XG5cbmNsYXNzIEZyYW1lciBleHRlbmRzIExmbyB7XG4gIGNvbnN0cnVjdG9yKHByZXZpb3VzLCBvcHRpb25zKSB7XG4gICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgZnJhbWVTaXplOiA1MTIsXG4gICAgICAvLyBkZWZpbmUgYSBnb29kIG5hbWUgY2YuIE5vYmVydFxuICAgICAgdGltZVRhZ1Bvc2l0aW9uOiAnc3RhcnQnIC8vICgnc3RhcnQnfHwnY2VudGVyJylcbiAgICB9O1xuXG4gICAgc3VwZXIocHJldmlvdXMsIG9wdGlvbnMsIGRlZmF1bHRzKTtcblxuICAgIHRoaXMuZnJhbWVJbmRleCA9IDA7XG5cbiAgICBpZiAoIXRoaXMucGFyYW1zLmhvcFNpemUpIHtcbiAgICAgIHRoaXMucGFyYW1zLmhvcFNpemUgPSB0aGlzLnBhcmFtcy5mcmFtZVNpemU7XG4gICAgfVxuXG4gICAgLy8gc2V0dXAgc3RyZWFtXG4gICAgdGhpcy5zZXR1cFN0cmVhbSh7XG4gICAgICBmcmFtZVNpemU6IHRoaXMucGFyYW1zLmZyYW1lU2l6ZSxcbiAgICAgIGZyYW1lUmF0ZTogdGhpcy5zdHJlYW1QYXJhbXMuYmxvY2tTYW1wbGVSYXRlIC8gdGhpcy5wYXJhbXMuaG9wU2l6ZVxuICAgIH0pO1xuXG4gICAgLy8gdGhyb3cgZXJyb3IgaWYgZnJhbWVTaXplIGlzIG5vdCBhIHBvd2VyIG9mIDIgP1xuICAgIGlmICghaXNQb3dlck9mVHdvKHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSkpIHtcbiAgICAgIC8vIHRocm93IEVycm9yKCkgP1xuICAgIH1cblxuICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuc3RyZWFtUGFyYW1zKTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgYmxvY2ssIG1ldGFkYXRhKSB7XG4gICAgdmFyIHNhbXBsZVJhdGUgPSB0aGlzLnN0cmVhbVBhcmFtcy5ibG9ja1NhbXBsZVJhdGU7XG4gICAgdmFyIHNhbXBsZVBlcmlvZCA9IDEgLyBzYW1wbGVSYXRlO1xuXG4gICAgdmFyIGZyYW1lSW5kZXggPSB0aGlzLmZyYW1lSW5kZXg7XG4gICAgdmFyIGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICB2YXIgYmxvY2tTaXplID0gYmxvY2subGVuZ3RoO1xuICAgIHZhciBibG9ja0luZGV4ID0gMDtcbiAgICB2YXIgaG9wU2l6ZSA9IHRoaXMucGFyYW1zLmhvcFNpemU7XG5cbiAgICB2YXIgb3V0RnJhbWUgPSB0aGlzLm91dEZyYW1lO1xuXG4gICAgd2hpbGUgKGJsb2NrSW5kZXggPCBibG9ja1NpemUpIHtcbiAgICAgIHZhciBudW1Ta2lwID0gMDtcblxuICAgICAgLy8gc2tpcCBibG9jayBzYW1wbGVzIGZvciBuZWdhdGl2ZSBmcmFtZUluZGV4XG4gICAgICBpZiAoZnJhbWVJbmRleCA8IDApIHtcbiAgICAgICAgbnVtU2tpcCA9IC1mcmFtZUluZGV4O1xuICAgICAgfVxuXG4gICAgICBpZiAobnVtU2tpcCA8IGJsb2NrU2l6ZSkge1xuICAgICAgICBibG9ja0luZGV4ICs9IG51bVNraXA7IC8vIHNraXAgYmxvY2sgc2VnbWVudFxuICAgICAgICAvLyBjYW4gY29weSBhbGwgdGhlIHJlc3Qgb2YgdGhlIGluY29taW5nIGJsb2NrXG4gICAgICAgIHZhciBudW1Db3B5ID0gYmxvY2tTaXplIC0gYmxvY2tJbmRleDtcbiAgICAgICAgLy8gY29ubm90IGNvcHkgbW9yZSB0aGFuIHdoYXQgZml0cyBpbnRvIHRoZSBmcmFtZVxuICAgICAgICB2YXIgbWF4Q29weSA9IGZyYW1lU2l6ZSAtIGZyYW1lSW5kZXg7XG5cbiAgICAgICAgaWYgKG51bUNvcHkgPj0gbWF4Q29weSkge1xuICAgICAgICAgIG51bUNvcHkgPSBtYXhDb3B5O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY29weSBibG9jayBzZWdtZW50IGludG8gZnJhbWVcbiAgICAgICAgdmFyIGNvcHkgPSBibG9jay5zdWJhcnJheShibG9ja0luZGV4LCBibG9ja0luZGV4ICsgbnVtQ29weSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGJsb2NrSW5kZXgsIGZyYW1lSW5kZXgsIG51bUNvcHkpO1xuICAgICAgICBvdXRGcmFtZS5zZXQoY29weSwgZnJhbWVJbmRleCk7XG5cbiAgICAgICAgLy8gYWR2YW5jZSBibG9jayBhbmQgZnJhbWUgaW5kZXhcbiAgICAgICAgYmxvY2tJbmRleCArPSBudW1Db3B5O1xuICAgICAgICBmcmFtZUluZGV4ICs9IG51bUNvcHk7XG5cbiAgICAgICAgLy8gc2VuZCBmcmFtZSB3aGVuIGNvbXBsZXRlZFxuICAgICAgICBpZiAoZnJhbWVJbmRleCA9PT0gZnJhbWVTaXplKSB7XG4gICAgICAgICAgLy8gZGVmaW5lIHRpbWUgdGFnIGZvciB0aGUgb3V0RnJhbWUgYWNjb3JkaW5nIHRvIGNvbmZpZ3VyYXRpb25cbiAgICAgICAgICBpZiAodGhpcy5wYXJhbXMudGltZVRhZ1Bvc2l0aW9uID09PSAnY2VudGVyJykge1xuICAgICAgICAgICAgdGhpcy50aW1lID0gdGltZSArIChibG9ja0luZGV4IC0gZnJhbWVTaXplIC8gMikgKiBzYW1wbGVQZXJpb2Q7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudGltZSA9IHRpbWUgKyAoYmxvY2tJbmRleCAtIGZyYW1lU2l6ZSkgKiBzYW1wbGVQZXJpb2Q7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gZm9yd2FyZCB0byBuZXh0IG5vZGVzXG4gICAgICAgICAgdGhpcy5vdXRwdXQoKTtcblxuICAgICAgICAgIC8vIHNoaWZ0IGZyYW1lIGxlZnRcbiAgICAgICAgICBpZiAoaG9wU2l6ZSA8IGZyYW1lU2l6ZSkge1xuICAgICAgICAgICAgb3V0RnJhbWUuc2V0KG91dEZyYW1lLnN1YmFycmF5KGhvcFNpemUsIGZyYW1lU2l6ZSksIDApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGZyYW1lSW5kZXggLT0gaG9wU2l6ZTsgLy8gaG9wIGZvcndhcmRcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gc2tpcCBlbnRpcmUgYmxvY2tcbiAgICAgICAgdmFyIGJsb2NrUmVzdCA9IGJsb2NrU2l6ZSAtIGJsb2NrSW5kZXg7XG4gICAgICAgIGZyYW1lSW5kZXggKz0gYmxvY2tSZXN0O1xuICAgICAgICBibG9ja0luZGV4ICs9IGJsb2NrUmVzdDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmZyYW1lSW5kZXggPSBmcmFtZUluZGV4O1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRnJhbWVyOyJdfQ==