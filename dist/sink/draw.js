"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _require = require("../core/lfo-base");

var Lfo = _require.Lfo;

var Draw = (function (Lfo) {
  function Draw() {
    var previous = arguments[0] === undefined ? null : arguments[0];
    var options = arguments[1] === undefined ? {} : arguments[1];

    _babelHelpers.classCallCheck(this, Draw);

    this.type = "sink-draw";

    var defaults = {
      scroll: true,
      color: "#000000"
    };

    _babelHelpers.get(_core.Object.getPrototypeOf(Draw.prototype), "constructor", this).call(this, previous, options, defaults);

    if (!this.params.canvas) {
      return console.error("Please note: a canvas element is required or this module");
    } // pubs
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
    this._rate = 0.1;

    this._minVal = -1;
    this._maxVal = 1;
  }

  _babelHelpers.inherits(Draw, Lfo);

  _babelHelpers.prototypeProperties(Draw, null, {
    _clearCanvas: {

      // Private Methods
      // ---------------

      value: function _clearCanvas(cv) {
        cv.height = this._height;cv.width = this._width;
      },
      writable: true,
      configurable: true
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
      },
      writable: true,
      configurable: true
    },
    process: {

      // Public Methods
      // --------------

      value: function process(time, data) {
        var min = this._maxVal;
        var max = this._minVal;
        var step = data.length;

        if (this.scrolls && this._i % 4 === 0) {

          for (var j = 0; j < step; j++) {
            var datum = data[j];
            if (datum < min) min = datum;
            if (datum > max) max = datum;
          }

          var pos = this._maxVal - max * this._amp + this._amp;
          var h = (max - min) * this._amp;

          this._cvCtx.fillStyle = this.color;
          this._cvCtx.fillRect(this._x, pos, 1, Math.max(1, h));

          this._x++;
          if (this._x >= this._width) this._scrollLeft();
        }

        this._i++;
      },
      writable: true,
      configurable: true
    }
  });

  return Draw;
})(Lfo);

function factory(previous, options) {
  return new Draw(previous, options);
}
factory.Draw = Draw;

