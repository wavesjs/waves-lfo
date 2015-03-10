"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _require = require("../core/lfo-base");

var Lfo = _require.Lfo;

var Draw = (function (_Lfo) {
  function Draw() {
    var previous = arguments[0] === undefined ? null : arguments[0];
    var options = arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Draw);

    this.type = "sink-draw";

    var defaults = {
      scroll: true,
      color: "#000000"
    };

    _get(_core.Object.getPrototypeOf(Draw.prototype), "constructor", this).call(this, previous, options, defaults);

    if (!this.params.canvas) {
      return console.error("Please note: a canvas element is required for this module");
    }

    // pubs
    this.scrolls = this.params.scroll;
    this.canvas = this.params.canvas;
    this.color = this.params.color;

    // privs
    this._buffer = document.createElement("canvas");
    this._buffer.width = this.canvas.width;
    this._buffer.height = this.canvas.height;

    this._buffCtx = this._buffer.getContext("2d");
    this._cvCtx = this.canvas.getContext("2d");

    this._width = this.canvas.width;
    this._height = this.canvas.height;
    this._amp = this._height / 2;

    this._x = 0;
    this._i = 0;
    this._rate = 0.1; // not used ?

    this._minVal = -1;
    this._maxVal = 1;
  }

  _inherits(Draw, _Lfo);

  _createClass(Draw, {
    _clearCanvas: {

      // Private Methods
      // ---------------

      value: function _clearCanvas(cv) {
        cv.height = this._height;cv.width = this._width;
      }
    },
    _scrollLeft: {
      value: function _scrollLeft() {

        // clear the buffer
        this._clearCanvas(this._buffer);
        // draw the destination into the buffer at 0 0
        this._buffCtx.drawImage(this.canvas, 0, 0);

        // clear the destination
        this._clearCanvas(this.canvas);
        // save the destination state
        this._cvCtx.save();
        // translate destination by 1 px on x
        this._cvCtx.translate(-1, 0);
        // draw the buffer into the destination
        this._cvCtx.drawImage(this._buffer, 0, 0);
        // restore the destination
        this._cvCtx.restore();

        // re-set the index
        this._x = this._width - 1;
      }
    },
    process: {

      // Public Methods
      // --------------

      value: function process(time, data) {
        var min = this._maxVal;
        var max = this._minVal;
        var step = data.length;

        // this._i % 4 looks like really hardcoded
        if (this.scrolls && this._i % 4 === 0) {

          for (var j = 0; j < step; j++) {
            var datum = data[j];
            if (datum < min) {
              min = datum;
            }
            if (datum > max) {
              max = datum;
            }
          }

          var pos = this._maxVal - max * this._amp + this._amp;
          var h = (max - min) * this._amp;

          this._cvCtx.fillStyle = this.color;
          this._cvCtx.fillRect(this._x, pos, 1, Math.max(1, h));

          this._x++;
          if (this._x >= this._width) this._scrollLeft();
        }

        this._i++;
      }
    }
  });

  return Draw;
})(Lfo);

function factory(previous, options) {
  return new Draw(previous, options);
}
factory.Draw = Draw;

