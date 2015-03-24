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
      frameRate: 0
    };

    this.params = _core.Object.assign({}, defaults, options);
    this.children = [];

    if (parent) {
      if (parent.streamParams === null) {
        throw new Error("cannot connect to as dead node");
      }
      // add ourselves to the parent operator if its passed
      parent.add(this);
      // pass on stream params
      this.streamParams = _core.Object.assign({}, parent.streamParams);
    }
  }

  _createClass(Lfo, {
    reset: {

      // reset `outFrame` and call reset on children

      value: function reset() {}
    },
    finalize: {

      // fill the on-going buffer with 0
      // output it, then call reset on all the children

      value: function finalize() {}
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
        for (var i = 0, l = this.children.length; i < l; i++) {
          this.children[i].destroy();
        }

        // delete itself from the parent node
        if (this.previous) {
          var index = parent.children.indexOf(this);
          parent.children.splice(index, 1);
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
//# sourceMappingURL=data:application/json;base64,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QUFRLEdBQUcsUUFBUSxDQUFDOztBQUV6QixZQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7T0FDZjs7QUFFRCxXQUFPO2FBQUEsbUJBQUc7O0FBRVIsYUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDcEQsY0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUM1Qjs7O0FBR0QsWUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2pCLGNBQUksS0FBSyxHQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzNDLGdCQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDbEM7OztBQUdELFlBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDOzs7T0FHMUI7Ozs7U0FwRkcsR0FBRzs7O0FBd0ZULE1BQU0sQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDIiwiZmlsZSI6ImVzNi9jb3JlL2xmby1iYXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaWQgPSAwO1xuXG5jbGFzcyBMZm8ge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQgPSBudWxsLCBvcHRpb25zID0ge30sIGRlZmF1bHRzID0ge30pIHtcbiAgICB0aGlzLmNpZCA9IGlkKys7XG4gICAgdGhpcy5wYXJhbXMgPSB7fTtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcyA9IHtcbiAgICAgIGZyYW1lU2l6ZTogMSxcbiAgICAgIGZyYW1lUmF0ZTogMFxuICAgIH07XG5cbiAgICB0aGlzLnBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcbiAgICB0aGlzLmNoaWxkcmVuID0gW107XG5cbiAgICBpZiAocGFyZW50KSB7XG4gICAgICBpZiAocGFyZW50LnN0cmVhbVBhcmFtcyA9PT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Nhbm5vdCBjb25uZWN0IHRvIGFzIGRlYWQgbm9kZScpO1xuICAgICAgfVxuICAgICAgLy8gYWRkIG91cnNlbHZlcyB0byB0aGUgcGFyZW50IG9wZXJhdG9yIGlmIGl0cyBwYXNzZWRcbiAgICAgIHBhcmVudC5hZGQodGhpcyk7XG4gICAgICAvLyBwYXNzIG9uIHN0cmVhbSBwYXJhbXNcbiAgICAgIHRoaXMuc3RyZWFtUGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgcGFyZW50LnN0cmVhbVBhcmFtcyk7XG4gICAgfVxuICB9XG5cbiAgLy8gcmVzZXQgYG91dEZyYW1lYCBhbmQgY2FsbCByZXNldCBvbiBjaGlsZHJlblxuICByZXNldCgpIHt9XG5cbiAgLy8gZmlsbCB0aGUgb24tZ29pbmcgYnVmZmVyIHdpdGggMFxuICAvLyBvdXRwdXQgaXQsIHRoZW4gY2FsbCByZXNldCBvbiBhbGwgdGhlIGNoaWxkcmVuXG4gIGZpbmFsaXplKCkge31cblxuICAvLyBjb21tb24gc3RyZWFtIGNvbmZpZ3VyYXRpb24gYmFzZWQgb24gdGhlIGdpdmVuIHBhcmFtc1xuICBzZXR1cFN0cmVhbShvcHRzID0ge30pIHtcbiAgICBpZiAob3B0cy5mcmFtZVJhdGUpIHtcbiAgICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lUmF0ZSA9IG9wdHMuZnJhbWVSYXRlO1xuICAgIH1cblxuICAgIGlmIChvcHRzLmZyYW1lU2l6ZSkge1xuICAgICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gb3B0cy5mcmFtZVNpemU7XG4gICAgfVxuXG4gICAgaWYgKG9wdHMuYmxvY2tTYW1wbGVSYXRlKSB7XG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcy5ibG9ja1NhbXBsZVJhdGUgPSBvcHRzLmJsb2NrU2FtcGxlUmF0ZTtcbiAgICB9XG5cbiAgICB0aGlzLm91dEZyYW1lID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUpO1xuICB9XG5cbiAgLy8gYmluZCBjaGlsZCBub2RlXG4gIGFkZChsZm8gPSBudWxsKSB7XG4gICAgdGhpcy5jaGlsZHJlbi5wdXNoKGxmbyk7XG4gIH1cblxuICAvLyBmb3J3YXJkIHRoZSBjdXJyZW50IHN0YXRlICh0aW1lLCBmcmFtZSwgbWV0YURhdGEpIHRvIGFsbCB0aGUgY2hpbGRyZW5cbiAgb3V0cHV0KHRpbWUgPSB0aGlzLnRpbWUsIG91dEZyYW1lID0gdGhpcy5vdXRGcmFtZSwgbWV0YURhdGEgPSB0aGlzLm1ldGFEYXRhKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdGhpcy5jaGlsZHJlbltpXS5wcm9jZXNzKHRpbWUsIG91dEZyYW1lLCBtZXRhRGF0YSk7XG4gICAgfVxuICB9XG5cbiAgLy8gbWFpbiBmdW5jdGlvbiB0byBvdmVycmlkZSwgZGVmYXVsdHMgdG8gbm9vcFxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuICAgIHRoaXMudGltZSA9IHRpbWU7XG4gICAgdGhpcy5vdXRGcmFtZSA9IGZyYW1lO1xuICAgIHRoaXMubWV0YURhdGEgPSBtZXRhRGF0YTtcblxuICAgIHRoaXMub3V0cHV0KCk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIC8vIGNhbGwgYGRlc3Ryb3lgIGluIGFsbCBpdCdzIGNoaWxkcmVuXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdGhpcy5jaGlsZHJlbltpXS5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgLy8gZGVsZXRlIGl0c2VsZiBmcm9tIHRoZSBwYXJlbnQgbm9kZVxuICAgIGlmICh0aGlzLnByZXZpb3VzKSB7XG4gICAgICB2YXIgaW5kZXggPSAgcGFyZW50LmNoaWxkcmVuLmluZGV4T2YodGhpcyk7XG4gICAgICBwYXJlbnQuY2hpbGRyZW4uc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG5cbiAgICAvLyBjYW5ub3QgdXNlIGEgZGVhZCBvYmplY3QgYXMgcGFyZW50XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMgPSBudWxsO1xuXG4gICAgLy8gY2xlYW4gaXQncyBvd24gcmVmZXJlbmNlcyAvIGRpc2Nvbm5lY3QgYXVkaW8gbm9kZXMgaWYgbmVlZGVkXG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExmbztcbiJdfQ==