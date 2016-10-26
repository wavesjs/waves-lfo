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

var _displayUtils = require('../../common/utils/display-utils');

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJwZkRpc3BsYXkuanMiXSwibmFtZXMiOlsiZGVmaW5pdGlvbnMiLCJyYWRpdXMiLCJ0eXBlIiwibWluIiwiZGVmYXVsdCIsIm1ldGFzIiwia2luZCIsImxpbmUiLCJjb2xvcnMiLCJCcGZEaXNwbGF5Iiwib3B0aW9ucyIsInByZXZGcmFtZSIsInBhcmFtcyIsImdldCIsInByZXZTdHJlYW1QYXJhbXMiLCJwcmVwYXJlU3RyZWFtUGFyYW1zIiwic2V0Iiwic3RyZWFtUGFyYW1zIiwiZnJhbWVTaXplIiwicHJvcGFnYXRlU3RyZWFtUGFyYW1zIiwiZnJhbWUiLCJmcmFtZVdpZHRoIiwicGl4ZWxzU2luY2VMYXN0RnJhbWUiLCJkcmF3TGluZSIsImN0eCIsImRhdGEiLCJwcmV2RGF0YSIsInNhdmUiLCJpIiwibCIsInBvc1kiLCJnZXRZUG9zaXRpb24iLCJjb2xvciIsInN0cm9rZVN0eWxlIiwiZmlsbFN0eWxlIiwibGFzdFBvc1kiLCJiZWdpblBhdGgiLCJtb3ZlVG8iLCJsaW5lVG8iLCJzdHJva2UiLCJjbG9zZVBhdGgiLCJhcmMiLCJNYXRoIiwiUEkiLCJmaWxsIiwicmVzdG9yZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBRUEsSUFBTUEsY0FBYztBQUNsQkMsVUFBUTtBQUNOQyxVQUFNLE9BREE7QUFFTkMsU0FBSyxDQUZDO0FBR05DLGFBQVMsQ0FISDtBQUlOQyxXQUFPLEVBQUVDLE1BQU0sU0FBUjtBQUpELEdBRFU7QUFPbEJDLFFBQU07QUFDSkwsVUFBTSxTQURGO0FBRUpFLGFBQVMsSUFGTDtBQUdKQyxXQUFPLEVBQUVDLE1BQU0sU0FBUjtBQUhILEdBUFk7QUFZbEJFLFVBQVE7QUFDTk4sVUFBTSxLQURBO0FBRU5FLGFBQVM7QUFGSDtBQVpVLENBQXBCOztBQW1CQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXlETUssVTs7O0FBQ0osc0JBQVlDLE9BQVosRUFBcUI7QUFBQTs7QUFBQSw4SUFDYlYsV0FEYSxFQUNBVSxPQURBOztBQUduQixVQUFLQyxTQUFMLEdBQWlCLElBQWpCO0FBSG1CO0FBSXBCOztBQUVEOzs7OzsyQ0FDdUI7QUFDckIsYUFBTyxLQUFLQyxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsUUFBaEIsQ0FBUDtBQUNEOztBQUVEOzs7O3dDQUNvQkMsZ0IsRUFBa0I7QUFDcEMsV0FBS0MsbUJBQUwsQ0FBeUJELGdCQUF6Qjs7QUFFQSxVQUFJLEtBQUtGLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixRQUFoQixNQUE4QixJQUFsQyxFQUNFLEtBQUtELE1BQUwsQ0FBWUksR0FBWixDQUFnQixRQUFoQixFQUEwQiw2QkFBVSxLQUFWLEVBQWlCLEtBQUtDLFlBQUwsQ0FBa0JDLFNBQW5DLENBQTFCOztBQUVGLFdBQUtDLHFCQUFMO0FBQ0Q7O0FBRUQ7Ozs7a0NBQ2NDLEssRUFBT0MsVSxFQUFZQyxvQixFQUFzQjtBQUNyRCxVQUFNZCxTQUFTLEtBQUtJLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixRQUFoQixDQUFmO0FBQ0EsVUFBTVosU0FBUyxLQUFLVyxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsUUFBaEIsQ0FBZjtBQUNBLFVBQU1VLFdBQVcsS0FBS1gsTUFBTCxDQUFZQyxHQUFaLENBQWdCLE1BQWhCLENBQWpCO0FBQ0EsVUFBTUssWUFBWSxLQUFLRCxZQUFMLENBQWtCQyxTQUFwQztBQUNBLFVBQU1NLE1BQU0sS0FBS0EsR0FBakI7QUFDQSxVQUFNQyxPQUFPTCxNQUFNSyxJQUFuQjtBQUNBLFVBQU1DLFdBQVcsS0FBS2YsU0FBTCxHQUFpQixLQUFLQSxTQUFMLENBQWVjLElBQWhDLEdBQXVDLElBQXhEOztBQUVBRCxVQUFJRyxJQUFKOztBQUVBLFdBQUssSUFBSUMsSUFBSSxDQUFSLEVBQVdDLElBQUlYLFNBQXBCLEVBQStCVSxJQUFJQyxDQUFuQyxFQUFzQ0QsR0FBdEMsRUFBMkM7QUFDekMsWUFBTUUsT0FBTyxLQUFLQyxZQUFMLENBQWtCTixLQUFLRyxDQUFMLENBQWxCLENBQWI7QUFDQSxZQUFNSSxRQUFReEIsT0FBT29CLENBQVAsQ0FBZDs7QUFFQUosWUFBSVMsV0FBSixHQUFrQkQsS0FBbEI7QUFDQVIsWUFBSVUsU0FBSixHQUFnQkYsS0FBaEI7O0FBRUEsWUFBSU4sWUFBWUgsUUFBaEIsRUFBMEI7QUFDeEIsY0FBTVksV0FBVyxLQUFLSixZQUFMLENBQWtCTCxTQUFTRSxDQUFULENBQWxCLENBQWpCO0FBQ0FKLGNBQUlZLFNBQUo7QUFDQVosY0FBSWEsTUFBSixDQUFXLENBQUNmLG9CQUFaLEVBQWtDYSxRQUFsQztBQUNBWCxjQUFJYyxNQUFKLENBQVcsQ0FBWCxFQUFjUixJQUFkO0FBQ0FOLGNBQUllLE1BQUo7QUFDQWYsY0FBSWdCLFNBQUo7QUFDRDs7QUFFRCxZQUFJdkMsU0FBUyxDQUFiLEVBQWdCO0FBQ2R1QixjQUFJWSxTQUFKO0FBQ0FaLGNBQUlpQixHQUFKLENBQVEsQ0FBUixFQUFXWCxJQUFYLEVBQWlCN0IsTUFBakIsRUFBeUIsQ0FBekIsRUFBNEJ5QyxLQUFLQyxFQUFMLEdBQVUsQ0FBdEMsRUFBeUMsS0FBekM7QUFDQW5CLGNBQUlvQixJQUFKO0FBQ0FwQixjQUFJZ0IsU0FBSjtBQUNEO0FBRUY7O0FBRURoQixVQUFJcUIsT0FBSjs7QUFFQSxXQUFLbEMsU0FBTCxHQUFpQlMsS0FBakI7QUFDRDs7Ozs7a0JBR1lYLFUiLCJmaWxlIjoiQnBmRGlzcGxheS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlRGlzcGxheSBmcm9tICcuL0Jhc2VEaXNwbGF5JztcbmltcG9ydCB7IGdldENvbG9ycyB9IGZyb20gJy4uLy4uL2NvbW1vbi91dGlscy9kaXNwbGF5LXV0aWxzJztcblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIHJhZGl1czoge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgbWluOiAwLFxuICAgIGRlZmF1bHQ6IDAsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH1cbiAgfSxcbiAgbGluZToge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9LFxuICB9LFxuICBjb2xvcnM6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICB9XG59XG5cblxuLyoqXG4gKiBCcmVha3BvaW50IEZ1bmN0aW9uLCBkaXNwbGF5IGEgc3RyZWFtIG9mIHR5cGUgYHZlY3RvcmAuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpjbGllbnQuc2lua1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9ycz1udWxsXSAtIEFycmF5IG9mIGNvbG9ycyBmb3IgZWFjaCBpbmRleCBvZiB0aGVcbiAqICB2ZWN0b3IuIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5yYWRpdXM9MF0gLSBSYWRpdXMgb2YgdGhlIGRvdCBhdCBlYWNoIHZhbHVlLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5saW5lPXRydWVdIC0gRGlzcGxheSBhIGxpbmUgYmV0d2VlbiBlYWNoIGNvbnNlY3V0aXZlXG4gKiAgdmFsdWVzIG9mIHRoZSB2ZWN0b3IuIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5taW49LTFdIC0gTWluaW11bSB2YWx1ZSByZXByZXNlbnRlZCBpbiB0aGUgY2FudmFzLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5tYXg9MV0gLSBNYXhpbXVtIHZhbHVlIHJlcHJlc2VudGVkIGluIHRoZSBjYW52YXMuXG4gKiAgX2R5bmFtaWMgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLndpZHRoPTMwMF0gLSBXaWR0aCBvZiB0aGUgY2FudmFzLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5oZWlnaHQ9MTUwXSAtIEhlaWdodCBvZiB0aGUgY2FudmFzLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7RWxlbWVudHxDU1NTZWxlY3Rvcn0gW29wdGlvbnMuY29udGFpbmVyPW51bGxdIC0gQ29udGFpbmVyIGVsZW1lbnRcbiAqICBpbiB3aGljaCB0byBpbnNlcnQgdGhlIGNhbnZhcy4gX2NvbnN0YW50IHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7RWxlbWVudHxDU1NTZWxlY3Rvcn0gW29wdGlvbnMuY2FudmFzPW51bGxdIC0gQ2FudmFzIGVsZW1lbnRcbiAqICBpbiB3aGljaCB0byBkcmF3LiBfY29uc3RhbnQgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmR1cmF0aW9uPTFdIC0gRHVyYXRpb24gKGluIHNlY29uZHMpIHJlcHJlc2VudGVkIGluXG4gKiAgdGhlIGNhbnZhcy4gX2R5bmFtaWMgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnJlZmVyZW5jZVRpbWU9bnVsbF0gLSBPcHRpb25uYWwgcmVmZXJlbmNlIHRpbWUgdGhlXG4gKiAgZGlzcGxheSBzaG91bGQgY29uc2lkZXJlciBhcyB0aGUgb3JpZ2luLiBJcyBvbmx5IHVzZWZ1bGwgd2hlbiBzeW5jaHJvbml6aW5nXG4gKiAgc2V2ZXJhbCBkaXNwbGF5IHVzaW5nIHRoZSBgRGlzcGxheVN5bmNgIGNsYXNzLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NsaWVudCc7XG4gKlxuICogY29uc3QgZXZlbnRJbiA9IG5ldyBsZm8uc291cmNlLkV2ZW50SW4oe1xuICogICBmcmFtZVNpemU6IDIsXG4gKiAgIGZyYW1lUmF0ZTogMC4xLFxuICogICBmcmFtZVR5cGU6ICd2ZWN0b3InXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBicGYgPSBuZXcgbGZvLnNpbmsuQnBmRGlzcGxheSh7XG4gKiAgIGNhbnZhczogJyNicGYnLFxuICogICBkdXJhdGlvbjogMTAsXG4gKiB9KTtcbiAqXG4gKiBldmVudEluLmNvbm5lY3QoYnBmKTtcbiAqIGV2ZW50SW4uc3RhcnQoKTtcbiAqXG4gKiBsZXQgdGltZSA9IDA7XG4gKiBjb25zdCBkdCA9IDAuMTtcbiAqXG4gKiAoZnVuY3Rpb24gZ2VuZXJhdGVEYXRhKCkge1xuICogICBldmVudEluLnByb2Nlc3ModGltZSwgW01hdGgucmFuZG9tKCkgKiAyIC0gMSwgTWF0aC5yYW5kb20oKSAqIDIgLSAxXSk7XG4gKiAgIHRpbWUgKz0gZHQ7XG4gKlxuICogICBzZXRUaW1lb3V0KGdlbmVyYXRlRGF0YSwgZHQgKiAxMDAwKTtcbiAqIH0oKSk7XG4gKi9cbmNsYXNzIEJwZkRpc3BsYXkgZXh0ZW5kcyBCYXNlRGlzcGxheSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLnByZXZGcmFtZSA9IG51bGw7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgZ2V0TWluaW11bUZyYW1lV2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1zLmdldCgncmFkaXVzJyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKSB7XG4gICAgdGhpcy5wcmVwYXJlU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLmdldCgnY29sb3JzJykgPT09IG51bGwpXG4gICAgICB0aGlzLnBhcmFtcy5zZXQoJ2NvbG9ycycsIGdldENvbG9ycygnYnBmJywgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplKSk7XG5cbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NWZWN0b3IoZnJhbWUsIGZyYW1lV2lkdGgsIHBpeGVsc1NpbmNlTGFzdEZyYW1lKSB7XG4gICAgY29uc3QgY29sb3JzID0gdGhpcy5wYXJhbXMuZ2V0KCdjb2xvcnMnKTtcbiAgICBjb25zdCByYWRpdXMgPSB0aGlzLnBhcmFtcy5nZXQoJ3JhZGl1cycpO1xuICAgIGNvbnN0IGRyYXdMaW5lID0gdGhpcy5wYXJhbXMuZ2V0KCdsaW5lJyk7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4O1xuICAgIGNvbnN0IGRhdGEgPSBmcmFtZS5kYXRhO1xuICAgIGNvbnN0IHByZXZEYXRhID0gdGhpcy5wcmV2RnJhbWUgPyB0aGlzLnByZXZGcmFtZS5kYXRhIDogbnVsbDtcblxuICAgIGN0eC5zYXZlKCk7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IGZyYW1lU2l6ZTsgaSA8IGw7IGkrKykge1xuICAgICAgY29uc3QgcG9zWSA9IHRoaXMuZ2V0WVBvc2l0aW9uKGRhdGFbaV0pO1xuICAgICAgY29uc3QgY29sb3IgPSBjb2xvcnNbaV07XG5cbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGNvbG9yO1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuXG4gICAgICBpZiAocHJldkRhdGEgJiYgZHJhd0xpbmUpIHtcbiAgICAgICAgY29uc3QgbGFzdFBvc1kgPSB0aGlzLmdldFlQb3NpdGlvbihwcmV2RGF0YVtpXSk7XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4Lm1vdmVUbygtcGl4ZWxzU2luY2VMYXN0RnJhbWUsIGxhc3RQb3NZKTtcbiAgICAgICAgY3R4LmxpbmVUbygwLCBwb3NZKTtcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChyYWRpdXMgPiAwKSB7XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4LmFyYygwLCBwb3NZLCByYWRpdXMsIDAsIE1hdGguUEkgKiAyLCBmYWxzZSk7XG4gICAgICAgIGN0eC5maWxsKCk7XG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgICB0aGlzLnByZXZGcmFtZSA9IGZyYW1lO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJwZkRpc3BsYXk7XG4iXX0=