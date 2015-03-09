"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var _core = require("babel-runtime/core-js")["default"];

var EventEmitter = require("events").EventEmitter;
// var extend = require('object-assign');

var Lfo = (function (EventEmitter) {
  function Lfo() {
    var previous = arguments[0] === undefined ? null : arguments[0];
    var options = arguments[1] === undefined ? {} : arguments[1];
    var defaults = arguments[2] === undefined ? {} : arguments[2];

    _babelHelpers.classCallCheck(this, Lfo);

    this.idx = 0;
    this.params = {};
    this.streamParams = {
      frameSize: 1,
      frameRate: 0
    };

    this.params = _core.Object.assign(defaults, options);

    if (previous) {
      // add ourselves to the previous operator if its passed
      previous.add(this);
      // pass on stream params
      this.streamParams = _core.Object.assign({}, previous.streamParams);
    }
  }

  _babelHelpers.inherits(Lfo, EventEmitter);

  _babelHelpers.prototypeProperties(Lfo, null, {
    setupStream: {

      // common stream config based on the instantiated params

      value: function setupStream() {
        var opts = arguments[0] === undefined ? {} : arguments[0];

        if (opts.frameRate) this.streamParams.frameRate = opts.frameRate;
        if (opts.frameSize) this.streamParams.frameSize = opts.frameSize;

        this.outFrame = new Float32Array(this.streamParams.frameSize);
      },
      writable: true,
      configurable: true
    },
    add: {

      // bind child node

      value: function add() {
        var lfo = arguments[0] === undefined ? null : arguments[0];

        this.on("frame", function (t, d) {
          return lfo.process(t, d);
        });
      },
      writable: true,
      configurable: true
    },
    output: {

      // we take care of the emit ourselves

      value: function output() {
        var outTime = arguments[0] === undefined ? null : arguments[0];

        if (!outTime) outTime = this.time;
        this.emit("frame", outTime, this.outFrame);
      },
      writable: true,
      configurable: true
    },
    remove: {

      // removes all children from listening

      value: function remove() {
        this.removeAllListeners("frame");
      },
      writable: true,
      configurable: true
    },
    process: {
      value: function process(time, data) {
        console.error("process not implemented");
      },
      writable: true,
      configurable: true
    },
    destroy: {

      // will delete itself from the parent node

      value: function destroy() {
        if (this.previous) this.previous.removeListener("frame", this);
      },
      writable: true,
      configurable: true
    }
  });

  return Lfo;
})(EventEmitter);

function factory(previous, options, defaults) {
  return new Lfo(previous, options, defaults);
}
factory.Lfo = Lfo;

