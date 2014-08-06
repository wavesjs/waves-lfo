
"use strict";

class Node {

  constructor(graph, lfp){
    this.graph = graph;
    this.lfp = lfp;
    this.nodes = [];
  }

  pipe(ctor, options = {}, id = null) {
    var lfp = ctor(options);
    var nextNode = new Node(this.graph, lfp);
    
    this.lfp.add(lfp); // add to operators
    this.graph.add(this, nextNode, id); // add to graph: parent, child, id
    
    return nextNode;
  }

  remove(){
    this.graph.remove(this);
    this.lfp.remove(this);
  }
}

module.exports = Node;