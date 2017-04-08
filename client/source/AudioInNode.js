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

var _BaseLfo = require('../../core/BaseLfo');

var _BaseLfo2 = _interopRequireDefault(_BaseLfo);

var _SourceMixin2 = require('../../core/SourceMixin');

var _SourceMixin3 = _interopRequireDefault(_SourceMixin2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AudioContext = window.AudioContext || window.webkitAudioContext;

var definitions = {
  frameSize: {
    type: 'integer',
    default: 512,
    constant: true
  },
  channel: {
    type: 'integer',
    default: 0,
    constant: true
  },
  sourceNode: {
    type: 'any',
    default: null,
    constant: true
  },
  audioContext: {
    type: 'any',
    default: null,
    constant: true
  }
};

/**
 * Use a `WebAudio` node as a source for the graph.
 *
 * @param {Object} options - Override parameter' default values.
 * @param {AudioNode} [options.sourceNode=null] - Audio node to process
 *  (mandatory).
 * @param {AudioContext} [options.audioContext=null] - Audio context used to
 *  create the audio node (mandatory).
 * @param {Number} [options.frameSize=512] - Size of the output blocks, define
 *  the `frameSize` in the `streamParams`.
 * @param {Number} [options.channel=0] - Number of the channel to process.
 *
 * @memberof module:client.source
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * const audioContext = new AudioContext();
 * const sine = audioContext.createOscillator();
 * sine.frequency.value = 2;
 *
 * const audioInNode = new lfo.source.AudioInNode({
 *   audioContext: audioContext,
 *   sourceNode: sine,
 * });
 *
 * const signalDisplay = new lfo.sink.SignalDisplay({
 *   canvas: '#signal',
 *   duration: 1,
 * });
 *
 * audioInNode.connect(signalDisplay);
 *
 * // start the sine oscillator node and the lfo graph
 * sine.start();
 * audioInNode.start();
 */

var AudioInNode = function (_SourceMixin) {
  (0, _inherits3.default)(AudioInNode, _SourceMixin);

  function AudioInNode() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, AudioInNode);

    var _this = (0, _possibleConstructorReturn3.default)(this, (AudioInNode.__proto__ || (0, _getPrototypeOf2.default)(AudioInNode)).call(this, definitions, options));

    var audioContext = _this.params.get('audioContext');
    var sourceNode = _this.params.get('sourceNode');

    if (!audioContext || !(audioContext instanceof AudioContext)) throw new Error('Invalid `audioContext` parameter');

    if (!sourceNode || !(sourceNode instanceof AudioNode)) throw new Error('Invalid `sourceNode` parameter');

    _this.sourceNode = sourceNode;
    _this._channel = _this.params.get('channel');
    _this._blockDuration = null;

    _this.processFrame = _this.processFrame.bind(_this);
    return _this;
  }

  /**
   * Propagate the `streamParams` in the graph and start to propagate signal
   * blocks produced by the audio node into the graph.
   *
   * @see {@link module:common.core.BaseLfo#processStreamParams}
   * @see {@link module:common.core.BaseLfo#resetStream}
   * @see {@link module:client.source.AudioInNode#stop}
   */


  (0, _createClass3.default)(AudioInNode, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      if (!this.initialized) {
        this.initialized = this.init();
        this.initialized.then(function () {
          return _this2.start(startTime);
        });
        return;
      }

      var audioContext = this.params.get('audioContext');
      var frameSize = this.params.get('frameSize');

      this.frame.time = 0;
      // @note: recreate each time because of a firefox weird behavior
      this.scriptProcessor = audioContext.createScriptProcessor(frameSize, 1, 1);
      this.scriptProcessor.onaudioprocess = this.processFrame;

      this.ready = true;
      this.sourceNode.connect(this.scriptProcessor);
      this.scriptProcessor.connect(audioContext.destination);
    }

    /**
     * Finalize the stream and stop the whole graph.
     *
     * @see {@link module:common.core.BaseLfo#finalizeStream}
     * @see {@link module:client.source.AudioInNode#start}
     */

  }, {
    key: 'stop',
    value: function stop() {
      this.finalizeStream(this.frame.time);
      this.ready = false;
      this.sourceNode.disconnect();
      this.scriptProcessor.disconnect();
    }

    /** @private */

  }, {
    key: 'processStreamParams',
    value: function processStreamParams() {
      var audioContext = this.params.get('audioContext');
      var frameSize = this.params.get('frameSize');
      var sampleRate = audioContext.sampleRate;

      this.streamParams.frameSize = frameSize;
      this.streamParams.frameRate = sampleRate / frameSize;
      this.streamParams.frameType = 'signal';
      this.streamParams.sourceSampleRate = sampleRate;
      this.streamParams.sourceSampleCount = frameSize;

      this._blockDuration = frameSize / sampleRate;

      this.propagateStreamParams();
    }

    /**
     * Basically the `scriptProcessor.onaudioprocess` callback
     * @private
     */

  }, {
    key: 'processFrame',
    value: function processFrame(e) {
      if (this.ready === false) return;

      this.frame.data = e.inputBuffer.getChannelData(this._channel);
      this.propagateFrame();

      this.frame.time += this._blockDuration;
    }
  }]);
  return AudioInNode;
}((0, _SourceMixin3.default)(_BaseLfo2.default));

