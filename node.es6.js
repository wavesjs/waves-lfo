
"use strict";

class Node {

  constructor(graph, lfo){
    this.graph = graph;
    this.lfo = lfo;
    this.nodes = [];
  }

  pipe(ctor, options = {}, id = null) {
    var lfo = ctor(options);
    var nextNode = new Node(this.graph, lfo);
    
    this.lfo.add(lfo); // add to operators
    this.graph.add(this, nextNode, id); // add to graph: parent, child, id
    
    return nextNode;
  }

  remove(){
    this.graph.remove(this);
    this.lfo.remove(this);
  }
}

module.exports = Node;