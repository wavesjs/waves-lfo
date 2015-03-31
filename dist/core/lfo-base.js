"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var id = 0;

var Lfo = (function () {
  function Lfo() {
    var options = arguments[0] === undefined ? {} : arguments[0];
    var defaults = arguments[1] === undefined ? {} : arguments[1];

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

    // if (parent) {
    //   if (parent.streamParams === null) {
    //     throw new Error('cannot connect to as dead lfo node');
    //   }

    //   this.parent = parent;
    //   // add ourselves to the parent operator if its passed
    //   this.parent.add(this);
    //   // pass on stream params
    //   this.streamParams = Object.assign({}, this.parent.streamParams);
    //   // console.log(parent, this.streamParams);
    //   // this.setupStream();
    // }
  }

  _createClass(Lfo, {
    connect: {

      // webAudioAPI connect like method

      value: function connect(child) {
        if (this.streamParams === null) {
          throw new Error("cannot connect to a dead lfo node");
        }

        this.children.push(child);
        child.parent = this;
      }
    },
    initialize: {

      // initialize the current node stream and propagate to it's children

      value: function initialize() {
        if (this.parent) {
          // defaults to inherit parent's stream parameters
          // reuse the same object each time
          this.streamParams = _core.Object.assign(this.streamParams, this.parent.streamParams);
        }

        // entry point for stream params configuration in derived class
        this.configureStream();
        // create the `outStream` arrayBuffer
        this.setupStream();

        // propagate initialization in lfo chain
        for (var i = 0, l = this.children.length; i < l; i++) {
          this.children[i].initialize();
        }
      }
    },
    configureStream: {

      // for sources only
      // start() {
      //   this.initialize();
      //   this.reset();
      // }

      //

      value: function configureStream() {
        if (this.params.frameSize) {
          this.streamParams.frameSize = this.params.frameSize;
        }

        if (this.params.frameRate) {
          this.streamParams.frameRate = this.params.frameRate;
        }

        if (this.params.blockSampleRate) {
          this.streamParams.blockSampleRate = this.params.blockSampleRate;
        }
      }
    },
    setupStream: {
      // common stream configuration based on the given params

      value: function setupStream() {
        // if (opts.frameRate) { this.streamParams.frameRate = opts.frameRate; }
        // if (opts.frameSize) { this.streamParams.frameSize = opts.frameSize; }
        // if (opts.blockSampleRate) { this.streamParams.blockSampleRate = opts.blockSampleRate; }

        this.outFrame = new Float32Array(this.streamParams.frameSize);
      }
    },
    reset: {

      // reset `outFrame` and call reset on children

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
    },
    finalize: {

      // fill the on-going buffer with 0
      // output it, then call reset on all the children (sure ?)
      // @NOTE: `reset` is called in `sources.start`,
      //  if is called here, it will be called more than once in a child node
      //  is this a problem ?

      value: function finalize() {
        for (var i = 0, l = this.children.length; i < l; i++) {
          this.children[i].finalize();
        }
      }
    },
    output: {

      // bind child node
      // add(lfo) {
      //   this.children.push(lfo);
      // }

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
/* opts = {} */
//# sourceMappingURL=data:application/json;base64,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O0FBQ2pCLFlBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0FBQ3RCLFlBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDOztBQUV6QixZQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7T0FDZjs7QUFFRCxXQUFPO2FBQUEsbUJBQUc7O0FBRVIsWUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7QUFDakMsZUFBTyxLQUFLLEVBQUUsRUFBRTtBQUNkLGNBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDaEM7OztBQUdELFlBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNmLGNBQUksS0FBSyxHQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNoRCxjQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ3ZDOzs7QUFHRCxZQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQzs7O09BRzFCOzs7O1NBdkpHLEdBQUc7OztBQTJKVCxNQUFNLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQyIsImZpbGUiOiJlczYvY29yZS9sZm8tYmFzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIGlkID0gMDtcblxuY2xhc3MgTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9LCBkZWZhdWx0cyA9IHt9KSB7XG4gICAgdGhpcy5jaWQgPSBpZCsrO1xuICAgIHRoaXMucGFyYW1zID0ge307XG5cbiAgICB0aGlzLnN0cmVhbVBhcmFtcyA9IHtcbiAgICAgIGZyYW1lU2l6ZTogMSxcbiAgICAgIGZyYW1lUmF0ZTogMCxcbiAgICAgIGJsb2NrU2FtcGxlUmF0ZTogMFxuICAgIH07XG5cbiAgICB0aGlzLnBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcbiAgICB0aGlzLmNoaWxkcmVuID0gW107XG5cbiAgICAvLyBpZiAocGFyZW50KSB7XG4gICAgLy8gICBpZiAocGFyZW50LnN0cmVhbVBhcmFtcyA9PT0gbnVsbCkge1xuICAgIC8vICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Nhbm5vdCBjb25uZWN0IHRvIGFzIGRlYWQgbGZvIG5vZGUnKTtcbiAgICAvLyAgIH1cblxuICAgIC8vICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgLy8gICAvLyBhZGQgb3Vyc2VsdmVzIHRvIHRoZSBwYXJlbnQgb3BlcmF0b3IgaWYgaXRzIHBhc3NlZFxuICAgIC8vICAgdGhpcy5wYXJlbnQuYWRkKHRoaXMpO1xuICAgIC8vICAgLy8gcGFzcyBvbiBzdHJlYW0gcGFyYW1zXG4gICAgLy8gICB0aGlzLnN0cmVhbVBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMucGFyZW50LnN0cmVhbVBhcmFtcyk7XG4gICAgLy8gICAvLyBjb25zb2xlLmxvZyhwYXJlbnQsIHRoaXMuc3RyZWFtUGFyYW1zKTtcbiAgICAvLyAgIC8vIHRoaXMuc2V0dXBTdHJlYW0oKTtcbiAgICAvLyB9XG4gIH1cblxuICAvLyB3ZWJBdWRpb0FQSSBjb25uZWN0IGxpa2UgbWV0aG9kXG4gIGNvbm5lY3QoY2hpbGQpIHtcbiAgICBpZiAodGhpcy5zdHJlYW1QYXJhbXMgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY2Fubm90IGNvbm5lY3QgdG8gYSBkZWFkIGxmbyBub2RlJyk7XG4gICAgfVxuXG4gICAgdGhpcy5jaGlsZHJlbi5wdXNoKGNoaWxkKTtcbiAgICBjaGlsZC5wYXJlbnQgPSB0aGlzO1xuICB9XG5cbiAgLy8gaW5pdGlhbGl6ZSB0aGUgY3VycmVudCBub2RlIHN0cmVhbSBhbmQgcHJvcGFnYXRlIHRvIGl0J3MgY2hpbGRyZW5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgIC8vIGRlZmF1bHRzIHRvIGluaGVyaXQgcGFyZW50J3Mgc3RyZWFtIHBhcmFtZXRlcnNcbiAgICAgIC8vIHJldXNlIHRoZSBzYW1lIG9iamVjdCBlYWNoIHRpbWVcbiAgICAgIHRoaXMuc3RyZWFtUGFyYW1zID0gT2JqZWN0LmFzc2lnbih0aGlzLnN0cmVhbVBhcmFtcywgdGhpcy5wYXJlbnQuc3RyZWFtUGFyYW1zKTtcbiAgICB9XG5cbiAgICAvLyBlbnRyeSBwb2ludCBmb3Igc3RyZWFtIHBhcmFtcyBjb25maWd1cmF0aW9uIGluIGRlcml2ZWQgY2xhc3NcbiAgICB0aGlzLmNvbmZpZ3VyZVN0cmVhbSgpO1xuICAgIC8vIGNyZWF0ZSB0aGUgYG91dFN0cmVhbWAgYXJyYXlCdWZmZXJcbiAgICB0aGlzLnNldHVwU3RyZWFtKCk7XG5cbiAgICAvLyBwcm9wYWdhdGUgaW5pdGlhbGl6YXRpb24gaW4gbGZvIGNoYWluXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdGhpcy5jaGlsZHJlbltpXS5pbml0aWFsaXplKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gZm9yIHNvdXJjZXMgb25seVxuICAvLyBzdGFydCgpIHtcbiAgLy8gICB0aGlzLmluaXRpYWxpemUoKTtcbiAgLy8gICB0aGlzLnJlc2V0KCk7XG4gIC8vIH1cblxuICAvL1xuICBjb25maWd1cmVTdHJlYW0oKSB7XG4gICAgaWYgKHRoaXMucGFyYW1zLmZyYW1lU2l6ZSkge1xuICAgICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gdGhpcy5wYXJhbXMuZnJhbWVTaXplO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBhcmFtcy5mcmFtZVJhdGUpIHtcbiAgICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lUmF0ZSA9IHRoaXMucGFyYW1zLmZyYW1lUmF0ZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYXJhbXMuYmxvY2tTYW1wbGVSYXRlKSB7XG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcy5ibG9ja1NhbXBsZVJhdGUgPSB0aGlzLnBhcmFtcy5ibG9ja1NhbXBsZVJhdGU7XG4gICAgfVxuICB9XG4gIC8vIGNvbW1vbiBzdHJlYW0gY29uZmlndXJhdGlvbiBiYXNlZCBvbiB0aGUgZ2l2ZW4gcGFyYW1zXG4gIHNldHVwU3RyZWFtKC8qIG9wdHMgPSB7fSAqLykge1xuICAgIC8vIGlmIChvcHRzLmZyYW1lUmF0ZSkgeyB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVJhdGUgPSBvcHRzLmZyYW1lUmF0ZTsgfVxuICAgIC8vIGlmIChvcHRzLmZyYW1lU2l6ZSkgeyB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSBvcHRzLmZyYW1lU2l6ZTsgfVxuICAgIC8vIGlmIChvcHRzLmJsb2NrU2FtcGxlUmF0ZSkgeyB0aGlzLnN0cmVhbVBhcmFtcy5ibG9ja1NhbXBsZVJhdGUgPSBvcHRzLmJsb2NrU2FtcGxlUmF0ZTsgfVxuXG4gICAgdGhpcy5vdXRGcmFtZSA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplKTtcbiAgfVxuXG4gIC8vIHJlc2V0IGBvdXRGcmFtZWAgYW5kIGNhbGwgcmVzZXQgb24gY2hpbGRyZW5cbiAgcmVzZXQoKSB7XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdGhpcy5jaGlsZHJlbltpXS5yZXNldCgpO1xuICAgIH1cblxuICAgIC8vIHNpbmtzIGhhdmUgbm8gYG91dEZyYW1lYFxuICAgIGlmICghdGhpcy5vdXRGcmFtZSkgeyByZXR1cm4gfVxuXG4gICAgLy8gdGhpcy5vdXRGcmFtZS5maWxsKDApOyAvLyBwcm9iYWJseSBiZXR0ZXIgYnV0IGRvZXNuJ3Qgd29yayB5ZXRcbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMub3V0RnJhbWUubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB0aGlzLm91dEZyYW1lW2ldID0gMDtcbiAgICB9XG4gIH1cblxuICAvLyBmaWxsIHRoZSBvbi1nb2luZyBidWZmZXIgd2l0aCAwXG4gIC8vIG91dHB1dCBpdCwgdGhlbiBjYWxsIHJlc2V0IG9uIGFsbCB0aGUgY2hpbGRyZW4gKHN1cmUgPylcbiAgLy8gQE5PVEU6IGByZXNldGAgaXMgY2FsbGVkIGluIGBzb3VyY2VzLnN0YXJ0YCxcbiAgLy8gIGlmIGlzIGNhbGxlZCBoZXJlLCBpdCB3aWxsIGJlIGNhbGxlZCBtb3JlIHRoYW4gb25jZSBpbiBhIGNoaWxkIG5vZGVcbiAgLy8gIGlzIHRoaXMgYSBwcm9ibGVtID9cbiAgZmluYWxpemUoKSB7XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdGhpcy5jaGlsZHJlbltpXS5maW5hbGl6ZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGJpbmQgY2hpbGQgbm9kZVxuICAvLyBhZGQobGZvKSB7XG4gIC8vICAgdGhpcy5jaGlsZHJlbi5wdXNoKGxmbyk7XG4gIC8vIH1cblxuICAvLyBmb3J3YXJkIHRoZSBjdXJyZW50IHN0YXRlICh0aW1lLCBmcmFtZSwgbWV0YURhdGEpIHRvIGFsbCB0aGUgY2hpbGRyZW5cbiAgb3V0cHV0KHRpbWUgPSB0aGlzLnRpbWUsIG91dEZyYW1lID0gdGhpcy5vdXRGcmFtZSwgbWV0YURhdGEgPSB0aGlzLm1ldGFEYXRhKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdGhpcy5jaGlsZHJlbltpXS5wcm9jZXNzKHRpbWUsIG91dEZyYW1lLCBtZXRhRGF0YSk7XG4gICAgfVxuICB9XG5cbiAgLy8gbWFpbiBmdW5jdGlvbiB0byBvdmVycmlkZSwgZGVmYXVsdHMgdG8gbm9vcFxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuICAgIHRoaXMudGltZSA9IHRpbWU7XG4gICAgdGhpcy5vdXRGcmFtZSA9IGZyYW1lO1xuICAgIHRoaXMubWV0YURhdGEgPSBtZXRhRGF0YTtcblxuICAgIHRoaXMub3V0cHV0KCk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIC8vIGNhbGwgYGRlc3Ryb3lgIGluIGFsbCBpdCdzIGNoaWxkcmVuXG4gICAgdmFyIGluZGV4ID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7XG4gICAgd2hpbGUgKGluZGV4LS0pIHtcbiAgICAgIHRoaXMuY2hpbGRyZW5baW5kZXhdLmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICAvLyBkZWxldGUgaXRzZWxmIGZyb20gdGhlIHBhcmVudCBub2RlXG4gICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICB2YXIgaW5kZXggPSAgdGhpcy5wYXJlbnQuY2hpbGRyZW4uaW5kZXhPZih0aGlzKTtcbiAgICAgIHRoaXMucGFyZW50LmNoaWxkcmVuLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuXG4gICAgLy8gY2Fubm90IHVzZSBhIGRlYWQgb2JqZWN0IGFzIHBhcmVudFxuICAgIHRoaXMuc3RyZWFtUGFyYW1zID0gbnVsbDtcblxuICAgIC8vIGNsZWFuIGl0J3Mgb3duIHJlZmVyZW5jZXMgLyBkaXNjb25uZWN0IGF1ZGlvIG5vZGVzIGlmIG5lZWRlZFxuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBMZm87XG4iXX0=