exports.default = AudioInNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvSW5Ob2RlLmpzIl0sIm5hbWVzIjpbIkF1ZGlvQ29udGV4dCIsIndpbmRvdyIsIndlYmtpdEF1ZGlvQ29udGV4dCIsImRlZmluaXRpb25zIiwiZnJhbWVTaXplIiwidHlwZSIsImRlZmF1bHQiLCJjb25zdGFudCIsImNoYW5uZWwiLCJzb3VyY2VOb2RlIiwiYXVkaW9Db250ZXh0IiwiQXVkaW9Jbk5vZGUiLCJvcHRpb25zIiwicGFyYW1zIiwiZ2V0IiwiRXJyb3IiLCJBdWRpb05vZGUiLCJfY2hhbm5lbCIsIl9ibG9ja0R1cmF0aW9uIiwicHJvY2Vzc0ZyYW1lIiwiYmluZCIsImluaXRpYWxpemVkIiwiaW5pdCIsInRoZW4iLCJzdGFydCIsInN0YXJ0VGltZSIsImZyYW1lIiwidGltZSIsInNjcmlwdFByb2Nlc3NvciIsImNyZWF0ZVNjcmlwdFByb2Nlc3NvciIsIm9uYXVkaW9wcm9jZXNzIiwicmVhZHkiLCJjb25uZWN0IiwiZGVzdGluYXRpb24iLCJmaW5hbGl6ZVN0cmVhbSIsImRpc2Nvbm5lY3QiLCJzYW1wbGVSYXRlIiwic3RyZWFtUGFyYW1zIiwiZnJhbWVSYXRlIiwiZnJhbWVUeXBlIiwic291cmNlU2FtcGxlUmF0ZSIsInNvdXJjZVNhbXBsZUNvdW50IiwicHJvcGFnYXRlU3RyZWFtUGFyYW1zIiwiZSIsImRhdGEiLCJpbnB1dEJ1ZmZlciIsImdldENoYW5uZWxEYXRhIiwicHJvcGFnYXRlRnJhbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsZUFBZUMsT0FBT0QsWUFBUCxJQUF1QkMsT0FBT0Msa0JBQW5EOztBQUVBLElBQU1DLGNBQWM7QUFDbEJDLGFBQVc7QUFDVEMsVUFBTSxTQURHO0FBRVRDLGFBQVMsR0FGQTtBQUdUQyxjQUFVO0FBSEQsR0FETztBQU1sQkMsV0FBUztBQUNQSCxVQUFNLFNBREM7QUFFUEMsYUFBUyxDQUZGO0FBR1BDLGNBQVU7QUFI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Q0FBa0JFLFNBQWxCLEdBQThCLFFBQTlCO0FBQ0EsV0FBS0YsWUFBTCxDQUFrQkcsZ0JBQWxCLEdBQXFDSixVQUFyQztBQUNBLFdBQUtDLFlBQUwsQ0FBa0JJLGlCQUFsQixHQUFzQ3JDLFNBQXRDOztBQUVBLFdBQUtjLGNBQUwsR0FBc0JkLFlBQVlnQyxVQUFsQzs7QUFFQSxXQUFLTSxxQkFBTDtBQUNEOztBQUVEOzs7Ozs7O2lDQUlhQyxDLEVBQUc7QUFDZCxVQUFJLEtBQUtaLEtBQUwsS0FBZSxLQUFuQixFQUNFOztBQUVGLFdBQUtMLEtBQUwsQ0FBV2tCLElBQVgsR0FBa0JELEVBQUVFLFdBQUYsQ0FBY0MsY0FBZCxDQUE2QixLQUFLN0IsUUFBbEMsQ0FBbEI7QUFDQSxXQUFLOEIsY0FBTDs7QUFFQSxXQUFLckIsS0FBTCxDQUFXQyxJQUFYLElBQW1CLEtBQUtULGNBQXhCO0FBQ0Q7OztFQTFGdUIsNkM7O2tCQTZGWFAsVyIsImZpbGUiOiJBdWRpb0luTm9kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uLy4uL2NvcmUvQmFzZUxmbyc7XG5pbXBvcnQgU291cmNlTWl4aW4gZnJvbSAnLi4vLi4vY29yZS9Tb3VyY2VNaXhpbic7XG5cbmNvbnN0IEF1ZGlvQ29udGV4dCA9IHdpbmRvdy5BdWRpb0NvbnRleHQgfHzCoHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQ7XG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBmcmFtZVNpemU6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogNTEyLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICBjaGFubmVsOiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDAsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIHNvdXJjZU5vZGU6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICBhdWRpb0NvbnRleHQ6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxufTtcblxuLyoqXG4gKiBVc2UgYSBgV2ViQXVkaW9gIG5vZGUgYXMgYSBzb3VyY2UgZm9yIHRoZSBncmFwaC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIHBhcmFtZXRlcicgZGVmYXVsdCB2YWx1ZXMuXG4gKiBAcGFyYW0ge0F1ZGlvTm9kZX0gW29wdGlvbnMuc291cmNlTm9kZT1udWxsXSAtIEF1ZGlvIG5vZGUgdG8gcHJvY2Vzc1xuICogIChtYW5kYXRvcnkpLlxuICogQHBhcmFtIHtBdWRpb0NvbnRleHR9IFtvcHRpb25zLmF1ZGlvQ29udGV4dD1udWxsXSAtIEF1ZGlvIGNvbnRleHQgdXNlZCB0b1xuICogIGNyZWF0ZSB0aGUgYXVkaW8gbm9kZSAobWFuZGF0b3J5KS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5mcmFtZVNpemU9NTEyXSAtIFNpemUgb2YgdGhlIG91dHB1dCBibG9ja3MsIGRlZmluZVxuICogIHRoZSBgZnJhbWVTaXplYCBpbiB0aGUgYHN0cmVhbVBhcmFtc2AuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuY2hhbm5lbD0wXSAtIE51bWJlciBvZiB0aGUgY2hhbm5lbCB0byBwcm9jZXNzLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6Y2xpZW50LnNvdXJjZVxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NsaWVudCc7XG4gKlxuICogY29uc3QgYXVkaW9Db250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xuICogY29uc3Qgc2luZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVPc2NpbGxhdG9yKCk7XG4gKiBzaW5lLmZyZXF1ZW5jeS52YWx1ZSA9IDI7XG4gKlxuICogY29uc3QgYXVkaW9Jbk5vZGUgPSBuZXcgbGZvLnNvdXJjZS5BdWRpb0luTm9kZSh7XG4gKiAgIGF1ZGlvQ29udGV4dDogYXVkaW9Db250ZXh0LFxuICogICBzb3VyY2VOb2RlOiBzaW5lLFxuICogfSk7XG4gKlxuICogY29uc3Qgc2lnbmFsRGlzcGxheSA9IG5ldyBsZm8uc2luay5TaWduYWxEaXNwbGF5KHtcbiAqICAgY2FudmFzOiAnI3NpZ25hbCcsXG4gKiAgIGR1cmF0aW9uOiAxLFxuICogfSk7XG4gKlxuICogYXVkaW9Jbk5vZGUuY29ubmVjdChzaWduYWxEaXNwbGF5KTtcbiAqXG4gKiAvLyBzdGFydCB0aGUgc2luZSBvc2NpbGxhdG9yIG5vZGUgYW5kIHRoZSBsZm8gZ3JhcGhcbiAqIHNpbmUuc3RhcnQoKTtcbiAqIGF1ZGlvSW5Ob2RlLnN0YXJ0KCk7XG4gKi9cbmNsYXNzIEF1ZGlvSW5Ob2RlIGV4dGVuZHMgU291cmNlTWl4aW4oQmFzZUxmbykge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICBjb25zdCBhdWRpb0NvbnRleHQgPSB0aGlzLnBhcmFtcy5nZXQoJ2F1ZGlvQ29udGV4dCcpO1xuICAgIGNvbnN0IHNvdXJjZU5vZGUgPSB0aGlzLnBhcmFtcy5nZXQoJ3NvdXJjZU5vZGUnKTtcblxuICAgIGlmICghYXVkaW9Db250ZXh0IHx8ICEoYXVkaW9Db250ZXh0IGluc3RhbmNlb2YgQXVkaW9Db250ZXh0KSlcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBgYXVkaW9Db250ZXh0YCBwYXJhbWV0ZXInKTtcblxuICAgIGlmICghc291cmNlTm9kZSB8fCAhKHNvdXJjZU5vZGUgaW5zdGFuY2VvZiBBdWRpb05vZGUpKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGBzb3VyY2VOb2RlYCBwYXJhbWV0ZXInKTtcblxuICAgIHRoaXMuc291cmNlTm9kZSA9IHNvdXJjZU5vZGU7XG4gICAgdGhpcy5fY2hhbm5lbCA9IHRoaXMucGFyYW1zLmdldCgnY2hhbm5lbCcpO1xuICAgIHRoaXMuX2Jsb2NrRHVyYXRpb24gPSBudWxsO1xuXG4gICAgdGhpcy5wcm9jZXNzRnJhbWUgPSB0aGlzLnByb2Nlc3NGcmFtZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFByb3BhZ2F0ZSB0aGUgYHN0cmVhbVBhcmFtc2AgaW4gdGhlIGdyYXBoIGFuZCBzdGFydCB0byBwcm9wYWdhdGUgc2lnbmFsXG4gICAqIGJsb2NrcyBwcm9kdWNlZCBieSB0aGUgYXVkaW8gbm9kZSBpbnRvIHRoZSBncmFwaC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJvY2Vzc1N0cmVhbVBhcmFtc31cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcmVzZXRTdHJlYW19XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjbGllbnQuc291cmNlLkF1ZGlvSW5Ob2RlI3N0b3B9XG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBpZiAoIXRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0aGlzLmluaXQoKTtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQudGhlbigoKSA9PiB0aGlzLnN0YXJ0KHN0YXJ0VGltZSkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGF1ZGlvQ29udGV4dCA9IHRoaXMucGFyYW1zLmdldCgnYXVkaW9Db250ZXh0Jyk7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5wYXJhbXMuZ2V0KCdmcmFtZVNpemUnKTtcblxuICAgIHRoaXMuZnJhbWUudGltZSA9IDA7XG4gICAgLy8gQG5vdGU6IHJlY3JlYXRlIGVhY2ggdGltZSBiZWNhdXNlIG9mIGEgZmlyZWZveCB3ZWlyZCBiZWhhdmlvclxuICAgIHRoaXMuc2NyaXB0UHJvY2Vzc29yID0gYXVkaW9Db250ZXh0LmNyZWF0ZVNjcmlwdFByb2Nlc3NvcihmcmFtZVNpemUsIDEsIDEpO1xuICAgIHRoaXMuc2NyaXB0UHJvY2Vzc29yLm9uYXVkaW9wcm9jZXNzID0gdGhpcy5wcm9jZXNzRnJhbWU7XG5cbiAgICB0aGlzLnJlYWR5ID0gdHJ1ZTtcbiAgICB0aGlzLnNvdXJjZU5vZGUuY29ubmVjdCh0aGlzLnNjcmlwdFByb2Nlc3Nvcik7XG4gICAgdGhpcy5zY3JpcHRQcm9jZXNzb3IuY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmFsaXplIHRoZSBzdHJlYW0gYW5kIHN0b3AgdGhlIHdob2xlIGdyYXBoLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNmaW5hbGl6ZVN0cmVhbX1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNsaWVudC5zb3VyY2UuQXVkaW9Jbk5vZGUjc3RhcnR9XG4gICAqL1xuICBzdG9wKCkge1xuICAgIHRoaXMuZmluYWxpemVTdHJlYW0odGhpcy5mcmFtZS50aW1lKTtcbiAgICB0aGlzLnJlYWR5ID0gZmFsc2U7XG4gICAgdGhpcy5zb3VyY2VOb2RlLmRpc2Nvbm5lY3QoKTtcbiAgICB0aGlzLnNjcmlwdFByb2Nlc3Nvci5kaXNjb25uZWN0KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcygpIHtcbiAgICBjb25zdCBhdWRpb0NvbnRleHQgPSB0aGlzLnBhcmFtcy5nZXQoJ2F1ZGlvQ29udGV4dCcpO1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMucGFyYW1zLmdldCgnZnJhbWVTaXplJyk7XG4gICAgY29uc3Qgc2FtcGxlUmF0ZSA9IGF1ZGlvQ29udGV4dC5zYW1wbGVSYXRlO1xuXG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gZnJhbWVTaXplO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lUmF0ZSA9IHNhbXBsZVJhdGUgLyBmcmFtZVNpemU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVUeXBlID0gJ3NpZ25hbCc7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZSA9IHNhbXBsZVJhdGU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlQ291bnQgPSBmcmFtZVNpemU7XG5cbiAgICB0aGlzLl9ibG9ja0R1cmF0aW9uID0gZnJhbWVTaXplIC8gc2FtcGxlUmF0ZTtcblxuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKipcbiAgICogQmFzaWNhbGx5IHRoZSBgc2NyaXB0UHJvY2Vzc29yLm9uYXVkaW9wcm9jZXNzYCBjYWxsYmFja1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcHJvY2Vzc0ZyYW1lKGUpIHtcbiAgICBpZiAodGhpcy5yZWFkeSA9PT0gZmFsc2UpXG4gICAgICByZXR1cm47XG5cbiAgICB0aGlzLmZyYW1lLmRhdGEgPSBlLmlucHV0QnVmZmVyLmdldENoYW5uZWxEYXRhKHRoaXMuX2NoYW5uZWwpO1xuICAgIHRoaXMucHJvcGFnYXRlRnJhbWUoKTtcblxuICAgIHRoaXMuZnJhbWUudGltZSArPSB0aGlzLl9ibG9ja0R1cmF0aW9uO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEF1ZGlvSW5Ob2RlO1xuIl19