
"use strict";

var LFO = require('lfo');
var extend = Object.assign;

class Draw extends LFO {

  constructor(previous = null, options = {}) {
    if (!(this instanceof Draw)) return new Draw(previous, options);
    
    this.type = 'sink-draw';

    // defaults
    options = extend({
      scroll: true,
      color: '#000000'
    }, options);

    super(previous, options);
   
    if(!options.canvas)
      return console.error('Please note: a canvas element is required or this module');
    
    // pubs
    this.scrolls = options.scroll;
    this.canvas = options.canvas;
    this.color = options.color;
     
    // privs
    this.__buffer = document.createElement("canvas");
    this.__buffer.width = this.canvas.width;
    this.__buffer.height = this.canvas.height;

    this.__buffCtx = this.__buffer.getContext('2d');
    this.__cvCtx = this.canvas.getContext('2d');

    this.__width = this.canvas.width;
    this.__height = this.canvas.height;
    this.__amp = this.__height / 2;

    this.__x = 0;
    this.__i = 0;
    this.__rate = 0.1;

    this.__minVal = -1.0;
    this.__maxVal = 1.0;

  }

  // Private Methods
  // ---------------

  __clearCanvas(cv) { 
    cv.height = this.__height; cv.width = this.__width;
  }

  __scrollLeft() {

    // clear the buffer
    this.__clearCanvas(this.__buffer);
    // draw the destination into the buffer at 0 0
    this.__buffCtx.drawImage(this.canvas, 0, 0);

    // clear the destination
    this.__clearCanvas(this.canvas);
    // save the destination state
    this.__cvCtx.save();
    // translate destination by 1 px on x
    this.__cvCtx.translate(-1, 0);
    // draw the buffer into the destination
    this.__cvCtx.drawImage(this.__buffer, 0, 0);
    // restore the destination
    this.__cvCtx.restore();

    // re-set the index
    this.__x = this.__width - 1;
  }


  // Public Methods
  // --------------

  process(time, data) {
    var min = this.__maxVal;
    var max = this.__minVal;
    var step = data.length;

    if(this.scrolls && (this.__i % 4 === 0)){

      for (var j = 0; j < step; j++) {
        var datum = data[j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }

      var pos = (1 - max * this.__amp) + this.__amp;
      var h = (max - min) * this.__amp;

      this.__cvCtx.fillStyle = this.color;
      this.__cvCtx.fillRect(this.__x, pos, 1, Math.max(1, h));
      
      this.__x++;
      if(this.__x >= this.__width) this.__scrollLeft();
    }
    
    this.__i++;
  }

}

module.exports = Draw;