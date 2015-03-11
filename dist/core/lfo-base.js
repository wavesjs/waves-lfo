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

    this.params = _core.Object.assign(defaults, options);

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

        this.outFrame = new Float32Array(this.streamParams.frameSize);
      }
    },
    add: {

      // bind child node

      value: function add() {
        var lfo = arguments[0] === undefined ? null : arguments[0];

        this.on("frame", function (t, d) {
          lfo.process(t, d);
        });
      }
    },
    output: {

      // we take care of the emit ourselves

      value: function output() {
        var outTime = arguments[0] === undefined ? null : arguments[0];

        if (!outTime) outTime = this.time;
        this.emit("frame", outTime, this.outFrame);
      }
    },
    remove: {

      // removes all children from listening

      value: function remove() {
        this.removeAllListeners("frame");
      }
    },
    process: {
      value: function process(time, data, metadata) {
        console.error("process not implemented");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL3Byb2Nlc3Mtd29ya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFHQSxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsWUFBWSxDQUFDOzs7SUFHNUMsR0FBRztBQUVJLFdBRlAsR0FBRyxHQUVtRDtRQUE5QyxRQUFRLGdDQUFHLElBQUk7UUFBRSxPQUFPLGdDQUFHLEVBQUU7UUFBRSxRQUFRLGdDQUFHLEVBQUU7OzBCQUZwRCxHQUFHOztBQUdMLFFBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQ2IsUUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDakIsUUFBSSxDQUFDLFlBQVksR0FBRztBQUNsQixlQUFTLEVBQUUsQ0FBQztBQUNaLGVBQVMsRUFBRSxDQUFDO0tBQ2IsQ0FBQzs7QUFFRixRQUFJLENBQUMsTUFBTSxHQUFHLE1BQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBRS9DLFFBQUksUUFBUSxFQUFFOztBQUVaLGNBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRW5CLFVBQUksQ0FBQyxZQUFZLEdBQUcsTUFBQSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7S0FDOUQ7R0FDRjs7WUFsQkcsR0FBRzs7ZUFBSCxHQUFHO0FBcUJQLFNBQUs7Ozs7YUFBQSxpQkFBRyxFQUFFOztBQU1WLFlBQVE7Ozs7Ozs7YUFBQSxvQkFBRyxFQUFFOztBQUdiLGVBQVc7Ozs7YUFBQSx1QkFBWTtZQUFYLElBQUksZ0NBQUcsRUFBRTs7QUFDbkIsWUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQUUsY0FBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztTQUFFO0FBQ3JFLFlBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUFFLGNBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7U0FBRTs7QUFFckUsWUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO09BQy9EOztBQUdELE9BQUc7Ozs7YUFBQSxlQUFhO1lBQVosR0FBRyxnQ0FBRyxJQUFJOztBQUNaLFlBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBSztBQUN6QixhQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNuQixDQUFDLENBQUM7T0FDSjs7QUFHRCxVQUFNOzs7O2FBQUEsa0JBQWlCO1lBQWhCLE9BQU8sZ0NBQUcsSUFBSTs7QUFDbkIsWUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztBQUNsQyxZQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO09BQzVDOztBQUdELFVBQU07Ozs7YUFBQSxrQkFBRztBQUNQLFlBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztPQUNsQzs7QUFFRCxXQUFPO2FBQUEsaUJBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7QUFDNUIsZUFBTyxDQUFDLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO09BQzFDOztBQUtELFdBQU87Ozs7OzthQUFBLG1CQUFHO0FBQ1IsWUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFBRSxpQkFBTztTQUFFO0FBQy9CLFlBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztPQUM3Qzs7OztTQWpFRyxHQUFHO0dBQVMsWUFBWTs7QUFxRTlCLFNBQVMsT0FBTyxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQzVDLFNBQU8sSUFBSSxHQUFHLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztDQUM3QztBQUNELE9BQU8sQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDOztBQUVsQixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyIsImZpbGUiOiJlczYvc291cmNlcy9wcm9jZXNzLXdvcmtlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG4vLyB2YXIgZXh0ZW5kID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xuXG5jbGFzcyBMZm8gZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuXG4gIGNvbnN0cnVjdG9yKHByZXZpb3VzID0gbnVsbCwgb3B0aW9ucyA9IHt9LCBkZWZhdWx0cyA9IHt9KSB7XG4gICAgdGhpcy5pZHggPSAwO1xuICAgIHRoaXMucGFyYW1zID0ge307XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMgPSB7XG4gICAgICBmcmFtZVNpemU6IDEsXG4gICAgICBmcmFtZVJhdGU6IDBcbiAgICB9O1xuXG4gICAgdGhpcy5wYXJhbXMgPSBPYmplY3QuYXNzaWduKGRlZmF1bHRzLCBvcHRpb25zKTtcblxuICAgIGlmIChwcmV2aW91cykge1xuICAgICAgLy8gYWRkIG91cnNlbHZlcyB0byB0aGUgcHJldmlvdXMgb3BlcmF0b3IgaWYgaXRzIHBhc3NlZFxuICAgICAgcHJldmlvdXMuYWRkKHRoaXMpO1xuICAgICAgLy8gcGFzcyBvbiBzdHJlYW0gcGFyYW1zXG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIHByZXZpb3VzLnN0cmVhbVBhcmFtcyk7XG4gICAgfVxuICB9XG5cbiAgLy8gcmVzZXQgYG91dEZyYW1lYCBhbmQgY2FsbCByZXNldCBvbiBjaGlsZHJlblxuICByZXNldCgpIHt9XG5cbiAgLy8gZmlsbCB0aGUgb24tZ29pbmcgYnVmZmVyIHdpdGggMFxuICAvLyBvdXRwdXQgaXQsIHRoZW4gY2FsbCByZXNldCBvbiBhbGwgdGhlIGNoaWxkcmVuXG4gIC8vIEBOT1RFIHRoZSBldmVudCBiYXNlZCBzeXN0ZW0gKGFzeW5jKSBjb3VsZCBwcm9kdWNlIHRoYXQgdGhlIHJlc2V0XG4gIC8vICAgICAgIGNvdWxkIGJlIGNhbGxlZCBiZWZvcmUgdGhlIGNoaWxkIGZpbmFsaXplXG4gIGZpbmFsaXplKCkge31cblxuICAvLyBjb21tb24gc3RyZWFtIGNvbmZpZyBiYXNlZCBvbiB0aGUgaW5zdGFudGlhdGVkIHBhcmFtc1xuICBzZXR1cFN0cmVhbShvcHRzID0ge30pIHtcbiAgICBpZiAob3B0cy5mcmFtZVJhdGUpIHsgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVSYXRlID0gb3B0cy5mcmFtZVJhdGU7IH1cbiAgICBpZiAob3B0cy5mcmFtZVNpemUpIHsgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gb3B0cy5mcmFtZVNpemU7IH1cblxuICAgIHRoaXMub3V0RnJhbWUgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSk7XG4gIH1cblxuICAvLyBiaW5kIGNoaWxkIG5vZGVcbiAgYWRkKGxmbyA9IG51bGwpIHtcbiAgICB0aGlzLm9uKCdmcmFtZScsICh0LCBkKSA9PiB7XG4gICAgICBsZm8ucHJvY2Vzcyh0LCBkKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIHdlIHRha2UgY2FyZSBvZiB0aGUgZW1pdCBvdXJzZWx2ZXNcbiAgb3V0cHV0KG91dFRpbWUgPSBudWxsKSB7XG4gICAgaWYgKCFvdXRUaW1lKSBvdXRUaW1lID0gdGhpcy50aW1lO1xuICAgIHRoaXMuZW1pdCgnZnJhbWUnLCBvdXRUaW1lLCB0aGlzLm91dEZyYW1lKTtcbiAgfVxuXG4gIC8vIHJlbW92ZXMgYWxsIGNoaWxkcmVuIGZyb20gbGlzdGVuaW5nXG4gIHJlbW92ZSgpIHtcbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygnZnJhbWUnKTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZGF0YSwgbWV0YWRhdGEpIHtcbiAgICBjb25zb2xlLmVycm9yKCdwcm9jZXNzIG5vdCBpbXBsZW1lbnRlZCcpO1xuICB9XG5cbiAgLy8gd2lsbCBkZWxldGUgaXRzZWxmIGZyb20gdGhlIHBhcmVudCBub2RlXG4gIC8vIEBOT1RFIHRoaXMgbm9kZSBhbmQgYWxsIGhpcyBjaGlsZHJlbiB3aWxsIG5ldmVyIGdhcmJhZ2UgY29sbGVjdGVkXG4gIC8vIGB0aGlzLnByZXZpb3VzID0gbnVsbGAgZml4ZXMgdGhlIGZpcnN0IHByb2JsZW0gYnV0IG5vdCB0aGUgc2Vjb25kIG9uZVxuICBkZXN0cm95KCkge1xuICAgIGlmICghdGhpcy5wcmV2aW91cykgeyByZXR1cm47IH1cbiAgICB0aGlzLnByZXZpb3VzLnJlbW92ZUxpc3RlbmVyKCdmcmFtZScsIHRoaXMpO1xuICB9XG5cbn1cblxuZnVuY3Rpb24gZmFjdG9yeShwcmV2aW91cywgb3B0aW9ucywgZGVmYXVsdHMpIHtcbiAgcmV0dXJuIG5ldyBMZm8ocHJldmlvdXMsIG9wdGlvbnMsIGRlZmF1bHRzKTtcbn1cbmZhY3RvcnkuTGZvID0gTGZvO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnk7XG4iXX0=