"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var EventEmitter = require("events").EventEmitter;
// var extend = require('object-assign');

var Lfo = (function (_EventEmitter) {
  function Lfo() {
    var previous = arguments[0] === undefined ? null : arguments[0];
    var options = arguments[1] === undefined ? {} : arguments[1];
    var defaults = arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, Lfo);

    this.idx = 0;
    this.params = {};
    this.streamParams = {
      frameSize: 1,
      frameRate: 0
    };

    this.params = _core.Object.assign({}, defaults, options);

    if (previous) {
      // add ourselves to the previous operator if its passed
      previous.add(this);
      // pass on stream params
      this.streamParams = _core.Object.assign({}, previous.streamParams);
    }
  }

  _inherits(Lfo, _EventEmitter);

  _createClass(Lfo, {
    reset: {

      // reset `outFrame` and call reset on children

      value: function reset() {}
    },
    finalize: {

      // fill the on-going buffer with 0
      // output it, then call reset on all the children
      // @NOTE the event based system (async) could produce that the reset
      //       could be called before the child finalize

      value: function finalize() {}
    },
    setupStream: {

      // common stream config based on the instantiated params

      value: function setupStream() {
        var opts = arguments[0] === undefined ? {} : arguments[0];

        if (opts.frameRate) {
          this.streamParams.frameRate = opts.frameRate;
        }

        if (opts.frameSize) {
          this.streamParams.frameSize = opts.frameSize;
        }

        if (opts.blockSampleRate) {
          this.streamParams.blockSampleRate = opts.blockSampleRate;
        }

        this.outFrame = new Float32Array(this.streamParams.frameSize);
      }
    },
    add: {

      // bind child node

      value: function add() {
        var lfo = arguments[0] === undefined ? null : arguments[0];

        this.on("frame", function (time, frame, metaData) {
          lfo.process(time, frame, metaData);
        });
      }
    },
    output: {

      // we take care of the emit ourselves

      value: function output() {
        var outTime = arguments[0] === undefined ? this.time : arguments[0];
        var outFrame = arguments[1] === undefined ? this.outFrame : arguments[1];
        var metaData = arguments[2] === undefined ? this.metaData : arguments[2];

        this.emit("frame", outTime, outFrame, metaData);
      }
    },
    remove: {

      // removes all children from listening

      value: function remove() {
        this.removeAllListeners("frame");
      }
    },
    process: {
      value: function process(time, frame, metadata) {
        this.time = time;
      }
    },
    destroy: {

      // will delete itself from the parent node
      // @NOTE this node and all his children will never garbage collected
      // `this.previous = null` fixes the first problem but not the second one

      value: function destroy() {
        if (!this.previous) {
          return;
        }
        this.previous.removeListener("frame", this);
      }
    }
  });

  return Lfo;
})(EventEmitter);

function factory(previous, options, defaults) {
  return new Lfo(previous, options, defaults);
}
factory.Lfo = Lfo;

module.exports = factory;
//# sourceMappingURL=data:application/json;base64,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QUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztPQUM3Qzs7OztTQXpFRyxHQUFHO0dBQVMsWUFBWTs7QUE2RTlCLFNBQVMsT0FBTyxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQzVDLFNBQU8sSUFBSSxHQUFHLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztDQUM3QztBQUNELE9BQU8sQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDOztBQUVsQixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyIsImZpbGUiOiJlczYvY29yZS9sZm8tYmFzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG4vLyB2YXIgZXh0ZW5kID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xuXG5jbGFzcyBMZm8gZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuXG4gIGNvbnN0cnVjdG9yKHByZXZpb3VzID0gbnVsbCwgb3B0aW9ucyA9IHt9LCBkZWZhdWx0cyA9IHt9KSB7XG4gICAgdGhpcy5pZHggPSAwO1xuICAgIHRoaXMucGFyYW1zID0ge307XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMgPSB7XG4gICAgICBmcmFtZVNpemU6IDEsXG4gICAgICBmcmFtZVJhdGU6IDBcbiAgICB9O1xuXG4gICAgdGhpcy5wYXJhbXMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG5cbiAgICBpZiAocHJldmlvdXMpIHtcbiAgICAgIC8vIGFkZCBvdXJzZWx2ZXMgdG8gdGhlIHByZXZpb3VzIG9wZXJhdG9yIGlmIGl0cyBwYXNzZWRcbiAgICAgIHByZXZpb3VzLmFkZCh0aGlzKTtcbiAgICAgIC8vIHBhc3Mgb24gc3RyZWFtIHBhcmFtc1xuICAgICAgdGhpcy5zdHJlYW1QYXJhbXMgPSBPYmplY3QuYXNzaWduKHt9LCBwcmV2aW91cy5zdHJlYW1QYXJhbXMpO1xuICAgIH1cbiAgfVxuXG4gIC8vIHJlc2V0IGBvdXRGcmFtZWAgYW5kIGNhbGwgcmVzZXQgb24gY2hpbGRyZW5cbiAgcmVzZXQoKSB7fVxuXG4gIC8vIGZpbGwgdGhlIG9uLWdvaW5nIGJ1ZmZlciB3aXRoIDBcbiAgLy8gb3V0cHV0IGl0LCB0aGVuIGNhbGwgcmVzZXQgb24gYWxsIHRoZSBjaGlsZHJlblxuICAvLyBATk9URSB0aGUgZXZlbnQgYmFzZWQgc3lzdGVtIChhc3luYykgY291bGQgcHJvZHVjZSB0aGF0IHRoZSByZXNldFxuICAvLyAgICAgICBjb3VsZCBiZSBjYWxsZWQgYmVmb3JlIHRoZSBjaGlsZCBmaW5hbGl6ZVxuICBmaW5hbGl6ZSgpIHt9XG5cbiAgLy8gY29tbW9uIHN0cmVhbSBjb25maWcgYmFzZWQgb24gdGhlIGluc3RhbnRpYXRlZCBwYXJhbXNcbiAgc2V0dXBTdHJlYW0ob3B0cyA9IHt9KSB7XG4gICAgaWYgKG9wdHMuZnJhbWVSYXRlKSB7XG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVJhdGUgPSBvcHRzLmZyYW1lUmF0ZTtcbiAgICB9XG5cbiAgICBpZiAob3B0cy5mcmFtZVNpemUpIHtcbiAgICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IG9wdHMuZnJhbWVTaXplO1xuICAgIH1cblxuICAgIGlmIChvcHRzLmJsb2NrU2FtcGxlUmF0ZSkge1xuICAgICAgdGhpcy5zdHJlYW1QYXJhbXMuYmxvY2tTYW1wbGVSYXRlID0gb3B0cy5ibG9ja1NhbXBsZVJhdGU7XG4gICAgfVxuXG4gICAgdGhpcy5vdXRGcmFtZSA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplKTtcbiAgfVxuXG4gIC8vIGJpbmQgY2hpbGQgbm9kZVxuICBhZGQobGZvID0gbnVsbCkge1xuICAgIHRoaXMub24oJ2ZyYW1lJywgZnVuY3Rpb24odGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgICBsZm8ucHJvY2Vzcyh0aW1lLCBmcmFtZSwgbWV0YURhdGEpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gd2UgdGFrZSBjYXJlIG9mIHRoZSBlbWl0IG91cnNlbHZlc1xuICBvdXRwdXQob3V0VGltZSA9IHRoaXMudGltZSwgb3V0RnJhbWUgPSB0aGlzLm91dEZyYW1lLCBtZXRhRGF0YSA9IHRoaXMubWV0YURhdGEpIHtcbiAgICB0aGlzLmVtaXQoJ2ZyYW1lJywgb3V0VGltZSwgb3V0RnJhbWUsIG1ldGFEYXRhKTtcbiAgfVxuXG4gIC8vIHJlbW92ZXMgYWxsIGNoaWxkcmVuIGZyb20gbGlzdGVuaW5nXG4gIHJlbW92ZSgpIHtcbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygnZnJhbWUnKTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFkYXRhKSB7XG4gICAgdGhpcy50aW1lID0gdGltZTtcbiAgfVxuXG4gIC8vIHdpbGwgZGVsZXRlIGl0c2VsZiBmcm9tIHRoZSBwYXJlbnQgbm9kZVxuICAvLyBATk9URSB0aGlzIG5vZGUgYW5kIGFsbCBoaXMgY2hpbGRyZW4gd2lsbCBuZXZlciBnYXJiYWdlIGNvbGxlY3RlZFxuICAvLyBgdGhpcy5wcmV2aW91cyA9IG51bGxgIGZpeGVzIHRoZSBmaXJzdCBwcm9ibGVtIGJ1dCBub3QgdGhlIHNlY29uZCBvbmVcbiAgZGVzdHJveSgpIHtcbiAgICBpZiAoIXRoaXMucHJldmlvdXMpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy5wcmV2aW91cy5yZW1vdmVMaXN0ZW5lcignZnJhbWUnLCB0aGlzKTtcbiAgfVxuXG59XG5cbmZ1bmN0aW9uIGZhY3RvcnkocHJldmlvdXMsIG9wdGlvbnMsIGRlZmF1bHRzKSB7XG4gIHJldHVybiBuZXcgTGZvKHByZXZpb3VzLCBvcHRpb25zLCBkZWZhdWx0cyk7XG59XG5mYWN0b3J5LkxmbyA9IExmbztcblxubW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5O1xuIl19