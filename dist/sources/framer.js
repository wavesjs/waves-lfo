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
          if (frameIndex < 0) numSkip = -frameIndex;

          if (numSkip < blockSize) {
            blockIndex += numSkip; // skip block segment

            var numCopy = blockSize - blockIndex; // can copy all the rest of the incoming block
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
      }
    }
  });

  return Framer;
})();

module.exports = Framer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL3Byb2Nlc3Mtd29ya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztJQUVNLE1BQU07QUFDQyxXQURQLE1BQU0sQ0FDRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUU7MEJBRGpELE1BQU07O0FBRVIsUUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7QUFDMUIsUUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7QUFDeEIsUUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDO0FBQ3BDLFFBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDOztBQUUxQixRQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztHQUN0Qjs7ZUFSRyxNQUFNO0FBVVYsU0FBSzthQUFBLGlCQUFHO0FBQ04sWUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7T0FDdEI7O0FBRUQsWUFBUTthQUFBLGtCQUFDLElBQUksRUFBRTtBQUNiLFlBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7QUFDbEMsWUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztBQUNqQyxZQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDOztBQUU5QixZQUFJLFVBQVUsR0FBRyxDQUFDLEVBQUU7O0FBRWxCLGtCQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQzs7O0FBRzdCLGNBQUksU0FBUyxHQUFHLElBQUksR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFBLEdBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQztBQUN6RSxjQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztTQUNyQztPQUNGOztBQUVELFNBQUs7YUFBQSxlQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7O0FBRWpCLFlBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7QUFDbEMsWUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFDdEMsWUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztBQUM3QixZQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7OztBQUduQixlQUFPLFVBQVUsR0FBRyxTQUFTLEVBQUU7QUFDN0IsY0FBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDOzs7QUFHaEIsY0FBSSxVQUFVLEdBQUcsQ0FBQyxFQUNoQixPQUFPLEdBQUcsQ0FBQyxVQUFVLENBQUM7O0FBRXhCLGNBQUksT0FBTyxHQUFHLFNBQVMsRUFBRTtBQUN2QixzQkFBVSxJQUFJLE9BQU8sQ0FBQzs7QUFFdEIsZ0JBQUksT0FBTyxHQUFHLFNBQVMsR0FBRyxVQUFVLENBQUM7QUFDckMsZ0JBQUksT0FBTyxHQUFHLFNBQVMsR0FBRyxVQUFVLENBQUM7O0FBRXJDLGdCQUFJLE9BQU8sSUFBSSxPQUFPLEVBQ3BCLE9BQU8sR0FBRyxPQUFPLENBQUM7OztBQUdwQixnQkFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsVUFBVSxHQUFHLE9BQU8sQ0FBQyxDQUFDO0FBQzVELGdCQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7OztBQUdyQyxzQkFBVSxJQUFJLE9BQU8sQ0FBQztBQUN0QixzQkFBVSxJQUFJLE9BQU8sQ0FBQzs7O0FBR3RCLGdCQUFJLFVBQVUsS0FBSyxTQUFTLEVBQUU7QUFDNUIsa0JBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7OztBQUc5QixrQkFBSSxTQUFTLEdBQUcsSUFBSSxHQUFHLENBQUMsVUFBVSxHQUFHLFNBQVMsR0FBRyxDQUFDLENBQUEsR0FBSSxJQUFJLENBQUMsYUFBYSxDQUFDO0FBQ3pFLGtCQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQzs7O0FBR3BDLGtCQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsU0FBUyxFQUMzQixRQUFRLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFL0Qsd0JBQVUsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDO2FBQzdCO1dBQ0YsTUFBTTs7QUFFTCxnQkFBSSxTQUFTLEdBQUcsU0FBUyxHQUFHLFVBQVUsQ0FBQztBQUN2QyxzQkFBVSxJQUFJLFNBQVMsQ0FBQztBQUN4QixzQkFBVSxJQUFJLFNBQVMsQ0FBQztXQUN6QjtTQUNGOztBQUVELFlBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO09BQy9COzs7O1NBcEZHLE1BQU07OztBQXVGWixNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyIsImZpbGUiOiJlczYvc291cmNlcy9wcm9jZXNzLXdvcmtlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuY2xhc3MgRnJhbWVyIHtcbiAgY29uc3RydWN0b3Iob3V0RnJhbWUsIGhvcFNpemUsIHNhbXBsZVJhdGUsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fb3V0RnJhbWUgPSBvdXRGcmFtZTtcbiAgICB0aGlzLl9ob3BTaXplID0gaG9wU2l6ZTtcbiAgICB0aGlzLl9zYW1wbGVQZXJpb2QgPSAxIC8gc2FtcGxlUmF0ZTtcbiAgICB0aGlzLl9jYWxsYmFjayA9IGNhbGxiYWNrO1xuXG4gICAgdGhpcy5fZnJhbWVJbmRleCA9IDA7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLl9mcmFtZUluZGV4ID0gMDtcbiAgfVxuXG4gIGZpbmFsaXplKHRpbWUpIHtcbiAgICB2YXIgZnJhbWVJbmRleCA9IHRoaXMuX2ZyYW1lSW5kZXg7XG4gICAgdmFyIGZyYW1lU2l6ZSA9IHRoaXMuX2ZyYW1lSW5kZXg7XG4gICAgdmFyIG91dEZyYW1lID0gdGhpcy5fb3V0RnJhbWU7XG5cbiAgICBpZiAoZnJhbWVJbmRleCA+IDApIHtcbiAgICAgIC8vIHplcm8gcGFkIGZyYW1lXG4gICAgICBvdXRGcmFtZS5maWxsKDAsIGZyYW1lSW5kZXgpO1xuXG4gICAgICAvLyBvdXRwdXQgemVybyBwYWRkZWQgZnJhbWVcbiAgICAgIHZhciBmcmFtZVRpbWUgPSB0aW1lICsgKGZyYW1lU2l6ZSAvIDIgKyBmcmFtZUluZGV4KSAqIHRoaXMuX3NhbXBsZVBlcmlvZDsgLy8gZnJhbWVTaXplIC8gMiAtIGZyYW1lSW5kZXggLSBmcmFtZVNpemUgLyAyKVxuICAgICAgdGhpcy5fY2FsbGJhY2soZnJhbWVUaW1lLCBvdXRGcmFtZSk7XG4gICAgfVxuICB9XG5cbiAgaW5wdXQodGltZSwgYmxvY2spIHtcbiAgICAvLyBjb25zb2xlLmxvZyh0aW1lLCBibG9jayk7XG4gICAgdmFyIGZyYW1lSW5kZXggPSB0aGlzLl9mcmFtZUluZGV4O1xuICAgIHZhciBmcmFtZVNpemUgPSB0aGlzLl9vdXRGcmFtZS5sZW5ndGg7XG4gICAgdmFyIGJsb2NrU2l6ZSA9IGJsb2NrLmxlbmd0aDtcbiAgICB2YXIgYmxvY2tJbmRleCA9IDA7XG5cbiAgICAvLyBjb25zdW1lIGJsb2NrXG4gICAgd2hpbGUgKGJsb2NrSW5kZXggPCBibG9ja1NpemUpIHtcbiAgICAgIHZhciBudW1Ta2lwID0gMDtcblxuICAgICAgLy8gc2tpcCBibG9jayBzYW1wbGVzIGZvciBuZWdhdGl2ZSBmcmFtZUluZGV4XG4gICAgICBpZiAoZnJhbWVJbmRleCA8IDApXG4gICAgICAgIG51bVNraXAgPSAtZnJhbWVJbmRleDtcblxuICAgICAgaWYgKG51bVNraXAgPCBibG9ja1NpemUpIHtcbiAgICAgICAgYmxvY2tJbmRleCArPSBudW1Ta2lwOyAvLyBza2lwIGJsb2NrIHNlZ21lbnRcblxuICAgICAgICB2YXIgbnVtQ29weSA9IGJsb2NrU2l6ZSAtIGJsb2NrSW5kZXg7IC8vIGNhbiBjb3B5IGFsbCB0aGUgcmVzdCBvZiB0aGUgaW5jb21pbmcgYmxvY2tcbiAgICAgICAgdmFyIG1heENvcHkgPSBmcmFtZVNpemUgLSBmcmFtZUluZGV4OyAvLyBjb25ub3QgY29weSBtb3JlIHRoYW4gd2hhdCBmaXRzIGludG8gdGhlIGZyYW1lXG5cbiAgICAgICAgaWYgKG51bUNvcHkgPj0gbWF4Q29weSlcbiAgICAgICAgICBudW1Db3B5ID0gbWF4Q29weTtcblxuICAgICAgICAvLyBjb3B5IGJsb2NrIHNlZ21lbnQgaW50byBmcmFtZVxuICAgICAgICB2YXIgY29weSA9IGJsb2NrLnN1YmFycmF5KGJsb2NrSW5kZXgsIGJsb2NrSW5kZXggKyBudW1Db3B5KTtcbiAgICAgICAgdGhpcy5fb3V0RnJhbWUuc2V0KGNvcHksIGZyYW1lSW5kZXgpO1xuXG4gICAgICAgIC8vIGFkdmFuY2UgYmxvY2sgYW5kIGZyYW1lIGluZGV4XG4gICAgICAgIGJsb2NrSW5kZXggKz0gbnVtQ29weTtcbiAgICAgICAgZnJhbWVJbmRleCArPSBudW1Db3B5O1xuXG4gICAgICAgIC8vIHNlbmQgZnJhbWUgd2hlbiBjb21wbGV0ZWRcbiAgICAgICAgaWYgKGZyYW1lSW5kZXggPT09IGZyYW1lU2l6ZSkge1xuICAgICAgICAgIHZhciBvdXRGcmFtZSA9IHRoaXMuX291dEZyYW1lO1xuXG4gICAgICAgICAgLy8gb3V0cHV0IGNvbXBsZXRlIGZyYW1lXG4gICAgICAgICAgdmFyIGZyYW1lVGltZSA9IHRpbWUgKyAoYmxvY2tJbmRleCAtIGZyYW1lU2l6ZSAvIDIpICogdGhpcy5fc2FtcGxlUGVyaW9kO1xuICAgICAgICAgIHRoaXMuX2NhbGxiYWNrKGZyYW1lVGltZSwgb3V0RnJhbWUpO1xuXG4gICAgICAgICAgLy8gc2hpZnQgZnJhbWUgbGVmdFxuICAgICAgICAgIGlmICh0aGlzLl9ob3BTaXplIDwgZnJhbWVTaXplKVxuICAgICAgICAgICAgb3V0RnJhbWUuc2V0KG91dEZyYW1lLnN1YmFycmF5KHRoaXMuX2hvcFNpemUsIGZyYW1lU2l6ZSksIDApO1xuXG4gICAgICAgICAgZnJhbWVJbmRleCAtPSB0aGlzLl9ob3BTaXplOyAvLyBob3AgZm9yd2FyZFxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBza2lwIGVudGlyZSBibG9ja1xuICAgICAgICB2YXIgYmxvY2tSZXN0ID0gYmxvY2tTaXplIC0gYmxvY2tJbmRleDtcbiAgICAgICAgZnJhbWVJbmRleCArPSBibG9ja1Jlc3Q7XG4gICAgICAgIGJsb2NrSW5kZXggKz0gYmxvY2tSZXN0O1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX2ZyYW1lSW5kZXggPSBmcmFtZUluZGV4O1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRnJhbWVyO1xuIl19