
"use strict";

var Lfo = require('../../lfo-base');

var Magnitude = (function(super$0){var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(Magnitude, super$0);var proto$0={};

  function Magnitude() {var previous = arguments[0];if(previous === void 0)previous = null;var options = arguments[1];if(options === void 0)options = {};

    if (!(this instanceof Magnitude)) return new Magnitude(previous, options);

    super$0.call(this, previous, options);

    // pubs
    this.type = 'mag';
    // privs
    this.__outFrame = new Float32Array(1);
    this.__frameSize = options.frameSize || 2048;
    this.__offset = options.offset || 0;
  }if(super$0!==null)SP$0(Magnitude,super$0);Magnitude.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":Magnitude,"configurable":true,"writable":true}});DP$0(Magnitude,"prototype",{"configurable":false,"enumerable":false,"writable":false});


  proto$0.process = function(time, frame) {

    var outFrame = this.__outFrame,
      frameSize  = this.__frameSize,
      sum = 0,
      i;

    for (i = 0; i < frameSize; i++)
      sum += (frame[i] * frame[i]);

    time -= this.__offset;
    outFrame.set([Math.sqrt(sum / frameSize)], 0);
    this.emit('frame', time, outFrame);
  };
MIXIN$0(Magnitude.prototype,proto$0);proto$0=void 0;return Magnitude;})(Lfo);

module.exports = Magnitude;