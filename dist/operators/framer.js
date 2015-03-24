"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var Lfo = require("../core/lfo-base");

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
      centeredTimeTag: false
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
  }

  _inherits(Framer, _Lfo);

  _createClass(Framer, {
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
//# sourceMappingURL=data:application/json;base64,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QUFDO0FBQ3ZDLHNCQUFVLElBQUksU0FBUyxDQUFDO0FBQ3hCLHNCQUFVLElBQUksU0FBUyxDQUFDO1dBQ3pCO1NBQ0Y7O0FBRUQsWUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7T0FDOUI7Ozs7U0FsSEcsTUFBTTtHQUFTLEdBQUc7O0FBcUh4QixNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyIsImZpbGUiOiJlczYvb3BlcmF0b3JzL2ZyYW1lci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIExmbyA9IHJlcXVpcmUoJy4uL2NvcmUvbGZvLWJhc2UnKTtcblxudmFyIGlzUG93ZXJPZlR3byA9IGZ1bmN0aW9uKG51bWJlcikge1xuICB3aGlsZSAoKG51bWJlciAlIDIgPT09IDApICYmIG51bWJlciA+IDEpIHtcbiAgICBudW1iZXIgPSBudW1iZXIgLyAyO1xuICB9XG5cbiAgcmV0dXJuIG51bWJlciA9PT0gMTtcbn1cblxuY2xhc3MgRnJhbWVyIGV4dGVuZHMgTGZvIHtcbiAgY29uc3RydWN0b3IocHJldmlvdXMsIG9wdGlvbnMpIHtcbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICBmcmFtZVNpemU6IDUxMixcbiAgICAgIC8vIGRlZmluZSBhIGdvb2QgbmFtZSBjZi4gTm9iZXJ0XG4gICAgICBjZW50ZXJlZFRpbWVUYWc6IGZhbHNlXG4gICAgfTtcblxuICAgIHN1cGVyKHByZXZpb3VzLCBvcHRpb25zLCBkZWZhdWx0cyk7XG5cbiAgICB0aGlzLmZyYW1lSW5kZXggPSAwO1xuXG4gICAgaWYgKCF0aGlzLnBhcmFtcy5ob3BTaXplKSB7XG4gICAgICB0aGlzLnBhcmFtcy5ob3BTaXplID0gdGhpcy5wYXJhbXMuZnJhbWVTaXplO1xuICAgIH1cblxuICAgIC8vIHNldHVwIHN0cmVhbVxuICAgIHRoaXMuc2V0dXBTdHJlYW0oe1xuICAgICAgZnJhbWVTaXplOiB0aGlzLnBhcmFtcy5mcmFtZVNpemUsXG4gICAgICBmcmFtZVJhdGU6IHRoaXMuc3RyZWFtUGFyYW1zLmJsb2NrU2FtcGxlUmF0ZSAvIHRoaXMucGFyYW1zLmhvcFNpemVcbiAgICB9KTtcblxuICAgIC8vIHRocm93IGVycm9yIGlmIGZyYW1lU2l6ZSBpcyBub3QgYSBwb3dlciBvZiAyID9cbiAgICBpZiAoIWlzUG93ZXJPZlR3byh0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUpKSB7XG4gICAgICAvLyB0aHJvdyBFcnJvcigpID9cbiAgICB9XG4gIH1cblxuICAvLyBATk9URSBtdXN0IGJlIHRlc3RlZFxuICByZXNldCgpIHtcbiAgICB0aGlzLmZyYW1lSW5kZXggPSAwO1xuICAgIHN1cGVyLnJlc2V0KCk7XG4gIH1cblxuICBmaW5hbGl6ZSgpIHtcbiAgICAvLyBATk9URSB3aGF0IGFib3V0IHRpbWUgP1xuICAgIC8vIGZpbGwgdGhlIG9uZ29pbmcgYnVmZmVyIHdpdGggMFxuICAgIGZvciAobGV0IGkgPSB0aGlzLmZyYW1lSW5kZXgsIGwgPSB0aGlzLm91dEZyYW1lLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdGhpcy5vdXRGcmFtZVtpXSA9IDA7XG4gICAgfVxuICAgIC8vIG91dHB1dCBpdFxuICAgIHRoaXMub3V0cHV0KCk7XG5cbiAgICBzdXBlci5maW5hbGl6ZSgpO1xuICB9XG5cbiAgcHJvY2Vzcyh0aW1lLCBibG9jaywgbWV0YWRhdGEpIHtcbiAgICB2YXIgc2FtcGxlUmF0ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmJsb2NrU2FtcGxlUmF0ZTtcbiAgICB2YXIgc2FtcGxlUGVyaW9kID0gMSAvIHNhbXBsZVJhdGU7XG5cbiAgICB2YXIgZnJhbWVJbmRleCA9IHRoaXMuZnJhbWVJbmRleDtcbiAgICB2YXIgZnJhbWVTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIHZhciBibG9ja1NpemUgPSBibG9jay5sZW5ndGg7XG4gICAgdmFyIGJsb2NrSW5kZXggPSAwO1xuICAgIHZhciBob3BTaXplID0gdGhpcy5wYXJhbXMuaG9wU2l6ZTtcblxuICAgIHZhciBvdXRGcmFtZSA9IHRoaXMub3V0RnJhbWU7XG5cbiAgICB3aGlsZSAoYmxvY2tJbmRleCA8IGJsb2NrU2l6ZSkge1xuICAgICAgdmFyIG51bVNraXAgPSAwO1xuXG4gICAgICAvLyBza2lwIGJsb2NrIHNhbXBsZXMgZm9yIG5lZ2F0aXZlIGZyYW1lSW5kZXhcbiAgICAgIGlmIChmcmFtZUluZGV4IDwgMCkge1xuICAgICAgICBudW1Ta2lwID0gLWZyYW1lSW5kZXg7XG4gICAgICB9XG5cbiAgICAgIGlmIChudW1Ta2lwIDwgYmxvY2tTaXplKSB7XG4gICAgICAgIGJsb2NrSW5kZXggKz0gbnVtU2tpcDsgLy8gc2tpcCBibG9jayBzZWdtZW50XG4gICAgICAgIC8vIGNhbiBjb3B5IGFsbCB0aGUgcmVzdCBvZiB0aGUgaW5jb21pbmcgYmxvY2tcbiAgICAgICAgdmFyIG51bUNvcHkgPSBibG9ja1NpemUgLSBibG9ja0luZGV4O1xuICAgICAgICAvLyBjb25ub3QgY29weSBtb3JlIHRoYW4gd2hhdCBmaXRzIGludG8gdGhlIGZyYW1lXG4gICAgICAgIHZhciBtYXhDb3B5ID0gZnJhbWVTaXplIC0gZnJhbWVJbmRleDtcblxuICAgICAgICBpZiAobnVtQ29weSA+PSBtYXhDb3B5KSB7XG4gICAgICAgICAgbnVtQ29weSA9IG1heENvcHk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjb3B5IGJsb2NrIHNlZ21lbnQgaW50byBmcmFtZVxuICAgICAgICB2YXIgY29weSA9IGJsb2NrLnN1YmFycmF5KGJsb2NrSW5kZXgsIGJsb2NrSW5kZXggKyBudW1Db3B5KTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coYmxvY2tJbmRleCwgZnJhbWVJbmRleCwgbnVtQ29weSk7XG4gICAgICAgIG91dEZyYW1lLnNldChjb3B5LCBmcmFtZUluZGV4KTtcblxuICAgICAgICAvLyBhZHZhbmNlIGJsb2NrIGFuZCBmcmFtZSBpbmRleFxuICAgICAgICBibG9ja0luZGV4ICs9IG51bUNvcHk7XG4gICAgICAgIGZyYW1lSW5kZXggKz0gbnVtQ29weTtcblxuICAgICAgICAvLyBzZW5kIGZyYW1lIHdoZW4gY29tcGxldGVkXG4gICAgICAgIGlmIChmcmFtZUluZGV4ID09PSBmcmFtZVNpemUpIHtcbiAgICAgICAgICAvLyBkZWZpbmUgdGltZSB0YWcgZm9yIHRoZSBvdXRGcmFtZSBhY2NvcmRpbmcgdG8gY29uZmlndXJhdGlvblxuICAgICAgICAgIGlmICh0aGlzLnBhcmFtcy5jZW50ZXJlZFRpbWVUYWcpIHtcbiAgICAgICAgICAgIHRoaXMudGltZSA9IHRpbWUgKyAoYmxvY2tJbmRleCAtIGZyYW1lU2l6ZSAvIDIpICogc2FtcGxlUGVyaW9kO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRpbWUgPSB0aW1lICsgKGJsb2NrSW5kZXggLSBmcmFtZVNpemUpICogc2FtcGxlUGVyaW9kO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIGZvcndhcmQgdG8gbmV4dCBub2Rlc1xuICAgICAgICAgIHRoaXMub3V0cHV0KCk7XG5cbiAgICAgICAgICAvLyBzaGlmdCBmcmFtZSBsZWZ0XG4gICAgICAgICAgaWYgKGhvcFNpemUgPCBmcmFtZVNpemUpIHtcbiAgICAgICAgICAgIG91dEZyYW1lLnNldChvdXRGcmFtZS5zdWJhcnJheShob3BTaXplLCBmcmFtZVNpemUpLCAwKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmcmFtZUluZGV4IC09IGhvcFNpemU7IC8vIGhvcCBmb3J3YXJkXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHNraXAgZW50aXJlIGJsb2NrXG4gICAgICAgIHZhciBibG9ja1Jlc3QgPSBibG9ja1NpemUgLSBibG9ja0luZGV4O1xuICAgICAgICBmcmFtZUluZGV4ICs9IGJsb2NrUmVzdDtcbiAgICAgICAgYmxvY2tJbmRleCArPSBibG9ja1Jlc3Q7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5mcmFtZUluZGV4ID0gZnJhbWVJbmRleDtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEZyYW1lcjtcbiJdfQ==