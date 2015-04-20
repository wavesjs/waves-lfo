"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var Lfo = require("../core/lfo-base");

// var isPowerOfTwo = function(number) {
//   while ((number % 2 === 0) && number > 1) {
//     number = number / 2;
//   }

//   return number === 1;
// }

var Framer = (function (_Lfo) {
  function Framer(options) {
    _classCallCheck(this, Framer);

    var defaults = {
      frameSize: 512,
      // define a good name cf. Nobert
      centeredTimeTag: false
    };

    _get(_core.Object.getPrototypeOf(Framer.prototype), "constructor", this).call(this, options, defaults);

    this.frameIndex = 0;

    // throw error if frameSize is not a power of 2 ?
    // if (!isPowerOfTwo(this.streamParams.frameSize)) {
    //   // throw Error() ?
    // }
  }

  _inherits(Framer, _Lfo);

  _createClass(Framer, {
    configureStream: {
      value: function configureStream() {
        // defaults to `hopSize` === `frameSize`
        if (!this.params.hopSize) {
          this.params.hopSize = this.params.frameSize;
        }

        this.streamParams.frameSize = this.params.frameSize;
        this.streamParams.frameRate = this.streamParams.blockSampleRate / this.params.hopSize;
      }
    },
    reset: {

      // @NOTE must be tested

      value: function reset() {
        this.frameIndex = 0;
        _get(_core.Object.getPrototypeOf(Framer.prototype), "reset", this).call(this);
      }
    },
    finalize: {
      value: function finalize() {
        // @NOTE what about time ?
        // fill the ongoing buffer with 0
        for (var i = this.frameIndex, l = this.outFrame.length; i < l; i++) {
          this.outFrame[i] = 0;
        }
        // output it
        this.output();

        _get(_core.Object.getPrototypeOf(Framer.prototype), "finalize", this).call(this);
      }
    },
    process: {
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
    }
  });

  return Framer;
})(Lfo);

