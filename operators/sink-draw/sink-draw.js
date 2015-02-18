
"use strict";

var LFO = require('../../lfo-base');

var Draw = (function(super$0){var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(Draw, super$0);var proto$0={};

  function Draw() {var previous = arguments[0];if(previous === void 0)previous = null;var options = arguments[1];if(options === void 0)options = {};
    if (!(this instanceof Draw)) return new Draw(previous, options);
    
    this.type = 'sink-draw';
    
    var defaults = {
      scroll: true,
      color: '#000000'
    };

    super$0.call(this, previous, options, defaults);
   
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

  }if(super$0!==null)SP$0(Draw,super$0);Draw.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":Draw,"configurable":true,"writable":true}});DP$0(Draw,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  // Private Methods
  // ---------------

  proto$0._clearCanvas = function(cv) { 
    cv.height = this._height; cv.width = this._width;
  };

  proto$0._scrollLeft = function() {

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
  };


  // Public Methods
  // --------------

  proto$0.process = function(time, data) {
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
  };

MIXIN$0(Draw.prototype,proto$0);proto$0=void 0;return Draw;})(LFO);

module.exports = Draw;