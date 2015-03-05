"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var Framer = (function () {
  function Framer(outFrame, hopSize, sampleRate, callback) {
    _babelHelpers.classCallCheck(this, Framer);

    this._outFrame = outFrame;
    this._hopSize = hopSize;
    this._samplePeriod = 1 / sampleRate;
    this._callback = callback;

    this._frameIndex = 0;
  }

  _babelHelpers.prototypeProperties(Framer, null, {
    reset: {
      value: function reset() {
        this._frameIndex = 0;
      },
      writable: true,
      configurable: true
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
      },
      writable: true,
      configurable: true
    },
    input: {
      value: function input(time, block) {
        var frameIndex = this._frameIndex;
        var frameSize = this._outFrame.length;
        var blockSize = block.length;
        var blockIndex = 0;

        // consume block
        while (blockIndex < blockSize) {
          var numSkip = 0;

          // skip block samples for negative frameIndex
          if (frameIndex < 0) numSkip = -frameIndex;

          if (numSkip < blockSize) {
            blockIndex += numSkip; // skip block segment

            var numCopy = blockSize - blockIndex; // can copy all the rest of teh incoming block
            var maxCopy = frameSize - frameIndex; // connot copy more than what fits into the frame

            if (numCopy >= maxCopy) numCopy = maxCopy;

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
              if (this._hopSize < frameSize) outFrame.set(outFrame.subarray(this._hopSize, frameSize), 0);

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
      },
      writable: true,
      configurable: true
    }
  });

  return Framer;
})();

module.exports = Framer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9vcGVyYXRvcnMvc3JjLWF1ZGlvL3Byb2Nlc3Mtd29ya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFFTSxNQUFNO0FBQ0MsV0FEUCxNQUFNLENBQ0UsUUFBUSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUTt1Q0FEL0MsTUFBTTs7QUFFUixRQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztBQUMxQixRQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztBQUN4QixRQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsR0FBRyxVQUFVLENBQUM7QUFDcEMsUUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7O0FBRTFCLFFBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO0dBQ3RCOztvQ0FSRyxNQUFNO0FBVVYsU0FBSzthQUFBLGlCQUFHO0FBQ04sWUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7T0FDdEI7Ozs7QUFFRCxZQUFRO2FBQUEsa0JBQUMsSUFBSSxFQUFFO0FBQ2IsWUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztBQUNsQyxZQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO0FBQ2pDLFlBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7O0FBRTlCLFlBQUksVUFBVSxHQUFHLENBQUMsRUFBRTs7QUFFbEIsa0JBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDOzs7QUFHN0IsY0FBSSxTQUFTLEdBQUcsSUFBSSxHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsR0FBRyxVQUFVLENBQUEsR0FBSSxJQUFJLENBQUMsYUFBYSxDQUFDO0FBQ3pFLGNBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQ3JDO09BQ0Y7Ozs7QUFFRCxTQUFLO2FBQUEsZUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQ2pCLFlBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7QUFDbEMsWUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFDdEMsWUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztBQUM3QixZQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7OztBQUduQixlQUFPLFVBQVUsR0FBRyxTQUFTLEVBQUU7QUFDN0IsY0FBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDOzs7QUFHaEIsY0FBSSxVQUFVLEdBQUcsQ0FBQyxFQUNoQixPQUFPLEdBQUcsQ0FBQyxVQUFVLENBQUM7O0FBRXhCLGNBQUksT0FBTyxHQUFHLFNBQVMsRUFBRTtBQUN2QixzQkFBVSxJQUFJLE9BQU8sQ0FBQzs7QUFFdEIsZ0JBQUksT0FBTyxHQUFHLFNBQVMsR0FBRyxVQUFVLENBQUM7QUFDckMsZ0JBQUksT0FBTyxHQUFHLFNBQVMsR0FBRyxVQUFVLENBQUM7O0FBRXJDLGdCQUFJLE9BQU8sSUFBSSxPQUFPLEVBQ3BCLE9BQU8sR0FBRyxPQUFPLENBQUM7OztBQUdwQixnQkFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsVUFBVSxHQUFHLE9BQU8sQ0FBQyxDQUFDO0FBQzVELGdCQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7OztBQUdyQyxzQkFBVSxJQUFJLE9BQU8sQ0FBQztBQUN0QixzQkFBVSxJQUFJLE9BQU8sQ0FBQzs7O0FBR3RCLGdCQUFJLFVBQVUsS0FBSyxTQUFTLEVBQUU7QUFDNUIsa0JBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7OztBQUc5QixrQkFBSSxTQUFTLEdBQUcsSUFBSSxHQUFHLENBQUMsVUFBVSxHQUFHLFNBQVMsR0FBRyxDQUFDLENBQUEsR0FBSSxJQUFJLENBQUMsYUFBYSxDQUFDO0FBQ3pFLGtCQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQzs7O0FBR3BDLGtCQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsU0FBUyxFQUMzQixRQUFRLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFL0Qsd0JBQVUsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDO2FBQzdCO1dBQ0YsTUFBTTs7QUFFTCxnQkFBSSxTQUFTLEdBQUcsU0FBUyxHQUFHLFVBQVUsQ0FBQztBQUN2QyxzQkFBVSxJQUFJLFNBQVMsQ0FBQztBQUN4QixzQkFBVSxJQUFJLFNBQVMsQ0FBQztXQUN6QjtTQUNGOztBQUVELFlBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO09BQy9COzs7Ozs7U0FuRkcsTUFBTTs7O0FBc0ZaLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDIiwiZmlsZSI6InNyYy9vcGVyYXRvcnMvc3JjLWF1ZGlvL3Byb2Nlc3Mtd29ya2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbmNsYXNzIEZyYW1lciB7XG4gIGNvbnN0cnVjdG9yKG91dEZyYW1lLCBob3BTaXplLCBzYW1wbGVSYXRlLCBjYWxsYmFjaykge1xuICAgIHRoaXMuX291dEZyYW1lID0gb3V0RnJhbWU7XG4gICAgdGhpcy5faG9wU2l6ZSA9IGhvcFNpemU7XG4gICAgdGhpcy5fc2FtcGxlUGVyaW9kID0gMSAvIHNhbXBsZVJhdGU7XG4gICAgdGhpcy5fY2FsbGJhY2sgPSBjYWxsYmFjaztcblxuICAgIHRoaXMuX2ZyYW1lSW5kZXggPSAwO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5fZnJhbWVJbmRleCA9IDA7XG4gIH1cblxuICBmaW5hbGl6ZSh0aW1lKSB7XG4gICAgdmFyIGZyYW1lSW5kZXggPSB0aGlzLl9mcmFtZUluZGV4O1xuICAgIHZhciBmcmFtZVNpemUgPSB0aGlzLl9mcmFtZUluZGV4O1xuICAgIHZhciBvdXRGcmFtZSA9IHRoaXMuX291dEZyYW1lO1xuXG4gICAgaWYgKGZyYW1lSW5kZXggPiAwKSB7XG4gICAgICAvLyB6ZXJvIHBhZCBmcmFtZVxuICAgICAgb3V0RnJhbWUuZmlsbCgwLCBmcmFtZUluZGV4KTtcblxuICAgICAgLy8gb3V0cHV0IHplcm8gcGFkZGVkIGZyYW1lXG4gICAgICB2YXIgZnJhbWVUaW1lID0gdGltZSArIChmcmFtZVNpemUgLyAyICsgZnJhbWVJbmRleCkgKiB0aGlzLl9zYW1wbGVQZXJpb2Q7IC8vIGZyYW1lU2l6ZSAvIDIgLSBmcmFtZUluZGV4IC0gZnJhbWVTaXplIC8gMilcbiAgICAgIHRoaXMuX2NhbGxiYWNrKGZyYW1lVGltZSwgb3V0RnJhbWUpO1xuICAgIH1cbiAgfVxuXG4gIGlucHV0KHRpbWUsIGJsb2NrKSB7XG4gICAgdmFyIGZyYW1lSW5kZXggPSB0aGlzLl9mcmFtZUluZGV4O1xuICAgIHZhciBmcmFtZVNpemUgPSB0aGlzLl9vdXRGcmFtZS5sZW5ndGg7XG4gICAgdmFyIGJsb2NrU2l6ZSA9IGJsb2NrLmxlbmd0aDtcbiAgICB2YXIgYmxvY2tJbmRleCA9IDA7XG5cbiAgICAvLyBjb25zdW1lIGJsb2NrXG4gICAgd2hpbGUgKGJsb2NrSW5kZXggPCBibG9ja1NpemUpIHtcbiAgICAgIHZhciBudW1Ta2lwID0gMDtcblxuICAgICAgLy8gc2tpcCBibG9jayBzYW1wbGVzIGZvciBuZWdhdGl2ZSBmcmFtZUluZGV4XG4gICAgICBpZiAoZnJhbWVJbmRleCA8IDApXG4gICAgICAgIG51bVNraXAgPSAtZnJhbWVJbmRleDtcblxuICAgICAgaWYgKG51bVNraXAgPCBibG9ja1NpemUpIHtcbiAgICAgICAgYmxvY2tJbmRleCArPSBudW1Ta2lwOyAvLyBza2lwIGJsb2NrIHNlZ21lbnRcblxuICAgICAgICB2YXIgbnVtQ29weSA9IGJsb2NrU2l6ZSAtIGJsb2NrSW5kZXg7IC8vIGNhbiBjb3B5IGFsbCB0aGUgcmVzdCBvZiB0ZWggaW5jb21pbmcgYmxvY2tcbiAgICAgICAgdmFyIG1heENvcHkgPSBmcmFtZVNpemUgLSBmcmFtZUluZGV4OyAvLyBjb25ub3QgY29weSBtb3JlIHRoYW4gd2hhdCBmaXRzIGludG8gdGhlIGZyYW1lXG5cbiAgICAgICAgaWYgKG51bUNvcHkgPj0gbWF4Q29weSlcbiAgICAgICAgICBudW1Db3B5ID0gbWF4Q29weTtcblxuICAgICAgICAvLyBjb3B5IGJsb2NrIHNlZ21lbnQgaW50byBmcmFtZVxuICAgICAgICB2YXIgY29weSA9IGJsb2NrLnN1YmFycmF5KGJsb2NrSW5kZXgsIGJsb2NrSW5kZXggKyBudW1Db3B5KTtcbiAgICAgICAgdGhpcy5fb3V0RnJhbWUuc2V0KGNvcHksIGZyYW1lSW5kZXgpO1xuXG4gICAgICAgIC8vIGFkdmFuY2UgYmxvY2sgYW5kIGZyYW1lIGluZGV4XG4gICAgICAgIGJsb2NrSW5kZXggKz0gbnVtQ29weTtcbiAgICAgICAgZnJhbWVJbmRleCArPSBudW1Db3B5O1xuXG4gICAgICAgIC8vIHNlbmQgZnJhbWUgd2hlbiBjb21wbGV0ZWRcbiAgICAgICAgaWYgKGZyYW1lSW5kZXggPT09IGZyYW1lU2l6ZSkge1xuICAgICAgICAgIHZhciBvdXRGcmFtZSA9IHRoaXMuX291dEZyYW1lO1xuXG4gICAgICAgICAgLy8gb3V0cHV0IGNvbXBsZXRlIGZyYW1lXG4gICAgICAgICAgdmFyIGZyYW1lVGltZSA9IHRpbWUgKyAoYmxvY2tJbmRleCAtIGZyYW1lU2l6ZSAvIDIpICogdGhpcy5fc2FtcGxlUGVyaW9kO1xuICAgICAgICAgIHRoaXMuX2NhbGxiYWNrKGZyYW1lVGltZSwgb3V0RnJhbWUpO1xuXG4gICAgICAgICAgLy8gc2hpZnQgZnJhbWUgbGVmdFxuICAgICAgICAgIGlmICh0aGlzLl9ob3BTaXplIDwgZnJhbWVTaXplKVxuICAgICAgICAgICAgb3V0RnJhbWUuc2V0KG91dEZyYW1lLnN1YmFycmF5KHRoaXMuX2hvcFNpemUsIGZyYW1lU2l6ZSksIDApO1xuXG4gICAgICAgICAgZnJhbWVJbmRleCAtPSB0aGlzLl9ob3BTaXplOyAvLyBob3AgZm9yd2FyZFxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBza2lwIGVudGlyZSBibG9ja1xuICAgICAgICB2YXIgYmxvY2tSZXN0ID0gYmxvY2tTaXplIC0gYmxvY2tJbmRleDtcbiAgICAgICAgZnJhbWVJbmRleCArPSBibG9ja1Jlc3Q7XG4gICAgICAgIGJsb2NrSW5kZXggKz0gYmxvY2tSZXN0O1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX2ZyYW1lSW5kZXggPSBmcmFtZUluZGV4O1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRnJhbWVyO1xuIl19