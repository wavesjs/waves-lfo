"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var EventEmitter = require("events").EventEmitter;
var extend = require("object-assign");

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

    this.params = extend(defaults, options);

    if (previous) {
      // add ourselves to the previous operator if its passed
      previous.add(this);
      // pass on stream params
      this.streamParams = extend({}, previous.streamParams);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9vcGVyYXRvcnMvc3JjLWF1ZGlvL3Byb2Nlc3Mtd29ya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFHQSxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsWUFBWSxDQUFDO0FBQ2xELElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQzs7SUFFaEMsR0FBRyxjQUFTLFlBQVk7QUFFakIsV0FGUCxHQUFHO1FBRUssUUFBUSxnQ0FBRyxJQUFJO1FBQUUsT0FBTyxnQ0FBRyxFQUFFO1FBQUUsUUFBUSxnQ0FBRyxFQUFFOzt1Q0FGcEQsR0FBRzs7QUFHTCxRQUFJLEVBQUUsSUFBSSxZQUFZLEdBQUcsQ0FBQSxBQUFDO0FBQUUsYUFBTyxJQUFJLEdBQUcsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FBQSxBQUU5RCxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUNiLFFBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLFFBQUksQ0FBQyxZQUFZLEdBQUc7QUFDbEIsZUFBUyxFQUFFLENBQUM7QUFDWixlQUFTLEVBQUUsQ0FBQztLQUNiLENBQUM7O0FBRUYsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDOztBQUV4QyxRQUFHLFFBQVEsRUFBRTs7QUFFWCxjQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVuQixVQUFJLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO0tBQ3ZEO0dBQ0Y7O3lCQXBCRyxHQUFHLEVBQVMsWUFBWTs7b0NBQXhCLEdBQUc7QUF1QlAsZUFBVzs7OzthQUFBLHVCQUFZO1lBQVgsSUFBSSxnQ0FBRyxFQUFFOztBQUVuQixZQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztBQUNoRSxZQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztBQUNoRSxZQUFJLENBQUMsUUFBUSxHQUFHLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7T0FDL0Q7Ozs7QUFHRCxPQUFHOzs7O2FBQUEsZUFBWTtZQUFYLEdBQUcsZ0NBQUcsSUFBSTs7QUFDWixZQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFDLENBQUMsRUFBRSxDQUFDO2lCQUFLLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUFBLENBQUMsQ0FBQztPQUMvQzs7OztBQUdELFVBQU07Ozs7YUFBQSxrQkFBaUI7WUFBaEIsT0FBTyxnQ0FBRyxJQUFJOztBQUNuQixZQUFHLENBQUMsT0FBTyxFQUFFLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ2pDLFlBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7T0FDNUM7Ozs7QUFHRCxVQUFNOzs7O2FBQUEsa0JBQUU7QUFDTixZQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUM7T0FDbEM7Ozs7QUFFRCxXQUFPO2FBQUEsaUJBQUMsSUFBSSxFQUFFLElBQUksRUFBRTtBQUFFLGVBQU8sQ0FBQyxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztPQUFFOzs7O0FBR2pFLFdBQU87Ozs7YUFBQSxtQkFBRTtBQUNQLFlBQUcsSUFBSSxDQUFDLFFBQVEsRUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7T0FDL0M7Ozs7OztTQXBERyxHQUFHO0dBQVMsWUFBWTs7QUF3RDlCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDIiwiZmlsZSI6InNyYy9vcGVyYXRvcnMvc3JjLWF1ZGlvL3Byb2Nlc3Mtd29ya2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcbnZhciBleHRlbmQgPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG5cbmNsYXNzIExmbyBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG5cbiAgY29uc3RydWN0b3IocHJldmlvdXMgPSBudWxsLCBvcHRpb25zID0ge30sIGRlZmF1bHRzID0ge30pIHtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgTGZvKSkgcmV0dXJuIG5ldyBMZm8ocHJldmlvdXMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5pZHggPSAwO1xuICAgIHRoaXMucGFyYW1zID0ge307XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMgPSB7XG4gICAgICBmcmFtZVNpemU6IDEsXG4gICAgICBmcmFtZVJhdGU6IDBcbiAgICB9O1xuICAgIFxuICAgIHRoaXMucGFyYW1zID0gZXh0ZW5kKGRlZmF1bHRzLCBvcHRpb25zKTtcblxuICAgIGlmKHByZXZpb3VzKSB7XG4gICAgICAvLyBhZGQgb3Vyc2VsdmVzIHRvIHRoZSBwcmV2aW91cyBvcGVyYXRvciBpZiBpdHMgcGFzc2VkXG4gICAgICBwcmV2aW91cy5hZGQodGhpcyk7XG4gICAgICAvLyBwYXNzIG9uIHN0cmVhbSBwYXJhbXNcbiAgICAgIHRoaXMuc3RyZWFtUGFyYW1zID0gZXh0ZW5kKHt9LCBwcmV2aW91cy5zdHJlYW1QYXJhbXMpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGNvbW1vbiBzdHJlYW0gY29uZmlnIGJhc2VkIG9uIHRoZSBpbnN0YW50aWF0ZWQgcGFyYW1zXG4gIHNldHVwU3RyZWFtKG9wdHMgPSB7fSkge1xuXG4gICAgaWYob3B0cy5mcmFtZVJhdGUpIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lUmF0ZSA9IG9wdHMuZnJhbWVSYXRlO1xuICAgIGlmKG9wdHMuZnJhbWVTaXplKSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSBvcHRzLmZyYW1lU2l6ZTtcbiAgICB0aGlzLm91dEZyYW1lID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUpO1xuICB9XG5cbiAgLy8gYmluZCBjaGlsZCBub2RlXG4gIGFkZChsZm8gPSBudWxsKXtcbiAgICB0aGlzLm9uKCdmcmFtZScsICh0LCBkKSA9PiBsZm8ucHJvY2Vzcyh0LCBkKSk7XG4gIH1cblxuICAvLyB3ZSB0YWtlIGNhcmUgb2YgdGhlIGVtaXQgb3Vyc2VsdmVzXG4gIG91dHB1dChvdXRUaW1lID0gbnVsbCkge1xuICAgIGlmKCFvdXRUaW1lKSBvdXRUaW1lID0gdGhpcy50aW1lO1xuICAgIHRoaXMuZW1pdCgnZnJhbWUnLCBvdXRUaW1lLCB0aGlzLm91dEZyYW1lKTtcbiAgfVxuXG4gIC8vIHJlbW92ZXMgYWxsIGNoaWxkcmVuIGZyb20gbGlzdGVuaW5nXG4gIHJlbW92ZSgpe1xuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdmcmFtZScpO1xuICB9XG5cbiAgcHJvY2Vzcyh0aW1lLCBkYXRhKSB7IGNvbnNvbGUuZXJyb3IoJ3Byb2Nlc3Mgbm90IGltcGxlbWVudGVkJyk7IH1cblxuICAvLyB3aWxsIGRlbGV0ZSBpdHNlbGYgZnJvbSB0aGUgcGFyZW50IG5vZGVcbiAgZGVzdHJveSgpe1xuICAgIGlmKHRoaXMucHJldmlvdXMpXG4gICAgICB0aGlzLnByZXZpb3VzLnJlbW92ZUxpc3RlbmVyKCdmcmFtZScsIHRoaXMpO1xuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBMZm87Il19