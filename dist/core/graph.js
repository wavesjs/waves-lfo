"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var Node = (function () {
  function Node(graph, lfo) {
    _babelHelpers.classCallCheck(this, Node);

    this.graph = graph;
    this.lfo = lfo;
    this.nodes = [];
  }

  _babelHelpers.prototypeProperties(Node, null, {
    pipe: {
      value: function pipe(ctor) {
        var options = arguments[1] === undefined ? {} : arguments[1];
        var id = arguments[2] === undefined ? null : arguments[2];

        var lfo = ctor(options);
        var nextNode = new Node(this.graph, lfo);

        this.lfo.add(lfo); // add to operators
        this.graph.add(this, nextNode, id); // add to graph: parent, child, id

        return nextNode;
      },
      writable: true,
      configurable: true
    },
    remove: {
      value: function remove() {
        this.graph.remove(this);
        this.lfo.remove(this);
      },
      writable: true,
      configurable: true
    }
  });

  return Node;
})();

var LfpGraph = (function () {
  function LfpGraph(ctor) {
    var options = arguments[1] === undefined ? {} : arguments[1];
    var id = arguments[2] === undefined ? null : arguments[2];

    _babelHelpers.classCallCheck(this, LfpGraph);

    if (!(this instanceof LfpGraph)) {
      return new LfpGraph(ctor, options, id);
    }this.nodes = {};
    this.typeCount = {};
    this.rootNode = null;

    var node = new Node(this, ctor(options));

    this.add(null, node, id);
  }

  _babelHelpers.prototypeProperties(LfpGraph, null, {
    add: {

      // adds a node to the structure

      value: function add(parent, node) {
        var id = arguments[2] === undefined ? null : arguments[2];

        id = id || node.lfo.type;
        this.typeCount[id] = this.typeCount[id] + 1 || 0;
        id = this.typeCount[id] === 0 ? id : "" + id + "-" + this.typeCount[id];
        node.id = id; // to remove the node later

        if (parent) {
          // && this.nodes[parent.id]) {
          // debugging
          if (!this.nodes[parent.id]) console.error("Parent didnt register correctly");

          // fetch parent node
          var p = this.get(parent.id);

          // add node as nodes in the graph
          p.nodes.push(node.id);

          // removing logic, clean up when code is ready
          // node.parent = p.lfo; // bind the parnt for removing later
          // node.index = idx; // necessary?
        } else {
          this.rootNode = id;
        }

        this.nodes[node.id] = node;

        // console.log(this.nodes);
        return id;
      },
      writable: true,
      configurable: true
    },
    remove: {

      // removes a node from the structure

      value: function remove(item) {
        var _this = this;

        // clear nodes nodes from the node
        // remove nodes from the graph

        // only if it has nodes
        if (item.nodes.length > 0) {

          // subnodes
          item.nodes.forEach(function (id) {
            var node = _this.get(id);
            _this.remove(node); // remove subnodes
            delete _this.nodes[id];
          });

          item.nodes = []; // reset nodes container
        }
      },
      writable: true,
      configurable: true
    },
    pipe: {

      // graph pipe, only adds nodes into the rootNode

      value: function pipe(ctor) {
        var options = arguments[1] === undefined ? {} : arguments[1];
        var id = arguments[2] === undefined ? null : arguments[2];

        var lfo = ctor(options);
        var node = new Node(this, lfo);

        var parent = this.get(this.rootNode);
        parent.lfo.add(lfo);
        this.add(parent, node, id);

        return node;
      },
      writable: true,
      configurable: true
    },
    start: {
      value: function start() {
        for (var key in this.nodes) {
          var node = this.nodes[key].lfo;
          if ("start" in node) node.start();
        }
      },
      writable: true,
      configurable: true
    },
    get: {
      value: function get(id) {
        return this.nodes[id];
      },
      writable: true,
      configurable: true
    },
    toString: {
      value: function toString() {
        return this.nodes;
      },
      writable: true,
      configurable: true
    }
  });

  return LfpGraph;
})();

module.exports = LfpGraph;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9vcGVyYXRvcnMvc3JjLWF1ZGlvL3Byb2Nlc3Mtd29ya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFHTSxJQUFJO0FBRUcsV0FGUCxJQUFJLENBRUksS0FBSyxFQUFFLEdBQUc7dUNBRmxCLElBQUk7O0FBR04sUUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDbkIsUUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDZixRQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztHQUNqQjs7b0NBTkcsSUFBSTtBQVFSLFFBQUk7YUFBQSxjQUFDLElBQUksRUFBMkI7WUFBekIsT0FBTyxnQ0FBRyxFQUFFO1lBQUUsRUFBRSxnQ0FBRyxJQUFJOztBQUNoQyxZQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDeEIsWUFBSSxRQUFRLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQzs7QUFFekMsWUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbEIsWUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQzs7QUFFbkMsZUFBTyxRQUFRLENBQUM7T0FDakI7Ozs7QUFFRCxVQUFNO2FBQUEsa0JBQUU7QUFDTixZQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN4QixZQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztPQUN2Qjs7Ozs7O1NBckJHLElBQUk7OztJQXlCSixRQUFRO0FBRUQsV0FGUCxRQUFRLENBRUEsSUFBSTtRQUFFLE9BQU8sZ0NBQUcsRUFBRTtRQUFFLEVBQUUsZ0NBQUcsSUFBSTs7dUNBRnJDLFFBQVE7O0FBR1YsUUFBSSxFQUFFLElBQUksWUFBWSxRQUFRLENBQUEsQUFBQztBQUFFLGFBQU8sSUFBSSxRQUFRLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztLQUFBLEFBRXhFLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLFFBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQ3BCLFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDOztBQUVyQixRQUFJLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7O0FBRXpDLFFBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztHQUMxQjs7b0NBWkcsUUFBUTtBQWVaLE9BQUc7Ozs7YUFBQSxhQUFDLE1BQU0sRUFBRSxJQUFJLEVBQWE7WUFBWCxFQUFFLGdDQUFHLElBQUk7O0FBQ3pCLFVBQUUsR0FBRyxFQUFFLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUM7QUFDekIsWUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxHQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDaEQsVUFBRSxHQUFHLEFBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxRQUFNLEVBQUUsU0FBSSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxBQUFFLENBQUM7QUFDcEUsWUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7O0FBRWIsWUFBRyxNQUFNLEVBQUM7OztBQUVSLGNBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7OztBQUc1RSxjQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQzs7O0FBRzVCLFdBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQzs7Ozs7U0FNdkIsTUFBTTtBQUNMLGNBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1NBQ3BCOztBQUVELFlBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQzs7O0FBRzNCLGVBQU8sRUFBRSxDQUFDO09BQ1g7Ozs7QUFHRCxVQUFNOzs7O2FBQUEsZ0JBQUMsSUFBSSxFQUFFOzs7Ozs7O0FBTVgsWUFBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7OztBQUd4QixjQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFBLEVBQUUsRUFBSTtBQUN2QixnQkFBSSxJQUFJLEdBQUcsTUFBSyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDeEIsa0JBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xCLG1CQUFPLE1BQUssS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1dBQ3ZCLENBQUMsQ0FBQzs7QUFFSCxjQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztTQUNqQjtPQUNGOzs7O0FBR0QsUUFBSTs7OzthQUFBLGNBQUMsSUFBSSxFQUEyQjtZQUF6QixPQUFPLGdDQUFHLEVBQUU7WUFBRSxFQUFFLGdDQUFHLElBQUk7O0FBQ2hDLFlBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN4QixZQUFJLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7O0FBRS9CLFlBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3JDLGNBQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3BCLFlBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQzs7QUFFM0IsZUFBTyxJQUFJLENBQUM7T0FDYjs7OztBQUVELFNBQUs7YUFBQSxpQkFBRTtBQUNMLGFBQUksSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtBQUN6QixjQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQztBQUMvQixjQUFHLE9BQU8sSUFBSSxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ2xDO09BQ0Y7Ozs7QUFFRCxPQUFHO2FBQUEsYUFBQyxFQUFFLEVBQUU7QUFDTixlQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7T0FDdkI7Ozs7QUFFRCxZQUFRO2FBQUEsb0JBQUU7QUFDUixlQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7T0FDbkI7Ozs7OztTQTFGRyxRQUFROzs7QUE4RmQsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMiLCJmaWxlIjoic3JjL29wZXJhdG9ycy9zcmMtYXVkaW8vcHJvY2Vzcy13b3JrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcblwidXNlIHN0cmljdFwiO1xuXG5jbGFzcyBOb2RlIHtcblxuICBjb25zdHJ1Y3RvcihncmFwaCwgbGZvKXtcbiAgICB0aGlzLmdyYXBoID0gZ3JhcGg7XG4gICAgdGhpcy5sZm8gPSBsZm87XG4gICAgdGhpcy5ub2RlcyA9IFtdO1xuICB9XG5cbiAgcGlwZShjdG9yLCBvcHRpb25zID0ge30sIGlkID0gbnVsbCkge1xuICAgIHZhciBsZm8gPSBjdG9yKG9wdGlvbnMpO1xuICAgIHZhciBuZXh0Tm9kZSA9IG5ldyBOb2RlKHRoaXMuZ3JhcGgsIGxmbyk7XG4gICAgXG4gICAgdGhpcy5sZm8uYWRkKGxmbyk7IC8vIGFkZCB0byBvcGVyYXRvcnNcbiAgICB0aGlzLmdyYXBoLmFkZCh0aGlzLCBuZXh0Tm9kZSwgaWQpOyAvLyBhZGQgdG8gZ3JhcGg6IHBhcmVudCwgY2hpbGQsIGlkXG4gICAgXG4gICAgcmV0dXJuIG5leHROb2RlO1xuICB9XG5cbiAgcmVtb3ZlKCl7XG4gICAgdGhpcy5ncmFwaC5yZW1vdmUodGhpcyk7XG4gICAgdGhpcy5sZm8ucmVtb3ZlKHRoaXMpO1xuICB9XG59XG5cblxuY2xhc3MgTGZwR3JhcGgge1xuXG4gIGNvbnN0cnVjdG9yKGN0b3IsIG9wdGlvbnMgPSB7fSwgaWQgPSBudWxsKSB7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIExmcEdyYXBoKSkgcmV0dXJuIG5ldyBMZnBHcmFwaChjdG9yLCBvcHRpb25zLCBpZCk7XG4gICAgXG4gICAgdGhpcy5ub2RlcyA9IHt9O1xuICAgIHRoaXMudHlwZUNvdW50ID0ge307XG4gICAgdGhpcy5yb290Tm9kZSA9IG51bGw7XG5cbiAgICB2YXIgbm9kZSA9IG5ldyBOb2RlKHRoaXMsIGN0b3Iob3B0aW9ucykpO1xuICAgIFxuICAgIHRoaXMuYWRkKG51bGwsIG5vZGUsIGlkKTtcbiAgfVxuXG4gIC8vIGFkZHMgYSBub2RlIHRvIHRoZSBzdHJ1Y3R1cmVcbiAgYWRkKHBhcmVudCwgbm9kZSwgaWQgPSBudWxsKSB7XG4gICAgaWQgPSBpZCB8fCBub2RlLmxmby50eXBlO1xuICAgIHRoaXMudHlwZUNvdW50W2lkXSA9IHRoaXMudHlwZUNvdW50W2lkXSArMSB8fCAwO1xuICAgIGlkID0gKHRoaXMudHlwZUNvdW50W2lkXSA9PT0gMCk/IGlkIDogYCR7aWR9LSR7dGhpcy50eXBlQ291bnRbaWRdfWA7XG4gICAgbm9kZS5pZCA9IGlkOyAvLyB0byByZW1vdmUgdGhlIG5vZGUgbGF0ZXJcblxuICAgIGlmKHBhcmVudCl7IC8vICYmIHRoaXMubm9kZXNbcGFyZW50LmlkXSkge1xuICAgICAgLy8gZGVidWdnaW5nXG4gICAgICBpZighdGhpcy5ub2Rlc1twYXJlbnQuaWRdKSBjb25zb2xlLmVycm9yKCdQYXJlbnQgZGlkbnQgcmVnaXN0ZXIgY29ycmVjdGx5Jyk7XG5cbiAgICAgIC8vIGZldGNoIHBhcmVudCBub2RlXG4gICAgICB2YXIgcCA9IHRoaXMuZ2V0KHBhcmVudC5pZCk7XG5cbiAgICAgIC8vIGFkZCBub2RlIGFzIG5vZGVzIGluIHRoZSBncmFwaFxuICAgICAgcC5ub2Rlcy5wdXNoKG5vZGUuaWQpO1xuICAgICAgXG4gICAgICAvLyByZW1vdmluZyBsb2dpYywgY2xlYW4gdXAgd2hlbiBjb2RlIGlzIHJlYWR5XG4gICAgICAvLyBub2RlLnBhcmVudCA9IHAubGZvOyAvLyBiaW5kIHRoZSBwYXJudCBmb3IgcmVtb3ZpbmcgbGF0ZXJcbiAgICAgIC8vIG5vZGUuaW5kZXggPSBpZHg7IC8vIG5lY2Vzc2FyeT9cbiAgICBcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yb290Tm9kZSA9IGlkO1xuICAgIH1cblxuICAgIHRoaXMubm9kZXNbbm9kZS5pZF0gPSBub2RlO1xuXG4gICAgLy8gY29uc29sZS5sb2codGhpcy5ub2Rlcyk7XG4gICAgcmV0dXJuIGlkO1xuICB9XG5cbiAgLy8gcmVtb3ZlcyBhIG5vZGUgZnJvbSB0aGUgc3RydWN0dXJlXG4gIHJlbW92ZShpdGVtKSB7XG5cbiAgICAvLyBjbGVhciBub2RlcyBub2RlcyBmcm9tIHRoZSBub2RlXG4gICAgLy8gcmVtb3ZlIG5vZGVzIGZyb20gdGhlIGdyYXBoXG5cbiAgICAvLyBvbmx5IGlmIGl0IGhhcyBub2Rlc1xuICAgIGlmKGl0ZW0ubm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgXG4gICAgICAvLyBzdWJub2Rlc1xuICAgICAgaXRlbS5ub2Rlcy5mb3JFYWNoKGlkID0+IHtcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzLmdldChpZCk7XG4gICAgICAgIHRoaXMucmVtb3ZlKG5vZGUpOyAvLyByZW1vdmUgc3Vibm9kZXNcbiAgICAgICAgZGVsZXRlIHRoaXMubm9kZXNbaWRdO1xuICAgICAgfSk7XG5cbiAgICAgIGl0ZW0ubm9kZXMgPSBbXTsgLy8gcmVzZXQgbm9kZXMgY29udGFpbmVyXG4gICAgfVxuICB9XG5cbiAgLy8gZ3JhcGggcGlwZSwgb25seSBhZGRzIG5vZGVzIGludG8gdGhlIHJvb3ROb2RlXG4gIHBpcGUoY3Rvciwgb3B0aW9ucyA9IHt9LCBpZCA9IG51bGwpIHtcbiAgICB2YXIgbGZvID0gY3RvcihvcHRpb25zKTtcbiAgICB2YXIgbm9kZSA9IG5ldyBOb2RlKHRoaXMsIGxmbyk7XG4gICBcbiAgICB2YXIgcGFyZW50ID0gdGhpcy5nZXQodGhpcy5yb290Tm9kZSk7XG4gICAgcGFyZW50Lmxmby5hZGQobGZvKTtcbiAgICB0aGlzLmFkZChwYXJlbnQsIG5vZGUsIGlkKTtcblxuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgc3RhcnQoKXtcbiAgICBmb3IobGV0IGtleSBpbiB0aGlzLm5vZGVzKSB7XG4gICAgICB2YXIgbm9kZSA9IHRoaXMubm9kZXNba2V5XS5sZm87XG4gICAgICBpZignc3RhcnQnIGluIG5vZGUpIG5vZGUuc3RhcnQoKTtcbiAgICB9XG4gIH1cblxuICBnZXQoaWQpIHtcbiAgICByZXR1cm4gdGhpcy5ub2Rlc1tpZF07XG4gIH1cblxuICB0b1N0cmluZygpe1xuICAgIHJldHVybiB0aGlzLm5vZGVzO1xuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBMZnBHcmFwaDsiXX0=