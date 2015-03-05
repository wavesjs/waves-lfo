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

    if (!(this instanceof Lfo)) {
      return new Lfo(previous, options);
    }this.idx = 0;
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

module.exports = Lfo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL3Byb2Nlc3Mtd29ya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUdBLElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUM7OztJQUc1QyxHQUFHLGNBQVMsWUFBWTtBQUVqQixXQUZQLEdBQUc7UUFFSyxRQUFRLGdDQUFHLElBQUk7UUFBRSxPQUFPLGdDQUFHLEVBQUU7UUFBRSxRQUFRLGdDQUFHLEVBQUU7O3VDQUZwRCxHQUFHOztBQUdMLFFBQUksRUFBRSxJQUFJLFlBQVksR0FBRyxDQUFBLEFBQUM7QUFBRSxhQUFPLElBQUksR0FBRyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztLQUFBLEFBRTlELElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQ2IsUUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDakIsUUFBSSxDQUFDLFlBQVksR0FBRztBQUNsQixlQUFTLEVBQUUsQ0FBQztBQUNaLGVBQVMsRUFBRSxDQUFDO0tBQ2IsQ0FBQzs7QUFFRixRQUFJLENBQUMsTUFBTSxHQUFHLE1BQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBRS9DLFFBQUcsUUFBUSxFQUFFOztBQUVYLGNBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRW5CLFVBQUksQ0FBQyxZQUFZLEdBQUcsTUFBQSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7S0FDOUQ7R0FDRjs7eUJBcEJHLEdBQUcsRUFBUyxZQUFZOztvQ0FBeEIsR0FBRztBQXVCUCxlQUFXOzs7O2FBQUEsdUJBQVk7WUFBWCxJQUFJLGdDQUFHLEVBQUU7O0FBRW5CLFlBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO0FBQ2hFLFlBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO0FBQ2hFLFlBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztPQUMvRDs7OztBQUdELE9BQUc7Ozs7YUFBQSxlQUFZO1lBQVgsR0FBRyxnQ0FBRyxJQUFJOztBQUNaLFlBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFVBQUMsQ0FBQyxFQUFFLENBQUM7aUJBQUssR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQUEsQ0FBQyxDQUFDO09BQy9DOzs7O0FBR0QsVUFBTTs7OzthQUFBLGtCQUFpQjtZQUFoQixPQUFPLGdDQUFHLElBQUk7O0FBQ25CLFlBQUcsQ0FBQyxPQUFPLEVBQUUsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDakMsWUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztPQUM1Qzs7OztBQUdELFVBQU07Ozs7YUFBQSxrQkFBRTtBQUNOLFlBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztPQUNsQzs7OztBQUVELFdBQU87YUFBQSxpQkFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFO0FBQUUsZUFBTyxDQUFDLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO09BQUU7Ozs7QUFHakUsV0FBTzs7OzthQUFBLG1CQUFFO0FBQ1AsWUFBRyxJQUFJLENBQUMsUUFBUSxFQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztPQUMvQzs7Ozs7O1NBcERHLEdBQUc7R0FBUyxZQUFZOztBQXdEOUIsTUFBTSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMiLCJmaWxlIjoiZXM2L3NvdXJjZXMvcHJvY2Vzcy13b3JrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcblwidXNlIHN0cmljdFwiO1xuXG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyO1xuLy8gdmFyIGV4dGVuZCA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcblxuY2xhc3MgTGZvIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcblxuICBjb25zdHJ1Y3RvcihwcmV2aW91cyA9IG51bGwsIG9wdGlvbnMgPSB7fSwgZGVmYXVsdHMgPSB7fSkge1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBMZm8pKSByZXR1cm4gbmV3IExmbyhwcmV2aW91cywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmlkeCA9IDA7XG4gICAgdGhpcy5wYXJhbXMgPSB7fTtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcyA9IHtcbiAgICAgIGZyYW1lU2l6ZTogMSxcbiAgICAgIGZyYW1lUmF0ZTogMFxuICAgIH07XG5cbiAgICB0aGlzLnBhcmFtcyA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdHMsIG9wdGlvbnMpO1xuXG4gICAgaWYocHJldmlvdXMpIHtcbiAgICAgIC8vIGFkZCBvdXJzZWx2ZXMgdG8gdGhlIHByZXZpb3VzIG9wZXJhdG9yIGlmIGl0cyBwYXNzZWRcbiAgICAgIHByZXZpb3VzLmFkZCh0aGlzKTtcbiAgICAgIC8vIHBhc3Mgb24gc3RyZWFtIHBhcmFtc1xuICAgICAgdGhpcy5zdHJlYW1QYXJhbXMgPSBPYmplY3QuYXNzaWduKHt9LCBwcmV2aW91cy5zdHJlYW1QYXJhbXMpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGNvbW1vbiBzdHJlYW0gY29uZmlnIGJhc2VkIG9uIHRoZSBpbnN0YW50aWF0ZWQgcGFyYW1zXG4gIHNldHVwU3RyZWFtKG9wdHMgPSB7fSkge1xuXG4gICAgaWYob3B0cy5mcmFtZVJhdGUpIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lUmF0ZSA9IG9wdHMuZnJhbWVSYXRlO1xuICAgIGlmKG9wdHMuZnJhbWVTaXplKSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSBvcHRzLmZyYW1lU2l6ZTtcbiAgICB0aGlzLm91dEZyYW1lID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUpO1xuICB9XG5cbiAgLy8gYmluZCBjaGlsZCBub2RlXG4gIGFkZChsZm8gPSBudWxsKXtcbiAgICB0aGlzLm9uKCdmcmFtZScsICh0LCBkKSA9PiBsZm8ucHJvY2Vzcyh0LCBkKSk7XG4gIH1cblxuICAvLyB3ZSB0YWtlIGNhcmUgb2YgdGhlIGVtaXQgb3Vyc2VsdmVzXG4gIG91dHB1dChvdXRUaW1lID0gbnVsbCkge1xuICAgIGlmKCFvdXRUaW1lKSBvdXRUaW1lID0gdGhpcy50aW1lO1xuICAgIHRoaXMuZW1pdCgnZnJhbWUnLCBvdXRUaW1lLCB0aGlzLm91dEZyYW1lKTtcbiAgfVxuXG4gIC8vIHJlbW92ZXMgYWxsIGNoaWxkcmVuIGZyb20gbGlzdGVuaW5nXG4gIHJlbW92ZSgpe1xuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdmcmFtZScpO1xuICB9XG5cbiAgcHJvY2Vzcyh0aW1lLCBkYXRhKSB7IGNvbnNvbGUuZXJyb3IoJ3Byb2Nlc3Mgbm90IGltcGxlbWVudGVkJyk7IH1cblxuICAvLyB3aWxsIGRlbGV0ZSBpdHNlbGYgZnJvbSB0aGUgcGFyZW50IG5vZGVcbiAgZGVzdHJveSgpe1xuICAgIGlmKHRoaXMucHJldmlvdXMpXG4gICAgICB0aGlzLnByZXZpb3VzLnJlbW92ZUxpc3RlbmVyKCdmcmFtZScsIHRoaXMpO1xuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBMZm87Il19