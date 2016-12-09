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

var _BaseLfo2 = require('../../core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

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

var AudioInNode = function (_BaseLfo) {
  (0, _inherits3.default)(AudioInNode, _BaseLfo);

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
      this.initStream();

      var audioContext = this.params.get('audioContext');
      this.frame.time = 0;

      var frameSize = this.params.get('frameSize');

      // @note: recreate each time because of a firefox weird behavior
      this.scriptProcessor = audioContext.createScriptProcessor(frameSize, 1, 1);
      this.scriptProcessor.onaudioprocess = this.processFrame;

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
      this.frame.data = e.inputBuffer.getChannelData(this._channel);
      this.propagateFrame();

      this.frame.time += this._blockDuration;
    }
  }]);
  return AudioInNode;
}(_BaseLfo3.default);

exports.default = AudioInNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvSW5Ob2RlLmpzIl0sIm5hbWVzIjpbIkF1ZGlvQ29udGV4dCIsIndpbmRvdyIsIndlYmtpdEF1ZGlvQ29udGV4dCIsImRlZmluaXRpb25zIiwiZnJhbWVTaXplIiwidHlwZSIsImRlZmF1bHQiLCJjb25zdGFudCIsImNoYW5uZWwiLCJzb3VyY2VOb2RlIiwiYXVkaW9Db250ZXh0IiwiQXVkaW9Jbk5vZGUiLCJvcHRpb25zIiwicGFyYW1zIiwiZ2V0IiwiRXJyb3IiLCJBdWRpb05vZGUiLCJfY2hhbm5lbCIsIl9ibG9ja0R1cmF0aW9uIiwicHJvY2Vzc0ZyYW1lIiwiYmluZCIsImluaXRTdHJlYW0iLCJmcmFtZSIsInRpbWUiLCJzY3JpcHRQcm9jZXNzb3IiLCJjcmVhdGVTY3JpcHRQcm9jZXNzb3IiLCJvbmF1ZGlvcHJvY2VzcyIsImNvbm5lY3QiLCJkZXN0aW5hdGlvbiIsImZpbmFsaXplU3RyZWFtIiwiZGlzY29ubmVjdCIsInNhbXBsZVJhdGUiLCJzdHJlYW1QYXJhbXMiLCJmcmFtZVJhdGUiLCJmcmFtZVR5cGUiLCJzb3VyY2VTYW1wbGVSYXRlIiwic291cmNlU2FtcGxlQ291bnQiLCJwcm9wYWdhdGVTdHJlYW1QYXJhbXMiLCJlIiwiZGF0YSIsImlucHV0QnVmZmVyIiwiZ2V0Q2hhbm5lbERhdGEiLCJwcm9wYWdhdGVGcmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBRUEsSUFBTUEsZUFBZUMsT0FBT0QsWUFBUCxJQUF1QkMsT0FBT0Msa0JBQW5EOztBQUVBLElBQU1DLGNBQWM7QUFDbEJDLGFBQVc7QUFDVEMsVUFBTSxTQURHO0FBRVRDLGFBQVMsR0FGQTtBQUdUQyxjQUFVO0FBSEQsR0FETztBQU1sQkMsV0FBUztBQUNQSCxVQUFNLFNBREM7QUFFUEMsYUFBUyxDQUZGO0FBR1BDLGNBQVU7QUFISCxHQU5TO0FBV2xCRSxjQUFZO0FBQ1ZKLFVBQU0sS0FESTtBQUVWQyxhQUFTLElBRkM7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QixLQUFLeEIsUUFBbEMsQ0FBbEI7QUFDQSxXQUFLeUIsY0FBTDs7QUFFQSxXQUFLcEIsS0FBTCxDQUFXQyxJQUFYLElBQW1CLEtBQUtMLGNBQXhCO0FBQ0Q7Ozs7O2tCQUdZUCxXIiwiZmlsZSI6IkF1ZGlvSW5Ob2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vLi4vY29yZS9CYXNlTGZvJztcblxuY29uc3QgQXVkaW9Db250ZXh0ID0gd2luZG93LkF1ZGlvQ29udGV4dCB8fMKgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dDtcblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIGZyYW1lU2l6ZToge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiA1MTIsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIGNoYW5uZWw6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogMCxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbiAgc291cmNlTm9kZToge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIGF1ZGlvQ29udGV4dDoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG59O1xuXG4vKipcbiAqIFVzZSBhIGBXZWJBdWRpb2Agbm9kZSBhcyBhIHNvdXJjZSBmb3IgdGhlIGdyYXBoLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgcGFyYW1ldGVyJyBkZWZhdWx0IHZhbHVlcy5cbiAqIEBwYXJhbSB7QXVkaW9Ob2RlfSBbb3B0aW9ucy5zb3VyY2VOb2RlPW51bGxdIC0gQXVkaW8gbm9kZSB0byBwcm9jZXNzXG4gKiAgKG1hbmRhdG9yeSkuXG4gKiBAcGFyYW0ge0F1ZGlvQ29udGV4dH0gW29wdGlvbnMuYXVkaW9Db250ZXh0PW51bGxdIC0gQXVkaW8gY29udGV4dCB1c2VkIHRvXG4gKiAgY3JlYXRlIHRoZSBhdWRpbyBub2RlIChtYW5kYXRvcnkpLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmZyYW1lU2l6ZT01MTJdIC0gU2l6ZSBvZiB0aGUgb3V0cHV0IGJsb2NrcywgZGVmaW5lXG4gKiAgdGhlIGBmcmFtZVNpemVgIGluIHRoZSBgc3RyZWFtUGFyYW1zYC5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5jaGFubmVsPTBdIC0gTnVtYmVyIG9mIHRoZSBjaGFubmVsIHRvIHByb2Nlc3MuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpjbGllbnQuc291cmNlXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY2xpZW50JztcbiAqXG4gKiBjb25zdCBhdWRpb0NvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KCk7XG4gKiBjb25zdCBzaW5lID0gYXVkaW9Db250ZXh0LmNyZWF0ZU9zY2lsbGF0b3IoKTtcbiAqIHNpbmUuZnJlcXVlbmN5LnZhbHVlID0gMjtcbiAqXG4gKiBjb25zdCBhdWRpb0luTm9kZSA9IG5ldyBsZm8uc291cmNlLkF1ZGlvSW5Ob2RlKHtcbiAqICAgYXVkaW9Db250ZXh0OiBhdWRpb0NvbnRleHQsXG4gKiAgIHNvdXJjZU5vZGU6IHNpbmUsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBzaWduYWxEaXNwbGF5ID0gbmV3IGxmby5zaW5rLlNpZ25hbERpc3BsYXkoe1xuICogICBjYW52YXM6ICcjc2lnbmFsJyxcbiAqICAgZHVyYXRpb246IDEsXG4gKiB9KTtcbiAqXG4gKiBhdWRpb0luTm9kZS5jb25uZWN0KHNpZ25hbERpc3BsYXkpO1xuICpcbiAqIC8vIHN0YXJ0IHRoZSBzaW5lIG9zY2lsbGF0b3Igbm9kZSBhbmQgdGhlIGxmbyBncmFwaFxuICogc2luZS5zdGFydCgpO1xuICogYXVkaW9Jbk5vZGUuc3RhcnQoKTtcbiAqL1xuY2xhc3MgQXVkaW9Jbk5vZGUgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgY29uc3QgYXVkaW9Db250ZXh0ID0gdGhpcy5wYXJhbXMuZ2V0KCdhdWRpb0NvbnRleHQnKTtcbiAgICBjb25zdCBzb3VyY2VOb2RlID0gdGhpcy5wYXJhbXMuZ2V0KCdzb3VyY2VOb2RlJyk7XG5cbiAgICBpZiAoIWF1ZGlvQ29udGV4dCB8fCAhKGF1ZGlvQ29udGV4dCBpbnN0YW5jZW9mIEF1ZGlvQ29udGV4dCkpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgYGF1ZGlvQ29udGV4dGAgcGFyYW1ldGVyJyk7XG5cbiAgICBpZiAoIXNvdXJjZU5vZGUgfHwgIShzb3VyY2VOb2RlIGluc3RhbmNlb2YgQXVkaW9Ob2RlKSlcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBgc291cmNlTm9kZWAgcGFyYW1ldGVyJyk7XG5cbiAgICB0aGlzLnNvdXJjZU5vZGUgPSBzb3VyY2VOb2RlO1xuICAgIHRoaXMuX2NoYW5uZWwgPSB0aGlzLnBhcmFtcy5nZXQoJ2NoYW5uZWwnKTtcbiAgICB0aGlzLl9ibG9ja0R1cmF0aW9uID0gbnVsbDtcblxuICAgIHRoaXMucHJvY2Vzc0ZyYW1lID0gdGhpcy5wcm9jZXNzRnJhbWUuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9wYWdhdGUgdGhlIGBzdHJlYW1QYXJhbXNgIGluIHRoZSBncmFwaCBhbmQgc3RhcnQgdG8gcHJvcGFnYXRlIHNpZ25hbFxuICAgKiBibG9ja3MgcHJvZHVjZWQgYnkgdGhlIGF1ZGlvIG5vZGUgaW50byB0aGUgZ3JhcGguXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb2Nlc3NTdHJlYW1QYXJhbXN9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Jlc2V0U3RyZWFtfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y2xpZW50LnNvdXJjZS5BdWRpb0luTm9kZSNzdG9wfVxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5pbml0U3RyZWFtKCk7XG5cbiAgICBjb25zdCBhdWRpb0NvbnRleHQgPSB0aGlzLnBhcmFtcy5nZXQoJ2F1ZGlvQ29udGV4dCcpO1xuICAgIHRoaXMuZnJhbWUudGltZSA9IDA7XG5cbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnBhcmFtcy5nZXQoJ2ZyYW1lU2l6ZScpO1xuXG4gICAgLy8gQG5vdGU6IHJlY3JlYXRlIGVhY2ggdGltZSBiZWNhdXNlIG9mIGEgZmlyZWZveCB3ZWlyZCBiZWhhdmlvclxuICAgIHRoaXMuc2NyaXB0UHJvY2Vzc29yID0gYXVkaW9Db250ZXh0LmNyZWF0ZVNjcmlwdFByb2Nlc3NvcihmcmFtZVNpemUsIDEsIDEpO1xuICAgIHRoaXMuc2NyaXB0UHJvY2Vzc29yLm9uYXVkaW9wcm9jZXNzID0gdGhpcy5wcm9jZXNzRnJhbWU7XG5cbiAgICB0aGlzLnNvdXJjZU5vZGUuY29ubmVjdCh0aGlzLnNjcmlwdFByb2Nlc3Nvcik7XG4gICAgdGhpcy5zY3JpcHRQcm9jZXNzb3IuY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmFsaXplIHRoZSBzdHJlYW0gYW5kIHN0b3AgdGhlIHdob2xlIGdyYXBoLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNmaW5hbGl6ZVN0cmVhbX1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNsaWVudC5zb3VyY2UuQXVkaW9Jbk5vZGUjc3RhcnR9XG4gICAqL1xuICBzdG9wKCkge1xuICAgIHRoaXMuZmluYWxpemVTdHJlYW0odGhpcy5mcmFtZS50aW1lKTtcblxuXG4gICAgdGhpcy5zb3VyY2VOb2RlLmRpc2Nvbm5lY3QoKTtcbiAgICB0aGlzLnNjcmlwdFByb2Nlc3Nvci5kaXNjb25uZWN0KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcygpIHtcbiAgICBjb25zdCBhdWRpb0NvbnRleHQgPSB0aGlzLnBhcmFtcy5nZXQoJ2F1ZGlvQ29udGV4dCcpO1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMucGFyYW1zLmdldCgnZnJhbWVTaXplJyk7XG4gICAgY29uc3Qgc2FtcGxlUmF0ZSA9IGF1ZGlvQ29udGV4dC5zYW1wbGVSYXRlO1xuXG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gZnJhbWVTaXplO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lUmF0ZSA9IHNhbXBsZVJhdGUgLyBmcmFtZVNpemU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVUeXBlID0gJ3NpZ25hbCc7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZSA9IHNhbXBsZVJhdGU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlQ291bnQgPSBmcmFtZVNpemU7XG5cbiAgICB0aGlzLl9ibG9ja0R1cmF0aW9uID0gZnJhbWVTaXplIC8gc2FtcGxlUmF0ZTtcblxuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKipcbiAgICogQmFzaWNhbGx5IHRoZSBgc2NyaXB0UHJvY2Vzc29yLm9uYXVkaW9wcm9jZXNzYCBjYWxsYmFja1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcHJvY2Vzc0ZyYW1lKGUpIHtcbiAgICB0aGlzLmZyYW1lLmRhdGEgPSBlLmlucHV0QnVmZmVyLmdldENoYW5uZWxEYXRhKHRoaXMuX2NoYW5uZWwpO1xuICAgIHRoaXMucHJvcGFnYXRlRnJhbWUoKTtcblxuICAgIHRoaXMuZnJhbWUudGltZSArPSB0aGlzLl9ibG9ja0R1cmF0aW9uO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEF1ZGlvSW5Ob2RlO1xuIl19