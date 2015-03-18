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

    this.params = _core.Object.assign({}, defaults, options);

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
        var outTime = arguments[0] === undefined ? this.time : arguments[0];
        var outFrame = arguments[1] === undefined ? this.outFrame : arguments[1];
        var metaData = arguments[2] === undefined ? this.metaData : arguments[2];

        this.emit("frame", outTime, outFrame, metaData);
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
        this.time = time;
        // console.error('process not implemented');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL2xmby1iYXNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFHQSxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsWUFBWSxDQUFDOzs7SUFHNUMsR0FBRztBQUVJLFdBRlAsR0FBRyxHQUVtRDtRQUE5QyxRQUFRLGdDQUFHLElBQUk7UUFBRSxPQUFPLGdDQUFHLEVBQUU7UUFBRSxRQUFRLGdDQUFHLEVBQUU7OzBCQUZwRCxHQUFHOztBQUdMLFFBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQ2IsUUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDakIsUUFBSSxDQUFDLFlBQVksR0FBRztBQUNsQixlQUFTLEVBQUUsQ0FBQztBQUNaLGVBQVMsRUFBRSxDQUFDO0tBQ2IsQ0FBQzs7QUFFRixRQUFJLENBQUMsTUFBTSxHQUFHLE1BQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDOztBQUVuRCxRQUFJLFFBQVEsRUFBRTs7QUFFWixjQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVuQixVQUFJLENBQUMsWUFBWSxHQUFHLE1BQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO0tBQzlEO0dBQ0Y7O1lBbEJHLEdBQUc7O2VBQUgsR0FBRztBQXFCUCxTQUFLOzs7O2FBQUEsaUJBQUcsRUFBRTs7QUFNVixZQUFROzs7Ozs7O2FBQUEsb0JBQUcsRUFBRTs7QUFHYixlQUFXOzs7O2FBQUEsdUJBQVk7WUFBWCxJQUFJLGdDQUFHLEVBQUU7O0FBQ25CLFlBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUFFLGNBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7U0FBRTtBQUNyRSxZQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFBRSxjQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1NBQUU7O0FBRXJFLFlBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztPQUMvRDs7QUFHRCxPQUFHOzs7O2FBQUEsZUFBYTtZQUFaLEdBQUcsZ0NBQUcsSUFBSTs7QUFDWixZQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFDLENBQUMsRUFBRSxDQUFDLEVBQUs7QUFDekIsYUFBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDbkIsQ0FBQyxDQUFDO09BQ0o7O0FBR0QsVUFBTTs7OzthQUFBLGtCQUEwRTtZQUF6RSxPQUFPLGdDQUFHLElBQUksQ0FBQyxJQUFJO1lBQUUsUUFBUSxnQ0FBRyxJQUFJLENBQUMsUUFBUTtZQUFFLFFBQVEsZ0NBQUcsSUFBSSxDQUFDLFFBQVE7O0FBQzVFLFlBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7T0FDakQ7O0FBR0QsVUFBTTs7OzthQUFBLGtCQUFHO0FBQ1AsWUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDO09BQ2xDOztBQUVELFdBQU87YUFBQSxpQkFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtBQUM1QixZQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQzs7T0FFbEI7O0FBS0QsV0FBTzs7Ozs7O2FBQUEsbUJBQUc7QUFDUixZQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUFFLGlCQUFPO1NBQUU7QUFDL0IsWUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO09BQzdDOzs7O1NBakVHLEdBQUc7R0FBUyxZQUFZOztBQXFFOUIsU0FBUyxPQUFPLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7QUFDNUMsU0FBTyxJQUFJLEdBQUcsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0NBQzdDO0FBQ0QsT0FBTyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7O0FBRWxCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDIiwiZmlsZSI6ImVzNi9jb3JlL2xmby1iYXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcbi8vIHZhciBleHRlbmQgPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG5cbmNsYXNzIExmbyBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG5cbiAgY29uc3RydWN0b3IocHJldmlvdXMgPSBudWxsLCBvcHRpb25zID0ge30sIGRlZmF1bHRzID0ge30pIHtcbiAgICB0aGlzLmlkeCA9IDA7XG4gICAgdGhpcy5wYXJhbXMgPSB7fTtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcyA9IHtcbiAgICAgIGZyYW1lU2l6ZTogMSxcbiAgICAgIGZyYW1lUmF0ZTogMFxuICAgIH07XG5cbiAgICB0aGlzLnBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcblxuICAgIGlmIChwcmV2aW91cykge1xuICAgICAgLy8gYWRkIG91cnNlbHZlcyB0byB0aGUgcHJldmlvdXMgb3BlcmF0b3IgaWYgaXRzIHBhc3NlZFxuICAgICAgcHJldmlvdXMuYWRkKHRoaXMpO1xuICAgICAgLy8gcGFzcyBvbiBzdHJlYW0gcGFyYW1zXG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIHByZXZpb3VzLnN0cmVhbVBhcmFtcyk7XG4gICAgfVxuICB9XG5cbiAgLy8gcmVzZXQgYG91dEZyYW1lYCBhbmQgY2FsbCByZXNldCBvbiBjaGlsZHJlblxuICByZXNldCgpIHt9XG5cbiAgLy8gZmlsbCB0aGUgb24tZ29pbmcgYnVmZmVyIHdpdGggMFxuICAvLyBvdXRwdXQgaXQsIHRoZW4gY2FsbCByZXNldCBvbiBhbGwgdGhlIGNoaWxkcmVuXG4gIC8vIEBOT1RFIHRoZSBldmVudCBiYXNlZCBzeXN0ZW0gKGFzeW5jKSBjb3VsZCBwcm9kdWNlIHRoYXQgdGhlIHJlc2V0XG4gIC8vICAgICAgIGNvdWxkIGJlIGNhbGxlZCBiZWZvcmUgdGhlIGNoaWxkIGZpbmFsaXplXG4gIGZpbmFsaXplKCkge31cblxuICAvLyBjb21tb24gc3RyZWFtIGNvbmZpZyBiYXNlZCBvbiB0aGUgaW5zdGFudGlhdGVkIHBhcmFtc1xuICBzZXR1cFN0cmVhbShvcHRzID0ge30pIHtcbiAgICBpZiAob3B0cy5mcmFtZVJhdGUpIHsgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVSYXRlID0gb3B0cy5mcmFtZVJhdGU7IH1cbiAgICBpZiAob3B0cy5mcmFtZVNpemUpIHsgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gb3B0cy5mcmFtZVNpemU7IH1cblxuICAgIHRoaXMub3V0RnJhbWUgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSk7XG4gIH1cblxuICAvLyBiaW5kIGNoaWxkIG5vZGVcbiAgYWRkKGxmbyA9IG51bGwpIHtcbiAgICB0aGlzLm9uKCdmcmFtZScsICh0LCBkKSA9PiB7XG4gICAgICBsZm8ucHJvY2Vzcyh0LCBkKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIHdlIHRha2UgY2FyZSBvZiB0aGUgZW1pdCBvdXJzZWx2ZXNcbiAgb3V0cHV0KG91dFRpbWUgPSB0aGlzLnRpbWUsIG91dEZyYW1lID0gdGhpcy5vdXRGcmFtZSwgbWV0YURhdGEgPSB0aGlzLm1ldGFEYXRhKSB7XG4gICAgdGhpcy5lbWl0KCdmcmFtZScsIG91dFRpbWUsIG91dEZyYW1lLCBtZXRhRGF0YSk7XG4gIH1cblxuICAvLyByZW1vdmVzIGFsbCBjaGlsZHJlbiBmcm9tIGxpc3RlbmluZ1xuICByZW1vdmUoKSB7XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ2ZyYW1lJyk7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGRhdGEsIG1ldGFkYXRhKSB7XG4gICAgdGhpcy50aW1lID0gdGltZTtcbiAgICAvLyBjb25zb2xlLmVycm9yKCdwcm9jZXNzIG5vdCBpbXBsZW1lbnRlZCcpO1xuICB9XG5cbiAgLy8gd2lsbCBkZWxldGUgaXRzZWxmIGZyb20gdGhlIHBhcmVudCBub2RlXG4gIC8vIEBOT1RFIHRoaXMgbm9kZSBhbmQgYWxsIGhpcyBjaGlsZHJlbiB3aWxsIG5ldmVyIGdhcmJhZ2UgY29sbGVjdGVkXG4gIC8vIGB0aGlzLnByZXZpb3VzID0gbnVsbGAgZml4ZXMgdGhlIGZpcnN0IHByb2JsZW0gYnV0IG5vdCB0aGUgc2Vjb25kIG9uZVxuICBkZXN0cm95KCkge1xuICAgIGlmICghdGhpcy5wcmV2aW91cykgeyByZXR1cm47IH1cbiAgICB0aGlzLnByZXZpb3VzLnJlbW92ZUxpc3RlbmVyKCdmcmFtZScsIHRoaXMpO1xuICB9XG5cbn1cblxuZnVuY3Rpb24gZmFjdG9yeShwcmV2aW91cywgb3B0aW9ucywgZGVmYXVsdHMpIHtcbiAgcmV0dXJuIG5ldyBMZm8ocHJldmlvdXMsIG9wdGlvbnMsIGRlZmF1bHRzKTtcbn1cbmZhY3RvcnkuTGZvID0gTGZvO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnk7XG4iXX0=