module.exports = Framer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvZnJhbWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUVBLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDOzs7Ozs7Ozs7O0lBVWhDLE1BQU07QUFDQyxXQURQLE1BQU0sQ0FDRSxPQUFPLEVBQUU7MEJBRGpCLE1BQU07O0FBRVIsUUFBSSxRQUFRLEdBQUc7QUFDYixlQUFTLEVBQUUsR0FBRzs7QUFFZCxxQkFBZSxFQUFFLEtBQUs7S0FDdkIsQ0FBQzs7QUFFRixxQ0FSRSxNQUFNLDZDQVFGLE9BQU8sRUFBRSxRQUFRLEVBQUU7O0FBRXpCLFFBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDOzs7Ozs7R0FNckI7O1lBaEJHLE1BQU07O2VBQU4sTUFBTTtBQWtCVixtQkFBZTthQUFBLDJCQUFHOztBQUVoQixZQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUU7QUFDeEIsY0FBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7U0FDN0M7O0FBRUQsWUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7QUFDcEQsWUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7T0FDdkY7O0FBR0QsU0FBSzs7OzthQUFBLGlCQUFHO0FBQ04sWUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7QUFDcEIseUNBL0JFLE1BQU0sdUNBK0JNO09BQ2Y7O0FBRUQsWUFBUTthQUFBLG9CQUFHOzs7QUFHVCxhQUFLLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsR0FB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L29wZXJhdG9ycy9mcmFtZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBMZm8gPSByZXF1aXJlKCcuLi9jb3JlL2xmby1iYXNlJyk7XG5cbi8vIHZhciBpc1Bvd2VyT2ZUd28gPSBmdW5jdGlvbihudW1iZXIpIHtcbi8vICAgd2hpbGUgKChudW1iZXIgJSAyID09PSAwKSAmJiBudW1iZXIgPiAxKSB7XG4vLyAgICAgbnVtYmVyID0gbnVtYmVyIC8gMjtcbi8vICAgfVxuXG4vLyAgIHJldHVybiBudW1iZXIgPT09IDE7XG4vLyB9XG5cbmNsYXNzIEZyYW1lciBleHRlbmRzIExmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICBmcmFtZVNpemU6IDUxMixcbiAgICAgIC8vIGRlZmluZSBhIGdvb2QgbmFtZSBjZi4gTm9iZXJ0XG4gICAgICBjZW50ZXJlZFRpbWVUYWc6IGZhbHNlXG4gICAgfTtcblxuICAgIHN1cGVyKG9wdGlvbnMsIGRlZmF1bHRzKTtcblxuICAgIHRoaXMuZnJhbWVJbmRleCA9IDA7XG5cbiAgICAvLyB0aHJvdyBlcnJvciBpZiBmcmFtZVNpemUgaXMgbm90IGEgcG93ZXIgb2YgMiA/XG4gICAgLy8gaWYgKCFpc1Bvd2VyT2ZUd28odGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplKSkge1xuICAgIC8vICAgLy8gdGhyb3cgRXJyb3IoKSA/XG4gICAgLy8gfVxuICB9XG5cbiAgY29uZmlndXJlU3RyZWFtKCkge1xuICAgIC8vIGRlZmF1bHRzIHRvIGBob3BTaXplYCA9PT0gYGZyYW1lU2l6ZWBcbiAgICBpZiAoIXRoaXMucGFyYW1zLmhvcFNpemUpIHtcbiAgICAgIHRoaXMucGFyYW1zLmhvcFNpemUgPSB0aGlzLnBhcmFtcy5mcmFtZVNpemU7XG4gICAgfVxuXG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gdGhpcy5wYXJhbXMuZnJhbWVTaXplO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lUmF0ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmJsb2NrU2FtcGxlUmF0ZSAvIHRoaXMucGFyYW1zLmhvcFNpemU7XG4gIH1cblxuICAvLyBATk9URSBtdXN0IGJlIHRlc3RlZFxuICByZXNldCgpIHtcbiAgICB0aGlzLmZyYW1lSW5kZXggPSAwO1xuICAgIHN1cGVyLnJlc2V0KCk7XG4gIH1cblxuICBmaW5hbGl6ZSgpIHtcbiAgICAvLyBATk9URSB3aGF0IGFib3V0IHRpbWUgP1xuICAgIC8vIGZpbGwgdGhlIG9uZ29pbmcgYnVmZmVyIHdpdGggMFxuICAgIGZvciAobGV0IGkgPSB0aGlzLmZyYW1lSW5kZXgsIGwgPSB0aGlzLm91dEZyYW1lLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdGhpcy5vdXRGcmFtZVtpXSA9IDA7XG4gICAgfVxuICAgIC8vIG91dHB1dCBpdFxuICAgIHRoaXMub3V0cHV0KCk7XG5cbiAgICBzdXBlci5maW5hbGl6ZSgpO1xuICB9XG5cbiAgcHJvY2Vzcyh0aW1lLCBibG9jaywgbWV0YURhdGEpIHtcbiAgICB2YXIgc2FtcGxlUmF0ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmJsb2NrU2FtcGxlUmF0ZTtcbiAgICB2YXIgc2FtcGxlUGVyaW9kID0gMSAvIHNhbXBsZVJhdGU7XG5cbiAgICB2YXIgZnJhbWVJbmRleCA9IHRoaXMuZnJhbWVJbmRleDtcbiAgICB2YXIgZnJhbWVTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIHZhciBibG9ja1NpemUgPSBibG9jay5sZW5ndGg7XG4gICAgdmFyIGJsb2NrSW5kZXggPSAwO1xuICAgIHZhciBob3BTaXplID0gdGhpcy5wYXJhbXMuaG9wU2l6ZTtcblxuICAgIHZhciBvdXRGcmFtZSA9IHRoaXMub3V0RnJhbWU7XG5cbiAgICB3aGlsZSAoYmxvY2tJbmRleCA8IGJsb2NrU2l6ZSkge1xuICAgICAgdmFyIG51bVNraXAgPSAwO1xuXG4gICAgICAvLyBza2lwIGJsb2NrIHNhbXBsZXMgZm9yIG5lZ2F0aXZlIGZyYW1lSW5kZXhcbiAgICAgIGlmIChmcmFtZUluZGV4IDwgMCkge1xuICAgICAgICBudW1Ta2lwID0gLWZyYW1lSW5kZXg7XG4gICAgICB9XG5cbiAgICAgIGlmIChudW1Ta2lwIDwgYmxvY2tTaXplKSB7XG4gICAgICAgIGJsb2NrSW5kZXggKz0gbnVtU2tpcDsgLy8gc2tpcCBibG9jayBzZWdtZW50XG4gICAgICAgIC8vIGNhbiBjb3B5IGFsbCB0aGUgcmVzdCBvZiB0aGUgaW5jb21pbmcgYmxvY2tcbiAgICAgICAgdmFyIG51bUNvcHkgPSBibG9ja1NpemUgLSBibG9ja0luZGV4O1xuICAgICAgICAvLyBjb25ub3QgY29weSBtb3JlIHRoYW4gd2hhdCBmaXRzIGludG8gdGhlIGZyYW1lXG4gICAgICAgIHZhciBtYXhDb3B5ID0gZnJhbWVTaXplIC0gZnJhbWVJbmRleDtcblxuICAgICAgICBpZiAobnVtQ29weSA+PSBtYXhDb3B5KSB7XG4gICAgICAgICAgbnVtQ29weSA9IG1heENvcHk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjb3B5IGJsb2NrIHNlZ21lbnQgaW50byBmcmFtZVxuICAgICAgICB2YXIgY29weSA9IGJsb2NrLnN1YmFycmF5KGJsb2NrSW5kZXgsIGJsb2NrSW5kZXggKyBudW1Db3B5KTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coYmxvY2tJbmRleCwgZnJhbWVJbmRleCwgbnVtQ29weSk7XG4gICAgICAgIG91dEZyYW1lLnNldChjb3B5LCBmcmFtZUluZGV4KTtcblxuICAgICAgICAvLyBhZHZhbmNlIGJsb2NrIGFuZCBmcmFtZSBpbmRleFxuICAgICAgICBibG9ja0luZGV4ICs9IG51bUNvcHk7XG4gICAgICAgIGZyYW1lSW5kZXggKz0gbnVtQ29weTtcblxuICAgICAgICAvLyBzZW5kIGZyYW1lIHdoZW4gY29tcGxldGVkXG4gICAgICAgIGlmIChmcmFtZUluZGV4ID09PSBmcmFtZVNpemUpIHtcbiAgICAgICAgICAvLyBkZWZpbmUgdGltZSB0YWcgZm9yIHRoZSBvdXRGcmFtZSBhY2NvcmRpbmcgdG8gY29uZmlndXJhdGlvblxuICAgICAgICAgIGlmICh0aGlzLnBhcmFtcy5jZW50ZXJlZFRpbWVUYWcpIHtcbiAgICAgICAgICAgIHRoaXMudGltZSA9IHRpbWUgKyAoYmxvY2tJbmRleCAtIGZyYW1lU2l6ZSAvIDIpICogc2FtcGxlUGVyaW9kO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRpbWUgPSB0aW1lICsgKGJsb2NrSW5kZXggLSBmcmFtZVNpemUpICogc2FtcGxlUGVyaW9kO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIGZvcndhcmQgbWV0YURhdGEgP1xuICAgICAgICAgIHRoaXMubWV0YURhdGEgPSBtZXRhRGF0YTtcblxuICAgICAgICAgIC8vIGZvcndhcmQgdG8gbmV4dCBub2Rlc1xuICAgICAgICAgIHRoaXMub3V0cHV0KCk7XG5cbiAgICAgICAgICAvLyBzaGlmdCBmcmFtZSBsZWZ0XG4gICAgICAgICAgaWYgKGhvcFNpemUgPCBmcmFtZVNpemUpIHtcbiAgICAgICAgICAgIG91dEZyYW1lLnNldChvdXRGcmFtZS5zdWJhcnJheShob3BTaXplLCBmcmFtZVNpemUpLCAwKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmcmFtZUluZGV4IC09IGhvcFNpemU7IC8vIGhvcCBmb3J3YXJkXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHNraXAgZW50aXJlIGJsb2NrXG4gICAgICAgIHZhciBibG9ja1Jlc3QgPSBibG9ja1NpemUgLSBibG9ja0luZGV4O1xuICAgICAgICBmcmFtZUluZGV4ICs9IGJsb2NrUmVzdDtcbiAgICAgICAgYmxvY2tJbmRleCArPSBibG9ja1Jlc3Q7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5mcmFtZUluZGV4ID0gZnJhbWVJbmRleDtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEZyYW1lcjtcbiJdfQ==