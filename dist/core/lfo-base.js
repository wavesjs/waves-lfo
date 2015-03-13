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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL2xmby1iYXNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFHQSxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsWUFBWSxDQUFDOzs7SUFHNUMsR0FBRztBQUVJLFdBRlAsR0FBRyxHQUVtRDtRQUE5QyxRQUFRLGdDQUFHLElBQUk7UUFBRSxPQUFPLGdDQUFHLEVBQUU7UUFBRSxRQUFRLGdDQUFHLEVBQUU7OzBCQUZwRCxHQUFHOztBQUdMLFFBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQ2IsUUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDakIsUUFBSSxDQUFDLFlBQVksR0FBRztBQUNsQixlQUFTLEVBQUUsQ0FBQztBQUNaLGVBQVMsRUFBRSxDQUFDO0tBQ2IsQ0FBQzs7QUFFRixRQUFJLENBQUMsTUFBTSxHQUFHLE1BQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBRS9DLFFBQUksUUFBUSxFQUFFOztBQUVaLGNBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRW5CLFVBQUksQ0FBQyxZQUFZLEdBQUcsTUFBQSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7S0FDOUQ7R0FDRjs7WUFsQkcsR0FBRzs7ZUFBSCxHQUFHO0FBcUJQLFNBQUs7Ozs7YUFBQSxpQkFBRyxFQUFFOztBQU1WLFlBQVE7Ozs7Ozs7YUFBQSxvQkFBRyxFQUFFOztBQUdiLGVBQVc7Ozs7YUFBQSx1QkFBWTtZQUFYLElBQUksZ0NBQUcsRUFBRTs7QUFDbkIsWUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQUUsY0FBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztTQUFFO0FBQ3JFLFlBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUFFLGNBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7U0FBRTs7QUFFckUsWUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO09BQy9EOztBQUdELE9BQUc7Ozs7YUFBQSxlQUFhO1lBQVosR0FBRyxnQ0FBRyxJQUFJOztBQUNaLFlBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBSztBQUN6QixhQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNuQixDQUFDLENBQUM7T0FDSjs7QUFHRCxVQUFNOzs7O2FBQUEsa0JBQTBFO1lBQXpFLE9BQU8sZ0NBQUcsSUFBSSxDQUFDLElBQUk7WUFBRSxRQUFRLGdDQUFHLElBQUksQ0FBQyxRQUFRO1lBQUUsUUFBUSxnQ0FBRyxJQUFJLENBQUMsUUFBUTs7QUFDNUUsWUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztPQUNqRDs7QUFHRCxVQUFNOzs7O2FBQUEsa0JBQUc7QUFDUCxZQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUM7T0FDbEM7O0FBRUQsV0FBTzthQUFBLGlCQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFO0FBQzVCLFlBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLGVBQU8sQ0FBQyxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztPQUMxQzs7QUFLRCxXQUFPOzs7Ozs7YUFBQSxtQkFBRztBQUNSLFlBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQUUsaUJBQU87U0FBRTtBQUMvQixZQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7T0FDN0M7Ozs7U0FqRUcsR0FBRztHQUFTLFlBQVk7O0FBcUU5QixTQUFTLE9BQU8sQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUM1QyxTQUFPLElBQUksR0FBRyxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7Q0FDN0M7QUFDRCxPQUFPLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQzs7QUFFbEIsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMiLCJmaWxlIjoiZXM2L2NvcmUvbGZvLWJhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcblwidXNlIHN0cmljdFwiO1xuXG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyO1xuLy8gdmFyIGV4dGVuZCA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcblxuY2xhc3MgTGZvIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcblxuICBjb25zdHJ1Y3RvcihwcmV2aW91cyA9IG51bGwsIG9wdGlvbnMgPSB7fSwgZGVmYXVsdHMgPSB7fSkge1xuICAgIHRoaXMuaWR4ID0gMDtcbiAgICB0aGlzLnBhcmFtcyA9IHt9O1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zID0ge1xuICAgICAgZnJhbWVTaXplOiAxLFxuICAgICAgZnJhbWVSYXRlOiAwXG4gICAgfTtcblxuICAgIHRoaXMucGFyYW1zID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0cywgb3B0aW9ucyk7XG5cbiAgICBpZiAocHJldmlvdXMpIHtcbiAgICAgIC8vIGFkZCBvdXJzZWx2ZXMgdG8gdGhlIHByZXZpb3VzIG9wZXJhdG9yIGlmIGl0cyBwYXNzZWRcbiAgICAgIHByZXZpb3VzLmFkZCh0aGlzKTtcbiAgICAgIC8vIHBhc3Mgb24gc3RyZWFtIHBhcmFtc1xuICAgICAgdGhpcy5zdHJlYW1QYXJhbXMgPSBPYmplY3QuYXNzaWduKHt9LCBwcmV2aW91cy5zdHJlYW1QYXJhbXMpO1xuICAgIH1cbiAgfVxuXG4gIC8vIHJlc2V0IGBvdXRGcmFtZWAgYW5kIGNhbGwgcmVzZXQgb24gY2hpbGRyZW5cbiAgcmVzZXQoKSB7fVxuXG4gIC8vIGZpbGwgdGhlIG9uLWdvaW5nIGJ1ZmZlciB3aXRoIDBcbiAgLy8gb3V0cHV0IGl0LCB0aGVuIGNhbGwgcmVzZXQgb24gYWxsIHRoZSBjaGlsZHJlblxuICAvLyBATk9URSB0aGUgZXZlbnQgYmFzZWQgc3lzdGVtIChhc3luYykgY291bGQgcHJvZHVjZSB0aGF0IHRoZSByZXNldFxuICAvLyAgICAgICBjb3VsZCBiZSBjYWxsZWQgYmVmb3JlIHRoZSBjaGlsZCBmaW5hbGl6ZVxuICBmaW5hbGl6ZSgpIHt9XG5cbiAgLy8gY29tbW9uIHN0cmVhbSBjb25maWcgYmFzZWQgb24gdGhlIGluc3RhbnRpYXRlZCBwYXJhbXNcbiAgc2V0dXBTdHJlYW0ob3B0cyA9IHt9KSB7XG4gICAgaWYgKG9wdHMuZnJhbWVSYXRlKSB7IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lUmF0ZSA9IG9wdHMuZnJhbWVSYXRlOyB9XG4gICAgaWYgKG9wdHMuZnJhbWVTaXplKSB7IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IG9wdHMuZnJhbWVTaXplOyB9XG5cbiAgICB0aGlzLm91dEZyYW1lID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUpO1xuICB9XG5cbiAgLy8gYmluZCBjaGlsZCBub2RlXG4gIGFkZChsZm8gPSBudWxsKSB7XG4gICAgdGhpcy5vbignZnJhbWUnLCAodCwgZCkgPT4ge1xuICAgICAgbGZvLnByb2Nlc3ModCwgZCk7XG4gICAgfSk7XG4gIH1cblxuICAvLyB3ZSB0YWtlIGNhcmUgb2YgdGhlIGVtaXQgb3Vyc2VsdmVzXG4gIG91dHB1dChvdXRUaW1lID0gdGhpcy50aW1lLCBvdXRGcmFtZSA9IHRoaXMub3V0RnJhbWUsIG1ldGFEYXRhID0gdGhpcy5tZXRhRGF0YSkge1xuICAgIHRoaXMuZW1pdCgnZnJhbWUnLCBvdXRUaW1lLCBvdXRGcmFtZSwgbWV0YURhdGEpO1xuICB9XG5cbiAgLy8gcmVtb3ZlcyBhbGwgY2hpbGRyZW4gZnJvbSBsaXN0ZW5pbmdcbiAgcmVtb3ZlKCkge1xuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdmcmFtZScpO1xuICB9XG5cbiAgcHJvY2Vzcyh0aW1lLCBkYXRhLCBtZXRhZGF0YSkge1xuICAgIHRoaXMudGltZSA9IHRpbWU7XG4gICAgY29uc29sZS5lcnJvcigncHJvY2VzcyBub3QgaW1wbGVtZW50ZWQnKTtcbiAgfVxuXG4gIC8vIHdpbGwgZGVsZXRlIGl0c2VsZiBmcm9tIHRoZSBwYXJlbnQgbm9kZVxuICAvLyBATk9URSB0aGlzIG5vZGUgYW5kIGFsbCBoaXMgY2hpbGRyZW4gd2lsbCBuZXZlciBnYXJiYWdlIGNvbGxlY3RlZFxuICAvLyBgdGhpcy5wcmV2aW91cyA9IG51bGxgIGZpeGVzIHRoZSBmaXJzdCBwcm9ibGVtIGJ1dCBub3QgdGhlIHNlY29uZCBvbmVcbiAgZGVzdHJveSgpIHtcbiAgICBpZiAoIXRoaXMucHJldmlvdXMpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy5wcmV2aW91cy5yZW1vdmVMaXN0ZW5lcignZnJhbWUnLCB0aGlzKTtcbiAgfVxuXG59XG5cbmZ1bmN0aW9uIGZhY3RvcnkocHJldmlvdXMsIG9wdGlvbnMsIGRlZmF1bHRzKSB7XG4gIHJldHVybiBuZXcgTGZvKHByZXZpb3VzLCBvcHRpb25zLCBkZWZhdWx0cyk7XG59XG5mYWN0b3J5LkxmbyA9IExmbztcblxubW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5O1xuIl19