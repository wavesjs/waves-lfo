"use strict";

var Framer = (function(){var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var proto$0={};
  function Framer(outFrame, hopSize, sampleRate, callback) {
    this._outFrame = outFrame;
    this._hopSize = hopSize;
    this._samplePeriod = 1 / sampleRate;
    this._callback = callback;

    this._frameIndex = 0;
  }DP$0(Framer,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  proto$0.reset = function() {
    this._frameIndex = 0;
  };

  proto$0.finalize = function(time) {
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
  };

  proto$0.input = function(time, block) {
    var frameIndex = this._frameIndex;
    var frameSize = this._outFrame.length;
    var blockSize = block.length;
    var blockIndex = 0;

    // consume block
    while (blockIndex < blockSize) {
      var numSkip = 0;

      // skip block samples for negative frameIndex
      if (frameIndex < 0)
        numSkip = -frameIndex;

      if (numSkip < blockSize) {
        blockIndex += numSkip; // skip block segment

        var numCopy = blockSize - blockIndex; // can copy all the rest of teh incoming block
        var maxCopy = frameSize - frameIndex; // connot copy more than what fits into the frame

        if (numCopy >= maxCopy)
          numCopy = maxCopy;

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
          if (this._hopSize < frameSize)
            outFrame.set(outFrame.subarray(this._hopSize, frameSize), 0);

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
  };
MIXIN$0(Framer.prototype,proto$0);proto$0=void 0;return Framer;})();

module.exports = Framer;
