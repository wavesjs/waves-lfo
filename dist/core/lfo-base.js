"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var id = 0;

var Lfo = (function () {
  function Lfo() {
    var parent = arguments[0] === undefined ? null : arguments[0];
    var options = arguments[1] === undefined ? {} : arguments[1];
    var defaults = arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, Lfo);

    this.cid = id++;
    this.params = {};
    this.streamParams = {
      frameSize: 1,
      frameRate: 0,
      blockSampleRate: 0
    };

    this.params = _core.Object.assign({}, defaults, options);
    this.children = [];

    if (parent) {
      if (parent.streamParams === null) {
        throw new Error("cannot connect to as dead lfo node");
      }

      this.parent = parent;
      // add ourselves to the parent operator if its passed
      this.parent.add(this);
      // pass on stream params
      this.streamParams = _core.Object.assign({}, this.parent.streamParams);
    }
  }

  _createClass(Lfo, {
    reset: {

      // reset `outFrame` and call reset on children

      value: function reset() {
        for (var i = 0, l = this.children.length; i < l; i++) {
          this.children[i].reset();
        }

        // this.outFrame.fill(0); // probably better but doesn't work yet
        for (var i = 0, l = this.outFrame.length; i < l; i++) {
          this.outFrame[i] = 0;
        }
      }
    },
    finalize: {

      // fill the on-going buffer with 0
      // output it, then call reset on all the children (sure ?)
      // @NOTE: what about calling `reset` in `sources.start`
      //  if `reset` is called here, it will be called more than once in a child node

      value: function finalize() {
        for (var i = 0, l = this.children.length; i < l; i++) {
          this.children[i].finalize();
        }
      }
    },
    setupStream: {

      // common stream configuration based on the given params

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

        this.children.push(lfo);
      }
    },
    output: {

      // forward the current state (time, frame, metaData) to all the children

      value: function output() {
        var time = arguments[0] === undefined ? this.time : arguments[0];
        var outFrame = arguments[1] === undefined ? this.outFrame : arguments[1];
        var metaData = arguments[2] === undefined ? this.metaData : arguments[2];

        for (var i = 0, l = this.children.length; i < l; i++) {
          this.children[i].process(time, outFrame, metaData);
        }
      }
    },
    process: {

      // main function to override, defaults to noop

      value: function process(time, frame, metaData) {
        this.time = time;
        this.outFrame = frame;
        this.metaData = metaData;

        this.output();
      }
    },
    destroy: {
      value: function destroy() {
        // call `destroy` in all it's children
        var index = this.children.length;
        while (index--) {
          this.children[index].destroy();
        }

        // delete itself from the parent node
        if (this.parent) {
          var index = this.parent.children.indexOf(this);
          this.parent.children.splice(index, 1);
        }

        // cannot use a dead object as parent
        this.streamParams = null;

        // clean it's own references / disconnect audio nodes if needed
      }
    }
  });

  return Lfo;
})();

module.exports = Lfo;
//# sourceMappingURL=data:application/json;base64,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QyxJQUFJLENBQUMsQ0FBQztBQUNoRCxjQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ3ZDOzs7QUFHRCxZQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQzs7O09BRzFCOzs7O1NBdkdHLEdBQUc7OztBQTJHVCxNQUFNLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQyIsImZpbGUiOiJlczYvY29yZS9sZm8tYmFzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIGlkID0gMDtcblxuY2xhc3MgTGZvIHtcbiAgY29uc3RydWN0b3IocGFyZW50ID0gbnVsbCwgb3B0aW9ucyA9IHt9LCBkZWZhdWx0cyA9IHt9KSB7XG4gICAgdGhpcy5jaWQgPSBpZCsrO1xuICAgIHRoaXMucGFyYW1zID0ge307XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMgPSB7XG4gICAgICBmcmFtZVNpemU6IDEsXG4gICAgICBmcmFtZVJhdGU6IDAsXG4gICAgICBibG9ja1NhbXBsZVJhdGU6IDBcbiAgICB9O1xuXG4gICAgdGhpcy5wYXJhbXMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuXG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgaWYgKHBhcmVudC5zdHJlYW1QYXJhbXMgPT09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjYW5ub3QgY29ubmVjdCB0byBhcyBkZWFkIGxmbyBub2RlJyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgICAgLy8gYWRkIG91cnNlbHZlcyB0byB0aGUgcGFyZW50IG9wZXJhdG9yIGlmIGl0cyBwYXNzZWRcbiAgICAgIHRoaXMucGFyZW50LmFkZCh0aGlzKTtcbiAgICAgIC8vIHBhc3Mgb24gc3RyZWFtIHBhcmFtc1xuICAgICAgdGhpcy5zdHJlYW1QYXJhbXMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnBhcmVudC5zdHJlYW1QYXJhbXMpO1xuICAgIH1cbiAgfVxuXG4gIC8vIHJlc2V0IGBvdXRGcmFtZWAgYW5kIGNhbGwgcmVzZXQgb24gY2hpbGRyZW5cbiAgcmVzZXQoKSB7XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdGhpcy5jaGlsZHJlbltpXS5yZXNldCgpO1xuICAgIH1cblxuICAgIC8vIHRoaXMub3V0RnJhbWUuZmlsbCgwKTsgLy8gcHJvYmFibHkgYmV0dGVyIGJ1dCBkb2Vzbid0IHdvcmsgeWV0XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLm91dEZyYW1lLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdGhpcy5vdXRGcmFtZVtpXSA9IDA7XG4gICAgfVxuICB9XG5cbiAgLy8gZmlsbCB0aGUgb24tZ29pbmcgYnVmZmVyIHdpdGggMFxuICAvLyBvdXRwdXQgaXQsIHRoZW4gY2FsbCByZXNldCBvbiBhbGwgdGhlIGNoaWxkcmVuIChzdXJlID8pXG4gIC8vIEBOT1RFOiB3aGF0IGFib3V0IGNhbGxpbmcgYHJlc2V0YCBpbiBgc291cmNlcy5zdGFydGBcbiAgLy8gIGlmIGByZXNldGAgaXMgY2FsbGVkIGhlcmUsIGl0IHdpbGwgYmUgY2FsbGVkIG1vcmUgdGhhbiBvbmNlIGluIGEgY2hpbGQgbm9kZVxuICBmaW5hbGl6ZSgpIHtcbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB0aGlzLmNoaWxkcmVuW2ldLmZpbmFsaXplKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gY29tbW9uIHN0cmVhbSBjb25maWd1cmF0aW9uIGJhc2VkIG9uIHRoZSBnaXZlbiBwYXJhbXNcbiAgc2V0dXBTdHJlYW0ob3B0cyA9IHt9KSB7XG4gICAgaWYgKG9wdHMuZnJhbWVSYXRlKSB7XG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVJhdGUgPSBvcHRzLmZyYW1lUmF0ZTtcbiAgICB9XG5cbiAgICBpZiAob3B0cy5mcmFtZVNpemUpIHtcbiAgICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IG9wdHMuZnJhbWVTaXplO1xuICAgIH1cblxuICAgIGlmIChvcHRzLmJsb2NrU2FtcGxlUmF0ZSkge1xuICAgICAgdGhpcy5zdHJlYW1QYXJhbXMuYmxvY2tTYW1wbGVSYXRlID0gb3B0cy5ibG9ja1NhbXBsZVJhdGU7XG4gICAgfVxuXG4gICAgdGhpcy5vdXRGcmFtZSA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplKTtcbiAgfVxuXG4gIC8vIGJpbmQgY2hpbGQgbm9kZVxuICBhZGQobGZvID0gbnVsbCkge1xuICAgIHRoaXMuY2hpbGRyZW4ucHVzaChsZm8pO1xuICB9XG5cbiAgLy8gZm9yd2FyZCB0aGUgY3VycmVudCBzdGF0ZSAodGltZSwgZnJhbWUsIG1ldGFEYXRhKSB0byBhbGwgdGhlIGNoaWxkcmVuXG4gIG91dHB1dCh0aW1lID0gdGhpcy50aW1lLCBvdXRGcmFtZSA9IHRoaXMub3V0RnJhbWUsIG1ldGFEYXRhID0gdGhpcy5tZXRhRGF0YSkge1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHRoaXMuY2hpbGRyZW5baV0ucHJvY2Vzcyh0aW1lLCBvdXRGcmFtZSwgbWV0YURhdGEpO1xuICAgIH1cbiAgfVxuXG4gIC8vIG1haW4gZnVuY3Rpb24gdG8gb3ZlcnJpZGUsIGRlZmF1bHRzIHRvIG5vb3BcbiAgcHJvY2Vzcyh0aW1lLCBmcmFtZSwgbWV0YURhdGEpIHtcbiAgICB0aGlzLnRpbWUgPSB0aW1lO1xuICAgIHRoaXMub3V0RnJhbWUgPSBmcmFtZTtcbiAgICB0aGlzLm1ldGFEYXRhID0gbWV0YURhdGE7XG5cbiAgICB0aGlzLm91dHB1dCgpO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICAvLyBjYWxsIGBkZXN0cm95YCBpbiBhbGwgaXQncyBjaGlsZHJlblxuICAgIHZhciBpbmRleCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoO1xuICAgIHdoaWxlIChpbmRleC0tKSB7XG4gICAgICB0aGlzLmNoaWxkcmVuW2luZGV4XS5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgLy8gZGVsZXRlIGl0c2VsZiBmcm9tIHRoZSBwYXJlbnQgbm9kZVxuICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgdmFyIGluZGV4ID0gIHRoaXMucGFyZW50LmNoaWxkcmVuLmluZGV4T2YodGhpcyk7XG4gICAgICB0aGlzLnBhcmVudC5jaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cblxuICAgIC8vIGNhbm5vdCB1c2UgYSBkZWFkIG9iamVjdCBhcyBwYXJlbnRcbiAgICB0aGlzLnN0cmVhbVBhcmFtcyA9IG51bGw7XG5cbiAgICAvLyBjbGVhbiBpdCdzIG93biByZWZlcmVuY2VzIC8gZGlzY29ubmVjdCBhdWRpbyBub2RlcyBpZiBuZWVkZWRcbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gTGZvO1xuIl19