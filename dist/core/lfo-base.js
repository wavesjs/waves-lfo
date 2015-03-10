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
      value: function process(time, data) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL3Byb2Nlc3Mtd29ya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFHQSxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsWUFBWSxDQUFDOzs7SUFHNUMsR0FBRztBQUVJLFdBRlAsR0FBRyxHQUVtRDtRQUE5QyxRQUFRLGdDQUFHLElBQUk7UUFBRSxPQUFPLGdDQUFHLEVBQUU7UUFBRSxRQUFRLGdDQUFHLEVBQUU7OzBCQUZwRCxHQUFHOztBQUdMLFFBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQ2IsUUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDakIsUUFBSSxDQUFDLFlBQVksR0FBRztBQUNsQixlQUFTLEVBQUUsQ0FBQztBQUNaLGVBQVMsRUFBRSxDQUFDO0tBQ2IsQ0FBQzs7QUFFRixRQUFJLENBQUMsTUFBTSxHQUFHLE1BQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBRS9DLFFBQUksUUFBUSxFQUFFOztBQUVaLGNBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRW5CLFVBQUksQ0FBQyxZQUFZLEdBQUcsTUFBQSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7S0FDOUQ7R0FDRjs7WUFsQkcsR0FBRzs7ZUFBSCxHQUFHO0FBcUJQLGVBQVc7Ozs7YUFBQSx1QkFBWTtZQUFYLElBQUksZ0NBQUcsRUFBRTs7QUFDbkIsWUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQUUsY0FBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztTQUFFO0FBQ3JFLFlBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUFFLGNBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7U0FBRTs7QUFFckUsWUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO09BQy9EOztBQUdELE9BQUc7Ozs7YUFBQSxlQUFhO1lBQVosR0FBRyxnQ0FBRyxJQUFJOztBQUNaLFlBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBSztBQUN6QixhQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNuQixDQUFDLENBQUM7T0FDSjs7QUFHRCxVQUFNOzs7O2FBQUEsa0JBQWlCO1lBQWhCLE9BQU8sZ0NBQUcsSUFBSTs7QUFDbkIsWUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztBQUNsQyxZQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO09BQzVDOztBQUdELFVBQU07Ozs7YUFBQSxrQkFBRztBQUNQLFlBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztPQUNsQzs7QUFFRCxXQUFPO2FBQUEsaUJBQUMsSUFBSSxFQUFFLElBQUksRUFBRTtBQUNsQixlQUFPLENBQUMsS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7T0FDMUM7O0FBS0QsV0FBTzs7Ozs7O2FBQUEsbUJBQUc7QUFDUixZQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUFFLGlCQUFPO1NBQUU7QUFDL0IsWUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO09BQzdDOzs7O1NBeERHLEdBQUc7R0FBUyxZQUFZOztBQTREOUIsU0FBUyxPQUFPLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7QUFDNUMsU0FBTyxJQUFJLEdBQUcsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0NBQzdDO0FBQ0QsT0FBTyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7O0FBRWxCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDIiwiZmlsZSI6ImVzNi9zb3VyY2VzL3Byb2Nlc3Mtd29ya2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcbi8vIHZhciBleHRlbmQgPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG5cbmNsYXNzIExmbyBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG5cbiAgY29uc3RydWN0b3IocHJldmlvdXMgPSBudWxsLCBvcHRpb25zID0ge30sIGRlZmF1bHRzID0ge30pIHtcbiAgICB0aGlzLmlkeCA9IDA7XG4gICAgdGhpcy5wYXJhbXMgPSB7fTtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcyA9IHtcbiAgICAgIGZyYW1lU2l6ZTogMSxcbiAgICAgIGZyYW1lUmF0ZTogMFxuICAgIH07XG5cbiAgICB0aGlzLnBhcmFtcyA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdHMsIG9wdGlvbnMpO1xuXG4gICAgaWYgKHByZXZpb3VzKSB7XG4gICAgICAvLyBhZGQgb3Vyc2VsdmVzIHRvIHRoZSBwcmV2aW91cyBvcGVyYXRvciBpZiBpdHMgcGFzc2VkXG4gICAgICBwcmV2aW91cy5hZGQodGhpcyk7XG4gICAgICAvLyBwYXNzIG9uIHN0cmVhbSBwYXJhbXNcbiAgICAgIHRoaXMuc3RyZWFtUGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgcHJldmlvdXMuc3RyZWFtUGFyYW1zKTtcbiAgICB9XG4gIH1cblxuICAvLyBjb21tb24gc3RyZWFtIGNvbmZpZyBiYXNlZCBvbiB0aGUgaW5zdGFudGlhdGVkIHBhcmFtc1xuICBzZXR1cFN0cmVhbShvcHRzID0ge30pIHtcbiAgICBpZiAob3B0cy5mcmFtZVJhdGUpIHsgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVSYXRlID0gb3B0cy5mcmFtZVJhdGU7IH1cbiAgICBpZiAob3B0cy5mcmFtZVNpemUpIHsgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gb3B0cy5mcmFtZVNpemU7IH1cblxuICAgIHRoaXMub3V0RnJhbWUgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSk7XG4gIH1cblxuICAvLyBiaW5kIGNoaWxkIG5vZGVcbiAgYWRkKGxmbyA9IG51bGwpIHtcbiAgICB0aGlzLm9uKCdmcmFtZScsICh0LCBkKSA9PiB7XG4gICAgICBsZm8ucHJvY2Vzcyh0LCBkKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIHdlIHRha2UgY2FyZSBvZiB0aGUgZW1pdCBvdXJzZWx2ZXNcbiAgb3V0cHV0KG91dFRpbWUgPSBudWxsKSB7XG4gICAgaWYgKCFvdXRUaW1lKSBvdXRUaW1lID0gdGhpcy50aW1lO1xuICAgIHRoaXMuZW1pdCgnZnJhbWUnLCBvdXRUaW1lLCB0aGlzLm91dEZyYW1lKTtcbiAgfVxuXG4gIC8vIHJlbW92ZXMgYWxsIGNoaWxkcmVuIGZyb20gbGlzdGVuaW5nXG4gIHJlbW92ZSgpIHtcbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygnZnJhbWUnKTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZGF0YSkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ3Byb2Nlc3Mgbm90IGltcGxlbWVudGVkJyk7XG4gIH1cblxuICAvLyB3aWxsIGRlbGV0ZSBpdHNlbGYgZnJvbSB0aGUgcGFyZW50IG5vZGVcbiAgLy8gQE5PVEUgdGhpcyBub2RlIGFuZCBhbGwgaGlzIGNoaWxkcmVuIHdpbGwgbmV2ZXIgZ2FyYmFnZSBjb2xsZWN0ZWRcbiAgLy8gYHRoaXMucHJldmlvdXMgPSBudWxsYCBmaXhlcyB0aGUgZmlyc3QgcHJvYmxlbSBidXQgbm90IHRoZSBzZWNvbmQgb25lXG4gIGRlc3Ryb3koKSB7XG4gICAgaWYgKCF0aGlzLnByZXZpb3VzKSB7IHJldHVybjsgfVxuICAgIHRoaXMucHJldmlvdXMucmVtb3ZlTGlzdGVuZXIoJ2ZyYW1lJywgdGhpcyk7XG4gIH1cblxufVxuXG5mdW5jdGlvbiBmYWN0b3J5KHByZXZpb3VzLCBvcHRpb25zLCBkZWZhdWx0cykge1xuICByZXR1cm4gbmV3IExmbyhwcmV2aW91cywgb3B0aW9ucywgZGVmYXVsdHMpO1xufVxuZmFjdG9yeS5MZm8gPSBMZm87XG5cbm1vZHVsZS5leHBvcnRzID0gZmFjdG9yeTtcbiJdfQ==