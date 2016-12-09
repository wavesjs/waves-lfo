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
  color: {
    type: 'string',
    default: (0, _displayUtils.getColors)('trace'),
    metas: { kind: 'dynamic' }
  },
  colorScheme: {
    type: 'enum',
    default: 'none',
    list: ['none', 'hue', 'opacity']
  }
};

/**
 * Display a range value around a mean value (for example mean
 * and standart deviation).
 *
 * This sink can handle input of type `vector` of frameSize >= 2.
 *
 * @param {Object} options - Override default parameters.
 * @param {String} [options.color='orange'] - Color.
 * @param {String} [options.colorScheme='none'] - If a third value is available
 *  in the input, can be used to control the opacity or the hue. If input frame
 *  size is 2, this param is automatically set to `none`
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
 * @memberof module:client.sink
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * const AudioContext = (window.AudioContext || window.webkitAudioContext);
 * const audioContext = new AudioContext();
 *
 * navigator.mediaDevices
 *   .getUserMedia({ audio: true })
 *   .then(init)
 *   .catch((err) => console.error(err.stack));
 *
 * function init(stream) {
 *   const source = audioContext.createMediaStreamSource(stream);
 *
 *   const audioInNode = new lfo.source.AudioInNode({
 *     sourceNode: source,
 *     audioContext: audioContext,
 *   });
 *
 *   // not sure it make sens but...
 *   const meanStddev = new lfo.operator.MeanStddev();
 *
 *   const traceDisplay = new lfo.sink.TraceDisplay({
 *     canvas: '#trace',
 *   });
 *
 *   const logger = new lfo.sink.Logger({ data: true });
 *
 *   audioInNode.connect(meanStddev);
 *   meanStddev.connect(traceDisplay);
 *
 *   audioInNode.start();
 * }
 */

var TraceDisplay = function (_BaseDisplay) {
  (0, _inherits3.default)(TraceDisplay, _BaseDisplay);

  function TraceDisplay() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, TraceDisplay);

    var _this = (0, _possibleConstructorReturn3.default)(this, (TraceDisplay.__proto__ || (0, _getPrototypeOf2.default)(TraceDisplay)).call(this, definitions, options));

    _this.prevFrame = null;
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(TraceDisplay, [{
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      this.prepareStreamParams(prevStreamParams);

      if (this.streamParams.frameSize === 2) this.params.set('colorScheme', 'none');

      this.propagateStreamParams();
    }

    /** @private */

  }, {
    key: 'processVector',
    value: function processVector(frame, frameWidth, pixelsSinceLastFrame) {
      var colorScheme = this.params.get('colorScheme');
      var ctx = this.ctx;
      var prevData = this.prevFrame ? this.prevFrame.data : null;
      var data = frame.data;

      var halfRange = data[1] / 2;
      var mean = this.getYPosition(data[0]);
      var min = this.getYPosition(data[0] - halfRange);
      var max = this.getYPosition(data[0] + halfRange);

      var prevHalfRange = void 0;
      var prevMean = void 0;
      var prevMin = void 0;
      var prevMax = void 0;

      if (prevData !== null) {
        prevHalfRange = prevData[1] / 2;
        prevMean = this.getYPosition(prevData[0]);
        prevMin = this.getYPosition(prevData[0] - prevHalfRange);
        prevMax = this.getYPosition(prevData[0] + prevHalfRange);
      }

      var color = this.params.get('color');
      var gradient = void 0;
      var rgb = void 0;

      switch (colorScheme) {
        case 'none':
          rgb = (0, _displayUtils.hexToRGB)(color);
          ctx.fillStyle = 'rgba(' + rgb.join(',') + ', 0.7)';
          ctx.strokeStyle = color;
          break;
        case 'hue':
          gradient = ctx.createLinearGradient(-pixelsSinceLastFrame, 0, 0, 0);

          if (prevData) gradient.addColorStop(0, 'hsl(' + (0, _displayUtils.getHue)(prevData[2]) + ', 100%, 50%)');else gradient.addColorStop(0, 'hsl(' + (0, _displayUtils.getHue)(data[2]) + ', 100%, 50%)');

          gradient.addColorStop(1, 'hsl(' + (0, _displayUtils.getHue)(data[2]) + ', 100%, 50%)');
          ctx.fillStyle = gradient;
          break;
        case 'opacity':
          rgb = (0, _displayUtils.hexToRGB)(this.params.get('color'));
          gradient = ctx.createLinearGradient(-pixelsSinceLastFrame, 0, 0, 0);

          if (prevData) gradient.addColorStop(0, 'rgba(' + rgb.join(',') + ', ' + prevData[2] + ')');else gradient.addColorStop(0, 'rgba(' + rgb.join(',') + ', ' + data[2] + ')');

          gradient.addColorStop(1, 'rgba(' + rgb.join(',') + ', ' + data[2] + ')');
          ctx.fillStyle = gradient;
          break;
      }

      ctx.save();
      // draw range
      ctx.beginPath();
      ctx.moveTo(0, mean);
      ctx.lineTo(0, max);

      if (prevData !== null) {
        ctx.lineTo(-pixelsSinceLastFrame, prevMax);
        ctx.lineTo(-pixelsSinceLastFrame, prevMin);
      }

      ctx.lineTo(0, min);
      ctx.closePath();

      ctx.fill();

      // draw mean
      if (colorScheme === 'none' && prevMean) {
        ctx.beginPath();
        ctx.moveTo(-pixelsSinceLastFrame, prevMean);
        ctx.lineTo(0, mean);
        ctx.closePath();
        ctx.stroke();
      }

      ctx.restore();

      this.prevFrame = frame;
    }
  }]);
  return TraceDisplay;
}(_BaseDisplay3.default);

