'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _BaseLfo2 = require('../core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var definitions = {
  frameSize: {
    type: 'integer',
    default: 512,
    metas: { kind: 'static' }
  },
  hopSize: { // should be nullable
    type: 'integer',
    default: null,
    nullable: true,
    metas: { kind: 'static' }
  },
  centeredTimeTags: {
    type: 'boolean',
    default: false
  }
};

/**
 * Change the `frameSize` and `hopSize` of a `signal` input according to
 * the given options.
 * This operator updates the stream parameters according to its configuration.
 *
 * @memberof module:common.operator
 *
 * @param {Object} options - Override default parameters.
 * @param {Number} [options.frameSize=512] - Frame size of the output signal.
 * @param {Number} [options.hopSize=null] - Number of samples between two
 *  consecutive frames. If null, `hopSize` is set to `frameSize`.
 * @param {Boolean} [options.centeredTimeTags] - Move the time tag to the middle
 *  of the frame.
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * const eventIn = new lfo.source.EventIn({
 *   frameType: 'signal',
 *   frameSize: 10,
 *   sampleRate: 2,
 * });
 *
 * const slicer = new lfo.operator.Slicer({
 *   frameSize: 4,
 *   hopSize: 2
 * });
 *
 * const logger = new lfo.sink.Logger({ time: true, data: true });
 *
 * eventIn.connect(slicer);
 * slicer.connect(logger);
 * eventIn.start();
 *
 * eventIn.process(0, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
 * > { time: 0, data: [0, 1, 2, 3] }
 * > { time: 1, data: [2, 3, 4, 5] }
 * > { time: 2, data: [4, 5, 6, 7] }
 * > { time: 3, data: [6, 7, 8, 9] }
 */

var Slicer = function (_BaseLfo) {
  (0, _inherits3.default)(Slicer, _BaseLfo);

  function Slicer() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, Slicer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Slicer.__proto__ || (0, _getPrototypeOf2.default)(Slicer)).call(this, definitions, options));

    var hopSize = _this.params.get('hopSize');
    var frameSize = _this.params.get('frameSize');

    if (!hopSize) _this.params.set('hopSize', frameSize);

    _this.params.addListener(_this.onParamUpdate.bind(_this));

    _this.frameIndex = 0;
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(Slicer, [{
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      this.prepareStreamParams(prevStreamParams);

      var hopSize = this.params.get('hopSize');
      var frameSize = this.params.get('frameSize');

      this.streamParams.frameSize = frameSize;
      this.streamParams.frameRate = prevStreamParams.sourceSampleRate / hopSize;

      this.propagateStreamParams();
    }

    /** @private */

  }, {
    key: 'resetStream',
    value: function resetStream() {
      (0, _get3.default)(Slicer.prototype.__proto__ || (0, _getPrototypeOf2.default)(Slicer.prototype), 'resetStream', this).call(this);
      this.frameIndex = 0;
    }

    /** @private */

  }, {
    key: 'finalizeStream',
    value: function finalizeStream(endTime) {
      if (this.frameIndex > 0) {
        var frameRate = this.streamParams.frameRate;
        var frameSize = this.streamParams.frameSize;
        var data = this.frame.data;
        // set the time of the last frame
        this.frame.time += 1 / frameRate;

        for (var i = this.frameIndex; i < frameSize; i++) {
          data[i] = 0;
        }this.propagateFrame();
      }

      (0, _get3.default)(Slicer.prototype.__proto__ || (0, _getPrototypeOf2.default)(Slicer.prototype), 'finalizeStream', this).call(this, endTime);
    }

    /** @private */

  }, {
    key: 'processFrame',
    value: function processFrame(frame) {
      this.prepareFrame();
      this.processFunction(frame);
    }

    /** @private */

  }, {
    key: 'processSignal',
    value: function processSignal(frame) {
      var time = frame.time;
      var block = frame.data;
      var metadata = frame.metadata;

      var centeredTimeTags = this.params.get('centeredTimeTags');
      var hopSize = this.params.get('hopSize');
      var outFrame = this.frame.data;
      var frameSize = this.streamParams.frameSize;
      var sampleRate = this.streamParams.sourceSampleRate;
      var samplePeriod = 1 / sampleRate;
      var blockSize = block.length;

      var frameIndex = this.frameIndex;
      var blockIndex = 0;

      while (blockIndex < blockSize) {
        var numSkip = 0;

        // skip block samples for negative frameIndex (frameSize < hopSize)
        if (frameIndex < 0) {
          numSkip = -frameIndex;
          frameIndex = 0; // reset `frameIndex`
        }

        if (numSkip < blockSize) {
          blockIndex += numSkip; // skip block segment
          // can copy all the rest of the incoming block
          var numCopy = blockSize - blockIndex;
          // connot copy more than what fits into the frame
          var maxCopy = frameSize - frameIndex;

          if (numCopy >= maxCopy) numCopy = maxCopy;

          // copy block segment into frame
          var copy = block.subarray(blockIndex, blockIndex + numCopy);
          outFrame.set(copy, frameIndex);
          // advance block and frame index
          blockIndex += numCopy;
          frameIndex += numCopy;

          // send frame when completed
          if (frameIndex === frameSize) {
            // define time tag for the outFrame according to configuration
            if (centeredTimeTags) this.frame.time = time + (blockIndex - frameSize / 2) * samplePeriod;else this.frame.time = time + (blockIndex - frameSize) * samplePeriod;

            this.frame.metadata = metadata;
            // forward to next nodes
            this.propagateFrame();

            // shift frame left
            if (hopSize < frameSize) outFrame.set(outFrame.subarray(hopSize, frameSize), 0);

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
  return Slicer;
}(_BaseLfo3.default);

exports.default = Slicer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNsaWNlci5qcyJdLCJuYW1lcyI6WyJkZWZpbml0aW9ucyIsImZyYW1lU2l6ZSIsInR5cGUiLCJkZWZhdWx0IiwibWV0YXMiLCJraW5kIiwiaG9wU2l6ZSIsIm51bGxhYmxlIiwiY2VudGVyZWRUaW1lVGFncyIsIlNsaWNlciIsIm9wdGlvbnMiLCJwYXJhbXMiLCJnZXQiLCJzZXQiLCJhZGRMaXN0ZW5lciIsIm9uUGFyYW1VcGRhdGUiLCJiaW5kIiwiZnJhbWVJbmRleCIsInByZXZTdHJlYW1QYXJhbXMiLCJwcmVwYXJlU3RyZWFtUGFyYW1zIiwic3RyZWFtUGFyYW1zIiwiZnJhbWVSYXRlIiwic291cmNlU2FtcGxlUmF0ZSIsInByb3BhZ2F0ZVN0cmVhbVBhcmFtcyIsImVuZFRpbWUiLCJkYXRhIiwiZnJhbWUiLCJ0aW1lIiwiaSIsInByb3BhZ2F0ZUZyYW1lIiwicHJlcGFyZUZyYW1lIiwicHJvY2Vzc0Z1bmN0aW9uIiwiYmxvY2siLCJtZXRhZGF0YSIsIm91dEZyYW1lIiwic2FtcGxlUmF0ZSIsInNhbXBsZVBlcmlvZCIsImJsb2NrU2l6ZSIsImxlbmd0aCIsImJsb2NrSW5kZXgiLCJudW1Ta2lwIiwibnVtQ29weSIsIm1heENvcHkiLCJjb3B5Iiwic3ViYXJyYXkiLCJibG9ja1Jlc3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFFQSxJQUFNQSxjQUFjO0FBQ2xCQyxhQUFXO0FBQ1RDLFVBQU0sU0FERztBQUVUQyxhQUFTLEdBRkE7QUFHVEMsV0FBTyxFQUFFQyxNQUFNLFFBQVI7QUFIRSxHQURPO0FBTWxCQyxXQUFTLEVBQUU7QUFDVEosVUFBTSxTQURDO0FBRVBDLGFBQVMsSUFGRjtBQUdQSSxjQUFVLElBSEg7QUFJUEgsV0FBTyxFQUFFQyxNQUFNLFFBQVI7QUFKQSxHQU5TO0FBWWxCRyxvQkFBa0I7QUFDaEJOLFVBQU0sU0FEVTtBQUVoQkMsYUFBUztBQUZPO0FBWkEsQ0FBcEI7O0FBa0JB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Q0Y7O0FBRUQsV0FBSzVCLFVBQUwsR0FBa0JBLFVBQWxCO0FBQ0Q7Ozs7O2tCQUdZUixNIiwiZmlsZSI6IlNsaWNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvQmFzZUxmbyc7XG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBmcmFtZVNpemU6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogNTEyLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdzdGF0aWMnIH0sXG4gIH0sXG4gIGhvcFNpemU6IHsgLy8gc2hvdWxkIGJlIG51bGxhYmxlXG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgbWV0YXM6IHsga2luZDogJ3N0YXRpYycgfSxcbiAgfSxcbiAgY2VudGVyZWRUaW1lVGFnczoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgfVxufVxuXG4vKipcbiAqIENoYW5nZSB0aGUgYGZyYW1lU2l6ZWAgYW5kIGBob3BTaXplYCBvZiBhIGBzaWduYWxgIGlucHV0IGFjY29yZGluZyB0b1xuICogdGhlIGdpdmVuIG9wdGlvbnMuXG4gKiBUaGlzIG9wZXJhdG9yIHVwZGF0ZXMgdGhlIHN0cmVhbSBwYXJhbWV0ZXJzIGFjY29yZGluZyB0byBpdHMgY29uZmlndXJhdGlvbi5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5vcGVyYXRvclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmZyYW1lU2l6ZT01MTJdIC0gRnJhbWUgc2l6ZSBvZiB0aGUgb3V0cHV0IHNpZ25hbC5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5ob3BTaXplPW51bGxdIC0gTnVtYmVyIG9mIHNhbXBsZXMgYmV0d2VlbiB0d29cbiAqICBjb25zZWN1dGl2ZSBmcmFtZXMuIElmIG51bGwsIGBob3BTaXplYCBpcyBzZXQgdG8gYGZyYW1lU2l6ZWAuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmNlbnRlcmVkVGltZVRhZ3NdIC0gTW92ZSB0aGUgdGltZSB0YWcgdG8gdGhlIG1pZGRsZVxuICogIG9mIHRoZSBmcmFtZS5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuICpcbiAqIGNvbnN0IGV2ZW50SW4gPSBuZXcgbGZvLnNvdXJjZS5FdmVudEluKHtcbiAqICAgZnJhbWVUeXBlOiAnc2lnbmFsJyxcbiAqICAgZnJhbWVTaXplOiAxMCxcbiAqICAgc2FtcGxlUmF0ZTogMixcbiAqIH0pO1xuICpcbiAqIGNvbnN0IHNsaWNlciA9IG5ldyBsZm8ub3BlcmF0b3IuU2xpY2VyKHtcbiAqICAgZnJhbWVTaXplOiA0LFxuICogICBob3BTaXplOiAyXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBsb2dnZXIgPSBuZXcgbGZvLnNpbmsuTG9nZ2VyKHsgdGltZTogdHJ1ZSwgZGF0YTogdHJ1ZSB9KTtcbiAqXG4gKiBldmVudEluLmNvbm5lY3Qoc2xpY2VyKTtcbiAqIHNsaWNlci5jb25uZWN0KGxvZ2dlcik7XG4gKiBldmVudEluLnN0YXJ0KCk7XG4gKlxuICogZXZlbnRJbi5wcm9jZXNzKDAsIFswLCAxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5XSk7XG4gKiA+IHsgdGltZTogMCwgZGF0YTogWzAsIDEsIDIsIDNdIH1cbiAqID4geyB0aW1lOiAxLCBkYXRhOiBbMiwgMywgNCwgNV0gfVxuICogPiB7IHRpbWU6IDIsIGRhdGE6IFs0LCA1LCA2LCA3XSB9XG4gKiA+IHsgdGltZTogMywgZGF0YTogWzYsIDcsIDgsIDldIH1cbiAqL1xuY2xhc3MgU2xpY2VyIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIGNvbnN0IGhvcFNpemUgPSB0aGlzLnBhcmFtcy5nZXQoJ2hvcFNpemUnKTtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnBhcmFtcy5nZXQoJ2ZyYW1lU2l6ZScpO1xuXG4gICAgaWYgKCFob3BTaXplKVxuICAgICAgdGhpcy5wYXJhbXMuc2V0KCdob3BTaXplJywgZnJhbWVTaXplKTtcblxuICAgIHRoaXMucGFyYW1zLmFkZExpc3RlbmVyKHRoaXMub25QYXJhbVVwZGF0ZS5iaW5kKHRoaXMpKTtcblxuICAgIHRoaXMuZnJhbWVJbmRleCA9IDA7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKSB7XG4gICAgdGhpcy5wcmVwYXJlU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuXG4gICAgY29uc3QgaG9wU2l6ZSA9IHRoaXMucGFyYW1zLmdldCgnaG9wU2l6ZScpO1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMucGFyYW1zLmdldCgnZnJhbWVTaXplJyk7XG5cbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSBmcmFtZVNpemU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVSYXRlID0gcHJldlN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlIC8gaG9wU2l6ZTtcblxuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcmVzZXRTdHJlYW0oKSB7XG4gICAgc3VwZXIucmVzZXRTdHJlYW0oKTtcbiAgICB0aGlzLmZyYW1lSW5kZXggPSAwO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGZpbmFsaXplU3RyZWFtKGVuZFRpbWUpIHtcbiAgICBpZiAodGhpcy5mcmFtZUluZGV4ID4gMCkge1xuICAgICAgY29uc3QgZnJhbWVSYXRlID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVSYXRlO1xuICAgICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgICAgY29uc3QgZGF0YSA9IHRoaXMuZnJhbWUuZGF0YTtcbiAgICAgIC8vIHNldCB0aGUgdGltZSBvZiB0aGUgbGFzdCBmcmFtZVxuICAgICAgdGhpcy5mcmFtZS50aW1lICs9ICgxIC8gZnJhbWVSYXRlKTtcblxuICAgICAgZm9yIChsZXQgaSA9IHRoaXMuZnJhbWVJbmRleDsgaSA8IGZyYW1lU2l6ZTsgaSsrKVxuICAgICAgICBkYXRhW2ldID0gMDtcblxuICAgICAgdGhpcy5wcm9wYWdhdGVGcmFtZSgpO1xuICAgIH1cblxuICAgIHN1cGVyLmZpbmFsaXplU3RyZWFtKGVuZFRpbWUpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NGcmFtZShmcmFtZSkge1xuICAgIHRoaXMucHJlcGFyZUZyYW1lKCk7XG4gICAgdGhpcy5wcm9jZXNzRnVuY3Rpb24oZnJhbWUpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTaWduYWwoZnJhbWUpIHtcbiAgICBjb25zdCB0aW1lID0gZnJhbWUudGltZTtcbiAgICBjb25zdCBibG9jayA9IGZyYW1lLmRhdGE7XG4gICAgY29uc3QgbWV0YWRhdGEgPSBmcmFtZS5tZXRhZGF0YTtcblxuICAgIGNvbnN0IGNlbnRlcmVkVGltZVRhZ3MgPSB0aGlzLnBhcmFtcy5nZXQoJ2NlbnRlcmVkVGltZVRhZ3MnKTtcbiAgICBjb25zdCBob3BTaXplID0gdGhpcy5wYXJhbXMuZ2V0KCdob3BTaXplJyk7XG4gICAgY29uc3Qgb3V0RnJhbWUgPSB0aGlzLmZyYW1lLmRhdGE7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIGNvbnN0IHNhbXBsZVJhdGUgPSB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlO1xuICAgIGNvbnN0IHNhbXBsZVBlcmlvZCA9IDEgLyBzYW1wbGVSYXRlO1xuICAgIGNvbnN0IGJsb2NrU2l6ZSA9IGJsb2NrLmxlbmd0aDtcblxuICAgIGxldCBmcmFtZUluZGV4ID0gdGhpcy5mcmFtZUluZGV4O1xuICAgIGxldCBibG9ja0luZGV4ID0gMDtcblxuICAgIHdoaWxlIChibG9ja0luZGV4IDwgYmxvY2tTaXplKSB7XG4gICAgICBsZXQgbnVtU2tpcCA9IDA7XG5cbiAgICAgIC8vIHNraXAgYmxvY2sgc2FtcGxlcyBmb3IgbmVnYXRpdmUgZnJhbWVJbmRleCAoZnJhbWVTaXplIDwgaG9wU2l6ZSlcbiAgICAgIGlmIChmcmFtZUluZGV4IDwgMCkge1xuICAgICAgICBudW1Ta2lwID0gLWZyYW1lSW5kZXg7XG4gICAgICAgIGZyYW1lSW5kZXggPSAwOyAvLyByZXNldCBgZnJhbWVJbmRleGBcbiAgICAgIH1cblxuICAgICAgaWYgKG51bVNraXAgPCBibG9ja1NpemUpIHtcbiAgICAgICAgYmxvY2tJbmRleCArPSBudW1Ta2lwOyAvLyBza2lwIGJsb2NrIHNlZ21lbnRcbiAgICAgICAgLy8gY2FuIGNvcHkgYWxsIHRoZSByZXN0IG9mIHRoZSBpbmNvbWluZyBibG9ja1xuICAgICAgICBsZXQgbnVtQ29weSA9IGJsb2NrU2l6ZSAtIGJsb2NrSW5kZXg7XG4gICAgICAgIC8vIGNvbm5vdCBjb3B5IG1vcmUgdGhhbiB3aGF0IGZpdHMgaW50byB0aGUgZnJhbWVcbiAgICAgICAgY29uc3QgbWF4Q29weSA9IGZyYW1lU2l6ZSAtIGZyYW1lSW5kZXg7XG5cbiAgICAgICAgaWYgKG51bUNvcHkgPj0gbWF4Q29weSlcbiAgICAgICAgICBudW1Db3B5ID0gbWF4Q29weTtcblxuICAgICAgICAvLyBjb3B5IGJsb2NrIHNlZ21lbnQgaW50byBmcmFtZVxuICAgICAgICBjb25zdCBjb3B5ID0gYmxvY2suc3ViYXJyYXkoYmxvY2tJbmRleCwgYmxvY2tJbmRleCArIG51bUNvcHkpO1xuICAgICAgICBvdXRGcmFtZS5zZXQoY29weSwgZnJhbWVJbmRleCk7XG4gICAgICAgIC8vIGFkdmFuY2UgYmxvY2sgYW5kIGZyYW1lIGluZGV4XG4gICAgICAgIGJsb2NrSW5kZXggKz0gbnVtQ29weTtcbiAgICAgICAgZnJhbWVJbmRleCArPSBudW1Db3B5O1xuXG4gICAgICAgIC8vIHNlbmQgZnJhbWUgd2hlbiBjb21wbGV0ZWRcbiAgICAgICAgaWYgKGZyYW1lSW5kZXggPT09IGZyYW1lU2l6ZSkge1xuICAgICAgICAgIC8vIGRlZmluZSB0aW1lIHRhZyBmb3IgdGhlIG91dEZyYW1lIGFjY29yZGluZyB0byBjb25maWd1cmF0aW9uXG4gICAgICAgICAgaWYgKGNlbnRlcmVkVGltZVRhZ3MpXG4gICAgICAgICAgICB0aGlzLmZyYW1lLnRpbWUgPSB0aW1lICsgKGJsb2NrSW5kZXggLSBmcmFtZVNpemUgLyAyKSAqIHNhbXBsZVBlcmlvZDtcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzLmZyYW1lLnRpbWUgPSB0aW1lICsgKGJsb2NrSW5kZXggLSBmcmFtZVNpemUpICogc2FtcGxlUGVyaW9kO1xuXG4gICAgICAgICAgdGhpcy5mcmFtZS5tZXRhZGF0YSA9IG1ldGFkYXRhO1xuICAgICAgICAgIC8vIGZvcndhcmQgdG8gbmV4dCBub2Rlc1xuICAgICAgICAgIHRoaXMucHJvcGFnYXRlRnJhbWUoKTtcblxuICAgICAgICAgIC8vIHNoaWZ0IGZyYW1lIGxlZnRcbiAgICAgICAgICBpZiAoaG9wU2l6ZSA8IGZyYW1lU2l6ZSlcbiAgICAgICAgICAgIG91dEZyYW1lLnNldChvdXRGcmFtZS5zdWJhcnJheShob3BTaXplLCBmcmFtZVNpemUpLCAwKTtcblxuICAgICAgICAgIGZyYW1lSW5kZXggLT0gaG9wU2l6ZTsgLy8gaG9wIGZvcndhcmRcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gc2tpcCBlbnRpcmUgYmxvY2tcbiAgICAgICAgY29uc3QgYmxvY2tSZXN0ID0gYmxvY2tTaXplIC0gYmxvY2tJbmRleDtcbiAgICAgICAgZnJhbWVJbmRleCArPSBibG9ja1Jlc3Q7XG4gICAgICAgIGJsb2NrSW5kZXggKz0gYmxvY2tSZXN0O1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuZnJhbWVJbmRleCA9IGZyYW1lSW5kZXg7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2xpY2VyO1xuIl19