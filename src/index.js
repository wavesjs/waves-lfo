
"use strict";

var Lfp = require('lfp');

class Draw extends Lfp {

  constructor(previous = null, options = {}) {
    if (!(this instanceof Draw)) return new Draw(previous, options);
    
    // defaults
    options = this.extend({
      scroll: true,
      color: '#000000'
    }, options);

    super(previous, options);
    
    if(!options.canvas) return console.error('Please note: a canvas element is required or this module');
    
    // sets member properties with default encapsulation
    this.declareMembers([
      "buffCtx",
      "cvCtx",
      "width",
      "height",
      "amp",
      "x",
      "i",
      "rate",
      "minVal",
      "maxVal",
      { buffer: {value: document.createElement("canvas")} }
    ]);
    
    this.type = 'draw';//require('./package.json').name;
    this.scrolls = options.scroll;
    this.canvas = options.canvas;

    this.buffer.width = this.canvas.width;
    this.buffer.height = this.canvas.height;

    this.buffCtx = this.buffer.getContext('2d');
    this.cvCtx = this.canvas.getContext('2d');

    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.amp = this.height / 2;

    this.x = 0;
    this.i = 0;
    this.rate = 0.1;

    this.minVal = -1.0;
    this.maxVal = 1.0;

    this.color = options.color;
  }

  clearCanvas(cv) { 
    cv.height = this.height; cv.width = this.width;
  }

  scrollLeft() {

    // clear the buffer
    this.clearCanvas(this.buffer);
    // draw the destination into the buffer at 0 0
    this.buffCtx.drawImage(this.canvas, 0, 0);

    // clear the destination
    this.clearCanvas(this.canvas);
    // save the destination state
    this.cvCtx.save();
    // translate destination by 1 px on x
    this.cvCtx.translate(-1, 0);
    // draw the buffer into the destination
    this.cvCtx.drawImage(this.buffer, 0, 0);
    // restore the destination
    this.cvCtx.restore();

    // re-set the index
    this.x = this.width - 1;
  }


  process(time, data) {

    var min = this.maxVal;
    var max = this.minVal;
    var step = data.length;

    if(this.scrolls && (this.i % 4 === 0)){

      for (var j = 0; j < step; j++) {
        var datum = data[j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }

      var pos = (1 - max * this.amp) + this.amp;
      var h = (max - min) * this.amp;

      this.cvCtx.fillStyle = this.color;
      this.cvCtx.fillRect(this.x, pos, 1, Math.max(1, h));
      
      this.x++;
      if(this.x >= this.width) this.scrollLeft();
    }
    
    this.i++;
  }

}

module.exports = Draw;