;

exports.default = TraceDisplay;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRyYWNlRGlzcGxheS5qcyJdLCJuYW1lcyI6WyJkZWZpbml0aW9ucyIsImNvbG9yIiwidHlwZSIsImRlZmF1bHQiLCJtZXRhcyIsImtpbmQiLCJjb2xvclNjaGVtZSIsImxpc3QiLCJUcmFjZURpc3BsYXkiLCJvcHRpb25zIiwicHJldkZyYW1lIiwicHJldlN0cmVhbVBhcmFtcyIsInByZXBhcmVTdHJlYW1QYXJhbXMiLCJzdHJlYW1QYXJhbXMiLCJmcmFtZVNpemUiLCJwYXJhbXMiLCJzZXQiLCJwcm9wYWdhdGVTdHJlYW1QYXJhbXMiLCJmcmFtZSIsImZyYW1lV2lkdGgiLCJwaXhlbHNTaW5jZUxhc3RGcmFtZSIsImdldCIsImN0eCIsInByZXZEYXRhIiwiZGF0YSIsImhhbGZSYW5nZSIsIm1lYW4iLCJnZXRZUG9zaXRpb24iLCJtaW4iLCJtYXgiLCJwcmV2SGFsZlJhbmdlIiwicHJldk1lYW4iLCJwcmV2TWluIiwicHJldk1heCIsImdyYWRpZW50IiwicmdiIiwiZmlsbFN0eWxlIiwiam9pbiIsInN0cm9rZVN0eWxlIiwiY3JlYXRlTGluZWFyR3JhZGllbnQiLCJhZGRDb2xvclN0b3AiLCJzYXZlIiwiYmVnaW5QYXRoIiwibW92ZVRvIiwibGluZVRvIiwiY2xvc2VQYXRoIiwiZmlsbCIsInN0cm9rZSIsInJlc3RvcmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUdBLElBQU1BLGNBQWM7QUFDbEJDLFNBQU87QUFDTEMsVUFBTSxRQUREO0FBRUxDLGFBQVMsNkJBQVUsT0FBVixDQUZKO0FBR0xDLFdBQU8sRUFBRUMsTUFBTSxTQUFSO0FBSEYsR0FEVztBQU1sQkMsZUFBYTtBQUNYSixVQUFNLE1BREs7QUFFWEMsYUFBUyxNQUZFO0FBR1hJLFVBQU0sQ0FBQyxNQUFELEVBQVMsS0FBVCxFQUFnQixTQUFoQjtBQUhLO0FBTkssQ0FBcEI7O0FBYUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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eUIsTUFBSjtBQUNEOztBQUdEekIsVUFBSTBCLE9BQUo7O0FBRUEsV0FBS3RDLFNBQUwsR0FBaUJRLEtBQWpCO0FBQ0Q7Ozs7O0FBQ0Y7O2tCQUVjVixZIiwiZmlsZSI6IlRyYWNlRGlzcGxheS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlRGlzcGxheSBmcm9tICcuL0Jhc2VEaXNwbGF5JztcbmltcG9ydCB7IGdldENvbG9ycywgZ2V0SHVlLCBoZXhUb1JHQiB9IGZyb20gJy4uL3V0aWxzL2Rpc3BsYXktdXRpbHMnO1xuXG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBjb2xvcjoge1xuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6IGdldENvbG9ycygndHJhY2UnKSxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfSxcbiAgY29sb3JTY2hlbWU6IHtcbiAgICB0eXBlOiAnZW51bScsXG4gICAgZGVmYXVsdDogJ25vbmUnLFxuICAgIGxpc3Q6IFsnbm9uZScsICdodWUnLCAnb3BhY2l0eSddLFxuICB9LFxufTtcblxuLyoqXG4gKiBEaXNwbGF5IGEgcmFuZ2UgdmFsdWUgYXJvdW5kIGEgbWVhbiB2YWx1ZSAoZm9yIGV4YW1wbGUgbWVhblxuICogYW5kIHN0YW5kYXJ0IGRldmlhdGlvbikuXG4gKlxuICogVGhpcyBzaW5rIGNhbiBoYW5kbGUgaW5wdXQgb2YgdHlwZSBgdmVjdG9yYCBvZiBmcmFtZVNpemUgPj0gMi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHQgcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nb3JhbmdlJ10gLSBDb2xvci5cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvclNjaGVtZT0nbm9uZSddIC0gSWYgYSB0aGlyZCB2YWx1ZSBpcyBhdmFpbGFibGVcbiAqICBpbiB0aGUgaW5wdXQsIGNhbiBiZSB1c2VkIHRvIGNvbnRyb2wgdGhlIG9wYWNpdHkgb3IgdGhlIGh1ZS4gSWYgaW5wdXQgZnJhbWVcbiAqICBzaXplIGlzIDIsIHRoaXMgcGFyYW0gaXMgYXV0b21hdGljYWxseSBzZXQgdG8gYG5vbmVgXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMubWluPS0xXSAtIE1pbmltdW0gdmFsdWUgcmVwcmVzZW50ZWQgaW4gdGhlIGNhbnZhcy5cbiAqICBfZHluYW1pYyBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMubWF4PTFdIC0gTWF4aW11bSB2YWx1ZSByZXByZXNlbnRlZCBpbiB0aGUgY2FudmFzLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy53aWR0aD0zMDBdIC0gV2lkdGggb2YgdGhlIGNhbnZhcy5cbiAqICBfZHluYW1pYyBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuaGVpZ2h0PTE1MF0gLSBIZWlnaHQgb2YgdGhlIGNhbnZhcy5cbiAqICBfZHluYW1pYyBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge0VsZW1lbnR8Q1NTU2VsZWN0b3J9IFtvcHRpb25zLmNvbnRhaW5lcj1udWxsXSAtIENvbnRhaW5lciBlbGVtZW50XG4gKiAgaW4gd2hpY2ggdG8gaW5zZXJ0IHRoZSBjYW52YXMuIF9jb25zdGFudCBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge0VsZW1lbnR8Q1NTU2VsZWN0b3J9IFtvcHRpb25zLmNhbnZhcz1udWxsXSAtIENhbnZhcyBlbGVtZW50XG4gKiAgaW4gd2hpY2ggdG8gZHJhdy4gX2NvbnN0YW50IHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5kdXJhdGlvbj0xXSAtIER1cmF0aW9uIChpbiBzZWNvbmRzKSByZXByZXNlbnRlZCBpblxuICogIHRoZSBjYW52YXMuIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5yZWZlcmVuY2VUaW1lPW51bGxdIC0gT3B0aW9ubmFsIHJlZmVyZW5jZSB0aW1lIHRoZVxuICogIGRpc3BsYXkgc2hvdWxkIGNvbnNpZGVyZXIgYXMgdGhlIG9yaWdpbi4gSXMgb25seSB1c2VmdWxsIHdoZW4gc3luY2hyb25pemluZ1xuICogIHNldmVyYWwgZGlzcGxheSB1c2luZyB0aGUgYERpc3BsYXlTeW5jYCBjbGFzcy5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNsaWVudC5zaW5rXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY2xpZW50JztcbiAqXG4gKiBjb25zdCBBdWRpb0NvbnRleHQgPSAod2luZG93LkF1ZGlvQ29udGV4dCB8fMKgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dCk7XG4gKiBjb25zdCBhdWRpb0NvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KCk7XG4gKlxuICogbmF2aWdhdG9yLm1lZGlhRGV2aWNlc1xuICogICAuZ2V0VXNlck1lZGlhKHsgYXVkaW86IHRydWUgfSlcbiAqICAgLnRoZW4oaW5pdClcbiAqICAgLmNhdGNoKChlcnIpID0+IGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrKSk7XG4gKlxuICogZnVuY3Rpb24gaW5pdChzdHJlYW0pIHtcbiAqICAgY29uc3Qgc291cmNlID0gYXVkaW9Db250ZXh0LmNyZWF0ZU1lZGlhU3RyZWFtU291cmNlKHN0cmVhbSk7XG4gKlxuICogICBjb25zdCBhdWRpb0luTm9kZSA9IG5ldyBsZm8uc291cmNlLkF1ZGlvSW5Ob2RlKHtcbiAqICAgICBzb3VyY2VOb2RlOiBzb3VyY2UsXG4gKiAgICAgYXVkaW9Db250ZXh0OiBhdWRpb0NvbnRleHQsXG4gKiAgIH0pO1xuICpcbiAqICAgLy8gbm90IHN1cmUgaXQgbWFrZSBzZW5zIGJ1dC4uLlxuICogICBjb25zdCBtZWFuU3RkZGV2ID0gbmV3IGxmby5vcGVyYXRvci5NZWFuU3RkZGV2KCk7XG4gKlxuICogICBjb25zdCB0cmFjZURpc3BsYXkgPSBuZXcgbGZvLnNpbmsuVHJhY2VEaXNwbGF5KHtcbiAqICAgICBjYW52YXM6ICcjdHJhY2UnLFxuICogICB9KTtcbiAqXG4gKiAgIGNvbnN0IGxvZ2dlciA9IG5ldyBsZm8uc2luay5Mb2dnZXIoeyBkYXRhOiB0cnVlIH0pO1xuICpcbiAqICAgYXVkaW9Jbk5vZGUuY29ubmVjdChtZWFuU3RkZGV2KTtcbiAqICAgbWVhblN0ZGRldi5jb25uZWN0KHRyYWNlRGlzcGxheSk7XG4gKlxuICogICBhdWRpb0luTm9kZS5zdGFydCgpO1xuICogfVxuICovXG5jbGFzcyBUcmFjZURpc3BsYXkgZXh0ZW5kcyBCYXNlRGlzcGxheSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMucHJldkZyYW1lID0gbnVsbDtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpIHtcbiAgICB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG5cbiAgICBpZiAodGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID09PSAyKVxuICAgICAgdGhpcy5wYXJhbXMuc2V0KCdjb2xvclNjaGVtZScsICdub25lJyk7XG5cbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NWZWN0b3IoZnJhbWUsIGZyYW1lV2lkdGgsIHBpeGVsc1NpbmNlTGFzdEZyYW1lKSB7XG4gICAgY29uc3QgY29sb3JTY2hlbWUgPSB0aGlzLnBhcmFtcy5nZXQoJ2NvbG9yU2NoZW1lJyk7XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHg7XG4gICAgY29uc3QgcHJldkRhdGEgPSB0aGlzLnByZXZGcmFtZSA/IHRoaXMucHJldkZyYW1lLmRhdGEgOiBudWxsO1xuICAgIGNvbnN0IGRhdGEgPSBmcmFtZS5kYXRhO1xuXG4gICAgY29uc3QgaGFsZlJhbmdlID0gZGF0YVsxXSAvIDI7XG4gICAgY29uc3QgbWVhbiA9IHRoaXMuZ2V0WVBvc2l0aW9uKGRhdGFbMF0pO1xuICAgIGNvbnN0IG1pbiA9IHRoaXMuZ2V0WVBvc2l0aW9uKGRhdGFbMF0gLSBoYWxmUmFuZ2UpO1xuICAgIGNvbnN0IG1heCA9IHRoaXMuZ2V0WVBvc2l0aW9uKGRhdGFbMF0gKyBoYWxmUmFuZ2UpO1xuXG4gICAgbGV0IHByZXZIYWxmUmFuZ2U7XG4gICAgbGV0IHByZXZNZWFuO1xuICAgIGxldCBwcmV2TWluO1xuICAgIGxldCBwcmV2TWF4O1xuXG4gICAgaWYgKHByZXZEYXRhICE9PSBudWxsKSB7XG4gICAgICBwcmV2SGFsZlJhbmdlID0gcHJldkRhdGFbMV0gLyAyO1xuICAgICAgcHJldk1lYW4gPSB0aGlzLmdldFlQb3NpdGlvbihwcmV2RGF0YVswXSk7XG4gICAgICBwcmV2TWluID0gdGhpcy5nZXRZUG9zaXRpb24ocHJldkRhdGFbMF0gLSBwcmV2SGFsZlJhbmdlKTtcbiAgICAgIHByZXZNYXggPSB0aGlzLmdldFlQb3NpdGlvbihwcmV2RGF0YVswXSArIHByZXZIYWxmUmFuZ2UpO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbG9yID0gdGhpcy5wYXJhbXMuZ2V0KCdjb2xvcicpO1xuICAgIGxldCBncmFkaWVudDtcbiAgICBsZXQgcmdiO1xuXG4gICAgc3dpdGNoIChjb2xvclNjaGVtZSkge1xuICAgICAgY2FzZSAnbm9uZSc6XG4gICAgICAgIHJnYiA9IGhleFRvUkdCKGNvbG9yKTtcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGByZ2JhKCR7cmdiLmpvaW4oJywnKX0sIDAuNylgO1xuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvcjtcbiAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnaHVlJzpcbiAgICAgICAgZ3JhZGllbnQgPSBjdHguY3JlYXRlTGluZWFyR3JhZGllbnQoLXBpeGVsc1NpbmNlTGFzdEZyYW1lLCAwLCAwLCAwKTtcblxuICAgICAgICBpZiAocHJldkRhdGEpXG4gICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsIGBoc2woJHtnZXRIdWUocHJldkRhdGFbMl0pfSwgMTAwJSwgNTAlKWApO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsIGBoc2woJHtnZXRIdWUoZGF0YVsyXSl9LCAxMDAlLCA1MCUpYCk7XG5cbiAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsIGBoc2woJHtnZXRIdWUoZGF0YVsyXSl9LCAxMDAlLCA1MCUpYCk7XG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnb3BhY2l0eSc6XG4gICAgICAgIHJnYiA9IGhleFRvUkdCKHRoaXMucGFyYW1zLmdldCgnY29sb3InKSk7XG4gICAgICAgIGdyYWRpZW50ID0gY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KC1waXhlbHNTaW5jZUxhc3RGcmFtZSwgMCwgMCwgMCk7XG5cbiAgICAgICAgaWYgKHByZXZEYXRhKVxuICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCBgcmdiYSgke3JnYi5qb2luKCcsJyl9LCAke3ByZXZEYXRhWzJdfSlgKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCBgcmdiYSgke3JnYi5qb2luKCcsJyl9LCAke2RhdGFbMl19KWApO1xuXG4gICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCBgcmdiYSgke3JnYi5qb2luKCcsJyl9LCAke2RhdGFbMl19KWApO1xuICAgICAgICBjdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBjdHguc2F2ZSgpO1xuICAgIC8vIGRyYXcgcmFuZ2VcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4Lm1vdmVUbygwLCBtZWFuKTtcbiAgICBjdHgubGluZVRvKDAsIG1heCk7XG5cbiAgICBpZiAocHJldkRhdGEgIT09IG51bGwpIHtcbiAgICAgIGN0eC5saW5lVG8oLXBpeGVsc1NpbmNlTGFzdEZyYW1lLCBwcmV2TWF4KTtcbiAgICAgIGN0eC5saW5lVG8oLXBpeGVsc1NpbmNlTGFzdEZyYW1lLCBwcmV2TWluKTtcbiAgICB9XG5cbiAgICBjdHgubGluZVRvKDAsIG1pbik7XG4gICAgY3R4LmNsb3NlUGF0aCgpO1xuXG4gICAgY3R4LmZpbGwoKTtcblxuICAgIC8vIGRyYXcgbWVhblxuICAgIGlmIChjb2xvclNjaGVtZSA9PT0gJ25vbmUnICYmIHByZXZNZWFuKSB7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHgubW92ZVRvKC1waXhlbHNTaW5jZUxhc3RGcmFtZSwgcHJldk1lYW4pO1xuICAgICAgY3R4LmxpbmVUbygwLCBtZWFuKTtcbiAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9XG5cblxuICAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgICB0aGlzLnByZXZGcmFtZSA9IGZyYW1lO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBUcmFjZURpc3BsYXk7XG4iXX0=