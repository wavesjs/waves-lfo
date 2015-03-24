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
//# sourceMappingURL=data:application/json;base64,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LENBQUM7OztBQUcvQixzQkFBVSxJQUFJLE9BQU8sQ0FBQztBQUN0QixzQkFBVSxJQUFJLE9BQU8sQ0FBQzs7O0FBR3RCLGdCQUFJLFVBQVUsS0FBSyxTQUFTLEVBQUU7O0FBRTVCLGtCQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFO0FBQy9CLG9CQUFJLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLFVBQVUsR0FBRyxTQUFTLEdBQUcsQ0FBQyxDQUFBLEdBQUksWUFBWSxDQUFDO2VBQ2hFLE1BQU07QUFDTCxvQkFBSSxDQUFDLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFBLEdBQUksWUFBWSxDQUFDO2VBQzVEOzs7QUFHRCxrQkFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDOzs7QUFHZCxrQkFBSSxPQUFPLEdBQUcsU0FBUyxFQUFFO0FBQ3ZCLHdCQUFRLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2VBQ3hEOztBQUVELHdCQUFVLElBQUksT0FBTyxDQUFDO2FBQ3ZCO1dBQ0YsTUFBTTs7QUFFTCxnQkFBSSxTQUFTLEdBQUcsU0FBUyxHQUFHLFVBQVUsQ0FBQztBQUN2QyxzQkFBVSxJQUFJLFNBQVMsQ0FBQztBQUN4QixzQkFBVSxJQUFJLFNBQVMsQ0FBQztXQUN6QjtTQUNGOztBQUVELFlBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO09BQzlCOzs7O1NBbEdHLE1BQU07R0FBUyxHQUFHOztBQXFHeEIsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMiLCJmaWxlIjoiZXM2L29wZXJhdG9ycy9mcmFtZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBMZm8gPSByZXF1aXJlKCcuLi9jb3JlL2xmby1iYXNlJyk7XG5cbnZhciBpc1Bvd2VyT2ZUd28gPSBmdW5jdGlvbihudW1iZXIpIHtcbiAgd2hpbGUgKChudW1iZXIgJSAyID09PSAwKSAmJiBudW1iZXIgPiAxKSB7XG4gICAgbnVtYmVyID0gbnVtYmVyIC8gMjtcbiAgfVxuXG4gIHJldHVybiBudW1iZXIgPT09IDE7XG59XG5cbmNsYXNzIEZyYW1lciBleHRlbmRzIExmbyB7XG4gIGNvbnN0cnVjdG9yKHByZXZpb3VzLCBvcHRpb25zKSB7XG4gICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgZnJhbWVTaXplOiA1MTIsXG4gICAgICAvLyBkZWZpbmUgYSBnb29kIG5hbWUgY2YuIE5vYmVydFxuICAgICAgY2VudGVyZWRUaW1lVGFnOiBmYWxzZSAvLyAoJ3N0YXJ0J3x8J2NlbnRlcicpXG4gICAgfTtcblxuICAgIHN1cGVyKHByZXZpb3VzLCBvcHRpb25zLCBkZWZhdWx0cyk7XG5cbiAgICB0aGlzLmZyYW1lSW5kZXggPSAwO1xuXG4gICAgaWYgKCF0aGlzLnBhcmFtcy5ob3BTaXplKSB7XG4gICAgICB0aGlzLnBhcmFtcy5ob3BTaXplID0gdGhpcy5wYXJhbXMuZnJhbWVTaXplO1xuICAgIH1cblxuICAgIC8vIHNldHVwIHN0cmVhbVxuICAgIHRoaXMuc2V0dXBTdHJlYW0oe1xuICAgICAgZnJhbWVTaXplOiB0aGlzLnBhcmFtcy5mcmFtZVNpemUsXG4gICAgICBmcmFtZVJhdGU6IHRoaXMuc3RyZWFtUGFyYW1zLmJsb2NrU2FtcGxlUmF0ZSAvIHRoaXMucGFyYW1zLmhvcFNpemVcbiAgICB9KTtcblxuICAgIC8vIHRocm93IGVycm9yIGlmIGZyYW1lU2l6ZSBpcyBub3QgYSBwb3dlciBvZiAyID9cbiAgICBpZiAoIWlzUG93ZXJPZlR3byh0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUpKSB7XG4gICAgICAvLyB0aHJvdyBFcnJvcigpID9cbiAgICB9XG5cbiAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnN0cmVhbVBhcmFtcyk7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGJsb2NrLCBtZXRhZGF0YSkge1xuICAgIHZhciBzYW1wbGVSYXRlID0gdGhpcy5zdHJlYW1QYXJhbXMuYmxvY2tTYW1wbGVSYXRlO1xuICAgIHZhciBzYW1wbGVQZXJpb2QgPSAxIC8gc2FtcGxlUmF0ZTtcblxuICAgIHZhciBmcmFtZUluZGV4ID0gdGhpcy5mcmFtZUluZGV4O1xuICAgIHZhciBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgdmFyIGJsb2NrU2l6ZSA9IGJsb2NrLmxlbmd0aDtcbiAgICB2YXIgYmxvY2tJbmRleCA9IDA7XG4gICAgdmFyIGhvcFNpemUgPSB0aGlzLnBhcmFtcy5ob3BTaXplO1xuXG4gICAgdmFyIG91dEZyYW1lID0gdGhpcy5vdXRGcmFtZTtcblxuICAgIHdoaWxlIChibG9ja0luZGV4IDwgYmxvY2tTaXplKSB7XG4gICAgICB2YXIgbnVtU2tpcCA9IDA7XG5cbiAgICAgIC8vIHNraXAgYmxvY2sgc2FtcGxlcyBmb3IgbmVnYXRpdmUgZnJhbWVJbmRleFxuICAgICAgaWYgKGZyYW1lSW5kZXggPCAwKSB7XG4gICAgICAgIG51bVNraXAgPSAtZnJhbWVJbmRleDtcbiAgICAgIH1cblxuICAgICAgaWYgKG51bVNraXAgPCBibG9ja1NpemUpIHtcbiAgICAgICAgYmxvY2tJbmRleCArPSBudW1Ta2lwOyAvLyBza2lwIGJsb2NrIHNlZ21lbnRcbiAgICAgICAgLy8gY2FuIGNvcHkgYWxsIHRoZSByZXN0IG9mIHRoZSBpbmNvbWluZyBibG9ja1xuICAgICAgICB2YXIgbnVtQ29weSA9IGJsb2NrU2l6ZSAtIGJsb2NrSW5kZXg7XG4gICAgICAgIC8vIGNvbm5vdCBjb3B5IG1vcmUgdGhhbiB3aGF0IGZpdHMgaW50byB0aGUgZnJhbWVcbiAgICAgICAgdmFyIG1heENvcHkgPSBmcmFtZVNpemUgLSBmcmFtZUluZGV4O1xuXG4gICAgICAgIGlmIChudW1Db3B5ID49IG1heENvcHkpIHtcbiAgICAgICAgICBudW1Db3B5ID0gbWF4Q29weTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNvcHkgYmxvY2sgc2VnbWVudCBpbnRvIGZyYW1lXG4gICAgICAgIHZhciBjb3B5ID0gYmxvY2suc3ViYXJyYXkoYmxvY2tJbmRleCwgYmxvY2tJbmRleCArIG51bUNvcHkpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhibG9ja0luZGV4LCBmcmFtZUluZGV4LCBudW1Db3B5KTtcbiAgICAgICAgb3V0RnJhbWUuc2V0KGNvcHksIGZyYW1lSW5kZXgpO1xuXG4gICAgICAgIC8vIGFkdmFuY2UgYmxvY2sgYW5kIGZyYW1lIGluZGV4XG4gICAgICAgIGJsb2NrSW5kZXggKz0gbnVtQ29weTtcbiAgICAgICAgZnJhbWVJbmRleCArPSBudW1Db3B5O1xuXG4gICAgICAgIC8vIHNlbmQgZnJhbWUgd2hlbiBjb21wbGV0ZWRcbiAgICAgICAgaWYgKGZyYW1lSW5kZXggPT09IGZyYW1lU2l6ZSkge1xuICAgICAgICAgIC8vIGRlZmluZSB0aW1lIHRhZyBmb3IgdGhlIG91dEZyYW1lIGFjY29yZGluZyB0byBjb25maWd1cmF0aW9uXG4gICAgICAgICAgaWYgKHRoaXMucGFyYW1zLmNlbnRlcmVkVGltZVRhZykge1xuICAgICAgICAgICAgdGhpcy50aW1lID0gdGltZSArIChibG9ja0luZGV4IC0gZnJhbWVTaXplIC8gMikgKiBzYW1wbGVQZXJpb2Q7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudGltZSA9IHRpbWUgKyAoYmxvY2tJbmRleCAtIGZyYW1lU2l6ZSkgKiBzYW1wbGVQZXJpb2Q7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gZm9yd2FyZCB0byBuZXh0IG5vZGVzXG4gICAgICAgICAgdGhpcy5vdXRwdXQoKTtcblxuICAgICAgICAgIC8vIHNoaWZ0IGZyYW1lIGxlZnRcbiAgICAgICAgICBpZiAoaG9wU2l6ZSA8IGZyYW1lU2l6ZSkge1xuICAgICAgICAgICAgb3V0RnJhbWUuc2V0KG91dEZyYW1lLnN1YmFycmF5KGhvcFNpemUsIGZyYW1lU2l6ZSksIDApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGZyYW1lSW5kZXggLT0gaG9wU2l6ZTsgLy8gaG9wIGZvcndhcmRcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gc2tpcCBlbnRpcmUgYmxvY2tcbiAgICAgICAgdmFyIGJsb2NrUmVzdCA9IGJsb2NrU2l6ZSAtIGJsb2NrSW5kZXg7XG4gICAgICAgIGZyYW1lSW5kZXggKz0gYmxvY2tSZXN0O1xuICAgICAgICBibG9ja0luZGV4ICs9IGJsb2NrUmVzdDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmZyYW1lSW5kZXggPSBmcmFtZUluZGV4O1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRnJhbWVyOyJdfQ==