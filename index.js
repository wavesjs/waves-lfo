"use strict";

var Node = require('./node');

class LfpGraph {

  constructor(ctor, options = {}, id = null) {
    if (!(this instanceof LfpGraph)) return new LfpGraph(ctor, options, id);
    
    this.nodes = {};
    this.typeCount = {};
    this.rootNode = null;

    var node = new Node(this, ctor(options));
    
    this.add(null, node, id);
  }

  // adds a node to the structure
  add(parent, node, id = null) {
    id = id || node.lfp.type;
    this.typeCount[id] = this.typeCount[id] +1 || 0;
    id = (this.typeCount[id] === 0)? id : `${id}-${this.typeCount[id]}`;
    node.id = id; // to remove the node later

    if(parent){ // && this.nodes[parent.id]) {
      // debugging
      if(!this.nodes[parent.id]) console.error('Parent didnt register correctly');

      // fetch parent node
      var p = this.get(parent.id);

      // add node as nodes in the graph
      p.nodes.push(node.id);
      
      // removing logic, clean up when code is ready
      // node.parent = p.lfp; // bind the parnt for removing later
      // node.index = idx; // necessary?
    
    } else {
      this.rootNode = id;
    }

    this.nodes[node.id] = node;

    // console.log(this.nodes);
    return id;
  }

  // removes a node from the structure
  remove(item) {

    // clear nodes nodes from the node
    // remove nodes from the graph

    // only if it has nodes
    if(item.nodes.length > 0) {
      
      // subnodes
      item.nodes.forEach(id => {
        var node = this.get(id);
        this.remove(node); // remove subnodes
        delete this.nodes[id];
      });

      item.nodes = []; // reset nodes container
    }
  }

  // graph pipe, only adds nodes into the rootNode
  pipe(ctor, options = {}, id = null) {
    var lfp = ctor(options);
    var node = new Node(this, lfp);
   
    var parent = this.get(this.rootNode);
    parent.lfp.add(lfp);
    this.add(parent, node, id);

    return node;
  }

  get(id) {
    return this.nodes[id];
  }


  toString(){
    return this.nodes;
  }

}

module.exports = LfpGraph;