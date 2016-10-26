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
        // set the time of the last frame
        this.frame.time += 1 / frameRate;
        this.frame.data.fill(0, this.frameIndex);
        this.propagateFrame();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNsaWNlci5qcyJdLCJuYW1lcyI6WyJkZWZpbml0aW9ucyIsImZyYW1lU2l6ZSIsInR5cGUiLCJkZWZhdWx0IiwibWV0YXMiLCJraW5kIiwiaG9wU2l6ZSIsIm51bGxhYmxlIiwiY2VudGVyZWRUaW1lVGFncyIsIlNsaWNlciIsIm9wdGlvbnMiLCJwYXJhbXMiLCJnZXQiLCJzZXQiLCJhZGRMaXN0ZW5lciIsIm9uUGFyYW1VcGRhdGUiLCJiaW5kIiwiZnJhbWVJbmRleCIsInByZXZTdHJlYW1QYXJhbXMiLCJwcmVwYXJlU3RyZWFtUGFyYW1zIiwic3RyZWFtUGFyYW1zIiwiZnJhbWVSYXRlIiwic291cmNlU2FtcGxlUmF0ZSIsInByb3BhZ2F0ZVN0cmVhbVBhcmFtcyIsImVuZFRpbWUiLCJmcmFtZSIsInRpbWUiLCJkYXRhIiwiZmlsbCIsInByb3BhZ2F0ZUZyYW1lIiwicHJlcGFyZUZyYW1lIiwicHJvY2Vzc0Z1bmN0aW9uIiwiYmxvY2siLCJtZXRhZGF0YSIsIm91dEZyYW1lIiwic2FtcGxlUmF0ZSIsInNhbXBsZVBlcmlvZCIsImJsb2NrU2l6ZSIsImxlbmd0aCIsImJsb2NrSW5kZXgiLCJudW1Ta2lwIiwibnVtQ29weSIsIm1heENvcHkiLCJjb3B5Iiwic3ViYXJyYXkiLCJibG9ja1Jlc3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFFQSxJQUFNQSxjQUFjO0FBQ2xCQyxhQUFXO0FBQ1RDLFVBQU0sU0FERztBQUVUQyxhQUFTLEdBRkE7QUFHVEMsV0FBTyxFQUFFQyxNQUFNLFFBQVI7QUFIRSxHQURPO0FBTWxCQyxXQUFTLEVBQUU7QUFDVEosVUFBTSxTQURDO0FBRVBDLGFBQVMsSUFGRjtBQUdQSSxjQUFVLElBSEg7QUFJUEgsV0FBTyxFQUFFQyxNQUFNLFFBQVI7QUFKQSxHQU5TO0FBWWxCRyxvQkFBa0I7QUFDaEJOLFVBQU0sU0FEVTtBQUVoQkMsYUFBUztBQUZPO0FBWkEsQ0FBcEI7O0FB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ICcuLi9jb3JlL0Jhc2VMZm8nO1xuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgZnJhbWVTaXplOiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDUxMixcbiAgICBtZXRhczogeyBraW5kOiAnc3RhdGljJyB9LFxuICB9LFxuICBob3BTaXplOiB7IC8vIHNob3VsZCBiZSBudWxsYWJsZVxuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdzdGF0aWMnIH0sXG4gIH0sXG4gIGNlbnRlcmVkVGltZVRhZ3M6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gIH1cbn1cblxuLyoqXG4gKiBDaGFuZ2UgdGhlIGBmcmFtZVNpemVgIGFuZCBgaG9wU2l6ZWAgb2YgYSBgc2lnbmFsYCBpbnB1dCBhY2NvcmRpbmcgdG9cbiAqIHRoZSBnaXZlbiBvcHRpb25zLlxuICogVGhpcyBvcGVyYXRvciB1cGRhdGVzIHRoZSBzdHJlYW0gcGFyYW1ldGVycyBhY2NvcmRpbmcgdG8gaXRzIGNvbmZpZ3VyYXRpb24uXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpjb21tb24ub3BlcmF0b3JcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHQgcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5mcmFtZVNpemU9NTEyXSAtIEZyYW1lIHNpemUgb2YgdGhlIG91dHB1dCBzaWduYWwuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuaG9wU2l6ZT1udWxsXSAtIE51bWJlciBvZiBzYW1wbGVzIGJldHdlZW4gdHdvXG4gKiAgY29uc2VjdXRpdmUgZnJhbWVzLiBJZiBudWxsLCBgaG9wU2l6ZWAgaXMgc2V0IHRvIGBmcmFtZVNpemVgLlxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5jZW50ZXJlZFRpbWVUYWdzXSAtIE1vdmUgdGhlIHRpbWUgdGFnIHRvIHRoZSBtaWRkbGVcbiAqICBvZiB0aGUgZnJhbWUuXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY2xpZW50JztcbiAqXG4gKiBjb25zdCBldmVudEluID0gbmV3IGxmby5zb3VyY2UuRXZlbnRJbih7XG4gKiAgIGZyYW1lVHlwZTogJ3NpZ25hbCcsXG4gKiAgIGZyYW1lU2l6ZTogMTAsXG4gKiAgIHNhbXBsZVJhdGU6IDIsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBzbGljZXIgPSBuZXcgbGZvLm9wZXJhdG9yLlNsaWNlcih7XG4gKiAgIGZyYW1lU2l6ZTogNCxcbiAqICAgaG9wU2l6ZTogMlxuICogfSk7XG4gKlxuICogY29uc3QgbG9nZ2VyID0gbmV3IGxmby5zaW5rLkxvZ2dlcih7IHRpbWU6IHRydWUsIGRhdGE6IHRydWUgfSk7XG4gKlxuICogZXZlbnRJbi5jb25uZWN0KHNsaWNlcik7XG4gKiBzbGljZXIuY29ubmVjdChsb2dnZXIpO1xuICogZXZlbnRJbi5zdGFydCgpO1xuICpcbiAqIGV2ZW50SW4ucHJvY2VzcygwLCBbMCwgMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOV0pO1xuICogPiB7IHRpbWU6IDAsIGRhdGE6IFswLCAxLCAyLCAzXSB9XG4gKiA+IHsgdGltZTogMSwgZGF0YTogWzIsIDMsIDQsIDVdIH1cbiAqID4geyB0aW1lOiAyLCBkYXRhOiBbNCwgNSwgNiwgN10gfVxuICogPiB7IHRpbWU6IDMsIGRhdGE6IFs2LCA3LCA4LCA5XSB9XG4gKi9cbmNsYXNzIFNsaWNlciBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICBjb25zdCBob3BTaXplID0gdGhpcy5wYXJhbXMuZ2V0KCdob3BTaXplJyk7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5wYXJhbXMuZ2V0KCdmcmFtZVNpemUnKTtcblxuICAgIGlmICghaG9wU2l6ZSlcbiAgICAgIHRoaXMucGFyYW1zLnNldCgnaG9wU2l6ZScsIGZyYW1lU2l6ZSk7XG5cbiAgICB0aGlzLnBhcmFtcy5hZGRMaXN0ZW5lcih0aGlzLm9uUGFyYW1VcGRhdGUuYmluZCh0aGlzKSk7XG5cbiAgICB0aGlzLmZyYW1lSW5kZXggPSAwO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcykge1xuICAgIHRoaXMucHJlcGFyZVN0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKTtcblxuICAgIGNvbnN0IGhvcFNpemUgPSB0aGlzLnBhcmFtcy5nZXQoJ2hvcFNpemUnKTtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnBhcmFtcy5nZXQoJ2ZyYW1lU2l6ZScpO1xuXG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gZnJhbWVTaXplO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lUmF0ZSA9IHByZXZTdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZSAvIGhvcFNpemU7XG5cbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHJlc2V0U3RyZWFtKCkge1xuICAgIHN1cGVyLnJlc2V0U3RyZWFtKCk7XG4gICAgdGhpcy5mcmFtZUluZGV4ID0gMDtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBmaW5hbGl6ZVN0cmVhbShlbmRUaW1lKSB7XG4gICAgaWYgKHRoaXMuZnJhbWVJbmRleCA+IDApIHtcbiAgICAgIGNvbnN0IGZyYW1lUmF0ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lUmF0ZTtcbiAgICAgIC8vIHNldCB0aGUgdGltZSBvZiB0aGUgbGFzdCBmcmFtZVxuICAgICAgdGhpcy5mcmFtZS50aW1lICs9ICgxIC8gZnJhbWVSYXRlKTtcbiAgICAgIHRoaXMuZnJhbWUuZGF0YS5maWxsKDAsIHRoaXMuZnJhbWVJbmRleCk7XG4gICAgICB0aGlzLnByb3BhZ2F0ZUZyYW1lKCk7XG4gICAgfVxuXG4gICAgc3VwZXIuZmluYWxpemVTdHJlYW0oZW5kVGltZSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc0ZyYW1lKGZyYW1lKSB7XG4gICAgdGhpcy5wcmVwYXJlRnJhbWUoKTtcbiAgICB0aGlzLnByb2Nlc3NGdW5jdGlvbihmcmFtZSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1NpZ25hbChmcmFtZSkge1xuICAgIGNvbnN0IHRpbWUgPSBmcmFtZS50aW1lO1xuICAgIGNvbnN0IGJsb2NrID0gZnJhbWUuZGF0YTtcbiAgICBjb25zdCBtZXRhZGF0YSA9IGZyYW1lLm1ldGFkYXRhO1xuXG4gICAgY29uc3QgY2VudGVyZWRUaW1lVGFncyA9IHRoaXMucGFyYW1zLmdldCgnY2VudGVyZWRUaW1lVGFncycpO1xuICAgIGNvbnN0IGhvcFNpemUgPSB0aGlzLnBhcmFtcy5nZXQoJ2hvcFNpemUnKTtcbiAgICBjb25zdCBvdXRGcmFtZSA9IHRoaXMuZnJhbWUuZGF0YTtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgY29uc3Qgc2FtcGxlUmF0ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGU7XG4gICAgY29uc3Qgc2FtcGxlUGVyaW9kID0gMSAvIHNhbXBsZVJhdGU7XG4gICAgY29uc3QgYmxvY2tTaXplID0gYmxvY2subGVuZ3RoO1xuXG4gICAgbGV0IGZyYW1lSW5kZXggPSB0aGlzLmZyYW1lSW5kZXg7XG4gICAgbGV0IGJsb2NrSW5kZXggPSAwO1xuXG4gICAgd2hpbGUgKGJsb2NrSW5kZXggPCBibG9ja1NpemUpIHtcbiAgICAgIGxldCBudW1Ta2lwID0gMDtcblxuICAgICAgLy8gc2tpcCBibG9jayBzYW1wbGVzIGZvciBuZWdhdGl2ZSBmcmFtZUluZGV4IChmcmFtZVNpemUgPCBob3BTaXplKVxuICAgICAgaWYgKGZyYW1lSW5kZXggPCAwKSB7XG4gICAgICAgIG51bVNraXAgPSAtZnJhbWVJbmRleDtcbiAgICAgICAgZnJhbWVJbmRleCA9IDA7IC8vIHJlc2V0IGBmcmFtZUluZGV4YFxuICAgICAgfVxuXG4gICAgICBpZiAobnVtU2tpcCA8IGJsb2NrU2l6ZSkge1xuICAgICAgICBibG9ja0luZGV4ICs9IG51bVNraXA7IC8vIHNraXAgYmxvY2sgc2VnbWVudFxuICAgICAgICAvLyBjYW4gY29weSBhbGwgdGhlIHJlc3Qgb2YgdGhlIGluY29taW5nIGJsb2NrXG4gICAgICAgIGxldCBudW1Db3B5ID0gYmxvY2tTaXplIC0gYmxvY2tJbmRleDtcbiAgICAgICAgLy8gY29ubm90IGNvcHkgbW9yZSB0aGFuIHdoYXQgZml0cyBpbnRvIHRoZSBmcmFtZVxuICAgICAgICBjb25zdCBtYXhDb3B5ID0gZnJhbWVTaXplIC0gZnJhbWVJbmRleDtcblxuICAgICAgICBpZiAobnVtQ29weSA+PSBtYXhDb3B5KVxuICAgICAgICAgIG51bUNvcHkgPSBtYXhDb3B5O1xuXG4gICAgICAgIC8vIGNvcHkgYmxvY2sgc2VnbWVudCBpbnRvIGZyYW1lXG4gICAgICAgIGNvbnN0IGNvcHkgPSBibG9jay5zdWJhcnJheShibG9ja0luZGV4LCBibG9ja0luZGV4ICsgbnVtQ29weSk7XG4gICAgICAgIG91dEZyYW1lLnNldChjb3B5LCBmcmFtZUluZGV4KTtcbiAgICAgICAgLy8gYWR2YW5jZSBibG9jayBhbmQgZnJhbWUgaW5kZXhcbiAgICAgICAgYmxvY2tJbmRleCArPSBudW1Db3B5O1xuICAgICAgICBmcmFtZUluZGV4ICs9IG51bUNvcHk7XG5cbiAgICAgICAgLy8gc2VuZCBmcmFtZSB3aGVuIGNvbXBsZXRlZFxuICAgICAgICBpZiAoZnJhbWVJbmRleCA9PT0gZnJhbWVTaXplKSB7XG4gICAgICAgICAgLy8gZGVmaW5lIHRpbWUgdGFnIGZvciB0aGUgb3V0RnJhbWUgYWNjb3JkaW5nIHRvIGNvbmZpZ3VyYXRpb25cbiAgICAgICAgICBpZiAoY2VudGVyZWRUaW1lVGFncylcbiAgICAgICAgICAgIHRoaXMuZnJhbWUudGltZSA9IHRpbWUgKyAoYmxvY2tJbmRleCAtIGZyYW1lU2l6ZSAvIDIpICogc2FtcGxlUGVyaW9kO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRoaXMuZnJhbWUudGltZSA9IHRpbWUgKyAoYmxvY2tJbmRleCAtIGZyYW1lU2l6ZSkgKiBzYW1wbGVQZXJpb2Q7XG5cbiAgICAgICAgICB0aGlzLmZyYW1lLm1ldGFkYXRhID0gbWV0YWRhdGE7XG4gICAgICAgICAgLy8gZm9yd2FyZCB0byBuZXh0IG5vZGVzXG4gICAgICAgICAgdGhpcy5wcm9wYWdhdGVGcmFtZSgpO1xuXG4gICAgICAgICAgLy8gc2hpZnQgZnJhbWUgbGVmdFxuICAgICAgICAgIGlmIChob3BTaXplIDwgZnJhbWVTaXplKVxuICAgICAgICAgICAgb3V0RnJhbWUuc2V0KG91dEZyYW1lLnN1YmFycmF5KGhvcFNpemUsIGZyYW1lU2l6ZSksIDApO1xuXG4gICAgICAgICAgZnJhbWVJbmRleCAtPSBob3BTaXplOyAvLyBob3AgZm9yd2FyZFxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBza2lwIGVudGlyZSBibG9ja1xuICAgICAgICBjb25zdCBibG9ja1Jlc3QgPSBibG9ja1NpemUgLSBibG9ja0luZGV4O1xuICAgICAgICBmcmFtZUluZGV4ICs9IGJsb2NrUmVzdDtcbiAgICAgICAgYmxvY2tJbmRleCArPSBibG9ja1Jlc3Q7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5mcmFtZUluZGV4ID0gZnJhbWVJbmRleDtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTbGljZXI7XG4iXX0=