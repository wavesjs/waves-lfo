"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var Node = (function () {
  function Node(graph, lfo) {
    _classCallCheck(this, Node);

    this.graph = graph;
    this.lfo = lfo;
    this.nodes = [];
  }

  _createClass(Node, {
    pipe: {
      value: function pipe(ctor) {
        var options = arguments[1] === undefined ? {} : arguments[1];
        var id = arguments[2] === undefined ? null : arguments[2];

        var lfo = ctor(options);
        var nextNode = new Node(this.graph, lfo);

        this.lfo.add(lfo); // add to operators
        this.graph.add(this, nextNode, id); // add to graph: parent, child, id

        return nextNode;
      }
    },
    remove: {
      value: function remove() {
        this.graph.remove(this);
        this.lfo.remove(this);
      }
    }
  });

  return Node;
})();

var LfpGraph = (function () {
  function LfpGraph(ctor) {
    var options = arguments[1] === undefined ? {} : arguments[1];
    var id = arguments[2] === undefined ? null : arguments[2];

    _classCallCheck(this, LfpGraph);

    if (!(this instanceof LfpGraph)) {
      return new LfpGraph(ctor, options, id);
    }this.nodes = {};
    this.typeCount = {};
    this.rootNode = null;

    var node = new Node(this, ctor(options));

    this.add(null, node, id);
  }

  _createClass(LfpGraph, {
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
      }
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
      }
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
      }
    },
    start: {
      value: function start() {
        for (var key in this.nodes) {
          var node = this.nodes[key].lfo;
          if ("start" in node) node.start();
        }
      }
    },
    get: {
      value: function get(id) {
        return this.nodes[id];
      }
    },
    toString: {
      value: function toString() {
        return this.nodes;
      }
    }
  });

  return LfpGraph;
})();

module.exports = LfpGraph;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL3Byb2Nlc3Mtd29ya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztJQUdNLElBQUk7QUFFRyxXQUZQLElBQUksQ0FFSSxLQUFLLEVBQUUsR0FBRyxFQUFDOzBCQUZuQixJQUFJOztBQUdOLFFBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ25CLFFBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ2YsUUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7R0FDakI7O2VBTkcsSUFBSTtBQVFSLFFBQUk7YUFBQSxjQUFDLElBQUksRUFBMkI7WUFBekIsT0FBTyxnQ0FBRyxFQUFFO1lBQUUsRUFBRSxnQ0FBRyxJQUFJOztBQUNoQyxZQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDeEIsWUFBSSxRQUFRLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQzs7QUFFekMsWUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbEIsWUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQzs7QUFFbkMsZUFBTyxRQUFRLENBQUM7T0FDakI7O0FBRUQsVUFBTTthQUFBLGtCQUFFO0FBQ04sWUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDeEIsWUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDdkI7Ozs7U0FyQkcsSUFBSTs7O0lBeUJKLFFBQVE7QUFFRCxXQUZQLFFBQVEsQ0FFQSxJQUFJLEVBQTJCO1FBQXpCLE9BQU8sZ0NBQUcsRUFBRTtRQUFFLEVBQUUsZ0NBQUcsSUFBSTs7MEJBRnJDLFFBQVE7O0FBR1YsUUFBSSxFQUFFLElBQUksWUFBWSxRQUFRLENBQUEsQUFBQztB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LENBQUM7O0FBRTNCLGVBQU8sSUFBSSxDQUFDO09BQ2I7O0FBRUQsU0FBSzthQUFBLGlCQUFFO0FBQ0wsYUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQ3pCLGNBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDO0FBQy9CLGNBQUcsT0FBTyxJQUFJLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDbEM7T0FDRjs7QUFFRCxPQUFHO2FBQUEsYUFBQyxFQUFFLEVBQUU7QUFDTixlQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7T0FDdkI7O0FBRUQsWUFBUTthQUFBLG9CQUFFO0FBQ1IsZUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDO09BQ25COzs7O1NBMUZHLFFBQVE7OztBQThGZCxNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyIsImZpbGUiOiJlczYvc291cmNlcy9wcm9jZXNzLXdvcmtlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmNsYXNzIE5vZGUge1xuXG4gIGNvbnN0cnVjdG9yKGdyYXBoLCBsZm8pe1xuICAgIHRoaXMuZ3JhcGggPSBncmFwaDtcbiAgICB0aGlzLmxmbyA9IGxmbztcbiAgICB0aGlzLm5vZGVzID0gW107XG4gIH1cblxuICBwaXBlKGN0b3IsIG9wdGlvbnMgPSB7fSwgaWQgPSBudWxsKSB7XG4gICAgdmFyIGxmbyA9IGN0b3Iob3B0aW9ucyk7XG4gICAgdmFyIG5leHROb2RlID0gbmV3IE5vZGUodGhpcy5ncmFwaCwgbGZvKTtcbiAgICBcbiAgICB0aGlzLmxmby5hZGQobGZvKTsgLy8gYWRkIHRvIG9wZXJhdG9yc1xuICAgIHRoaXMuZ3JhcGguYWRkKHRoaXMsIG5leHROb2RlLCBpZCk7IC8vIGFkZCB0byBncmFwaDogcGFyZW50LCBjaGlsZCwgaWRcbiAgICBcbiAgICByZXR1cm4gbmV4dE5vZGU7XG4gIH1cblxuICByZW1vdmUoKXtcbiAgICB0aGlzLmdyYXBoLnJlbW92ZSh0aGlzKTtcbiAgICB0aGlzLmxmby5yZW1vdmUodGhpcyk7XG4gIH1cbn1cblxuXG5jbGFzcyBMZnBHcmFwaCB7XG5cbiAgY29uc3RydWN0b3IoY3Rvciwgb3B0aW9ucyA9IHt9LCBpZCA9IG51bGwpIHtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgTGZwR3JhcGgpKSByZXR1cm4gbmV3IExmcEdyYXBoKGN0b3IsIG9wdGlvbnMsIGlkKTtcbiAgICBcbiAgICB0aGlzLm5vZGVzID0ge307XG4gICAgdGhpcy50eXBlQ291bnQgPSB7fTtcbiAgICB0aGlzLnJvb3ROb2RlID0gbnVsbDtcblxuICAgIHZhciBub2RlID0gbmV3IE5vZGUodGhpcywgY3RvcihvcHRpb25zKSk7XG4gICAgXG4gICAgdGhpcy5hZGQobnVsbCwgbm9kZSwgaWQpO1xuICB9XG5cbiAgLy8gYWRkcyBhIG5vZGUgdG8gdGhlIHN0cnVjdHVyZVxuICBhZGQocGFyZW50LCBub2RlLCBpZCA9IG51bGwpIHtcbiAgICBpZCA9IGlkIHx8IG5vZGUubGZvLnR5cGU7XG4gICAgdGhpcy50eXBlQ291bnRbaWRdID0gdGhpcy50eXBlQ291bnRbaWRdICsxIHx8IDA7XG4gICAgaWQgPSAodGhpcy50eXBlQ291bnRbaWRdID09PSAwKT8gaWQgOiBgJHtpZH0tJHt0aGlzLnR5cGVDb3VudFtpZF19YDtcbiAgICBub2RlLmlkID0gaWQ7IC8vIHRvIHJlbW92ZSB0aGUgbm9kZSBsYXRlclxuXG4gICAgaWYocGFyZW50KXsgLy8gJiYgdGhpcy5ub2Rlc1twYXJlbnQuaWRdKSB7XG4gICAgICAvLyBkZWJ1Z2dpbmdcbiAgICAgIGlmKCF0aGlzLm5vZGVzW3BhcmVudC5pZF0pIGNvbnNvbGUuZXJyb3IoJ1BhcmVudCBkaWRudCByZWdpc3RlciBjb3JyZWN0bHknKTtcblxuICAgICAgLy8gZmV0Y2ggcGFyZW50IG5vZGVcbiAgICAgIHZhciBwID0gdGhpcy5nZXQocGFyZW50LmlkKTtcblxuICAgICAgLy8gYWRkIG5vZGUgYXMgbm9kZXMgaW4gdGhlIGdyYXBoXG4gICAgICBwLm5vZGVzLnB1c2gobm9kZS5pZCk7XG4gICAgICBcbiAgICAgIC8vIHJlbW92aW5nIGxvZ2ljLCBjbGVhbiB1cCB3aGVuIGNvZGUgaXMgcmVhZHlcbiAgICAgIC8vIG5vZGUucGFyZW50ID0gcC5sZm87IC8vIGJpbmQgdGhlIHBhcm50IGZvciByZW1vdmluZyBsYXRlclxuICAgICAgLy8gbm9kZS5pbmRleCA9IGlkeDsgLy8gbmVjZXNzYXJ5P1xuICAgIFxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJvb3ROb2RlID0gaWQ7XG4gICAgfVxuXG4gICAgdGhpcy5ub2Rlc1tub2RlLmlkXSA9IG5vZGU7XG5cbiAgICAvLyBjb25zb2xlLmxvZyh0aGlzLm5vZGVzKTtcbiAgICByZXR1cm4gaWQ7XG4gIH1cblxuICAvLyByZW1vdmVzIGEgbm9kZSBmcm9tIHRoZSBzdHJ1Y3R1cmVcbiAgcmVtb3ZlKGl0ZW0pIHtcblxuICAgIC8vIGNsZWFyIG5vZGVzIG5vZGVzIGZyb20gdGhlIG5vZGVcbiAgICAvLyByZW1vdmUgbm9kZXMgZnJvbSB0aGUgZ3JhcGhcblxuICAgIC8vIG9ubHkgaWYgaXQgaGFzIG5vZGVzXG4gICAgaWYoaXRlbS5ub2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICBcbiAgICAgIC8vIHN1Ym5vZGVzXG4gICAgICBpdGVtLm5vZGVzLmZvckVhY2goaWQgPT4ge1xuICAgICAgICB2YXIgbm9kZSA9IHRoaXMuZ2V0KGlkKTtcbiAgICAgICAgdGhpcy5yZW1vdmUobm9kZSk7IC8vIHJlbW92ZSBzdWJub2Rlc1xuICAgICAgICBkZWxldGUgdGhpcy5ub2Rlc1tpZF07XG4gICAgICB9KTtcblxuICAgICAgaXRlbS5ub2RlcyA9IFtdOyAvLyByZXNldCBub2RlcyBjb250YWluZXJcbiAgICB9XG4gIH1cblxuICAvLyBncmFwaCBwaXBlLCBvbmx5IGFkZHMgbm9kZXMgaW50byB0aGUgcm9vdE5vZGVcbiAgcGlwZShjdG9yLCBvcHRpb25zID0ge30sIGlkID0gbnVsbCkge1xuICAgIHZhciBsZm8gPSBjdG9yKG9wdGlvbnMpO1xuICAgIHZhciBub2RlID0gbmV3IE5vZGUodGhpcywgbGZvKTtcbiAgIFxuICAgIHZhciBwYXJlbnQgPSB0aGlzLmdldCh0aGlzLnJvb3ROb2RlKTtcbiAgICBwYXJlbnQubGZvLmFkZChsZm8pO1xuICAgIHRoaXMuYWRkKHBhcmVudCwgbm9kZSwgaWQpO1xuXG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICBzdGFydCgpe1xuICAgIGZvcihsZXQga2V5IGluIHRoaXMubm9kZXMpIHtcbiAgICAgIHZhciBub2RlID0gdGhpcy5ub2Rlc1trZXldLmxmbztcbiAgICAgIGlmKCdzdGFydCcgaW4gbm9kZSkgbm9kZS5zdGFydCgpO1xuICAgIH1cbiAgfVxuXG4gIGdldChpZCkge1xuICAgIHJldHVybiB0aGlzLm5vZGVzW2lkXTtcbiAgfVxuXG4gIHRvU3RyaW5nKCl7XG4gICAgcmV0dXJuIHRoaXMubm9kZXM7XG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExmcEdyYXBoOyJdfQ==