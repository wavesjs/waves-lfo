
"use strict";

var EventEmitter = require('events').EventEmitter;
var extend = Object.assign;
var pck = require('./package.json');

class Lfo extends EventEmitter {

  constructor(previous = null, options = {}) {

    this.idx = 0;
    
    if(previous && !('process' in previous)){ // no type in the duck, it's an options type of duck
      extend(options, previous);
      previous = null;
    }

    if(previous) {
      // add ourselves to the previous operator if its passed
      previous.add(this);
      // this.__previous = previous;
    }

  }

  // bind child node
  add(lfo = null){
    this.on('frame', (t, d) => lfo.process(t, d));
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