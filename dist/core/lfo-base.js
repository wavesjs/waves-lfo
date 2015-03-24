"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var Lfo = (function () {
  function Lfo() {
    var parent = arguments[0] === undefined ? null : arguments[0];
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
    this.children = [];

    if (parent) {
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

        // this.on('frame', function(time, frame, metaData) {
        //   lfo.process(time, frame, metaData);
        // });
        this.children.push(lfo);
      }
    },
    output: {

      // we take care of the emit ourselves

      value: function output() {
        var time = arguments[0] === undefined ? this.time : arguments[0];
        var outFrame = arguments[1] === undefined ? this.outFrame : arguments[1];
        var metaData = arguments[2] === undefined ? this.metaData : arguments[2];

        // this.emit('frame', outTime, outFrame, metaData);
        for (var i = 0, l = this.children.length; i < l; i++) {
          this.children[i].process(time, outFrame, metaData);
        }
      }
    },
    remove: {

      // removes all children from listening

      value: function remove() {}
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
})();

function factory(previous, options, defaults) {
  return new Lfo(previous, options, defaults);
}
factory.Lfo = Lfo;

module.exports = factory;

// this.removeAllListeners('frame');
// call remove on all childs
//# sourceMappingURL=data:application/json;base64,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QUM3Qzs7OztTQS9FRyxHQUFHOzs7QUFtRlQsU0FBUyxPQUFPLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7QUFDNUMsU0FBTyxJQUFJLEdBQUcsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0NBQzdDO0FBQ0QsT0FBTyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7O0FBRWxCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDIiwiZmlsZSI6ImVzNi9jb3JlL2xmby1iYXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBMZm8ge1xuXG4gIGNvbnN0cnVjdG9yKHBhcmVudCA9IG51bGwsIG9wdGlvbnMgPSB7fSwgZGVmYXVsdHMgPSB7fSkge1xuICAgIHRoaXMuaWR4ID0gMDtcbiAgICB0aGlzLnBhcmFtcyA9IHt9O1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zID0ge1xuICAgICAgZnJhbWVTaXplOiAxLFxuICAgICAgZnJhbWVSYXRlOiAwXG4gICAgfTtcblxuICAgIHRoaXMucGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcblxuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIC8vIGFkZCBvdXJzZWx2ZXMgdG8gdGhlIHBhcmVudCBvcGVyYXRvciBpZiBpdHMgcGFzc2VkXG4gICAgICBwYXJlbnQuYWRkKHRoaXMpO1xuICAgICAgLy8gcGFzcyBvbiBzdHJlYW0gcGFyYW1zXG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIHBhcmVudC5zdHJlYW1QYXJhbXMpO1xuICAgIH1cbiAgfVxuXG4gIC8vIHJlc2V0IGBvdXRGcmFtZWAgYW5kIGNhbGwgcmVzZXQgb24gY2hpbGRyZW5cbiAgcmVzZXQoKSB7fVxuXG4gIC8vIGZpbGwgdGhlIG9uLWdvaW5nIGJ1ZmZlciB3aXRoIDBcbiAgLy8gb3V0cHV0IGl0LCB0aGVuIGNhbGwgcmVzZXQgb24gYWxsIHRoZSBjaGlsZHJlblxuICAvLyBATk9URSB0aGUgZXZlbnQgYmFzZWQgc3lzdGVtIChhc3luYykgY291bGQgcHJvZHVjZSB0aGF0IHRoZSByZXNldFxuICAvLyAgICAgICBjb3VsZCBiZSBjYWxsZWQgYmVmb3JlIHRoZSBjaGlsZCBmaW5hbGl6ZVxuICBmaW5hbGl6ZSgpIHt9XG5cbiAgLy8gY29tbW9uIHN0cmVhbSBjb25maWcgYmFzZWQgb24gdGhlIGluc3RhbnRpYXRlZCBwYXJhbXNcbiAgc2V0dXBTdHJlYW0ob3B0cyA9IHt9KSB7XG4gICAgaWYgKG9wdHMuZnJhbWVSYXRlKSB7XG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVJhdGUgPSBvcHRzLmZyYW1lUmF0ZTtcbiAgICB9XG5cbiAgICBpZiAob3B0cy5mcmFtZVNpemUpIHtcbiAgICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IG9wdHMuZnJhbWVTaXplO1xuICAgIH1cblxuICAgIGlmIChvcHRzLmJsb2NrU2FtcGxlUmF0ZSkge1xuICAgICAgdGhpcy5zdHJlYW1QYXJhbXMuYmxvY2tTYW1wbGVSYXRlID0gb3B0cy5ibG9ja1NhbXBsZVJhdGU7XG4gICAgfVxuXG4gICAgdGhpcy5vdXRGcmFtZSA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplKTtcbiAgfVxuXG4gIC8vIGJpbmQgY2hpbGQgbm9kZVxuICBhZGQobGZvID0gbnVsbCkge1xuICAgIC8vIHRoaXMub24oJ2ZyYW1lJywgZnVuY3Rpb24odGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgLy8gICBsZm8ucHJvY2Vzcyh0aW1lLCBmcmFtZSwgbWV0YURhdGEpO1xuICAgIC8vIH0pO1xuICAgIHRoaXMuY2hpbGRyZW4ucHVzaChsZm8pO1xuICB9XG5cbiAgLy8gd2UgdGFrZSBjYXJlIG9mIHRoZSBlbWl0IG91cnNlbHZlc1xuICBvdXRwdXQodGltZSA9IHRoaXMudGltZSwgb3V0RnJhbWUgPSB0aGlzLm91dEZyYW1lLCBtZXRhRGF0YSA9IHRoaXMubWV0YURhdGEpIHtcbiAgICAvLyB0aGlzLmVtaXQoJ2ZyYW1lJywgb3V0VGltZSwgb3V0RnJhbWUsIG1ldGFEYXRhKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB0aGlzLmNoaWxkcmVuW2ldLnByb2Nlc3ModGltZSwgb3V0RnJhbWUsIG1ldGFEYXRhKTtcbiAgICB9XG4gIH1cblxuICAvLyByZW1vdmVzIGFsbCBjaGlsZHJlbiBmcm9tIGxpc3RlbmluZ1xuICByZW1vdmUoKSB7XG4gICAgLy8gdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ2ZyYW1lJyk7XG4gICAgLy8gY2FsbCByZW1vdmUgb24gYWxsIGNoaWxkc1xuICB9XG5cbiAgcHJvY2Vzcyh0aW1lLCBmcmFtZSwgbWV0YWRhdGEpIHtcbiAgICB0aGlzLnRpbWUgPSB0aW1lO1xuICB9XG5cbiAgLy8gd2lsbCBkZWxldGUgaXRzZWxmIGZyb20gdGhlIHBhcmVudCBub2RlXG4gIC8vIEBOT1RFIHRoaXMgbm9kZSBhbmQgYWxsIGhpcyBjaGlsZHJlbiB3aWxsIG5ldmVyIGdhcmJhZ2UgY29sbGVjdGVkXG4gIC8vIGB0aGlzLnByZXZpb3VzID0gbnVsbGAgZml4ZXMgdGhlIGZpcnN0IHByb2JsZW0gYnV0IG5vdCB0aGUgc2Vjb25kIG9uZVxuICBkZXN0cm95KCkge1xuICAgIGlmICghdGhpcy5wcmV2aW91cykgeyByZXR1cm47IH1cbiAgICB0aGlzLnByZXZpb3VzLnJlbW92ZUxpc3RlbmVyKCdmcmFtZScsIHRoaXMpO1xuICB9XG5cbn1cblxuZnVuY3Rpb24gZmFjdG9yeShwcmV2aW91cywgb3B0aW9ucywgZGVmYXVsdHMpIHtcbiAgcmV0dXJuIG5ldyBMZm8ocHJldmlvdXMsIG9wdGlvbnMsIGRlZmF1bHRzKTtcbn1cbmZhY3RvcnkuTGZvID0gTGZvO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnk7XG4iXX0=