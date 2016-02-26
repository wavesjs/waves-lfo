'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
var id = 0;

var BaseLfo = (function () {
  /**
   * @todo - reverse arguments order, is weird
   */

  function BaseLfo() {
    var defaults = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, BaseLfo);

    this.cid = id++;
    this.params = {};

    this.streamParams = {
      frameSize: 1,
      frameRate: 0,
      sourceSampleRate: 0
    };

    this.params = _Object$assign({}, defaults, options);
    this.children = [];

    // stream data
    this.time = 0;
    this.outFrame = null;
    this.metaData = {};
  }

  // WebAudioAPI `connect` like method

  _createClass(BaseLfo, [{
    key: 'connect',
    value: function connect(child) {
      if (this.streamParams === null) {
        throw new Error('cannot connect to a dead lfo node');
      }

      this.children.push(child);
      child.parent = this;
    }

    // define if suffiscient
  }, {
    key: 'disconnect',
    value: function disconnect() {
      // remove itself from parent children
      var index = this.parent.children.indexOf(this);
      this.parent.children.splice(index, 1);
      // this.parent = null;
      // this.children = null;
    }

    // initialize the current node stream and propagate to it's children
  }, {
    key: 'initialize',
    value: function initialize() {
      var inStreamParams = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var outStreamParams = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      _Object$assign(this.streamParams, inStreamParams, outStreamParams);

      // create the `outFrame` arrayBuffer
      this.setupStream();

      // propagate initialization in lfo chain
      for (var i = 0, l = this.children.length; i < l; i++) {
        this.children[i].initialize(this.streamParams);
      }
    }

    /**
     * create the outputFrame according to the `streamParams`
     */
  }, {
    key: 'setupStream',
    value: function setupStream() {
      var frameSize = this.streamParams.frameSize;

      if (frameSize > 0) this.outFrame = new Float32Array(frameSize);
    }

    // reset `outFrame` and call reset on children
  }, {
    key: 'reset',
    value: function reset() {
      for (var i = 0, l = this.children.length; i < l; i++) {
        this.children[i].reset();
      }

      // sinks have no `outFrame`
      if (!this.outFrame) {
        return;
      }

      // this.outFrame.fill(0); // probably better but doesn't work yet
      for (var i = 0, l = this.outFrame.length; i < l; i++) {
        this.outFrame[i] = 0;
      }
    }

    // finalize stream
  }, {
    key: 'finalize',
    value: function finalize() {
      for (var i = 0, l = this.children.length; i < l; i++) {
        this.children[i].finalize();
      }
    }

    // forward the current state (time, frame, metaData) to all the children
  }, {
    key: 'output',
    value: function output() {
      var time = arguments.length <= 0 || arguments[0] === undefined ? this.time : arguments[0];
      var outFrame = arguments.length <= 1 || arguments[1] === undefined ? this.outFrame : arguments[1];
      var metaData = arguments.length <= 2 || arguments[2] === undefined ? this.metaData : arguments[2];

      for (var i = 0, l = this.children.length; i < l; i++) {
        this.children[i].process(time, outFrame, metaData);
      }
    }

    // main function to override, defaults to noop
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      this.time = time;
      this.outFrame = frame;
      this.metaData = metaData;

      this.output();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      // call `destroy` in all it's children
      var index = this.children.length;

      while (index--) {
        this.children[index].destroy();
      }

      // delete itself from the parent node
      if (this.parent) {
        var _index = this.parent.children.indexOf(this);
        this.parent.children.splice(_index, 1);
      }

      // cannot use a dead object as parent
      this.streamParams = null;

      // clean it's own references / disconnect audio nodes if needed
    }
  }]);

  return BaseLfo;
})();

exports['default'] = BaseLfo;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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O0FBQ2QsWUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztPQUNoQzs7O0FBR0QsVUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ2YsWUFBTSxNQUFLLEdBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xELFlBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7T0FDdkM7OztBQUdELFVBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDOzs7S0FHMUI7OztTQXpIa0IsT0FBTzs7O3FCQUFQLE9BQU8iLCJmaWxlIjoiZXM2L2NvcmUvYmFzZS1sZm8uanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgaWQgPSAwO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlTGZvIHtcbiAgLyoqXG4gICAqIEB0b2RvIC0gcmV2ZXJzZSBhcmd1bWVudHMgb3JkZXIsIGlzIHdlaXJkXG4gICAqL1xuICBjb25zdHJ1Y3RvcihkZWZhdWx0cyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLmNpZCA9IGlkKys7XG4gICAgdGhpcy5wYXJhbXMgPSB7fTtcblxuICAgIHRoaXMuc3RyZWFtUGFyYW1zID0ge1xuICAgICAgZnJhbWVTaXplOiAxLFxuICAgICAgZnJhbWVSYXRlOiAwLFxuICAgICAgc291cmNlU2FtcGxlUmF0ZTogMFxuICAgIH07XG5cbiAgICB0aGlzLnBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcbiAgICB0aGlzLmNoaWxkcmVuID0gW107XG5cbiAgICAvLyBzdHJlYW0gZGF0YVxuICAgIHRoaXMudGltZSA9IDA7XG4gICAgdGhpcy5vdXRGcmFtZSA9IG51bGw7XG4gICAgdGhpcy5tZXRhRGF0YSA9IHt9O1xuICB9XG5cbiAgLy8gV2ViQXVkaW9BUEkgYGNvbm5lY3RgIGxpa2UgbWV0aG9kXG4gIGNvbm5lY3QoY2hpbGQpIHtcbiAgICBpZiAodGhpcy5zdHJlYW1QYXJhbXMgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY2Fubm90IGNvbm5lY3QgdG8gYSBkZWFkIGxmbyBub2RlJyk7XG4gICAgfVxuXG4gICAgdGhpcy5jaGlsZHJlbi5wdXNoKGNoaWxkKTtcbiAgICBjaGlsZC5wYXJlbnQgPSB0aGlzO1xuICB9XG5cbiAgLy8gZGVmaW5lIGlmIHN1ZmZpc2NpZW50XG4gIGRpc2Nvbm5lY3QoKSB7XG4gICAgLy8gcmVtb3ZlIGl0c2VsZiBmcm9tIHBhcmVudCBjaGlsZHJlblxuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5wYXJlbnQuY2hpbGRyZW4uaW5kZXhPZih0aGlzKTtcbiAgICB0aGlzLnBhcmVudC5jaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIC8vIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICAvLyB0aGlzLmNoaWxkcmVuID0gbnVsbDtcbiAgfVxuXG4gIC8vIGluaXRpYWxpemUgdGhlIGN1cnJlbnQgbm9kZSBzdHJlYW0gYW5kIHByb3BhZ2F0ZSB0byBpdCdzIGNoaWxkcmVuXG4gIGluaXRpYWxpemUoaW5TdHJlYW1QYXJhbXMgPSB7fSwgb3V0U3RyZWFtUGFyYW1zID0ge30pIHtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMuc3RyZWFtUGFyYW1zLCBpblN0cmVhbVBhcmFtcywgb3V0U3RyZWFtUGFyYW1zKTtcblxuICAgIC8vIGNyZWF0ZSB0aGUgYG91dEZyYW1lYCBhcnJheUJ1ZmZlclxuICAgIHRoaXMuc2V0dXBTdHJlYW0oKTtcblxuICAgIC8vIHByb3BhZ2F0ZSBpbml0aWFsaXphdGlvbiBpbiBsZm8gY2hhaW5cbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB0aGlzLmNoaWxkcmVuW2ldLmluaXRpYWxpemUodGhpcy5zdHJlYW1QYXJhbXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBjcmVhdGUgdGhlIG91dHB1dEZyYW1lIGFjY29yZGluZyB0byB0aGUgYHN0cmVhbVBhcmFtc2BcbiAgICovXG4gIHNldHVwU3RyZWFtKCkge1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcblxuICAgIGlmKGZyYW1lU2l6ZSA+IDApXG4gICAgICB0aGlzLm91dEZyYW1lID0gbmV3IEZsb2F0MzJBcnJheShmcmFtZVNpemUpO1xuICB9XG5cbiAgLy8gcmVzZXQgYG91dEZyYW1lYCBhbmQgY2FsbCByZXNldCBvbiBjaGlsZHJlblxuICByZXNldCgpIHtcbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB0aGlzLmNoaWxkcmVuW2ldLnJlc2V0KCk7XG4gICAgfVxuXG4gICAgLy8gc2lua3MgaGF2ZSBubyBgb3V0RnJhbWVgXG4gICAgaWYgKCF0aGlzLm91dEZyYW1lKSB7IHJldHVybiB9XG5cbiAgICAvLyB0aGlzLm91dEZyYW1lLmZpbGwoMCk7IC8vIHByb2JhYmx5IGJldHRlciBidXQgZG9lc24ndCB3b3JrIHlldFxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5vdXRGcmFtZS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHRoaXMub3V0RnJhbWVbaV0gPSAwO1xuICAgIH1cbiAgfVxuXG4gIC8vIGZpbmFsaXplIHN0cmVhbVxuICBmaW5hbGl6ZSgpIHtcbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB0aGlzLmNoaWxkcmVuW2ldLmZpbmFsaXplKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gZm9yd2FyZCB0aGUgY3VycmVudCBzdGF0ZSAodGltZSwgZnJhbWUsIG1ldGFEYXRhKSB0byBhbGwgdGhlIGNoaWxkcmVuXG4gIG91dHB1dCh0aW1lID0gdGhpcy50aW1lLCBvdXRGcmFtZSA9IHRoaXMub3V0RnJhbWUsIG1ldGFEYXRhID0gdGhpcy5tZXRhRGF0YSkge1xuICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHRoaXMuY2hpbGRyZW5baV0ucHJvY2Vzcyh0aW1lLCBvdXRGcmFtZSwgbWV0YURhdGEpO1xuICAgIH1cbiAgfVxuXG4gIC8vIG1haW4gZnVuY3Rpb24gdG8gb3ZlcnJpZGUsIGRlZmF1bHRzIHRvIG5vb3BcbiAgcHJvY2Vzcyh0aW1lLCBmcmFtZSwgbWV0YURhdGEpIHtcbiAgICB0aGlzLnRpbWUgPSB0aW1lO1xuICAgIHRoaXMub3V0RnJhbWUgPSBmcmFtZTtcbiAgICB0aGlzLm1ldGFEYXRhID0gbWV0YURhdGE7XG5cbiAgICB0aGlzLm91dHB1dCgpO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICAvLyBjYWxsIGBkZXN0cm95YCBpbiBhbGwgaXQncyBjaGlsZHJlblxuICAgIGxldCBpbmRleCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoO1xuXG4gICAgd2hpbGUgKGluZGV4LS0pIHtcbiAgICAgIHRoaXMuY2hpbGRyZW5baW5kZXhdLmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICAvLyBkZWxldGUgaXRzZWxmIGZyb20gdGhlIHBhcmVudCBub2RlXG4gICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICBjb25zdCBpbmRleCA9ICB0aGlzLnBhcmVudC5jaGlsZHJlbi5pbmRleE9mKHRoaXMpO1xuICAgICAgdGhpcy5wYXJlbnQuY2hpbGRyZW4uc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG5cbiAgICAvLyBjYW5ub3QgdXNlIGEgZGVhZCBvYmplY3QgYXMgcGFyZW50XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMgPSBudWxsO1xuXG4gICAgLy8gY2xlYW4gaXQncyBvd24gcmVmZXJlbmNlcyAvIGRpc2Nvbm5lY3QgYXVkaW8gbm9kZXMgaWYgbmVlZGVkXG4gIH1cbn1cbiJdfQ==