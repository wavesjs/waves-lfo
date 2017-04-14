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

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _BaseDisplay2 = require('./BaseDisplay');

var _BaseDisplay3 = _interopRequireDefault(_BaseDisplay2);

var _displayUtils = require('../utils/display-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var definitions = {
  radius: {
    type: 'float',
    min: 0,
    default: 0,
    metas: { kind: 'dynamic' }
  },
  line: {
    type: 'boolean',
    default: true,
    metas: { kind: 'dynamic' }
  },
  colors: {
    type: 'any',
    default: null
  }
};

/**
 * Breakpoint Function, display a stream of type `vector`.
 *
 * @memberof module:client.sink
 *
 * @param {Object} options - Override default parameters.
 * @param {String} [options.colors=null] - Array of colors for each index of the
 *  vector. _dynamic parameter_
 * @param {String} [options.radius=0] - Radius of the dot at each value.
 *  _dynamic parameter_
 * @param {String} [options.line=true] - Display a line between each consecutive
 *  values of the vector. _dynamic parameter_
 * @param {Number} [options.min=-1] - Minimum value represented in the canvas.
 *  _dynamic parameter_
 * @param {Number} [options.max=1] - Maximum value represented in the canvas.
 *  _dynamic parameter_
 * @param {Number} [options.width=300] - Width of the canvas.
 *  _dynamic parameter_
 * @param {Number} [options.height=150] - Height of the canvas.
 *  _dynamic parameter_
 * @param {Element|CSSSelector} [options.container=null] - Container element
 *  in which to insert the canvas. _constant parameter_
 * @param {Element|CSSSelector} [options.canvas=null] - Canvas element
 *  in which to draw. _constant parameter_
 * @param {Number} [options.duration=1] - Duration (in seconds) represented in
 *  the canvas. _dynamic parameter_
 * @param {Number} [options.referenceTime=null] - Optionnal reference time the
 *  display should considerer as the origin. Is only usefull when synchronizing
 *  several display using the `DisplaySync` class.
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * const eventIn = new lfo.source.EventIn({
 *   frameSize: 2,
 *   frameRate: 0.1,
 *   frameType: 'vector'
 * });
 *
 * const bpf = new lfo.sink.BpfDisplay({
 *   canvas: '#bpf',
 *   duration: 10,
 * });
 *
 * eventIn.connect(bpf);
 * eventIn.start();
 *
 * let time = 0;
 * const dt = 0.1;
 *
 * (function generateData() {
 *   eventIn.process(time, [Math.random() * 2 - 1, Math.random() * 2 - 1]);
 *   time += dt;
 *
 *   setTimeout(generateData, dt * 1000);
 * }());
 */

var BpfDisplay = function (_BaseDisplay) {
  (0, _inherits3.default)(BpfDisplay, _BaseDisplay);

  function BpfDisplay(options) {
    (0, _classCallCheck3.default)(this, BpfDisplay);

    var _this = (0, _possibleConstructorReturn3.default)(this, (BpfDisplay.__proto__ || (0, _getPrototypeOf2.default)(BpfDisplay)).call(this, definitions, options));

    _this.prevFrame = null;
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(BpfDisplay, [{
    key: 'getMinimumFrameWidth',
    value: function getMinimumFrameWidth() {
      return this.params.get('radius');
    }

    /** @private */

  }, {
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      this.prepareStreamParams(prevStreamParams);

      if (this.params.get('colors') === null) this.params.set('colors', (0, _displayUtils.getColors)('bpf', this.streamParams.frameSize));

      this.propagateStreamParams();
    }

    /** @private */

  }, {
    key: 'processVector',
    value: function processVector(frame, frameWidth, pixelsSinceLastFrame) {
      var colors = this.params.get('colors');
      var radius = this.params.get('radius');
      var drawLine = this.params.get('line');
      var frameSize = this.streamParams.frameSize;
      var ctx = this.ctx;
      var data = frame.data;
      var prevData = this.prevFrame ? this.prevFrame.data : null;

      ctx.save();

      for (var i = 0, l = frameSize; i < l; i++) {
        var posY = this.getYPosition(data[i]);
        var color = colors[i];

        ctx.strokeStyle = color;
        ctx.fillStyle = color;

        if (prevData && drawLine) {
          var lastPosY = this.getYPosition(prevData[i]);
          ctx.beginPath();
          ctx.moveTo(-pixelsSinceLastFrame, lastPosY);
          ctx.lineTo(0, posY);
          ctx.stroke();
          ctx.closePath();
        }

        if (radius > 0) {
          ctx.beginPath();
          ctx.arc(0, posY, radius, 0, Math.PI * 2, false);
          ctx.fill();
          ctx.closePath();
        }
      }

      ctx.restore();

      this.prevFrame = frame;
    }
  }]);
  return BpfDisplay;
}(_BaseDisplay3.default);

exports.default = BpfDisplay;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJwZkRpc3BsYXkuanMiXSwibmFtZXMiOlsiZGVmaW5pdGlvbnMiLCJyYWRpdXMiLCJ0eXBlIiwibWluIiwiZGVmYXVsdCIsIm1ldGFzIiwia2luZCIsImxpbmUiLCJjb2xvcnMiLCJCcGZEaXNwbGF5Iiwib3B0aW9ucyIsInByZXZGcmFtZSIsInBhcmFtcyIsImdldCIsInByZXZTdHJlYW1QYXJhbXMiLCJwcmVwYXJlU3RyZWFtUGFyYW1zIiwic2V0Iiwic3RyZWFtUGFyYW1zIiwiZnJhbWVTaXplIiwicHJvcGFnYXRlU3RyZWFtUGFyYW1zIiwiZnJhbWUiLCJmcmFtZVdpZHRoIiwicGl4ZWxzU2luY2VMYXN0RnJhbWUiLCJkcmF3TGluZSIsImN0eCIsImRhdGEiLCJwcmV2RGF0YSIsInNhdmUiLCJpIiwibCIsInBvc1kiLCJnZXRZUG9zaXRpb24iLCJjb2xvciIsInN0cm9rZVN0eWxlIiwiZmlsbFN0eWxlIiwibGFzdFBvc1kiLCJiZWdpblBhdGgiLCJtb3ZlVG8iLCJsaW5lVG8iLCJzdHJva2UiLCJjbG9zZVBhdGgiLCJhcmMiLCJNYXRoIiwiUEkiLCJmaWxsIiwicmVzdG9yZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBRUEsSUFBTUEsY0FBYztBQUNsQkMsVUFBUTtBQUNOQyxVQUFNLE9BREE7QUFFTkMsU0FBSyxDQUZDO0FBR05DLGFBQVMsQ0FISDtBQUlOQyxXQUFPLEVBQUVDLE1BQU0sU0FBUjtBQUpELEdBRFU7QUFPbEJDLFFBQU07QUFDSkwsVUFBTSxTQURGO0FBRUpFLGFBQVMsSUFGTDtBQUdKQyxXQUFPLEVBQUVDLE1BQU0sU0FBUjtBQUhILEdBUFk7QUFZbEJFLFVBQVE7QUFDTk4sVUFBTSxLQURBO0FBRU5FLGFBQVM7QUFGSDtBQVpVLENBQXBCOztBQW1CQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXlETUssVTs7O0FBQ0osc0JBQVlDLE9BQVosRUFBcUI7QUFBQTs7QUFBQSw4SUFDYlYsV0FEYSxFQUNBVSxPQURBOztBQUduQixVQUFLQyxTQUFMLEdBQWlCLElBQWpCO0FBSG1CO0FBSXBCOztBQUVEOzs7OzsyQ0FDdUI7QUFDckIsYUFBTyxLQUFLQyxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsUUFBaEIsQ0FBUDtBQUNEOztBQUVEOzs7O3dDQUNvQkMsZ0IsRUFBa0I7QUFDcEMsV0FBS0MsbUJBQUwsQ0FBeUJELGdCQUF6Qjs7QUFFQSxVQUFJLEtBQUtGLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixRQUFoQixNQUE4QixJQUFsQyxFQUNFLEtBQUtELE1BQUwsQ0FBWUksR0FBWixDQUFnQixRQUFoQixFQUEwQiw2QkFBVSxLQUFWLEVBQWlCLEtBQUtDLFlBQUwsQ0FBa0JDLFNBQW5DLENBQTFCOztBQUVGLFdBQUtDLHFCQUFMO0FBQ0Q7O0FBRUQ7Ozs7a0NBQ2NDLEssRUFBT0MsVSxFQUFZQyxvQixFQUFzQjtBQUNyRCxVQUFNZCxTQUFTLEtBQUtJLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixRQUFoQixDQUFmO0FBQ0EsVUFBTVosU0FBUyxLQUFLVyxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsUUFBaEIsQ0FBZjtBQUNBLFVBQU1VLFdBQVcsS0FBS1gsTUFBTCxDQUFZQyxHQUFaLENBQWdCLE1BQWhCLENBQWpCO0FBQ0EsVUFBTUssWUFBWSxLQUFLRCxZQUFMLENBQWtCQyxTQUFwQztBQUNBLFVBQU1NLE1BQU0sS0FBS0EsR0FBakI7QUFDQSxVQUFNQyxPQUFPTCxNQUFNSyxJQUFuQjtBQUNBLFVBQU1DLFdBQVcsS0FBS2YsU0FBTCxHQUFpQixLQUFLQSxTQUFMLENBQWVjLElBQWhDLEdBQXVDLElBQXhEOztBQUVBRCxVQUFJRyxJQUFKOztBQUVBLFdBQUssSUFBSUMsSUFBSSxDQUFSLEVBQVdDLElBQUlYLFNBQXBCLEVBQStCVSxJQUFJQyxDQUFuQyxFQUFzQ0QsR0FBdEMsRUFBMkM7QUFDekMsWUFBTUUsT0FBTyxLQUFLQyxZQUFMLENBQWtCTixLQUFLRyxDQUFMLENBQWxCLENBQWI7QUFDQSxZQUFNSSxRQUFReEIsT0FBT29CLENBQVAsQ0FBZDs7QUFFQUosWUFBSVMsV0FBSixHQUFrQkQsS0FBbEI7QUFDQVIsWUFBSVUsU0FBSixHQUFnQkYsS0FBaEI7O0FBRUEsWUFBSU4sWUFBWUgsUUFBaEIsRUFBMEI7QUFDeEIsY0FBTVksV0FBVyxLQUFLSixZQUFMLENBQWtCTCxTQUFTRSxDQUFULENBQWxCLENBQWpCO0FBQ0FKLGNBQUlZLFNBQUo7QUFDQVosY0FBSWEsTUFBSixDQUFXLENBQUNmLG9CQUFaLEVBQWtDYSxRQUFsQztBQUNBWCxjQUFJYyxNQUFKLENBQVcsQ0FBWCxFQUFjUixJQUFkO0FBQ0FOLGNBQUllLE1BQUo7QUFDQWYsY0FBSWdCLFNBQUo7QUFDRDs7QUFFRCxZQUFJdkMsU0FBUyxDQUFiLEVBQWdCO0FBQ2R1QixjQUFJWSxTQUFKO0FBQ0FaLGNBQUlpQixHQUFKLENBQVEsQ0FBUixFQUFXWCxJQUFYLEVBQWlCN0IsTUFBakIsRUFBeUIsQ0FBekIsRUFBNEJ5QyxLQUFLQyxFQUFMLEdBQVUsQ0FBdEMsRUFBeUMsS0FBekM7QUFDQW5CLGNBQUlvQixJQUFKO0FBQ0FwQixjQUFJZ0IsU0FBSjtBQUNEO0FBRUY7O0FBRURoQixVQUFJcUIsT0FBSjs7QUFFQSxXQUFLbEMsU0FBTCxHQUFpQlMsS0FBakI7QUFDRDs7Ozs7a0JBR1lYLFUiLCJmaWxlIjoiQnBmRGlzcGxheS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlRGlzcGxheSBmcm9tICcuL0Jhc2VEaXNwbGF5JztcbmltcG9ydCB7IGdldENvbG9ycyB9IGZyb20gJy4uL3V0aWxzL2Rpc3BsYXktdXRpbHMnO1xuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgcmFkaXVzOiB7XG4gICAgdHlwZTogJ2Zsb2F0JyxcbiAgICBtaW46IDAsXG4gICAgZGVmYXVsdDogMCxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfVxuICB9LFxuICBsaW5lOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH0sXG4gIH0sXG4gIGNvbG9yczoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gIH1cbn1cblxuXG4vKipcbiAqIEJyZWFrcG9pbnQgRnVuY3Rpb24sIGRpc3BsYXkgYSBzdHJlYW0gb2YgdHlwZSBgdmVjdG9yYC5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNsaWVudC5zaW5rXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBkZWZhdWx0IHBhcmFtZXRlcnMuXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuY29sb3JzPW51bGxdIC0gQXJyYXkgb2YgY29sb3JzIGZvciBlYWNoIGluZGV4IG9mIHRoZVxuICogIHZlY3Rvci4gX2R5bmFtaWMgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLnJhZGl1cz0wXSAtIFJhZGl1cyBvZiB0aGUgZG90IGF0IGVhY2ggdmFsdWUuXG4gKiAgX2R5bmFtaWMgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmxpbmU9dHJ1ZV0gLSBEaXNwbGF5IGEgbGluZSBiZXR3ZWVuIGVhY2ggY29uc2VjdXRpdmVcbiAqICB2YWx1ZXMgb2YgdGhlIHZlY3Rvci4gX2R5bmFtaWMgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLm1pbj0tMV0gLSBNaW5pbXVtIHZhbHVlIHJlcHJlc2VudGVkIGluIHRoZSBjYW52YXMuXG4gKiAgX2R5bmFtaWMgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLm1heD0xXSAtIE1heGltdW0gdmFsdWUgcmVwcmVzZW50ZWQgaW4gdGhlIGNhbnZhcy5cbiAqICBfZHluYW1pYyBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMud2lkdGg9MzAwXSAtIFdpZHRoIG9mIHRoZSBjYW52YXMuXG4gKiAgX2R5bmFtaWMgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmhlaWdodD0xNTBdIC0gSGVpZ2h0IG9mIHRoZSBjYW52YXMuXG4gKiAgX2R5bmFtaWMgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtFbGVtZW50fENTU1NlbGVjdG9yfSBbb3B0aW9ucy5jb250YWluZXI9bnVsbF0gLSBDb250YWluZXIgZWxlbWVudFxuICogIGluIHdoaWNoIHRvIGluc2VydCB0aGUgY2FudmFzLiBfY29uc3RhbnQgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtFbGVtZW50fENTU1NlbGVjdG9yfSBbb3B0aW9ucy5jYW52YXM9bnVsbF0gLSBDYW52YXMgZWxlbWVudFxuICogIGluIHdoaWNoIHRvIGRyYXcuIF9jb25zdGFudCBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuZHVyYXRpb249MV0gLSBEdXJhdGlvbiAoaW4gc2Vjb25kcykgcmVwcmVzZW50ZWQgaW5cbiAqICB0aGUgY2FudmFzLiBfZHluYW1pYyBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMucmVmZXJlbmNlVGltZT1udWxsXSAtIE9wdGlvbm5hbCByZWZlcmVuY2UgdGltZSB0aGVcbiAqICBkaXNwbGF5IHNob3VsZCBjb25zaWRlcmVyIGFzIHRoZSBvcmlnaW4uIElzIG9ubHkgdXNlZnVsbCB3aGVuIHN5bmNocm9uaXppbmdcbiAqICBzZXZlcmFsIGRpc3BsYXkgdXNpbmcgdGhlIGBEaXNwbGF5U3luY2AgY2xhc3MuXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY2xpZW50JztcbiAqXG4gKiBjb25zdCBldmVudEluID0gbmV3IGxmby5zb3VyY2UuRXZlbnRJbih7XG4gKiAgIGZyYW1lU2l6ZTogMixcbiAqICAgZnJhbWVSYXRlOiAwLjEsXG4gKiAgIGZyYW1lVHlwZTogJ3ZlY3RvcidcbiAqIH0pO1xuICpcbiAqIGNvbnN0IGJwZiA9IG5ldyBsZm8uc2luay5CcGZEaXNwbGF5KHtcbiAqICAgY2FudmFzOiAnI2JwZicsXG4gKiAgIGR1cmF0aW9uOiAxMCxcbiAqIH0pO1xuICpcbiAqIGV2ZW50SW4uY29ubmVjdChicGYpO1xuICogZXZlbnRJbi5zdGFydCgpO1xuICpcbiAqIGxldCB0aW1lID0gMDtcbiAqIGNvbnN0IGR0ID0gMC4xO1xuICpcbiAqIChmdW5jdGlvbiBnZW5lcmF0ZURhdGEoKSB7XG4gKiAgIGV2ZW50SW4ucHJvY2Vzcyh0aW1lLCBbTWF0aC5yYW5kb20oKSAqIDIgLSAxLCBNYXRoLnJhbmRvbSgpICogMiAtIDFdKTtcbiAqICAgdGltZSArPSBkdDtcbiAqXG4gKiAgIHNldFRpbWVvdXQoZ2VuZXJhdGVEYXRhLCBkdCAqIDEwMDApO1xuICogfSgpKTtcbiAqL1xuY2xhc3MgQnBmRGlzcGxheSBleHRlbmRzIEJhc2VEaXNwbGF5IHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMucHJldkZyYW1lID0gbnVsbDtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBnZXRNaW5pbXVtRnJhbWVXaWR0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJhbXMuZ2V0KCdyYWRpdXMnKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpIHtcbiAgICB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG5cbiAgICBpZiAodGhpcy5wYXJhbXMuZ2V0KCdjb2xvcnMnKSA9PT0gbnVsbClcbiAgICAgIHRoaXMucGFyYW1zLnNldCgnY29sb3JzJywgZ2V0Q29sb3JzKCdicGYnLCB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUpKTtcblxuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1ZlY3RvcihmcmFtZSwgZnJhbWVXaWR0aCwgcGl4ZWxzU2luY2VMYXN0RnJhbWUpIHtcbiAgICBjb25zdCBjb2xvcnMgPSB0aGlzLnBhcmFtcy5nZXQoJ2NvbG9ycycpO1xuICAgIGNvbnN0IHJhZGl1cyA9IHRoaXMucGFyYW1zLmdldCgncmFkaXVzJyk7XG4gICAgY29uc3QgZHJhd0xpbmUgPSB0aGlzLnBhcmFtcy5nZXQoJ2xpbmUnKTtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHg7XG4gICAgY29uc3QgZGF0YSA9IGZyYW1lLmRhdGE7XG4gICAgY29uc3QgcHJldkRhdGEgPSB0aGlzLnByZXZGcmFtZSA/IHRoaXMucHJldkZyYW1lLmRhdGEgOiBudWxsO1xuXG4gICAgY3R4LnNhdmUoKTtcblxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gZnJhbWVTaXplOyBpIDwgbDsgaSsrKSB7XG4gICAgICBjb25zdCBwb3NZID0gdGhpcy5nZXRZUG9zaXRpb24oZGF0YVtpXSk7XG4gICAgICBjb25zdCBjb2xvciA9IGNvbG9yc1tpXTtcblxuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gY29sb3I7XG4gICAgICBjdHguZmlsbFN0eWxlID0gY29sb3I7XG5cbiAgICAgIGlmIChwcmV2RGF0YSAmJiBkcmF3TGluZSkge1xuICAgICAgICBjb25zdCBsYXN0UG9zWSA9IHRoaXMuZ2V0WVBvc2l0aW9uKHByZXZEYXRhW2ldKTtcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBjdHgubW92ZVRvKC1waXhlbHNTaW5jZUxhc3RGcmFtZSwgbGFzdFBvc1kpO1xuICAgICAgICBjdHgubGluZVRvKDAsIHBvc1kpO1xuICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJhZGl1cyA+IDApIHtcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBjdHguYXJjKDAsIHBvc1ksIHJhZGl1cywgMCwgTWF0aC5QSSAqIDIsIGZhbHNlKTtcbiAgICAgICAgY3R4LmZpbGwoKTtcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgICAgfVxuXG4gICAgfVxuXG4gICAgY3R4LnJlc3RvcmUoKTtcblxuICAgIHRoaXMucHJldkZyYW1lID0gZnJhbWU7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQnBmRGlzcGxheTtcbiJdfQ==