module.exports = factory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL3Byb2Nlc3Mtd29ya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztlQUVjLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQzs7SUFBbkMsR0FBRyxZQUFILEdBQUc7O0lBRUgsSUFBSTtBQUVHLFdBRlAsSUFBSSxHQUVtQztRQUEvQixRQUFRLGdDQUFHLElBQUk7UUFBRSxPQUFPLGdDQUFHLEVBQUU7OzBCQUZyQyxJQUFJOztBQUdOLFFBQUksQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDOztBQUV4QixRQUFJLFFBQVEsR0FBRztBQUNiLFlBQU0sRUFBRSxJQUFJO0FBQ1osV0FBSyxFQUFFLFNBQVM7S0FDakIsQ0FBQzs7QUFFRixxQ0FWRSxJQUFJLDZDQVVBLFFBQVEsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFOztBQUVuQyxRQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7QUFDdkIsYUFBTyxPQUFPLENBQUMsS0FBSyxDQUFDLDJEQUEyRCxDQUFDLENBQUM7S0FDbkY7OztBQUdELFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDbEMsUUFBSSxDQUFDLE1BQU0sR0FBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUNsQyxRQUFJLENBQUMsS0FBSyxHQUFLLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDOzs7QUFHakMsUUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2hELFFBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ3ZDLFFBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDOztBQUV6QyxRQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENB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QUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ25DLGNBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUV0RCxjQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7QUFDVixjQUFJLElBQUksQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDaEQ7O0FBRUQsWUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO09BQ1g7Ozs7U0FwR0csSUFBSTtHQUFTLEdBQUc7O0FBd0d0QixTQUFTLE9BQU8sQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFO0FBQ2xDLFNBQU8sSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0NBQ3BDO0FBQ0QsT0FBTyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7O0FBRXBCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDIiwiZmlsZSI6ImVzNi9zb3VyY2VzL3Byb2Nlc3Mtd29ya2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciB7IExmbyB9ID0gcmVxdWlyZSgnLi4vY29yZS9sZm8tYmFzZScpO1xuXG5jbGFzcyBEcmF3IGV4dGVuZHMgTGZvIHtcblxuICBjb25zdHJ1Y3RvcihwcmV2aW91cyA9IG51bGwsIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMudHlwZSA9ICdzaW5rLWRyYXcnO1xuXG4gICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgc2Nyb2xsOiB0cnVlLFxuICAgICAgY29sb3I6ICcjMDAwMDAwJ1xuICAgIH07XG5cbiAgICBzdXBlcihwcmV2aW91cywgb3B0aW9ucywgZGVmYXVsdHMpO1xuXG4gICAgaWYgKCF0aGlzLnBhcmFtcy5jYW52YXMpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKCdQbGVhc2Ugbm90ZTogYSBjYW52YXMgZWxlbWVudCBpcyByZXF1aXJlZCBmb3IgdGhpcyBtb2R1bGUnKTtcbiAgICB9XG5cbiAgICAvLyBwdWJzXG4gICAgdGhpcy5zY3JvbGxzID0gdGhpcy5wYXJhbXMuc2Nyb2xsO1xuICAgIHRoaXMuY2FudmFzICA9IHRoaXMucGFyYW1zLmNhbnZhcztcbiAgICB0aGlzLmNvbG9yICAgPSB0aGlzLnBhcmFtcy5jb2xvcjtcblxuICAgIC8vIHByaXZzXG4gICAgdGhpcy5fYnVmZmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICB0aGlzLl9idWZmZXIud2lkdGggPSB0aGlzLmNhbnZhcy53aWR0aDtcbiAgICB0aGlzLl9idWZmZXIuaGVpZ2h0ID0gdGhpcy5jYW52YXMuaGVpZ2h0O1xuXG4gICAgdGhpcy5fYnVmZkN0eCA9IHRoaXMuX2J1ZmZlci5nZXRDb250ZXh0KCcyZCcpO1xuICAgIHRoaXMuX2N2Q3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgIHRoaXMuX3dpZHRoID0gdGhpcy5jYW52YXMud2lkdGg7XG4gICAgdGhpcy5faGVpZ2h0ID0gdGhpcy5jYW52YXMuaGVpZ2h0O1xuICAgIHRoaXMuX2FtcCA9IHRoaXMuX2hlaWdodCAvIDI7XG5cbiAgICB0aGlzLl94ID0gMDtcbiAgICB0aGlzLl9pID0gMDtcbiAgICB0aGlzLl9yYXRlID0gMC4xOyAvLyBub3QgdXNlZCA/XG5cbiAgICB0aGlzLl9taW5WYWwgPSAtMS4wO1xuICAgIHRoaXMuX21heFZhbCA9IDEuMDtcblxuICB9XG5cbiAgLy8gUHJpdmF0ZSBNZXRob2RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxuXG4gIF9jbGVhckNhbnZhcyhjdikge1xuICAgIGN2LmhlaWdodCA9IHRoaXMuX2hlaWdodDsgY3Yud2lkdGggPSB0aGlzLl93aWR0aDtcbiAgfVxuXG4gIF9zY3JvbGxMZWZ0KCkge1xuXG4gICAgLy8gY2xlYXIgdGhlIGJ1ZmZlclxuICAgIHRoaXMuX2NsZWFyQ2FudmFzKHRoaXMuX2J1ZmZlcik7XG4gICAgLy8gZHJhdyB0aGUgZGVzdGluYXRpb24gaW50byB0aGUgYnVmZmVyIGF0IDAgMFxuICAgIHRoaXMuX2J1ZmZDdHguZHJhd0ltYWdlKHRoaXMuY2FudmFzLCAwLCAwKTtcblxuICAgIC8vIGNsZWFyIHRoZSBkZXN0aW5hdGlvblxuICAgIHRoaXMuX2NsZWFyQ2FudmFzKHRoaXMuY2FudmFzKTtcbiAgICAvLyBzYXZlIHRoZSBkZXN0aW5hdGlvbiBzdGF0ZVxuICAgIHRoaXMuX2N2Q3R4LnNhdmUoKTtcbiAgICAvLyB0cmFuc2xhdGUgZGVzdGluYXRpb24gYnkgMSBweCBvbiB4XG4gICAgdGhpcy5fY3ZDdHgudHJhbnNsYXRlKC0xLCAwKTtcbiAgICAvLyBkcmF3IHRoZSBidWZmZXIgaW50byB0aGUgZGVzdGluYXRpb25cbiAgICB0aGlzLl9jdkN0eC5kcmF3SW1hZ2UodGhpcy5fYnVmZmVyLCAwLCAwKTtcbiAgICAvLyByZXN0b3JlIHRoZSBkZXN0aW5hdGlvblxuICAgIHRoaXMuX2N2Q3R4LnJlc3RvcmUoKTtcblxuICAgIC8vIHJlLXNldCB0aGUgaW5kZXhcbiAgICB0aGlzLl94ID0gdGhpcy5fd2lkdGggLSAxO1xuICB9XG5cblxuICAvLyBQdWJsaWMgTWV0aG9kc1xuICAvLyAtLS0tLS0tLS0tLS0tLVxuXG4gIHByb2Nlc3ModGltZSwgZGF0YSkge1xuICAgIHZhciBtaW4gPSB0aGlzLl9tYXhWYWw7XG4gICAgdmFyIG1heCA9IHRoaXMuX21pblZhbDtcbiAgICB2YXIgc3RlcCA9IGRhdGEubGVuZ3RoO1xuXG4gICAgLy8gdGhpcy5faSAlIDQgbG9va3MgbGlrZSByZWFsbHkgaGFyZGNvZGVkXG4gICAgaWYgKHRoaXMuc2Nyb2xscyAmJiAodGhpcy5faSAlIDQgPT09IDApKSB7XG5cbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgc3RlcDsgaisrKSB7XG4gICAgICAgIHZhciBkYXR1bSA9IGRhdGFbal07XG4gICAgICAgIGlmIChkYXR1bSA8IG1pbikgeyBtaW4gPSBkYXR1bTsgfVxuICAgICAgICBpZiAoZGF0dW0gPiBtYXgpIHsgbWF4ID0gZGF0dW07IH1cbiAgICAgIH1cblxuICAgICAgdmFyIHBvcyA9ICh0aGlzLl9tYXhWYWwgLSBtYXggKiB0aGlzLl9hbXApICsgdGhpcy5fYW1wO1xuICAgICAgdmFyIGggPSAobWF4IC0gbWluKSAqIHRoaXMuX2FtcDtcblxuICAgICAgdGhpcy5fY3ZDdHguZmlsbFN0eWxlID0gdGhpcy5jb2xvcjtcbiAgICAgIHRoaXMuX2N2Q3R4LmZpbGxSZWN0KHRoaXMuX3gsIHBvcywgMSwgTWF0aC5tYXgoMSwgaCkpO1xuXG4gICAgICB0aGlzLl94Kys7XG4gICAgICBpZiAodGhpcy5feCA+PSB0aGlzLl93aWR0aCkgdGhpcy5fc2Nyb2xsTGVmdCgpO1xuICAgIH1cblxuICAgIHRoaXMuX2krKztcbiAgfVxuXG59XG5cbmZ1bmN0aW9uIGZhY3RvcnkocHJldmlvdXMsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIG5ldyBEcmF3KHByZXZpb3VzLCBvcHRpb25zKTtcbn1cbmZhY3RvcnkuRHJhdyA9IERyYXc7XG5cbm1vZHVsZS5leHBvcnRzID0gZmFjdG9yeTtcbiJdfQ==