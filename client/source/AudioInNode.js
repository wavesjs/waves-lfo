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

      if (this.initialized === false) {
        if (this.initPromise === null) // init has not yet been called
          this.initPromise = this.init();

        this.initPromise.then(function () {
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

      this.started = true;
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
      this.started = false;
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
      if (this.started === false) return;

      this.frame.data = e.inputBuffer.getChannelData(this._channel);
      this.propagateFrame();

      this.frame.time += this._blockDuration;
    }
  }]);
  return AudioInNode;
}((0, _SourceMixin3.default)(_BaseLfo2.default));

exports.default = AudioInNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvSW5Ob2RlLmpzIl0sIm5hbWVzIjpbIkF1ZGlvQ29udGV4dCIsIndpbmRvdyIsIndlYmtpdEF1ZGlvQ29udGV4dCIsImRlZmluaXRpb25zIiwiZnJhbWVTaXplIiwidHlwZSIsImRlZmF1bHQiLCJjb25zdGFudCIsImNoYW5uZWwiLCJzb3VyY2VOb2RlIiwiYXVkaW9Db250ZXh0IiwiQXVkaW9Jbk5vZGUiLCJvcHRpb25zIiwicGFyYW1zIiwiZ2V0IiwiRXJyb3IiLCJBdWRpb05vZGUiLCJfY2hhbm5lbCIsIl9ibG9ja0R1cmF0aW9uIiwicHJvY2Vzc0ZyYW1lIiwiYmluZCIsImluaXRpYWxpemVkIiwiaW5pdFByb21pc2UiLCJpbml0IiwidGhlbiIsInN0YXJ0Iiwic3RhcnRUaW1lIiwiZnJhbWUiLCJ0aW1lIiwic2NyaXB0UHJvY2Vzc29yIiwiY3JlYXRlU2NyaXB0UHJvY2Vzc29yIiwib25hdWRpb3Byb2Nlc3MiLCJzdGFydGVkIiwiY29ubmVjdCIsImRlc3RpbmF0aW9uIiwiZmluYWxpemVTdHJlYW0iLCJkaXNjb25uZWN0Iiwic2FtcGxlUmF0ZSIsInN0cmVhbVBhcmFtcyIsImZyYW1lUmF0ZSIsImZyYW1lVHlwZSIsInNvdXJjZVNhbXBsZVJhdGUiLCJzb3VyY2VTYW1wbGVDb3VudCIsInByb3BhZ2F0ZVN0cmVhbVBhcmFtcyIsImUiLCJkYXRhIiwiaW5wdXRCdWZmZXIiLCJnZXRDaGFubmVsRGF0YSIsInByb3BhZ2F0ZUZyYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLGVBQWVDLE9BQU9ELFlBQVAsSUFBdUJDLE9BQU9DLGtCQUFuRDs7QUFFQSxJQUFNQyxjQUFjO0FBQ2xCQyxhQUFXO0FBQ1RDLFVBQU0sU0FERztBQUVUQyxhQUFTLEdBRkE7QUFHVEMsY0FBVTtBQUhELEdBRE87QUFNbEJDLFdBQVM7QUFDUEgsVUFBTSxTQURDO0FBRVBDLGFBQVMsQ0FG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Q0EsV0FBS2tDLFlBQUwsQ0FBa0JDLFNBQWxCLEdBQThCRixhQUFhakMsU0FBM0M7QUFDQSxXQUFLa0MsWUFBTCxDQUFrQkUsU0FBbEIsR0FBOEIsUUFBOUI7QUFDQSxXQUFLRixZQUFMLENBQWtCRyxnQkFBbEIsR0FBcUNKLFVBQXJDO0FBQ0EsV0FBS0MsWUFBTCxDQUFrQkksaUJBQWxCLEdBQXNDdEMsU0FBdEM7O0FBRUEsV0FBS2MsY0FBTCxHQUFzQmQsWUFBWWlDLFVBQWxDOztBQUVBLFdBQUtNLHFCQUFMO0FBQ0Q7O0FBRUQ7Ozs7Ozs7aUNBSWFDLEMsRUFBRztBQUNkLFVBQUksS0FBS1osT0FBTCxLQUFpQixLQUFyQixFQUNFOztBQUVGLFdBQUtMLEtBQUwsQ0FBV2tCLElBQVgsR0FBa0JELEVBQUVFLFdBQUYsQ0FBY0MsY0FBZCxDQUE2QixLQUFLOUIsUUFBbEMsQ0FBbEI7QUFDQSxXQUFLK0IsY0FBTDs7QUFFQSxXQUFLckIsS0FBTCxDQUFXQyxJQUFYLElBQW1CLEtBQUtWLGNBQXhCO0FBQ0Q7OztFQTVGdUIsNkM7O2tCQStGWFAsVyIsImZpbGUiOiJBdWRpb0luTm9kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uLy4uL2NvcmUvQmFzZUxmbyc7XG5pbXBvcnQgU291cmNlTWl4aW4gZnJvbSAnLi4vLi4vY29yZS9Tb3VyY2VNaXhpbic7XG5cbmNvbnN0IEF1ZGlvQ29udGV4dCA9IHdpbmRvdy5BdWRpb0NvbnRleHQgfHzCoHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQ7XG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBmcmFtZVNpemU6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogNTEyLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICBjaGFubmVsOiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDAsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIHNvdXJjZU5vZGU6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICBhdWRpb0NvbnRleHQ6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxufTtcblxuLyoqXG4gKiBVc2UgYSBgV2ViQXVkaW9gIG5vZGUgYXMgYSBzb3VyY2UgZm9yIHRoZSBncmFwaC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIHBhcmFtZXRlcicgZGVmYXVsdCB2YWx1ZXMuXG4gKiBAcGFyYW0ge0F1ZGlvTm9kZX0gW29wdGlvbnMuc291cmNlTm9kZT1udWxsXSAtIEF1ZGlvIG5vZGUgdG8gcHJvY2Vzc1xuICogIChtYW5kYXRvcnkpLlxuICogQHBhcmFtIHtBdWRpb0NvbnRleHR9IFtvcHRpb25zLmF1ZGlvQ29udGV4dD1udWxsXSAtIEF1ZGlvIGNvbnRleHQgdXNlZCB0b1xuICogIGNyZWF0ZSB0aGUgYXVkaW8gbm9kZSAobWFuZGF0b3J5KS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5mcmFtZVNpemU9NTEyXSAtIFNpemUgb2YgdGhlIG91dHB1dCBibG9ja3MsIGRlZmluZVxuICogIHRoZSBgZnJhbWVTaXplYCBpbiB0aGUgYHN0cmVhbVBhcmFtc2AuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuY2hhbm5lbD0wXSAtIE51bWJlciBvZiB0aGUgY2hhbm5lbCB0byBwcm9jZXNzLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6Y2xpZW50LnNvdXJjZVxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NsaWVudCc7XG4gKlxuICogY29uc3QgYXVkaW9Db250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xuICogY29uc3Qgc2luZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVPc2NpbGxhdG9yKCk7XG4gKiBzaW5lLmZyZXF1ZW5jeS52YWx1ZSA9IDI7XG4gKlxuICogY29uc3QgYXVkaW9Jbk5vZGUgPSBuZXcgbGZvLnNvdXJjZS5BdWRpb0luTm9kZSh7XG4gKiAgIGF1ZGlvQ29udGV4dDogYXVkaW9Db250ZXh0LFxuICogICBzb3VyY2VOb2RlOiBzaW5lLFxuICogfSk7XG4gKlxuICogY29uc3Qgc2lnbmFsRGlzcGxheSA9IG5ldyBsZm8uc2luay5TaWduYWxEaXNwbGF5KHtcbiAqICAgY2FudmFzOiAnI3NpZ25hbCcsXG4gKiAgIGR1cmF0aW9uOiAxLFxuICogfSk7XG4gKlxuICogYXVkaW9Jbk5vZGUuY29ubmVjdChzaWduYWxEaXNwbGF5KTtcbiAqXG4gKiAvLyBzdGFydCB0aGUgc2luZSBvc2NpbGxhdG9yIG5vZGUgYW5kIHRoZSBsZm8gZ3JhcGhcbiAqIHNpbmUuc3RhcnQoKTtcbiAqIGF1ZGlvSW5Ob2RlLnN0YXJ0KCk7XG4gKi9cbmNsYXNzIEF1ZGlvSW5Ob2RlIGV4dGVuZHMgU291cmNlTWl4aW4oQmFzZUxmbykge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICBjb25zdCBhdWRpb0NvbnRleHQgPSB0aGlzLnBhcmFtcy5nZXQoJ2F1ZGlvQ29udGV4dCcpO1xuICAgIGNvbnN0IHNvdXJjZU5vZGUgPSB0aGlzLnBhcmFtcy5nZXQoJ3NvdXJjZU5vZGUnKTtcblxuICAgIGlmICghYXVkaW9Db250ZXh0IHx8ICEoYXVkaW9Db250ZXh0IGluc3RhbmNlb2YgQXVkaW9Db250ZXh0KSlcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBgYXVkaW9Db250ZXh0YCBwYXJhbWV0ZXInKTtcblxuICAgIGlmICghc291cmNlTm9kZSB8fCAhKHNvdXJjZU5vZGUgaW5zdGFuY2VvZiBBdWRpb05vZGUpKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGBzb3VyY2VOb2RlYCBwYXJhbWV0ZXInKTtcblxuICAgIHRoaXMuc291cmNlTm9kZSA9IHNvdXJjZU5vZGU7XG4gICAgdGhpcy5fY2hhbm5lbCA9IHRoaXMucGFyYW1zLmdldCgnY2hhbm5lbCcpO1xuICAgIHRoaXMuX2Jsb2NrRHVyYXRpb24gPSBudWxsO1xuXG4gICAgdGhpcy5wcm9jZXNzRnJhbWUgPSB0aGlzLnByb2Nlc3NGcmFtZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFByb3BhZ2F0ZSB0aGUgYHN0cmVhbVBhcmFtc2AgaW4gdGhlIGdyYXBoIGFuZCBzdGFydCB0byBwcm9wYWdhdGUgc2lnbmFsXG4gICAqIGJsb2NrcyBwcm9kdWNlZCBieSB0aGUgYXVkaW8gbm9kZSBpbnRvIHRoZSBncmFwaC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJvY2Vzc1N0cmVhbVBhcmFtc31cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcmVzZXRTdHJlYW19XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjbGllbnQuc291cmNlLkF1ZGlvSW5Ob2RlI3N0b3B9XG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBpZiAodGhpcy5pbml0aWFsaXplZCA9PT0gZmFsc2UpIHtcbiAgICAgIGlmICh0aGlzLmluaXRQcm9taXNlID09PSBudWxsKSAvLyBpbml0IGhhcyBub3QgeWV0IGJlZW4gY2FsbGVkXG4gICAgICAgIHRoaXMuaW5pdFByb21pc2UgPSB0aGlzLmluaXQoKTtcblxuICAgICAgdGhpcy5pbml0UHJvbWlzZS50aGVuKCgpID0+IHRoaXMuc3RhcnQoc3RhcnRUaW1lKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgYXVkaW9Db250ZXh0ID0gdGhpcy5wYXJhbXMuZ2V0KCdhdWRpb0NvbnRleHQnKTtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnBhcmFtcy5nZXQoJ2ZyYW1lU2l6ZScpO1xuXG4gICAgdGhpcy5mcmFtZS50aW1lID0gMDtcbiAgICAvLyBAbm90ZTogcmVjcmVhdGUgZWFjaCB0aW1lIGJlY2F1c2Ugb2YgYSBmaXJlZm94IHdlaXJkIGJlaGF2aW9yXG4gICAgdGhpcy5zY3JpcHRQcm9jZXNzb3IgPSBhdWRpb0NvbnRleHQuY3JlYXRlU2NyaXB0UHJvY2Vzc29yKGZyYW1lU2l6ZSwgMSwgMSk7XG4gICAgdGhpcy5zY3JpcHRQcm9jZXNzb3Iub25hdWRpb3Byb2Nlc3MgPSB0aGlzLnByb2Nlc3NGcmFtZTtcblxuICAgIHRoaXMuc3RhcnRlZCA9IHRydWU7XG4gICAgdGhpcy5zb3VyY2VOb2RlLmNvbm5lY3QodGhpcy5zY3JpcHRQcm9jZXNzb3IpO1xuICAgIHRoaXMuc2NyaXB0UHJvY2Vzc29yLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5hbGl6ZSB0aGUgc3RyZWFtIGFuZCBzdG9wIHRoZSB3aG9sZSBncmFwaC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jZmluYWxpemVTdHJlYW19XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjbGllbnQuc291cmNlLkF1ZGlvSW5Ob2RlI3N0YXJ0fVxuICAgKi9cbiAgc3RvcCgpIHtcbiAgICB0aGlzLmZpbmFsaXplU3RyZWFtKHRoaXMuZnJhbWUudGltZSk7XG4gICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG4gICAgdGhpcy5zb3VyY2VOb2RlLmRpc2Nvbm5lY3QoKTtcbiAgICB0aGlzLnNjcmlwdFByb2Nlc3Nvci5kaXNjb25uZWN0KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcygpIHtcbiAgICBjb25zdCBhdWRpb0NvbnRleHQgPSB0aGlzLnBhcmFtcy5nZXQoJ2F1ZGlvQ29udGV4dCcpO1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMucGFyYW1zLmdldCgnZnJhbWVTaXplJyk7XG4gICAgY29uc3Qgc2FtcGxlUmF0ZSA9IGF1ZGlvQ29udGV4dC5zYW1wbGVSYXRlO1xuXG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gZnJhbWVTaXplO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lUmF0ZSA9IHNhbXBsZVJhdGUgLyBmcmFtZVNpemU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVUeXBlID0gJ3NpZ25hbCc7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZSA9IHNhbXBsZVJhdGU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlQ291bnQgPSBmcmFtZVNpemU7XG5cbiAgICB0aGlzLl9ibG9ja0R1cmF0aW9uID0gZnJhbWVTaXplIC8gc2FtcGxlUmF0ZTtcblxuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKipcbiAgICogQmFzaWNhbGx5IHRoZSBgc2NyaXB0UHJvY2Vzc29yLm9uYXVkaW9wcm9jZXNzYCBjYWxsYmFja1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcHJvY2Vzc0ZyYW1lKGUpIHtcbiAgICBpZiAodGhpcy5zdGFydGVkID09PSBmYWxzZSlcbiAgICAgIHJldHVybjtcblxuICAgIHRoaXMuZnJhbWUuZGF0YSA9IGUuaW5wdXRCdWZmZXIuZ2V0Q2hhbm5lbERhdGEodGhpcy5fY2hhbm5lbCk7XG4gICAgdGhpcy5wcm9wYWdhdGVGcmFtZSgpO1xuXG4gICAgdGhpcy5mcmFtZS50aW1lICs9IHRoaXMuX2Jsb2NrRHVyYXRpb247XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQXVkaW9Jbk5vZGU7XG4iXX0=