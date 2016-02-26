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

/*
  can forward
    - relativeTime (according to it's start() method)
    - absoluteTime (audioContex time)
    - input time

  methods
    - `start()` -> call `reset()`
    - `stop()`  -> call `finalize()`
*/

var EventIn = (function (_BaseLfo) {
  _inherits(EventIn, _BaseLfo);

  function EventIn(options) {
    _classCallCheck(this, EventIn);

    _get(Object.getPrototypeOf(EventIn.prototype), 'constructor', this).call(this, options, {
      timeType: 'absolute'
    });

    // test AudioContext for use in node environment
    if (!this.params.ctx && typeof process === 'undefined') {
      this.params.ctx = new AudioContext();
    }

    this._isStarted = false;
    this._startTime = undefined;
  }

  _createClass(EventIn, [{
    key: 'configureStream',
    value: function configureStream() {
      // throw error if some values are undefined ?
      this.streamParams.frameSize = this.params.frameSize;
      this.streamParams.frameRate = this.params.frameRate;
      // @NOTE what does make sens in this case ?
      // this.streamParams.sourceSampleRate = this.params.frameSize * this.params.frameRate;
      this.streamParams.sourceSampleRate = this.params.sourceSampleRate || this.params.frameRate;
    }
  }, {
    key: 'start',
    value: function start() {
      // should be setted in the first process call
      this._isStarted = true;
      this._startTime = undefined;

      this.initialize();
      this.reset();
    }
  }, {
    key: 'stop',
    value: function stop() {
      this._isStarted = false;
      this._startTime = undefined;
      this.finalize();
    }
  }, {
    key: 'process',
    value: function process(time, frame) {
      var metaData = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      if (!this._isStarted) {
        return;
      }
      // à revoir
      // if no time provided, use audioContext.currentTime
      var frameTime = !isNaN(parseFloat(time)) && isFinite(time) ? time : this.params.ctx.currentTime;

      // set `startTime` if first call after a `start`
      if (!this._startTime) {
        this._startTime = frameTime;
      }

      // handle time according to config
      if (this.params.timeType === 'relative') {
        frameTime = time - this._startTime;
      }

      // if scalar, create a vector
      if (frame.length === undefined) {
        frame = [frame];
      }
      // works if frame is an array
      this.outFrame.set(frame, 0);
      this.time = frameTime;
      this.metaData = metaData;

      this.output();
    }
  }]);

  return EventIn;
})(_coreBaseLfo2['default']);

exports['default'] = EventIn;

module.exports = EventIn;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL2V2ZW50LWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7MkJBQW9CLGtCQUFrQjs7Ozs7Ozs7Ozs7Ozs7O0lBYWpCLE9BQU87WUFBUCxPQUFPOztBQUNmLFdBRFEsT0FBTyxDQUNkLE9BQU8sRUFBRTswQkFERixPQUFPOztBQUV4QiwrQkFGaUIsT0FBTyw2Q0FFbEIsT0FBTyxFQUFFO0FBQ2IsY0FBUSxFQUFFLFVBQVU7S0FDckIsRUFBRTs7O0FBR0gsUUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFLLE9BQU8sT0FBTyxLQUFLLFdBQVcsQUFBQyxFQUFFO0FBQ3hELFVBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7S0FDdEM7O0FBRUQsUUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7QUFDeEIsUUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7R0FDN0I7O2VBYmtCLE9BQU87O1dBZVgsMkJBQUc7O0FBRWhCLFVBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ3BELFVBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDOzs7QUFHcEQsVUFBSSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsR0FBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxBQUFDLENBQUM7S0FDOUY7OztXQUVJLGlCQUFHOztBQUVOLFVBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0FBQ3ZCLFVBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDOztBQUU1QixVQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDbEIsVUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ2Q7OztXQUVHLGdCQUFHO0FBQ0wsVUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7QUFDeEIsVUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7QUFDNUIsVUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQ2pCOzs7V0FFTSxpQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFpQjtVQUFmLFFBQVEseURBQUcsRUFBRTs7QUFDaEMsVUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFBRSxlQUFPO09BQUU7OztBQUdqQyxVQUFJLFNBQVMsR0FBRyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQ3hELElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUM7OztBQUdyQyxVQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtBQUFFLFlBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO09BQUU7OztBQUd0RCxVQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxLQUFLLFVBQVUsRUFBRTtBQUN2QyxpQkFBUyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO09BQ3BDOzs7QUFHRCxVQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFO0FBQUUsYUFBSyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7T0FBRTs7QUFFcEQsVUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzVCLFVBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO0FBQ3RCLFVBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDOztBQUV6QixVQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDZjs7O1NBOURrQixPQUFPOzs7cUJBQVAsT0FBTzs7QUFpRTVCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDIiwiZmlsZSI6ImVzNi9zb3VyY2VzL2V2ZW50LWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vY29yZS9iYXNlLWxmbyc7XG5cbi8qXG4gIGNhbiBmb3J3YXJkXG4gICAgLSByZWxhdGl2ZVRpbWUgKGFjY29yZGluZyB0byBpdCdzIHN0YXJ0KCkgbWV0aG9kKVxuICAgIC0gYWJzb2x1dGVUaW1lIChhdWRpb0NvbnRleCB0aW1lKVxuICAgIC0gaW5wdXQgdGltZVxuXG4gIG1ldGhvZHNcbiAgICAtIGBzdGFydCgpYCAtPiBjYWxsIGByZXNldCgpYFxuICAgIC0gYHN0b3AoKWAgIC0+IGNhbGwgYGZpbmFsaXplKClgXG4qL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFdmVudEluIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihvcHRpb25zLCB7XG4gICAgICB0aW1lVHlwZTogJ2Fic29sdXRlJ1xuICAgIH0pO1xuXG4gICAgLy8gdGVzdCBBdWRpb0NvbnRleHQgZm9yIHVzZSBpbiBub2RlIGVudmlyb25tZW50XG4gICAgaWYgKCF0aGlzLnBhcmFtcy5jdHggJiYgKHR5cGVvZiBwcm9jZXNzID09PSAndW5kZWZpbmVkJykpIHtcbiAgICAgIHRoaXMucGFyYW1zLmN0eCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9pc1N0YXJ0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9zdGFydFRpbWUgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBjb25maWd1cmVTdHJlYW0oKSB7XG4gICAgLy8gdGhyb3cgZXJyb3IgaWYgc29tZSB2YWx1ZXMgYXJlIHVuZGVmaW5lZCA/XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gdGhpcy5wYXJhbXMuZnJhbWVTaXplO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lUmF0ZSA9IHRoaXMucGFyYW1zLmZyYW1lUmF0ZTtcbiAgICAvLyBATk9URSB3aGF0IGRvZXMgbWFrZSBzZW5zIGluIHRoaXMgY2FzZSA/XG4gICAgLy8gdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZSA9IHRoaXMucGFyYW1zLmZyYW1lU2l6ZSAqIHRoaXMucGFyYW1zLmZyYW1lUmF0ZTtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlID0gKHRoaXMucGFyYW1zLnNvdXJjZVNhbXBsZVJhdGUgfHzCoHRoaXMucGFyYW1zLmZyYW1lUmF0ZSk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICAvLyBzaG91bGQgYmUgc2V0dGVkIGluIHRoZSBmaXJzdCBwcm9jZXNzIGNhbGxcbiAgICB0aGlzLl9pc1N0YXJ0ZWQgPSB0cnVlO1xuICAgIHRoaXMuX3N0YXJ0VGltZSA9IHVuZGVmaW5lZDtcblxuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5faXNTdGFydGVkID0gZmFsc2U7XG4gICAgdGhpcy5fc3RhcnRUaW1lID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuZmluYWxpemUoKTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhID0ge30pIHtcbiAgICBpZiAoIXRoaXMuX2lzU3RhcnRlZCkgeyByZXR1cm47IH1cbiAgICAvLyDDoCByZXZvaXJcbiAgICAvLyBpZiBubyB0aW1lIHByb3ZpZGVkLCB1c2UgYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lXG4gICAgdmFyIGZyYW1lVGltZSA9ICFpc05hTihwYXJzZUZsb2F0KHRpbWUpKSAmJiBpc0Zpbml0ZSh0aW1lKSA/XG4gICAgICB0aW1lIDogdGhpcy5wYXJhbXMuY3R4LmN1cnJlbnRUaW1lO1xuXG4gICAgLy8gc2V0IGBzdGFydFRpbWVgIGlmIGZpcnN0IGNhbGwgYWZ0ZXIgYSBgc3RhcnRgXG4gICAgaWYgKCF0aGlzLl9zdGFydFRpbWUpIHsgdGhpcy5fc3RhcnRUaW1lID0gZnJhbWVUaW1lOyB9XG5cbiAgICAvLyBoYW5kbGUgdGltZSBhY2NvcmRpbmcgdG8gY29uZmlnXG4gICAgaWYgKHRoaXMucGFyYW1zLnRpbWVUeXBlID09PSAncmVsYXRpdmUnKSB7XG4gICAgICBmcmFtZVRpbWUgPSB0aW1lIC0gdGhpcy5fc3RhcnRUaW1lO1xuICAgIH1cblxuICAgIC8vIGlmIHNjYWxhciwgY3JlYXRlIGEgdmVjdG9yXG4gICAgaWYgKGZyYW1lLmxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7IGZyYW1lID0gW2ZyYW1lXTsgfVxuICAgIC8vIHdvcmtzIGlmIGZyYW1lIGlzIGFuIGFycmF5XG4gICAgdGhpcy5vdXRGcmFtZS5zZXQoZnJhbWUsIDApO1xuICAgIHRoaXMudGltZSA9IGZyYW1lVGltZTtcbiAgICB0aGlzLm1ldGFEYXRhID0gbWV0YURhdGE7XG5cbiAgICB0aGlzLm91dHB1dCgpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRJbjtcbiJdfQ==