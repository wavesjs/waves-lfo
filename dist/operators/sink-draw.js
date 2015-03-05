"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var _core = require("babel-runtime/core-js")["default"];

var LFO = require("../core/lfo-base");

var Draw = (function (LFO) {
  function Draw() {
    var previous = arguments[0] === undefined ? null : arguments[0];
    var options = arguments[1] === undefined ? {} : arguments[1];

    _babelHelpers.classCallCheck(this, Draw);

    if (!(this instanceof Draw)) {
      return new Draw(previous, options);
    }this.type = "sink-draw";

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

  _babelHelpers.inherits(Draw, LFO);

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
})(LFO);

module.exports = Draw;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9vcGVyYXRvcnMvc3JjLWF1ZGlvL3Byb2Nlc3Mtd29ya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDOztJQUVoQyxJQUFJLGNBQVMsR0FBRztBQUVULFdBRlAsSUFBSTtRQUVJLFFBQVEsZ0NBQUcsSUFBSTtRQUFFLE9BQU8sZ0NBQUcsRUFBRTs7dUNBRnJDLElBQUk7O0FBR04sUUFBSSxFQUFFLElBQUksWUFBWSxJQUFJLENBQUEsQUFBQztBQUFFLGFBQU8sSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQUEsQUFFaEUsSUFBSSxDQUFDLElBQUksR0FBRyxXQUFXLENBQUM7O0FBRXhCLFFBQUksUUFBUSxHQUFHO0FBQ2IsWUFBTSxFQUFFLElBQUk7QUFDWixXQUFLLEVBQUUsU0FBUztLQUNqQixDQUFDOztBQUVGLGtEQVpFLElBQUksNkNBWUEsUUFBUSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7O0FBRW5DLFFBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU07QUFDcEIsYUFBTyxPQUFPLENBQUMsS0FBSyxDQUFDLDBEQUEwRCxDQUFDLENBQUM7S0FBQTtBQUduRixRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ2xDLFFBQUksQ0FBQyxNQUFNLEdBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDbEMsUUFBSSxDQUFDLEtBQUssR0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQzs7O0FBR2pDLFFBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNoRCxRQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUN2QyxRQUFJLENB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LENBQUM7QUFDdkQsY0FBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFBLEdBQUksSUFBSSxDQUFDLElBQUksQ0FBQzs7QUFFaEMsY0FBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUNuQyxjQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFdEQsY0FBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQ1YsY0FBRyxJQUFJLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQy9DOztBQUVELFlBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQztPQUNYOzs7Ozs7U0FwR0csSUFBSTtHQUFTLEdBQUc7O0FBd0d0QixNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyIsImZpbGUiOiJzcmMvb3BlcmF0b3JzL3NyYy1hdWRpby9wcm9jZXNzLXdvcmtlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG52YXIgTEZPID0gcmVxdWlyZSgnLi4vY29yZS9sZm8tYmFzZScpO1xuXG5jbGFzcyBEcmF3IGV4dGVuZHMgTEZPIHtcblxuICBjb25zdHJ1Y3RvcihwcmV2aW91cyA9IG51bGwsIG9wdGlvbnMgPSB7fSkge1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBEcmF3KSkgcmV0dXJuIG5ldyBEcmF3KHByZXZpb3VzLCBvcHRpb25zKTtcblxuICAgIHRoaXMudHlwZSA9ICdzaW5rLWRyYXcnO1xuXG4gICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgc2Nyb2xsOiB0cnVlLFxuICAgICAgY29sb3I6ICcjMDAwMDAwJ1xuICAgIH07XG5cbiAgICBzdXBlcihwcmV2aW91cywgb3B0aW9ucywgZGVmYXVsdHMpO1xuXG4gICAgaWYoIXRoaXMucGFyYW1zLmNhbnZhcylcbiAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKCdQbGVhc2Ugbm90ZTogYSBjYW52YXMgZWxlbWVudCBpcyByZXF1aXJlZCBvciB0aGlzIG1vZHVsZScpO1xuXG4gICAgLy8gcHVic1xuICAgIHRoaXMuc2Nyb2xscyA9IHRoaXMucGFyYW1zLnNjcm9sbDtcbiAgICB0aGlzLmNhbnZhcyAgPSB0aGlzLnBhcmFtcy5jYW52YXM7XG4gICAgdGhpcy5jb2xvciAgID0gdGhpcy5wYXJhbXMuY29sb3I7XG5cbiAgICAvLyBwcml2c1xuICAgIHRoaXMuX2J1ZmZlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgdGhpcy5fYnVmZmVyLndpZHRoID0gdGhpcy5jYW52YXMud2lkdGg7XG4gICAgdGhpcy5fYnVmZmVyLmhlaWdodCA9IHRoaXMuY2FudmFzLmhlaWdodDtcblxuICAgIHRoaXMuX2J1ZmZDdHggPSB0aGlzLl9idWZmZXIuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICB0aGlzLl9jdkN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICB0aGlzLl93aWR0aCA9IHRoaXMuY2FudmFzLndpZHRoO1xuICAgIHRoaXMuX2hlaWdodCA9IHRoaXMuY2FudmFzLmhlaWdodDtcbiAgICB0aGlzLl9hbXAgPSB0aGlzLl9oZWlnaHQgLyAyO1xuXG4gICAgdGhpcy5feCA9IDA7XG4gICAgdGhpcy5faSA9IDA7XG4gICAgdGhpcy5fcmF0ZSA9IDAuMTtcblxuICAgIHRoaXMuX21pblZhbCA9IC0xLjA7XG4gICAgdGhpcy5fbWF4VmFsID0gMS4wO1xuXG4gIH1cblxuICAvLyBQcml2YXRlIE1ldGhvZHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXG5cbiAgX2NsZWFyQ2FudmFzKGN2KSB7XG4gICAgY3YuaGVpZ2h0ID0gdGhpcy5faGVpZ2h0OyBjdi53aWR0aCA9IHRoaXMuX3dpZHRoO1xuICB9XG5cbiAgX3Njcm9sbExlZnQoKSB7XG5cbiAgICAvLyBjbGVhciB0aGUgYnVmZmVyXG4gICAgdGhpcy5fY2xlYXJDYW52YXModGhpcy5fYnVmZmVyKTtcbiAgICAvLyBkcmF3IHRoZSBkZXN0aW5hdGlvbiBpbnRvIHRoZSBidWZmZXIgYXQgMCAwXG4gICAgdGhpcy5fYnVmZkN0eC5kcmF3SW1hZ2UodGhpcy5jYW52YXMsIDAsIDApO1xuXG4gICAgLy8gY2xlYXIgdGhlIGRlc3RpbmF0aW9uXG4gICAgdGhpcy5fY2xlYXJDYW52YXModGhpcy5jYW52YXMpO1xuICAgIC8vIHNhdmUgdGhlIGRlc3RpbmF0aW9uIHN0YXRlXG4gICAgdGhpcy5fY3ZDdHguc2F2ZSgpO1xuICAgIC8vIHRyYW5zbGF0ZSBkZXN0aW5hdGlvbiBieSAxIHB4IG9uIHhcbiAgICB0aGlzLl9jdkN0eC50cmFuc2xhdGUoLTEsIDApO1xuICAgIC8vIGRyYXcgdGhlIGJ1ZmZlciBpbnRvIHRoZSBkZXN0aW5hdGlvblxuICAgIHRoaXMuX2N2Q3R4LmRyYXdJbWFnZSh0aGlzLl9idWZmZXIsIDAsIDApO1xuICAgIC8vIHJlc3RvcmUgdGhlIGRlc3RpbmF0aW9uXG4gICAgdGhpcy5fY3ZDdHgucmVzdG9yZSgpO1xuXG4gICAgLy8gcmUtc2V0IHRoZSBpbmRleFxuICAgIHRoaXMuX3ggPSB0aGlzLl93aWR0aCAtIDE7XG4gIH1cblxuXG4gIC8vIFB1YmxpYyBNZXRob2RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tXG5cbiAgcHJvY2Vzcyh0aW1lLCBkYXRhKSB7XG4gICAgdmFyIG1pbiA9IHRoaXMuX21heFZhbDtcbiAgICB2YXIgbWF4ID0gdGhpcy5fbWluVmFsO1xuICAgIHZhciBzdGVwID0gZGF0YS5sZW5ndGg7XG5cbiAgICBpZih0aGlzLnNjcm9sbHMgJiYgKHRoaXMuX2kgJSA0ID09PSAwKSl7XG5cbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgc3RlcDsgaisrKSB7XG4gICAgICAgIHZhciBkYXR1bSA9IGRhdGFbal07XG4gICAgICAgIGlmIChkYXR1bSA8IG1pbikgbWluID0gZGF0dW07XG4gICAgICAgIGlmIChkYXR1bSA+IG1heCkgbWF4ID0gZGF0dW07XG4gICAgICB9XG5cbiAgICAgIHZhciBwb3MgPSAodGhpcy5fbWF4VmFsIC0gbWF4ICogdGhpcy5fYW1wKSArIHRoaXMuX2FtcDtcbiAgICAgIHZhciBoID0gKG1heCAtIG1pbikgKiB0aGlzLl9hbXA7XG5cbiAgICAgIHRoaXMuX2N2Q3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3I7XG4gICAgICB0aGlzLl9jdkN0eC5maWxsUmVjdCh0aGlzLl94LCBwb3MsIDEsIE1hdGgubWF4KDEsIGgpKTtcblxuICAgICAgdGhpcy5feCsrO1xuICAgICAgaWYodGhpcy5feCA+PSB0aGlzLl93aWR0aCkgdGhpcy5fc2Nyb2xsTGVmdCgpO1xuICAgIH1cblxuICAgIHRoaXMuX2krKztcbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gRHJhdzsiXX0=