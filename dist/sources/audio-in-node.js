'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreBaseLfo = require('../core/base-lfo');

var _coreBaseLfo2 = _interopRequireDefault(_coreBaseLfo);

/**
 *  Use a WebAudio node as a source
 */

var AudioInNode = (function (_AudioIn) {
  _inherits(AudioInNode, _AudioIn);

  function AudioInNode() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, AudioInNode);

    _get(Object.getPrototypeOf(AudioInNode.prototype), 'constructor', this).call(this, {
      frameSize: 512,
      channel: 0,
      ctx: null,
      src: null,
      timeType: 'absolute'
    }, options);

    if (!this.params.ctx || !(this.params.ctx instanceof AudioContext)) {
      throw new Error('Missing audio context parameter (ctx)');
    }

    if (!this.params.src || !(this.params.src instanceof AudioNode)) {
      throw new Error('Missing audio source node parameter (src)');
    }
  }

  _createClass(AudioInNode, [{
    key: 'initialize',
    value: function initialize() {
      _get(Object.getPrototypeOf(AudioInNode.prototype), 'initialize', this).call(this, {
        frameSize: this.params.frameSize,
        frameRate: this.ctx.sampleRate / this.params.frameSize,
        sourceSampleRate: this.ctx.sampleRate
      });

      var blockSize = this.streamParams.frameSize;
      this.scriptProcessor = this.ctx.createScriptProcessor(blockSize, 1, 1);

      // prepare audio graph
      this.scriptProcessor.onaudioprocess = this.process.bind(this);
      this.params.src.connect(this.scriptProcessor);
    }

    // connect the audio nodes to start streaming
  }, {
    key: 'start',
    value: function start() {
      this.initialize();
      this.reset();

      if (this.params.timeType === 'relative') this.time = 0;

      // start "the patch" ;)
      this.scriptProcessor.connect(this.ctx.destination);
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.finalize();
      this.scriptProcessor.disconnect();
    }

    // is basically the `scriptProcessor.onaudioprocess` callback
  }, {
    key: 'process',
    value: function process(e) {
      var block = e.inputBuffer.getChannelData(this.params.channel);

      this.time += block.length / this.streamParams.sourceSampleRate;
      this.outFrame.set(block, 0);
      this.output();
    }
  }]);

  return AudioInNode;
})(AudioIn);

exports['default'] = AudioInNode;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL2F1ZGlvLWluLW5vZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OzsyQkFBb0Isa0JBQWtCOzs7Ozs7OztJQUtqQixXQUFXO1lBQVgsV0FBVzs7QUFFbkIsV0FGUSxXQUFXLEdBRUo7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQUZMLFdBQVc7O0FBRzVCLCtCQUhpQixXQUFXLDZDQUd0QjtBQUNKLGVBQVMsRUFBRSxHQUFHO0FBQ2QsYUFBTyxFQUFFLENBQUM7QUFDVixTQUFHLEVBQUUsSUFBSTtBQUNULFNBQUcsRUFBRSxJQUFJO0FBQ1QsY0FBUSxFQUFFLFVBQVU7S0FDckIsRUFBRSxPQUFPLEVBQUU7O0FBRVosUUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLFlBQVksWUFBWSxDQUFBLEFBQUMsRUFBRTtBQUNsRSxZQUFNLElBQUksS0FBSyxDQUFDLHVDQUF1QyxDQUFDLENBQUM7S0FDMUQ7O0FBRUQsUUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLFlBQVksU0FBUyxDQUFBLEFBQUMsRUFBRTtBQUMvRCxZQUFNLElBQUksS0FBSyxDQUFDLDJDQUEyQyxDQUFDLENBQUM7S0FDOUQ7R0FDRjs7ZUFsQmtCLFdBQVc7O1dBb0JwQixzQkFBRztBQUNYLGlDQXJCaUIsV0FBVyw0Q0FxQlg7QUFDZixpQkFBUyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUztBQUNoQyxpQkFBUyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUztBQUN0RCx3QkFBZ0IsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVU7T0FDdEMsRUFBRTs7QUFFSCxVQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQztBQUM1QyxVQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7O0FBR3ZFLFVBQUksQ0FBQyxlQUFlLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlELFVBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7S0FDL0M7Ozs7O1dBR0ksaUJBQUc7QUFDTixVQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDbEIsVUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDOztBQUViLFVBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEtBQUssVUFBVSxFQUNyQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQzs7O0FBR2hCLFVBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7S0FDcEQ7OztXQUVHLGdCQUFHO0FBQ0wsVUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ2hCLFVBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLENBQUM7S0FDbkM7Ozs7O1dBR00saUJBQUMsQ0FBQyxFQUFFO0FBQ1QsVUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFaEUsVUFBSSxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUM7QUFDL0QsVUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzVCLFVBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUNmOzs7U0EzRGtCLFdBQVc7R0FBUyxPQUFPOztxQkFBM0IsV0FBVyIsImZpbGUiOiJlczYvc291cmNlcy9hdWRpby1pbi1ub2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vY29yZS9iYXNlLWxmbyc7XG5cbi8qKlxuICogIFVzZSBhIFdlYkF1ZGlvIG5vZGUgYXMgYSBzb3VyY2VcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXVkaW9Jbk5vZGUgZXh0ZW5kcyBBdWRpb0luIHtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcih7XG4gICAgICBmcmFtZVNpemU6IDUxMixcbiAgICAgIGNoYW5uZWw6IDAsXG4gICAgICBjdHg6IG51bGwsXG4gICAgICBzcmM6IG51bGwsXG4gICAgICB0aW1lVHlwZTogJ2Fic29sdXRlJyxcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIGlmICghdGhpcy5wYXJhbXMuY3R4IHx8ICEodGhpcy5wYXJhbXMuY3R4IGluc3RhbmNlb2YgQXVkaW9Db250ZXh0KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIGF1ZGlvIGNvbnRleHQgcGFyYW1ldGVyIChjdHgpJyk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnBhcmFtcy5zcmMgfHwgISh0aGlzLnBhcmFtcy5zcmMgaW5zdGFuY2VvZiBBdWRpb05vZGUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgYXVkaW8gc291cmNlIG5vZGUgcGFyYW1ldGVyIChzcmMpJyk7XG4gICAgfVxuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKHtcbiAgICAgIGZyYW1lU2l6ZTogdGhpcy5wYXJhbXMuZnJhbWVTaXplLFxuICAgICAgZnJhbWVSYXRlOiB0aGlzLmN0eC5zYW1wbGVSYXRlIC8gdGhpcy5wYXJhbXMuZnJhbWVTaXplLFxuICAgICAgc291cmNlU2FtcGxlUmF0ZTogdGhpcy5jdHguc2FtcGxlUmF0ZSxcbiAgICB9KTtcblxuICAgIHZhciBibG9ja1NpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgdGhpcy5zY3JpcHRQcm9jZXNzb3IgPSB0aGlzLmN0eC5jcmVhdGVTY3JpcHRQcm9jZXNzb3IoYmxvY2tTaXplLCAxLCAxKTtcblxuICAgIC8vIHByZXBhcmUgYXVkaW8gZ3JhcGhcbiAgICB0aGlzLnNjcmlwdFByb2Nlc3Nvci5vbmF1ZGlvcHJvY2VzcyA9IHRoaXMucHJvY2Vzcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMucGFyYW1zLnNyYy5jb25uZWN0KHRoaXMuc2NyaXB0UHJvY2Vzc29yKTtcbiAgfVxuXG4gIC8vIGNvbm5lY3QgdGhlIGF1ZGlvIG5vZGVzIHRvIHN0YXJ0IHN0cmVhbWluZ1xuICBzdGFydCgpIHtcbiAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnJlc2V0KCk7XG5cbiAgICBpZiAodGhpcy5wYXJhbXMudGltZVR5cGUgPT09ICdyZWxhdGl2ZScpXG4gICAgICB0aGlzLnRpbWUgPSAwO1xuXG4gICAgLy8gc3RhcnQgXCJ0aGUgcGF0Y2hcIiA7KVxuICAgIHRoaXMuc2NyaXB0UHJvY2Vzc29yLmNvbm5lY3QodGhpcy5jdHguZGVzdGluYXRpb24pO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICB0aGlzLmZpbmFsaXplKCk7XG4gICAgdGhpcy5zY3JpcHRQcm9jZXNzb3IuZGlzY29ubmVjdCgpO1xuICB9XG5cbiAgLy8gaXMgYmFzaWNhbGx5IHRoZSBgc2NyaXB0UHJvY2Vzc29yLm9uYXVkaW9wcm9jZXNzYCBjYWxsYmFja1xuICBwcm9jZXNzKGUpIHtcbiAgICBjb25zdCBibG9jayA9IGUuaW5wdXRCdWZmZXIuZ2V0Q2hhbm5lbERhdGEodGhpcy5wYXJhbXMuY2hhbm5lbCk7XG5cbiAgICB0aGlzLnRpbWUgKz0gYmxvY2subGVuZ3RoIC8gdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZTtcbiAgICB0aGlzLm91dEZyYW1lLnNldChibG9jaywgMCk7XG4gICAgdGhpcy5vdXRwdXQoKTtcbiAgfVxufVxuIl19