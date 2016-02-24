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
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var defaults = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

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
      if (this.parent) {
        // defaults to inherit parent's stream parameters
        this.streamParams = _Object$assign(this.streamParams, this.parent.streamParams);
      }

      // entry point for stream params configuration in derived class
      this.configureStream();
      // create the `outFrame` arrayBuffer
      this.setupStream();

      // propagate initialization in lfo chain
      for (var i = 0, l = this.children.length; i < l; i++) {
        this.children[i].initialize();
      }
    }

    // sources only
    // start() {
    //   this.initialize();
    //   this.reset();
    // }

    /**
     * override inherited streamParams, only if specified in `params`
     */
  }, {
    key: 'configureStream',
    value: function configureStream() {
      if (this.params.frameSize) {
        this.streamParams.frameSize = this.params.frameSize;
      }

      if (this.params.frameRate) {
        this.streamParams.frameRate = this.params.frameRate;
      }

      if (this.params.sourceSampleRate) {
        this.streamParams.sourceSampleRate = this.params.sourceSampleRate;
      }
    }

    /**
     * create the outputFrame according to the `streamParams`
     * @NOTE remove commented code ?
     */
  }, {
    key: 'setupStream',
    value: function setupStream() /* opts = {} */{
      // if (opts.frameRate) { this.streamParams.frameRate = opts.frameRate; }
      // if (opts.frameSize) { this.streamParams.frameSize = opts.frameSize; }
      // if (opts.sourceSampleRate) { this.streamParams.sourceSampleRate = opts.sourceSampleRate; }
      this.outFrame = new Float32Array(this.streamParams.frameSize);
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

    // fill the on-going buffer with 0 (is done)
    // output it, then call reset on all the children (sure ?)
    // @NOTE: `reset` is called in `sources.start`,
    //  if is called here, it will be called more than once in a child node
    //  is this a problem ?
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
//# sourceMappingURL=data:application/json;base64,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QUUsUUFBUSxFQUFFO0FBQzdCLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLFVBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0FBQ3RCLFVBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDOztBQUV6QixVQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDZjs7O1dBRU0sbUJBQUc7O0FBRVIsVUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7O0FBRWpDLGFBQU8sS0FBSyxFQUFFLEVBQUU7QUFDZCxZQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO09BQ2hDOzs7QUFHRCxVQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDZixZQUFNLE1BQUssR0FBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbEQsWUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQUssRUFBRSxDQUFDLENBQUMsQ0FBQztPQUN2Qzs7O0FBR0QsVUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7OztLQUcxQjs7O1NBckprQixPQUFPOzs7cUJBQVAsT0FBTyIsImZpbGUiOiJlczYvY29yZS9iYXNlLWxmby5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBpZCA9IDA7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VMZm8ge1xuICAvKipcbiAgICogQHRvZG8gLSByZXZlcnNlIGFyZ3VtZW50cyBvcmRlciwgaXMgd2VpcmRcbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSwgZGVmYXVsdHMgPSB7fSkge1xuICAgIHRoaXMuY2lkID0gaWQrKztcbiAgICB0aGlzLnBhcmFtcyA9IHt9O1xuXG4gICAgdGhpcy5zdHJlYW1QYXJhbXMgPSB7XG4gICAgICBmcmFtZVNpemU6IDEsXG4gICAgICBmcmFtZVJhdGU6IDAsXG4gICAgICBzb3VyY2VTYW1wbGVSYXRlOiAwXG4gICAgfTtcblxuICAgIHRoaXMucGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgfVxuXG4gIC8vIFdlYkF1ZGlvQVBJIGBjb25uZWN0YCBsaWtlIG1ldGhvZFxuICBjb25uZWN0KGNoaWxkKSB7XG4gICAgaWYgKHRoaXMuc3RyZWFtUGFyYW1zID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Nhbm5vdCBjb25uZWN0IHRvIGEgZGVhZCBsZm8gbm9kZScpO1xuICAgIH1cblxuICAgIHRoaXMuY2hpbGRyZW4ucHVzaChjaGlsZCk7XG4gICAgY2hpbGQucGFyZW50ID0gdGhpcztcbiAgfVxuXG4gIC8vIGRlZmluZSBpZiBzdWZmaXNjaWVudFxuICBkaXNjb25uZWN0KCkge1xuICAgIC8vIHJlbW92ZSBpdHNlbGYgZnJvbSBwYXJlbnQgY2hpbGRyZW5cbiAgICBjb25zdCBpbmRleCA9IHRoaXMucGFyZW50LmNoaWxkcmVuLmluZGV4T2YodGhpcyk7XG4gICAgdGhpcy5wYXJlbnQuY2hpbGRyZW4uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAvLyB0aGlzLnBhcmVudCA9IG51bGw7XG4gICAgLy8gdGhpcy5jaGlsZHJlbiA9IG51bGw7XG4gIH1cblxuICAvLyBpbml0aWFsaXplIHRoZSBjdXJyZW50IG5vZGUgc3RyZWFtIGFuZCBwcm9wYWdhdGUgdG8gaXQncyBjaGlsZHJlblxuICBpbml0aWFsaXplKCkge1xuICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgLy8gZGVmYXVsdHMgdG8gaW5oZXJpdCBwYXJlbnQncyBzdHJlYW0gcGFyYW1ldGVyc1xuICAgICAgdGhpcy5zdHJlYW1QYXJhbXMgPSBPYmplY3QuYXNzaWduKHRoaXMuc3RyZWFtUGFyYW1zLCB0aGlzLnBhcmVudC5zdHJlYW1QYXJhbXMpO1xuICAgIH1cblxuICAgIC8vIGVudHJ5IHBvaW50IGZvciBzdHJlYW0gcGFyYW1zIGNvbmZpZ3VyYXRpb24gaW4gZGVyaXZlZCBjbGFzc1xuICAgIHRoaXMuY29uZmlndXJlU3RyZWFtKCk7XG4gICAgLy8gY3JlYXRlIHRoZSBgb3V0RnJhbWVgIGFycmF5QnVmZmVyXG4gICAgdGhpcy5zZXR1cFN0cmVhbSgpO1xuXG4gICAgLy8gcHJvcGFnYXRlIGluaXRpYWxpemF0aW9uIGluIGxmbyBjaGFpblxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHRoaXMuY2hpbGRyZW5baV0uaW5pdGlhbGl6ZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8vIHNvdXJjZXMgb25seVxuICAvLyBzdGFydCgpIHtcbiAgLy8gICB0aGlzLmluaXRpYWxpemUoKTtcbiAgLy8gICB0aGlzLnJlc2V0KCk7XG4gIC8vIH1cblxuICAvKipcbiAgICogb3ZlcnJpZGUgaW5oZXJpdGVkIHN0cmVhbVBhcmFtcywgb25seSBpZiBzcGVjaWZpZWQgaW4gYHBhcmFtc2BcbiAgICovXG4gIGNvbmZpZ3VyZVN0cmVhbSgpIHtcbiAgICBpZiAodGhpcy5wYXJhbXMuZnJhbWVTaXplKSB7XG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSB0aGlzLnBhcmFtcy5mcmFtZVNpemU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGFyYW1zLmZyYW1lUmF0ZSkge1xuICAgICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVSYXRlID0gdGhpcy5wYXJhbXMuZnJhbWVSYXRlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlKSB7XG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlID0gdGhpcy5wYXJhbXMuc291cmNlU2FtcGxlUmF0ZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogY3JlYXRlIHRoZSBvdXRwdXRGcmFtZSBhY2NvcmRpbmcgdG8gdGhlIGBzdHJlYW1QYXJhbXNgXG4gICAqIEBOT1RFIHJlbW92ZSBjb21tZW50ZWQgY29kZSA/XG4gICAqL1xuICBzZXR1cFN0cmVhbSgvKiBvcHRzID0ge30gKi8pIHtcbiAgICAvLyBpZiAob3B0cy5mcmFtZVJhdGUpIHsgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVSYXRlID0gb3B0cy5mcmFtZVJhdGU7IH1cbiAgICAvLyBpZiAob3B0cy5mcmFtZVNpemUpIHsgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gb3B0cy5mcmFtZVNpemU7IH1cbiAgICAvLyBpZiAob3B0cy5zb3VyY2VTYW1wbGVSYXRlKSB7IHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGUgPSBvcHRzLnNvdXJjZVNhbXBsZVJhdGU7IH1cbiAgICB0aGlzLm91dEZyYW1lID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUpO1xuICB9XG5cbiAgLy8gcmVzZXQgYG91dEZyYW1lYCBhbmQgY2FsbCByZXNldCBvbiBjaGlsZHJlblxuICByZXNldCgpIHtcbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB0aGlzLmNoaWxkcmVuW2ldLnJlc2V0KCk7XG4gICAgfVxuXG4gICAgLy8gc2lua3MgaGF2ZSBubyBgb3V0RnJhbWVgXG4gICAgaWYgKCF0aGlzLm91dEZyYW1lKSB7IHJldHVybiB9XG5cbiAgICAvLyB0aGlzLm91dEZyYW1lLmZpbGwoMCk7IC8vIHByb2JhYmx5IGJldHRlciBidXQgZG9lc24ndCB3b3JrIHlldFxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5vdXRGcmFtZS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHRoaXMub3V0RnJhbWVbaV0gPSAwO1xuICAgIH1cbiAgfVxuXG4gIC8vIGZpbGwgdGhlIG9uLWdvaW5nIGJ1ZmZlciB3aXRoIDAgKGlzIGRvbmUpXG4gIC8vIG91dHB1dCBpdCwgdGhlbiBjYWxsIHJlc2V0IG9uIGFsbCB0aGUgY2hpbGRyZW4gKHN1cmUgPylcbiAgLy8gQE5PVEU6IGByZXNldGAgaXMgY2FsbGVkIGluIGBzb3VyY2VzLnN0YXJ0YCxcbiAgLy8gIGlmIGlzIGNhbGxlZCBoZXJlLCBpdCB3aWxsIGJlIGNhbGxlZCBtb3JlIHRoYW4gb25jZSBpbiBhIGNoaWxkIG5vZGVcbiAgLy8gIGlzIHRoaXMgYSBwcm9ibGVtID9cbiAgZmluYWxpemUoKSB7XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdGhpcy5jaGlsZHJlbltpXS5maW5hbGl6ZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGZvcndhcmQgdGhlIGN1cnJlbnQgc3RhdGUgKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkgdG8gYWxsIHRoZSBjaGlsZHJlblxuICBvdXRwdXQodGltZSA9IHRoaXMudGltZSwgb3V0RnJhbWUgPSB0aGlzLm91dEZyYW1lLCBtZXRhRGF0YSA9IHRoaXMubWV0YURhdGEpIHtcbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB0aGlzLmNoaWxkcmVuW2ldLnByb2Nlc3ModGltZSwgb3V0RnJhbWUsIG1ldGFEYXRhKTtcbiAgICB9XG4gIH1cblxuICAvLyBtYWluIGZ1bmN0aW9uIHRvIG92ZXJyaWRlLCBkZWZhdWx0cyB0byBub29wXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgdGhpcy50aW1lID0gdGltZTtcbiAgICB0aGlzLm91dEZyYW1lID0gZnJhbWU7XG4gICAgdGhpcy5tZXRhRGF0YSA9IG1ldGFEYXRhO1xuXG4gICAgdGhpcy5vdXRwdXQoKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgLy8gY2FsbCBgZGVzdHJveWAgaW4gYWxsIGl0J3MgY2hpbGRyZW5cbiAgICBsZXQgaW5kZXggPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDtcblxuICAgIHdoaWxlIChpbmRleC0tKSB7XG4gICAgICB0aGlzLmNoaWxkcmVuW2luZGV4XS5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgLy8gZGVsZXRlIGl0c2VsZiBmcm9tIHRoZSBwYXJlbnQgbm9kZVxuICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgY29uc3QgaW5kZXggPSAgdGhpcy5wYXJlbnQuY2hpbGRyZW4uaW5kZXhPZih0aGlzKTtcbiAgICAgIHRoaXMucGFyZW50LmNoaWxkcmVuLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuXG4gICAgLy8gY2Fubm90IHVzZSBhIGRlYWQgb2JqZWN0IGFzIHBhcmVudFxuICAgIHRoaXMuc3RyZWFtUGFyYW1zID0gbnVsbDtcblxuICAgIC8vIGNsZWFuIGl0J3Mgb3duIHJlZmVyZW5jZXMgLyBkaXNjb25uZWN0IGF1ZGlvIG5vZGVzIGlmIG5lZWRlZFxuICB9XG59XG4iXX0=