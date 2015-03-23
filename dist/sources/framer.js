"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var Framer = (function () {
  function Framer(outFrame, hopSize, sampleRate, callback) {
    _classCallCheck(this, Framer);

    this._outFrame = outFrame;
    this._hopSize = hopSize;
    this._samplePeriod = 1 / sampleRate;
    this._callback = callback;

    this._frameIndex = 0;
  }

  _createClass(Framer, {
    reset: {
      value: function reset() {
        this._frameIndex = 0;
      }
    },
    finalize: {
      value: function finalize(time) {
        var frameIndex = this._frameIndex;
        var frameSize = this._frameIndex;
        var outFrame = this._outFrame;

        if (frameIndex > 0) {
          // zero pad frame
          outFrame.fill(0, frameIndex);

          // output zero padded frame
          var frameTime = time + (frameSize / 2 + frameIndex) * this._samplePeriod; // frameSize / 2 - frameIndex - frameSize / 2)
          this._callback(frameTime, outFrame);
        }
      }
    },
    input: {
      value: function input(time, block) {
        // console.log(time, block);
        var frameIndex = this._frameIndex;
        var frameSize = this._outFrame.length;
        var blockSize = block.length;
        var blockIndex = 0;

        // consume block
        while (blockIndex < blockSize) {
          var numSkip = 0;

          // skip block samples for negative frameIndex
          if (frameIndex < 0) {
            numSkip = -frameIndex;
          }

          if (numSkip < blockSize) {
            blockIndex += numSkip; // skip block segment

            var numCopy = blockSize - blockIndex; // can copy all the rest of the incoming block
            var maxCopy = frameSize - frameIndex; // connot copy more than what fits into the frame

            if (numCopy >= maxCopy) {
              numCopy = maxCopy;
            }

            // copy block segment into frame
            var copy = block.subarray(blockIndex, blockIndex + numCopy);
            this._outFrame.set(copy, frameIndex);

            // advance block and frame index
            blockIndex += numCopy;
            frameIndex += numCopy;

            // send frame when completed
            if (frameIndex === frameSize) {
              var outFrame = this._outFrame;

              // output complete frame
              var frameTime = time + (blockIndex - frameSize / 2) * this._samplePeriod;
              this._callback(frameTime, outFrame);

              // shift frame left
              if (this._hopSize < frameSize) {
                outFrame.set(outFrame.subarray(this._hopSize, frameSize), 0);
              }

              frameIndex -= this._hopSize; // hop forward
            }
          } else {
            // skip entire block
            var blockRest = blockSize - blockIndex;
            frameIndex += blockRest;
            blockIndex += blockRest;
          }
        }

        this._frameIndex = frameIndex;
      }
    }
  });

  return Framer;
})();

module.exports = Framer;
//# sourceMappingURL=data:application/json;base64,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a0JBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxTQUFTLEVBQUU7QUFDN0Isd0JBQVEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2VBQzlEOztBQUVELHdCQUFVLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQzthQUM3QjtXQUNGLE1BQU07O0FBRUwsZ0JBQUksU0FBUyxHQUFHLFNBQVMsR0FBRyxVQUFVLENBQUM7QUFDdkMsc0JBQVUsSUFBSSxTQUFTLENBQUM7QUFDeEIsc0JBQVUsSUFBSSxTQUFTLENBQUM7V0FDekI7U0FDRjs7QUFFRCxZQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztPQUMvQjs7OztTQXZGRyxNQUFNOzs7QUEwRlosTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMiLCJmaWxlIjoiZXM2L3NvdXJjZXMvZnJhbWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBGcmFtZXIge1xuICBjb25zdHJ1Y3RvcihvdXRGcmFtZSwgaG9wU2l6ZSwgc2FtcGxlUmF0ZSwgY2FsbGJhY2spIHtcbiAgICB0aGlzLl9vdXRGcmFtZSA9IG91dEZyYW1lO1xuICAgIHRoaXMuX2hvcFNpemUgPSBob3BTaXplO1xuICAgIHRoaXMuX3NhbXBsZVBlcmlvZCA9IDEgLyBzYW1wbGVSYXRlO1xuICAgIHRoaXMuX2NhbGxiYWNrID0gY2FsbGJhY2s7XG5cbiAgICB0aGlzLl9mcmFtZUluZGV4ID0gMDtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuX2ZyYW1lSW5kZXggPSAwO1xuICB9XG5cbiAgZmluYWxpemUodGltZSkge1xuICAgIHZhciBmcmFtZUluZGV4ID0gdGhpcy5fZnJhbWVJbmRleDtcbiAgICB2YXIgZnJhbWVTaXplID0gdGhpcy5fZnJhbWVJbmRleDtcbiAgICB2YXIgb3V0RnJhbWUgPSB0aGlzLl9vdXRGcmFtZTtcblxuICAgIGlmIChmcmFtZUluZGV4ID4gMCkge1xuICAgICAgLy8gemVybyBwYWQgZnJhbWVcbiAgICAgIG91dEZyYW1lLmZpbGwoMCwgZnJhbWVJbmRleCk7XG5cbiAgICAgIC8vIG91dHB1dCB6ZXJvIHBhZGRlZCBmcmFtZVxuICAgICAgdmFyIGZyYW1lVGltZSA9IHRpbWUgKyAoZnJhbWVTaXplIC8gMiArIGZyYW1lSW5kZXgpICogdGhpcy5fc2FtcGxlUGVyaW9kOyAvLyBmcmFtZVNpemUgLyAyIC0gZnJhbWVJbmRleCAtIGZyYW1lU2l6ZSAvIDIpXG4gICAgICB0aGlzLl9jYWxsYmFjayhmcmFtZVRpbWUsIG91dEZyYW1lKTtcbiAgICB9XG4gIH1cblxuICBpbnB1dCh0aW1lLCBibG9jaykge1xuICAgIC8vIGNvbnNvbGUubG9nKHRpbWUsIGJsb2NrKTtcbiAgICB2YXIgZnJhbWVJbmRleCA9IHRoaXMuX2ZyYW1lSW5kZXg7XG4gICAgdmFyIGZyYW1lU2l6ZSA9IHRoaXMuX291dEZyYW1lLmxlbmd0aDtcbiAgICB2YXIgYmxvY2tTaXplID0gYmxvY2subGVuZ3RoO1xuICAgIHZhciBibG9ja0luZGV4ID0gMDtcblxuICAgIC8vIGNvbnN1bWUgYmxvY2tcbiAgICB3aGlsZSAoYmxvY2tJbmRleCA8IGJsb2NrU2l6ZSkge1xuICAgICAgdmFyIG51bVNraXAgPSAwO1xuXG4gICAgICAvLyBza2lwIGJsb2NrIHNhbXBsZXMgZm9yIG5lZ2F0aXZlIGZyYW1lSW5kZXhcbiAgICAgIGlmIChmcmFtZUluZGV4IDwgMCkge1xuICAgICAgICBudW1Ta2lwID0gLWZyYW1lSW5kZXg7XG4gICAgICB9XG5cbiAgICAgIGlmIChudW1Ta2lwIDwgYmxvY2tTaXplKSB7XG4gICAgICAgIGJsb2NrSW5kZXggKz0gbnVtU2tpcDsgLy8gc2tpcCBibG9jayBzZWdtZW50XG5cbiAgICAgICAgdmFyIG51bUNvcHkgPSBibG9ja1NpemUgLSBibG9ja0luZGV4OyAvLyBjYW4gY29weSBhbGwgdGhlIHJlc3Qgb2YgdGhlIGluY29taW5nIGJsb2NrXG4gICAgICAgIHZhciBtYXhDb3B5ID0gZnJhbWVTaXplIC0gZnJhbWVJbmRleDsgLy8gY29ubm90IGNvcHkgbW9yZSB0aGFuIHdoYXQgZml0cyBpbnRvIHRoZSBmcmFtZVxuXG4gICAgICAgIGlmIChudW1Db3B5ID49IG1heENvcHkpIHtcbiAgICAgICAgICBudW1Db3B5ID0gbWF4Q29weTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNvcHkgYmxvY2sgc2VnbWVudCBpbnRvIGZyYW1lXG4gICAgICAgIHZhciBjb3B5ID0gYmxvY2suc3ViYXJyYXkoYmxvY2tJbmRleCwgYmxvY2tJbmRleCArIG51bUNvcHkpO1xuICAgICAgICB0aGlzLl9vdXRGcmFtZS5zZXQoY29weSwgZnJhbWVJbmRleCk7XG5cbiAgICAgICAgLy8gYWR2YW5jZSBibG9jayBhbmQgZnJhbWUgaW5kZXhcbiAgICAgICAgYmxvY2tJbmRleCArPSBudW1Db3B5O1xuICAgICAgICBmcmFtZUluZGV4ICs9IG51bUNvcHk7XG5cbiAgICAgICAgLy8gc2VuZCBmcmFtZSB3aGVuIGNvbXBsZXRlZFxuICAgICAgICBpZiAoZnJhbWVJbmRleCA9PT0gZnJhbWVTaXplKSB7XG4gICAgICAgICAgdmFyIG91dEZyYW1lID0gdGhpcy5fb3V0RnJhbWU7XG5cbiAgICAgICAgICAvLyBvdXRwdXQgY29tcGxldGUgZnJhbWVcbiAgICAgICAgICB2YXIgZnJhbWVUaW1lID0gdGltZSArIChibG9ja0luZGV4IC0gZnJhbWVTaXplIC8gMikgKiB0aGlzLl9zYW1wbGVQZXJpb2Q7XG4gICAgICAgICAgdGhpcy5fY2FsbGJhY2soZnJhbWVUaW1lLCBvdXRGcmFtZSk7XG5cbiAgICAgICAgICAvLyBzaGlmdCBmcmFtZSBsZWZ0XG4gICAgICAgICAgaWYgKHRoaXMuX2hvcFNpemUgPCBmcmFtZVNpemUpIHtcbiAgICAgICAgICAgIG91dEZyYW1lLnNldChvdXRGcmFtZS5zdWJhcnJheSh0aGlzLl9ob3BTaXplLCBmcmFtZVNpemUpLCAwKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmcmFtZUluZGV4IC09IHRoaXMuX2hvcFNpemU7IC8vIGhvcCBmb3J3YXJkXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHNraXAgZW50aXJlIGJsb2NrXG4gICAgICAgIHZhciBibG9ja1Jlc3QgPSBibG9ja1NpemUgLSBibG9ja0luZGV4O1xuICAgICAgICBmcmFtZUluZGV4ICs9IGJsb2NrUmVzdDtcbiAgICAgICAgYmxvY2tJbmRleCArPSBibG9ja1Jlc3Q7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fZnJhbWVJbmRleCA9IGZyYW1lSW5kZXg7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBGcmFtZXI7XG4iXX0=