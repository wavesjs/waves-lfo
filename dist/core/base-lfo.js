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
      if (this.parent) {
        // inherits parent's stream parameters by default
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
    value: function configureStream() {}

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
//# sourceMappingURL=data:application/json;base64,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QUFLLEVBQUUsRUFBRTtBQUNkLFlBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7T0FDaEM7OztBQUdELFVBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNmLFlBQU0sTUFBSyxHQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNsRCxZQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO09BQ3ZDOzs7QUFHRCxVQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQzs7O0tBRzFCOzs7U0EvSWtCLE9BQU87OztxQkFBUCxPQUFPIiwiZmlsZSI6ImVzNi9jb3JlL2Jhc2UtbGZvLmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IGlkID0gMDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZUxmbyB7XG4gIC8qKlxuICAgKiBAdG9kbyAtIHJldmVyc2UgYXJndW1lbnRzIG9yZGVyLCBpcyB3ZWlyZFxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9LCBkZWZhdWx0cyA9IHt9KSB7XG4gICAgdGhpcy5jaWQgPSBpZCsrO1xuICAgIHRoaXMucGFyYW1zID0ge307XG5cbiAgICB0aGlzLnN0cmVhbVBhcmFtcyA9IHtcbiAgICAgIGZyYW1lU2l6ZTogMSxcbiAgICAgIGZyYW1lUmF0ZTogMCxcbiAgICAgIHNvdXJjZVNhbXBsZVJhdGU6IDBcbiAgICB9O1xuXG4gICAgdGhpcy5wYXJhbXMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuXG4gICAgLy8gc3RyZWFtIGRhdGFcbiAgICB0aGlzLnRpbWUgPSAwO1xuICAgIHRoaXMub3V0RnJhbWUgPSBudWxsO1xuICAgIHRoaXMubWV0YURhdGEgPSB7fTtcbiAgfVxuXG4gIC8vIFdlYkF1ZGlvQVBJIGBjb25uZWN0YCBsaWtlIG1ldGhvZFxuICBjb25uZWN0KGNoaWxkKSB7XG4gICAgaWYgKHRoaXMuc3RyZWFtUGFyYW1zID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Nhbm5vdCBjb25uZWN0IHRvIGEgZGVhZCBsZm8gbm9kZScpO1xuICAgIH1cblxuICAgIHRoaXMuY2hpbGRyZW4ucHVzaChjaGlsZCk7XG4gICAgY2hpbGQucGFyZW50ID0gdGhpcztcbiAgfVxuXG4gIC8vIGRlZmluZSBpZiBzdWZmaXNjaWVudFxuICBkaXNjb25uZWN0KCkge1xuICAgIC8vIHJlbW92ZSBpdHNlbGYgZnJvbSBwYXJlbnQgY2hpbGRyZW5cbiAgICBjb25zdCBpbmRleCA9IHRoaXMucGFyZW50LmNoaWxkcmVuLmluZGV4T2YodGhpcyk7XG4gICAgdGhpcy5wYXJlbnQuY2hpbGRyZW4uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAvLyB0aGlzLnBhcmVudCA9IG51bGw7XG4gICAgLy8gdGhpcy5jaGlsZHJlbiA9IG51bGw7XG4gIH1cblxuICAvLyBpbml0aWFsaXplIHRoZSBjdXJyZW50IG5vZGUgc3RyZWFtIGFuZCBwcm9wYWdhdGUgdG8gaXQncyBjaGlsZHJlblxuICBpbml0aWFsaXplKCkge1xuICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgLy8gaW5oZXJpdHMgcGFyZW50J3Mgc3RyZWFtIHBhcmFtZXRlcnMgYnkgZGVmYXVsdFxuICAgICAgdGhpcy5zdHJlYW1QYXJhbXMgPSBPYmplY3QuYXNzaWduKHRoaXMuc3RyZWFtUGFyYW1zLCB0aGlzLnBhcmVudC5zdHJlYW1QYXJhbXMpO1xuICAgIH1cblxuICAgIC8vIGVudHJ5IHBvaW50IGZvciBzdHJlYW0gcGFyYW1zIGNvbmZpZ3VyYXRpb24gaW4gZGVyaXZlZCBjbGFzc1xuICAgIHRoaXMuY29uZmlndXJlU3RyZWFtKCk7XG5cbiAgICAvLyBjcmVhdGUgdGhlIGBvdXRGcmFtZWAgYXJyYXlCdWZmZXJcbiAgICB0aGlzLnNldHVwU3RyZWFtKCk7XG5cbiAgICAvLyBwcm9wYWdhdGUgaW5pdGlhbGl6YXRpb24gaW4gbGZvIGNoYWluXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdGhpcy5jaGlsZHJlbltpXS5pbml0aWFsaXplKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gc291cmNlcyBvbmx5XG4gIC8vIHN0YXJ0KCkge1xuICAvLyAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICAvLyAgIHRoaXMucmVzZXQoKTtcbiAgLy8gfVxuXG4gIC8qKlxuICAgKiBvdmVycmlkZSBpbmhlcml0ZWQgc3RyZWFtUGFyYW1zLCBvbmx5IGlmIHNwZWNpZmllZCBpbiBgcGFyYW1zYFxuICAgKi9cbiAgY29uZmlndXJlU3RyZWFtKCkgeyB9XG5cbiAgLyoqXG4gICAqIGNyZWF0ZSB0aGUgb3V0cHV0RnJhbWUgYWNjb3JkaW5nIHRvIHRoZSBgc3RyZWFtUGFyYW1zYFxuICAgKiBATk9URSByZW1vdmUgY29tbWVudGVkIGNvZGUgP1xuICAgKi9cbiAgc2V0dXBTdHJlYW0oLyogb3B0cyA9IHt9ICovKSB7XG4gICAgLy8gaWYgKG9wdHMuZnJhbWVSYXRlKSB7IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lUmF0ZSA9IG9wdHMuZnJhbWVSYXRlOyB9XG4gICAgLy8gaWYgKG9wdHMuZnJhbWVTaXplKSB7IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IG9wdHMuZnJhbWVTaXplOyB9XG4gICAgLy8gaWYgKG9wdHMuc291cmNlU2FtcGxlUmF0ZSkgeyB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlID0gb3B0cy5zb3VyY2VTYW1wbGVSYXRlOyB9XG4gICAgdGhpcy5vdXRGcmFtZSA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplKTtcbiAgfVxuXG4gIC8vIHJlc2V0IGBvdXRGcmFtZWAgYW5kIGNhbGwgcmVzZXQgb24gY2hpbGRyZW5cbiAgcmVzZXQoKSB7XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdGhpcy5jaGlsZHJlbltpXS5yZXNldCgpO1xuICAgIH1cblxuICAgIC8vIHNpbmtzIGhhdmUgbm8gYG91dEZyYW1lYFxuICAgIGlmICghdGhpcy5vdXRGcmFtZSkgeyByZXR1cm4gfVxuXG4gICAgLy8gdGhpcy5vdXRGcmFtZS5maWxsKDApOyAvLyBwcm9iYWJseSBiZXR0ZXIgYnV0IGRvZXNuJ3Qgd29yayB5ZXRcbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMub3V0RnJhbWUubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB0aGlzLm91dEZyYW1lW2ldID0gMDtcbiAgICB9XG4gIH1cblxuICAvLyBmaWxsIHRoZSBvbi1nb2luZyBidWZmZXIgd2l0aCAwIChpcyBkb25lKVxuICAvLyBvdXRwdXQgaXQsIHRoZW4gY2FsbCByZXNldCBvbiBhbGwgdGhlIGNoaWxkcmVuIChzdXJlID8pXG4gIC8vIEBOT1RFOiBgcmVzZXRgIGlzIGNhbGxlZCBpbiBgc291cmNlcy5zdGFydGAsXG4gIC8vICBpZiBpcyBjYWxsZWQgaGVyZSwgaXQgd2lsbCBiZSBjYWxsZWQgbW9yZSB0aGFuIG9uY2UgaW4gYSBjaGlsZCBub2RlXG4gIC8vICBpcyB0aGlzIGEgcHJvYmxlbSA/XG4gIGZpbmFsaXplKCkge1xuICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHRoaXMuY2hpbGRyZW5baV0uZmluYWxpemUoKTtcbiAgICB9XG4gIH1cblxuICAvLyBmb3J3YXJkIHRoZSBjdXJyZW50IHN0YXRlICh0aW1lLCBmcmFtZSwgbWV0YURhdGEpIHRvIGFsbCB0aGUgY2hpbGRyZW5cbiAgb3V0cHV0KHRpbWUgPSB0aGlzLnRpbWUsIG91dEZyYW1lID0gdGhpcy5vdXRGcmFtZSwgbWV0YURhdGEgPSB0aGlzLm1ldGFEYXRhKSB7XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdGhpcy5jaGlsZHJlbltpXS5wcm9jZXNzKHRpbWUsIG91dEZyYW1lLCBtZXRhRGF0YSk7XG4gICAgfVxuICB9XG5cbiAgLy8gbWFpbiBmdW5jdGlvbiB0byBvdmVycmlkZSwgZGVmYXVsdHMgdG8gbm9vcFxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuICAgIHRoaXMudGltZSA9IHRpbWU7XG4gICAgdGhpcy5vdXRGcmFtZSA9IGZyYW1lO1xuICAgIHRoaXMubWV0YURhdGEgPSBtZXRhRGF0YTtcblxuICAgIHRoaXMub3V0cHV0KCk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIC8vIGNhbGwgYGRlc3Ryb3lgIGluIGFsbCBpdCdzIGNoaWxkcmVuXG4gICAgbGV0IGluZGV4ID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7XG5cbiAgICB3aGlsZSAoaW5kZXgtLSkge1xuICAgICAgdGhpcy5jaGlsZHJlbltpbmRleF0uZGVzdHJveSgpO1xuICAgIH1cblxuICAgIC8vIGRlbGV0ZSBpdHNlbGYgZnJvbSB0aGUgcGFyZW50IG5vZGVcbiAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gIHRoaXMucGFyZW50LmNoaWxkcmVuLmluZGV4T2YodGhpcyk7XG4gICAgICB0aGlzLnBhcmVudC5jaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cblxuICAgIC8vIGNhbm5vdCB1c2UgYSBkZWFkIG9iamVjdCBhcyBwYXJlbnRcbiAgICB0aGlzLnN0cmVhbVBhcmFtcyA9IG51bGw7XG5cbiAgICAvLyBjbGVhbiBpdCdzIG93biByZWZlcmVuY2VzIC8gZGlzY29ubmVjdCBhdWRpbyBub2RlcyBpZiBuZWVkZWRcbiAgfVxufVxuIl19