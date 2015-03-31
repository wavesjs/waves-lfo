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
/* DEPRECATED */
//# sourceMappingURL=data:application/json;base64,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LGVBQU8sSUFBSSxDQUFDO09BQ2I7O0FBRUQsU0FBSzthQUFBLGlCQUFFO0FBQ0wsYUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQ3pCLGNBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDO0FBQy9CLGNBQUksT0FBTyxJQUFJLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDbkM7T0FDRjs7QUFFRCxPQUFHO2FBQUEsYUFBQyxFQUFFLEVBQUU7QUFDTixlQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7T0FDdkI7O0FBRUQsWUFBUTthQUFBLG9CQUFFO0FBQ1IsZUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDO09BQ25COzs7O1NBMUZHLFFBQVE7OztBQThGZCxNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyIsImZpbGUiOiJlczYvY29yZS9ncmFwaC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIERFUFJFQ0FURUQgKi9cblwidXNlIHN0cmljdFwiO1xuXG5jbGFzcyBOb2RlIHtcblxuICBjb25zdHJ1Y3RvcihncmFwaCwgbGZvKXtcbiAgICB0aGlzLmdyYXBoID0gZ3JhcGg7XG4gICAgdGhpcy5sZm8gPSBsZm87XG4gICAgdGhpcy5ub2RlcyA9IFtdO1xuICB9XG5cbiAgcGlwZShjdG9yLCBvcHRpb25zID0ge30sIGlkID0gbnVsbCkge1xuICAgIHZhciBsZm8gPSBjdG9yKG9wdGlvbnMpO1xuICAgIHZhciBuZXh0Tm9kZSA9IG5ldyBOb2RlKHRoaXMuZ3JhcGgsIGxmbyk7XG5cbiAgICB0aGlzLmxmby5hZGQobGZvKTsgLy8gYWRkIHRvIG9wZXJhdG9yc1xuICAgIHRoaXMuZ3JhcGguYWRkKHRoaXMsIG5leHROb2RlLCBpZCk7IC8vIGFkZCB0byBncmFwaDogcGFyZW50LCBjaGlsZCwgaWRcblxuICAgIHJldHVybiBuZXh0Tm9kZTtcbiAgfVxuXG4gIHJlbW92ZSgpe1xuICAgIHRoaXMuZ3JhcGgucmVtb3ZlKHRoaXMpO1xuICAgIHRoaXMubGZvLnJlbW92ZSh0aGlzKTtcbiAgfVxufVxuXG5cbmNsYXNzIExmcEdyYXBoIHtcblxuICBjb25zdHJ1Y3RvcihjdG9yLCBvcHRpb25zID0ge30sIGlkID0gbnVsbCkge1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBMZnBHcmFwaCkpIHJldHVybiBuZXcgTGZwR3JhcGgoY3Rvciwgb3B0aW9ucywgaWQpO1xuXG4gICAgdGhpcy5ub2RlcyA9IHt9O1xuICAgIHRoaXMudHlwZUNvdW50ID0ge307XG4gICAgdGhpcy5yb290Tm9kZSA9IG51bGw7XG5cbiAgICB2YXIgbm9kZSA9IG5ldyBOb2RlKHRoaXMsIGN0b3Iob3B0aW9ucykpO1xuXG4gICAgdGhpcy5hZGQobnVsbCwgbm9kZSwgaWQpO1xuICB9XG5cbiAgLy8gYWRkcyBhIG5vZGUgdG8gdGhlIHN0cnVjdHVyZVxuICBhZGQocGFyZW50LCBub2RlLCBpZCA9IG51bGwpIHtcbiAgICBpZCA9IGlkIHx8IG5vZGUubGZvLnR5cGU7XG4gICAgdGhpcy50eXBlQ291bnRbaWRdID0gdGhpcy50eXBlQ291bnRbaWRdICsxIHx8IDA7XG4gICAgaWQgPSAodGhpcy50eXBlQ291bnRbaWRdID09PSAwKT8gaWQgOiBgJHtpZH0tJHt0aGlzLnR5cGVDb3VudFtpZF19YDtcbiAgICBub2RlLmlkID0gaWQ7IC8vIHRvIHJlbW92ZSB0aGUgbm9kZSBsYXRlclxuXG4gICAgaWYocGFyZW50KXsgLy8gJiYgdGhpcy5ub2Rlc1twYXJlbnQuaWRdKSB7XG4gICAgICAvLyBkZWJ1Z2dpbmdcbiAgICAgIGlmKCF0aGlzLm5vZGVzW3BhcmVudC5pZF0pIGNvbnNvbGUuZXJyb3IoJ1BhcmVudCBkaWRudCByZWdpc3RlciBjb3JyZWN0bHknKTtcblxuICAgICAgLy8gZmV0Y2ggcGFyZW50IG5vZGVcbiAgICAgIHZhciBwID0gdGhpcy5nZXQocGFyZW50LmlkKTtcblxuICAgICAgLy8gYWRkIG5vZGUgYXMgbm9kZXMgaW4gdGhlIGdyYXBoXG4gICAgICBwLm5vZGVzLnB1c2gobm9kZS5pZCk7XG5cbiAgICAgIC8vIHJlbW92aW5nIGxvZ2ljLCBjbGVhbiB1cCB3aGVuIGNvZGUgaXMgcmVhZHlcbiAgICAgIC8vIG5vZGUucGFyZW50ID0gcC5sZm87IC8vIGJpbmQgdGhlIHBhcm50IGZvciByZW1vdmluZyBsYXRlclxuICAgICAgLy8gbm9kZS5pbmRleCA9IGlkeDsgLy8gbmVjZXNzYXJ5P1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucm9vdE5vZGUgPSBpZDtcbiAgICB9XG5cbiAgICB0aGlzLm5vZGVzW25vZGUuaWRdID0gbm9kZTtcblxuICAgIC8vIGNvbnNvbGUubG9nKHRoaXMubm9kZXMpO1xuICAgIHJldHVybiBpZDtcbiAgfVxuXG4gIC8vIHJlbW92ZXMgYSBub2RlIGZyb20gdGhlIHN0cnVjdHVyZVxuICByZW1vdmUoaXRlbSkge1xuXG4gICAgLy8gY2xlYXIgbm9kZXMgbm9kZXMgZnJvbSB0aGUgbm9kZVxuICAgIC8vIHJlbW92ZSBub2RlcyBmcm9tIHRoZSBncmFwaFxuXG4gICAgLy8gb25seSBpZiBpdCBoYXMgbm9kZXNcbiAgICBpZihpdGVtLm5vZGVzLmxlbmd0aCA+IDApIHtcblxuICAgICAgLy8gc3Vibm9kZXNcbiAgICAgIGl0ZW0ubm9kZXMuZm9yRWFjaChpZCA9PiB7XG4gICAgICAgIHZhciBub2RlID0gdGhpcy5nZXQoaWQpO1xuICAgICAgICB0aGlzLnJlbW92ZShub2RlKTsgLy8gcmVtb3ZlIHN1Ym5vZGVzXG4gICAgICAgIGRlbGV0ZSB0aGlzLm5vZGVzW2lkXTtcbiAgICAgIH0pO1xuXG4gICAgICBpdGVtLm5vZGVzID0gW107IC8vIHJlc2V0IG5vZGVzIGNvbnRhaW5lclxuICAgIH1cbiAgfVxuXG4gIC8vIGdyYXBoIHBpcGUsIG9ubHkgYWRkcyBub2RlcyBpbnRvIHRoZSByb290Tm9kZVxuICBwaXBlKGN0b3IsIG9wdGlvbnMgPSB7fSwgaWQgPSBudWxsKSB7XG4gICAgdmFyIGxmbyA9IGN0b3Iob3B0aW9ucyk7XG4gICAgdmFyIG5vZGUgPSBuZXcgTm9kZSh0aGlzLCBsZm8pO1xuXG4gICAgdmFyIHBhcmVudCA9IHRoaXMuZ2V0KHRoaXMucm9vdE5vZGUpO1xuICAgIHBhcmVudC5sZm8uYWRkKGxmbyk7XG4gICAgdGhpcy5hZGQocGFyZW50LCBub2RlLCBpZCk7XG5cbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIHN0YXJ0KCl7XG4gICAgZm9yKGxldCBrZXkgaW4gdGhpcy5ub2Rlcykge1xuICAgICAgdmFyIG5vZGUgPSB0aGlzLm5vZGVzW2tleV0ubGZvO1xuICAgICAgaWYgKCdzdGFydCcgaW4gbm9kZSkgbm9kZS5zdGFydCgpO1xuICAgIH1cbiAgfVxuXG4gIGdldChpZCkge1xuICAgIHJldHVybiB0aGlzLm5vZGVzW2lkXTtcbiAgfVxuXG4gIHRvU3RyaW5nKCl7XG4gICAgcmV0dXJuIHRoaXMubm9kZXM7XG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExmcEdyYXBoOyJdfQ==