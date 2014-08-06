
"use strict";

function isObject(item){
  return typeof item === 'object';
}

class Lfp {

  constructor(previous = null, options = {}) {

    this.declareMembers(['previous', 'operators']);

    if(!previous.type){ // no type, it's options
      this.extend(options, previous);
      previous = null;
    }

    this.operators = [];

    if(previous) {
      // add ourselves to the previous operator if its passed
      previous.add(this);
      this.previous = previous;
    }
  }

  // sets all the members with there encapsulation properties in the instance
  declareMembers(members = []) {
    var that = this;
    members.forEach(function(member) {
      var accessors = {};
      
      if(isObject(member)){
        var key = Object.keys(member)[0];
        if(!member[key]) return;
        accessors = member[key];
        member = key;
      }

      accessors.writable = true; // always

      Object.defineProperty(that, member, accessors);
    });
  }

  // adds child node to the operators list
  add(lfp){
    if(lfp) this.operators.push(lfp);
    return this.operators.length-1;
  }

  // removes all children node from the operators list
  remove(){
    this.operators = [];
  }

  // calls alls the operators and passes them the data
  nextOperators(time, data) {
    var operators = this.operators;
    for (var i = 0; i < operators.length; i++) {
      var op = operators[i]; // the next operator object
      if(op && op.process) op.process.call(op, time, data); // call the process with its own context
    }
  }

  // will delete itself from the parent node
  destroy(){
    if(this.previous) this.previous.remove(this);
  }

}

Object.defineProperty(Lfp.prototype, 'extend', {value: require('extend')})

module.exports = Lfp;