module.exports = factory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL3Byb2Nlc3Mtd29ya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztlQUVjLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQzs7SUFBbkMsR0FBRyxZQUFILEdBQUc7O0lBRUgsSUFBSSxjQUFTLEdBQUc7QUFFVCxXQUZQLElBQUk7UUFFSSxRQUFRLGdDQUFHLElBQUk7UUFBRSxPQUFPLGdDQUFHLEVBQUU7O3VDQUZyQyxJQUFJOztBQUdOLFFBQUksQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDOztBQUV4QixRQUFJLFFBQVEsR0FBRztBQUNiLFlBQU0sRUFBRSxJQUFJO0FBQ1osV0FBSyxFQUFFLFNBQVM7S0FDakIsQ0FBQzs7QUFFRixrREFWRSxJQUFJLDZDQVVBLFFBQVEsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFOztBQUVuQyxRQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNO0FBQ3BCLGFBQU8sT0FBTyxDQUFDLEtBQUssQ0FBQywwREFBMEQsQ0FBQyxDQUFDO0tBQUE7QUFHbkYsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUNsQyxRQUFJLENBQUMsTUFBTSxHQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ2xDLFFBQUksQ0FBQyxLQUFLLEdBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7OztBQUdqQyxRQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDaEQsUUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDdkMsUUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7O0FBRXpDLFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUMsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFM0MsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNoQyxRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ2xDLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7O0FBRTdCLFFBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ1osUUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDWixRQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQzs7QUFFakIsUUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUcsQ0FBQztBQUNwQixRQUFJLENBQUMsT0FBTyxHQUFHLENBQUcsQ0FBQztHQUVwQjs7eUJBdkNHLElBQUksRUFBUyxHQUFHOztvQ0FBaEIsSUFBSTtBQTRDUixnQkFBWTs7Ozs7YUFBQSxzQkFBQyxFQUFFLEVBQUU7QUFDZixVQUFFLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQUFBQyxFQUFFLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7T0FDbEQ7Ozs7QUFFRCxlQUFXO2FBQUEsdUJBQUc7OztBQUdaLFlBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUVoQyxZQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7O0FBRzNDLFlBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUUvQixZQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDOztBQUVuQixZQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFN0IsWUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRTFDLFlBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7OztBQUd0QixZQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO09BQzNCOzs7O0FBTUQsV0FBTzs7Ozs7YUFBQSxpQkFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFO0FBQ2xCLFlBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDdkIsWUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUN2QixZQUFJLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDOztBQUV2QixZQUFHLElBQUksQ0FBQyxPQUFPLElBQUssSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxBQUFDLEVBQUM7O0FBRXJDLGVBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDN0IsZ0JBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixnQkFBSSxLQUFLLEdBQUcsR0FBRyxFQUFFLEdBQUcsR0FBRyxLQUFLLENBQUM7QUFDN0IsZ0JBQUksS0FBSyxHQUFHLEdBQUcsRUFBRSxHQUFHLEdBQUcsS0FBSyxDQUFDO1dBQzlCOztBQUVELGNBQUksR0FBRyxHQUFHLEFBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBSSxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ3ZELGNBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQSxHQUFJLElBQUksQ0FBQyxJQUFJLENBQUM7O0FBRWhDLGNBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDbkMsY0FBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRXRELGNBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQztBQUNWLGNBQUcsSUFBSSxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUMvQzs7QUFFRCxZQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7T0FDWDs7Ozs7O1NBbEdHLElBQUk7R0FBUyxHQUFHOztBQXNHdEIsU0FBUyxPQUFPLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRTtBQUNsQyxTQUFPLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztDQUNwQztBQUNELE9BQU8sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVwQixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyIsImZpbGUiOiJlczYvc291cmNlcy9wcm9jZXNzLXdvcmtlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG52YXIgeyBMZm8gfSA9IHJlcXVpcmUoJy4uL2NvcmUvbGZvLWJhc2UnKTtcblxuY2xhc3MgRHJhdyBleHRlbmRzIExmbyB7XG5cbiAgY29uc3RydWN0b3IocHJldmlvdXMgPSBudWxsLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLnR5cGUgPSAnc2luay1kcmF3JztcblxuICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgIHNjcm9sbDogdHJ1ZSxcbiAgICAgIGNvbG9yOiAnIzAwMDAwMCdcbiAgICB9O1xuXG4gICAgc3VwZXIocHJldmlvdXMsIG9wdGlvbnMsIGRlZmF1bHRzKTtcblxuICAgIGlmKCF0aGlzLnBhcmFtcy5jYW52YXMpXG4gICAgICByZXR1cm4gY29uc29sZS5lcnJvcignUGxlYXNlIG5vdGU6IGEgY2FudmFzIGVsZW1lbnQgaXMgcmVxdWlyZWQgb3IgdGhpcyBtb2R1bGUnKTtcblxuICAgIC8vIHB1YnNcbiAgICB0aGlzLnNjcm9sbHMgPSB0aGlzLnBhcmFtcy5zY3JvbGw7XG4gICAgdGhpcy5jYW52YXMgID0gdGhpcy5wYXJhbXMuY2FudmFzO1xuICAgIHRoaXMuY29sb3IgICA9IHRoaXMucGFyYW1zLmNvbG9yO1xuXG4gICAgLy8gcHJpdnNcbiAgICB0aGlzLl9idWZmZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgIHRoaXMuX2J1ZmZlci53aWR0aCA9IHRoaXMuY2FudmFzLndpZHRoO1xuICAgIHRoaXMuX2J1ZmZlci5oZWlnaHQgPSB0aGlzLmNhbnZhcy5oZWlnaHQ7XG5cbiAgICB0aGlzLl9idWZmQ3R4ID0gdGhpcy5fYnVmZmVyLmdldENvbnRleHQoJzJkJyk7XG4gICAgdGhpcy5fY3ZDdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgdGhpcy5fd2lkdGggPSB0aGlzLmNhbnZhcy53aWR0aDtcbiAgICB0aGlzLl9oZWlnaHQgPSB0aGlzLmNhbnZhcy5oZWlnaHQ7XG4gICAgdGhpcy5fYW1wID0gdGhpcy5faGVpZ2h0IC8gMjtcblxuICAgIHRoaXMuX3ggPSAwO1xuICAgIHRoaXMuX2kgPSAwO1xuICAgIHRoaXMuX3JhdGUgPSAwLjE7XG5cbiAgICB0aGlzLl9taW5WYWwgPSAtMS4wO1xuICAgIHRoaXMuX21heFZhbCA9IDEuMDtcblxuICB9XG5cbiAgLy8gUHJpdmF0ZSBNZXRob2RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxuXG4gIF9jbGVhckNhbnZhcyhjdikge1xuICAgIGN2LmhlaWdodCA9IHRoaXMuX2hlaWdodDsgY3Yud2lkdGggPSB0aGlzLl93aWR0aDtcbiAgfVxuXG4gIF9zY3JvbGxMZWZ0KCkge1xuXG4gICAgLy8gY2xlYXIgdGhlIGJ1ZmZlclxuICAgIHRoaXMuX2NsZWFyQ2FudmFzKHRoaXMuX2J1ZmZlcik7XG4gICAgLy8gZHJhdyB0aGUgZGVzdGluYXRpb24gaW50byB0aGUgYnVmZmVyIGF0IDAgMFxuICAgIHRoaXMuX2J1ZmZDdHguZHJhd0ltYWdlKHRoaXMuY2FudmFzLCAwLCAwKTtcblxuICAgIC8vIGNsZWFyIHRoZSBkZXN0aW5hdGlvblxuICAgIHRoaXMuX2NsZWFyQ2FudmFzKHRoaXMuY2FudmFzKTtcbiAgICAvLyBzYXZlIHRoZSBkZXN0aW5hdGlvbiBzdGF0ZVxuICAgIHRoaXMuX2N2Q3R4LnNhdmUoKTtcbiAgICAvLyB0cmFuc2xhdGUgZGVzdGluYXRpb24gYnkgMSBweCBvbiB4XG4gICAgdGhpcy5fY3ZDdHgudHJhbnNsYXRlKC0xLCAwKTtcbiAgICAvLyBkcmF3IHRoZSBidWZmZXIgaW50byB0aGUgZGVzdGluYXRpb25cbiAgICB0aGlzLl9jdkN0eC5kcmF3SW1hZ2UodGhpcy5fYnVmZmVyLCAwLCAwKTtcbiAgICAvLyByZXN0b3JlIHRoZSBkZXN0aW5hdGlvblxuICAgIHRoaXMuX2N2Q3R4LnJlc3RvcmUoKTtcblxuICAgIC8vIHJlLXNldCB0aGUgaW5kZXhcbiAgICB0aGlzLl94ID0gdGhpcy5fd2lkdGggLSAxO1xuICB9XG5cblxuICAvLyBQdWJsaWMgTWV0aG9kc1xuICAvLyAtLS0tLS0tLS0tLS0tLVxuXG4gIHByb2Nlc3ModGltZSwgZGF0YSkge1xuICAgIHZhciBtaW4gPSB0aGlzLl9tYXhWYWw7XG4gICAgdmFyIG1heCA9IHRoaXMuX21pblZhbDtcbiAgICB2YXIgc3RlcCA9IGRhdGEubGVuZ3RoO1xuXG4gICAgaWYodGhpcy5zY3JvbGxzICYmICh0aGlzLl9pICUgNCA9PT0gMCkpe1xuXG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHN0ZXA7IGorKykge1xuICAgICAgICB2YXIgZGF0dW0gPSBkYXRhW2pdO1xuICAgICAgICBpZiAoZGF0dW0gPCBtaW4pIG1pbiA9IGRhdHVtO1xuICAgICAgICBpZiAoZGF0dW0gPiBtYXgpIG1heCA9IGRhdHVtO1xuICAgICAgfVxuXG4gICAgICB2YXIgcG9zID0gKHRoaXMuX21heFZhbCAtIG1heCAqIHRoaXMuX2FtcCkgKyB0aGlzLl9hbXA7XG4gICAgICB2YXIgaCA9IChtYXggLSBtaW4pICogdGhpcy5fYW1wO1xuXG4gICAgICB0aGlzLl9jdkN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG9yO1xuICAgICAgdGhpcy5fY3ZDdHguZmlsbFJlY3QodGhpcy5feCwgcG9zLCAxLCBNYXRoLm1heCgxLCBoKSk7XG5cbiAgICAgIHRoaXMuX3grKztcbiAgICAgIGlmKHRoaXMuX3ggPj0gdGhpcy5fd2lkdGgpIHRoaXMuX3Njcm9sbExlZnQoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9pKys7XG4gIH1cblxufVxuXG5mdW5jdGlvbiBmYWN0b3J5KHByZXZpb3VzLCBvcHRpb25zKSB7XG4gIHJldHVybiBuZXcgRHJhdyhwcmV2aW91cywgb3B0aW9ucyk7XG59XG5mYWN0b3J5LkRyYXcgPSBEcmF3O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnk7XG4iXX0=