module.exports = factory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL3Byb2Nlc3Mtd29ya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUdBLElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUM7OztJQUc1QyxHQUFHLGNBQVMsWUFBWTtBQUVqQixXQUZQLEdBQUc7UUFFSyxRQUFRLGdDQUFHLElBQUk7UUFBRSxPQUFPLGdDQUFHLEVBQUU7UUFBRSxRQUFRLGdDQUFHLEVBQUU7O3VDQUZwRCxHQUFHOztBQUdMLFFBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQ2IsUUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDakIsUUFBSSxDQUFDLFlBQVksR0FBRztBQUNsQixlQUFTLEVBQUUsQ0FBQztBQUNaLGVBQVMsRUFBRSxDQUFDO0tBQ2IsQ0FBQzs7QUFFRixRQUFJLENBQUMsTUFBTSxHQUFHLE1BQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBRS9DLFFBQUksUUFBUSxFQUFFOztBQUVaLGNBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRW5CLFVBQUksQ0FBQyxZQUFZLEdBQUcsTUFBQSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7S0FDOUQ7R0FDRjs7eUJBbEJHLEdBQUcsRUFBUyxZQUFZOztvQ0FBeEIsR0FBRztBQXFCUCxlQUFXOzs7O2FBQUEsdUJBQVk7WUFBWCxJQUFJLGdDQUFHLEVBQUU7O0FBQ25CLFlBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO0FBQ2pFLFlBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDOztBQUVqRSxZQUFJLENBQUMsUUFBUSxHQUFHLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7T0FDL0Q7Ozs7QUFHRCxPQUFHOzs7O2FBQUEsZUFBYTtZQUFaLEdBQUcsZ0NBQUcsSUFBSTs7QUFDWixZQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFDLENBQUMsRUFBRSxDQUFDO2lCQUFLLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUFBLENBQUMsQ0FBQztPQUMvQzs7OztBQUdELFVBQU07Ozs7YUFBQSxrQkFBaUI7WUFBaEIsT0FBTyxnQ0FBRyxJQUFJOztBQUNuQixZQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ2xDLFlBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7T0FDNUM7Ozs7QUFHRCxVQUFNOzs7O2FBQUEsa0JBQUc7QUFDUCxZQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUM7T0FDbEM7Ozs7QUFFRCxXQUFPO2FBQUEsaUJBQUMsSUFBSSxFQUFFLElBQUksRUFBRTtBQUFFLGVBQU8sQ0FBQyxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztPQUFFOzs7O0FBR2pFLFdBQU87Ozs7YUFBQSxtQkFBRztBQUNSLFlBQUksSUFBSSxDQUFDLFFBQVEsRUFDZixJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7T0FDL0M7Ozs7OztTQWxERyxHQUFHO0dBQVMsWUFBWTs7QUFzRDlCLFNBQVMsT0FBTyxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQzVDLFNBQU8sSUFBSSxHQUFHLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztDQUM3QztBQUNELE9BQU8sQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDOztBQUVsQixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyIsImZpbGUiOiJlczYvc291cmNlcy9wcm9jZXNzLXdvcmtlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG4vLyB2YXIgZXh0ZW5kID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xuXG5jbGFzcyBMZm8gZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuXG4gIGNvbnN0cnVjdG9yKHByZXZpb3VzID0gbnVsbCwgb3B0aW9ucyA9IHt9LCBkZWZhdWx0cyA9IHt9KSB7XG4gICAgdGhpcy5pZHggPSAwO1xuICAgIHRoaXMucGFyYW1zID0ge307XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMgPSB7XG4gICAgICBmcmFtZVNpemU6IDEsXG4gICAgICBmcmFtZVJhdGU6IDBcbiAgICB9O1xuXG4gICAgdGhpcy5wYXJhbXMgPSBPYmplY3QuYXNzaWduKGRlZmF1bHRzLCBvcHRpb25zKTtcblxuICAgIGlmIChwcmV2aW91cykge1xuICAgICAgLy8gYWRkIG91cnNlbHZlcyB0byB0aGUgcHJldmlvdXMgb3BlcmF0b3IgaWYgaXRzIHBhc3NlZFxuICAgICAgcHJldmlvdXMuYWRkKHRoaXMpO1xuICAgICAgLy8gcGFzcyBvbiBzdHJlYW0gcGFyYW1zXG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIHByZXZpb3VzLnN0cmVhbVBhcmFtcyk7XG4gICAgfVxuICB9XG5cbiAgLy8gY29tbW9uIHN0cmVhbSBjb25maWcgYmFzZWQgb24gdGhlIGluc3RhbnRpYXRlZCBwYXJhbXNcbiAgc2V0dXBTdHJlYW0ob3B0cyA9IHt9KSB7XG4gICAgaWYgKG9wdHMuZnJhbWVSYXRlKSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVJhdGUgPSBvcHRzLmZyYW1lUmF0ZTtcbiAgICBpZiAob3B0cy5mcmFtZVNpemUpIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IG9wdHMuZnJhbWVTaXplO1xuXG4gICAgdGhpcy5vdXRGcmFtZSA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplKTtcbiAgfVxuXG4gIC8vIGJpbmQgY2hpbGQgbm9kZVxuICBhZGQobGZvID0gbnVsbCkge1xuICAgIHRoaXMub24oJ2ZyYW1lJywgKHQsIGQpID0+IGxmby5wcm9jZXNzKHQsIGQpKTtcbiAgfVxuXG4gIC8vIHdlIHRha2UgY2FyZSBvZiB0aGUgZW1pdCBvdXJzZWx2ZXNcbiAgb3V0cHV0KG91dFRpbWUgPSBudWxsKSB7XG4gICAgaWYgKCFvdXRUaW1lKSBvdXRUaW1lID0gdGhpcy50aW1lO1xuICAgIHRoaXMuZW1pdCgnZnJhbWUnLCBvdXRUaW1lLCB0aGlzLm91dEZyYW1lKTtcbiAgfVxuXG4gIC8vIHJlbW92ZXMgYWxsIGNoaWxkcmVuIGZyb20gbGlzdGVuaW5nXG4gIHJlbW92ZSgpIHtcbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygnZnJhbWUnKTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZGF0YSkgeyBjb25zb2xlLmVycm9yKCdwcm9jZXNzIG5vdCBpbXBsZW1lbnRlZCcpOyB9XG5cbiAgLy8gd2lsbCBkZWxldGUgaXRzZWxmIGZyb20gdGhlIHBhcmVudCBub2RlXG4gIGRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMucHJldmlvdXMpXG4gICAgICB0aGlzLnByZXZpb3VzLnJlbW92ZUxpc3RlbmVyKCdmcmFtZScsIHRoaXMpO1xuICB9XG5cbn1cblxuZnVuY3Rpb24gZmFjdG9yeShwcmV2aW91cywgb3B0aW9ucywgZGVmYXVsdHMpIHtcbiAgcmV0dXJuIG5ldyBMZm8ocHJldmlvdXMsIG9wdGlvbnMsIGRlZmF1bHRzKTtcbn1cbmZhY3RvcnkuTGZvID0gTGZvO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnk7Il19