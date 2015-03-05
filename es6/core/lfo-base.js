
"use strict";

var EventEmitter = require('events').EventEmitter;
var extend = require('object-assign');

class Lfo extends EventEmitter {

  constructor(previous = null, options = {}, defaults = {}) {
    if (!(this instanceof Lfo)) return new Lfo(previous, options);

    this.idx = 0;
    this.params = {};
    this.streamParams = {
      frameSize: 1,
      frameRate: 0
    };
    
    this.params = extend(defaults, options);

    if(previous) {
      // add ourselves to the previous operator if its passed
      previous.add(this);
      // pass on stream params
      this.streamParams = extend({}, previous.streamParams);
    }
  }

  // common stream config based on the instantiated params
  setupStream(opts = {}) {

    if(opts.frameRate) this.streamParams.frameRate = opts.frameRate;
    if(opts.frameSize) this.streamParams.frameSize = opts.frameSize;
    this.outFrame = new Float32Array(this.streamParams.frameSize);
  }

  // bind child node
  add(lfo = null){
    this.on('frame', (t, d) => lfo.process(t, d));
  }

  // we take care of the emit ourselves
  output(outTime = null) {
    if(!outTime) outTime = this.time;
    this.emit('frame', outTime, this.outFrame);
  }

  // removes all children from listening
  remove(){
    this.removeAllListeners('frame');
  }

  process(time, data) { console.error('process not implemented'); }

  // will delete itself from the parent node
  destroy(){
    if(this.previous)
      this.previous.removeListener('frame', this);
  }

}

module.exports = Lfo;