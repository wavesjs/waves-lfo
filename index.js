"use strict";


  var LFP = require('../lfp');
  var _lfp = Object.create(LFP); // inherit from base lfp
  var pck = require('./package.json');

  Object.defineProperties(_lfp, {
    type: {value: pck.name}
  });

  Object.defineProperty(_lfp, 'init', {
    value: function(opts) {
      
      this.scrolls = opts.scroll || true ;
      this.canvas = opts.canvas;
      this.buffer = document.createElement("canvas");
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

      this.color = opts.color || '#000000';

      return this;
    }
  });

  Object.defineProperty(_lfp, 'clearCanvas', {
    value: function(cv) { cv.height = this.height; cv.width = this.width;}
  });

  Object.defineProperty(_lfp, 'scrollLeft', {
    value: function() {

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
  });


  Object.defineProperty(_lfp, 'process', {
    value: function(time, data) {

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
  });

module.exports = function(opts) {
  return LFP.create(_lfp, opts);
};