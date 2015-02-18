
"use strict";

var LFO = require('../../lfo-base');

class Draw extends LFO {

  constructor(previous = null, options = {}) {
    if (!(this instanceof Draw)) return new Draw(previous, options);
    
    this.type = 'sink-draw';
    
    var defaults = {
      scroll: true,
      color: '#000000'
    };

    super(previous, options, defaults);
   
    if(!this.params.canvas)
      return console.error('Please note: a canvas element is required or this module');
    
    // pubs
    this.scrolls = this.params.scroll;
    this.canvas  = this.params.canvas;
    this.color   = this.params.color;
     
    // privs
    this._buffer = document.createElement("canvas");
    this._buffer.width = this.canvas.width;
    this._buffer.height = this.canvas.height;

    this._buffCtx = this._buffer.getContext('2d');
    this._cvCtx = this.canvas.getContext('2d');

    this._width = this.canvas.width;
    this._height = this.canvas.height;
    this._amp = this._height / 2;

    this._x = 0;
    this._i = 0;
    this._rate = 0.1;

    this._minVal = -1.0;
    this._maxVal = 1.0;

  }

  // Private Methods
  // ---------------

  _clearCanvas(cv) { 
    cv.height = this._height; cv.width = this._width;
  }

  _scrollLeft() {

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


  // Public Methods
  // --------------

  process(time, data) {
    var min = this._maxVal;
    var max = this._minVal;
    var step = data.length;

    if(this.scrolls && (this._i % 4 === 0)){

      for (var j = 0; j < step; j++) {
        var datum = data[j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }

      var pos = (1 - max * this._amp) + this._amp;
      var h = (max - min) * this._amp;

      this._cvCtx.fillStyle = this.color;
      this._cvCtx.fillRect(this._x, pos, 1, Math.max(1, h));
      
      this._x++;
      if(this._x >= this._width) this._scrollLeft();
    }
    
    this._i++;
  }

}

module.exports = Draw;