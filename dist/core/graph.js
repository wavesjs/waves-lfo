/* DEPRECATED */
"use strict";

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var Node = (function () {
  function Node(graph, lfo) {
    _classCallCheck(this, Node);

    this.graph = graph;
    this.lfo = lfo;
    this.nodes = [];
  }

  _createClass(Node, [{
    key: 'pipe',
    value: function pipe(ctor) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var id = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

      var lfo = ctor(options);
      var nextNode = new Node(this.graph, lfo);

      this.lfo.add(lfo); // add to operators
      this.graph.add(this, nextNode, id); // add to graph: parent, child, id

      return nextNode;
    }
  }, {
    key: 'remove',
    value: function remove() {
      this.graph.remove(this);
      this.lfo.remove(this);
    }
  }]);

  return Node;
})();

var LfpGraph = (function () {
  function LfpGraph(ctor) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var id = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

    _classCallCheck(this, LfpGraph);

    if (!(this instanceof LfpGraph)) return new LfpGraph(ctor, options, id);

    this.nodes = {};
    this.typeCount = {};
    this.rootNode = null;

    var node = new Node(this, ctor(options));

    this.add(null, node, id);
  }

  // adds a node to the structure

  _createClass(LfpGraph, [{
    key: 'add',
    value: function add(parent, node) {
      var id = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

      id = id || node.lfo.type;
      this.typeCount[id] = this.typeCount[id] + 1 || 0;
      id = this.typeCount[id] === 0 ? id : id + '-' + this.typeCount[id];
      node.id = id; // to remove the node later

      if (parent) {
        // && this.nodes[parent.id]) {
        // debugging
        if (!this.nodes[parent.id]) console.error('Parent didnt register correctly');

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

    // removes a node from the structure
  }, {
    key: 'remove',
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

    // graph pipe, only adds nodes into the rootNode
  }, {
    key: 'pipe',
    value: function pipe(ctor) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var id = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

      var lfo = ctor(options);
      var node = new Node(this, lfo);

      var parent = this.get(this.rootNode);
      parent.lfo.add(lfo);
      this.add(parent, node, id);

      return node;
    }
  }, {
    key: 'start',
    value: function start() {
      for (var key in this.nodes) {
        var node = this.nodes[key].lfo;
        if ('start' in node) node.start();
      }
    }
  }, {
    key: 'get',
    value: function get(id) {
      return this.nodes[id];
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.nodes;
    }
  }]);

  return LfpGraph;
})();

module.exports = LfpGraph;
//# sourceMappingURL=data:application/json;base64,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V0FBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQ3pCLFlBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDO0FBQy9CLFlBQUksT0FBTyxJQUFJLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7T0FDbkM7S0FDRjs7O1dBRUUsYUFBQyxFQUFFLEVBQUU7QUFDTixhQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDdkI7OztXQUVPLG9CQUFFO0FBQ1IsYUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0tBQ25COzs7U0ExRkcsUUFBUTs7O0FBOEZkLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDIiwiZmlsZSI6ImVzNi9jb3JlL2dyYXBoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogREVQUkVDQVRFRCAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmNsYXNzIE5vZGUge1xuXG4gIGNvbnN0cnVjdG9yKGdyYXBoLCBsZm8pe1xuICAgIHRoaXMuZ3JhcGggPSBncmFwaDtcbiAgICB0aGlzLmxmbyA9IGxmbztcbiAgICB0aGlzLm5vZGVzID0gW107XG4gIH1cblxuICBwaXBlKGN0b3IsIG9wdGlvbnMgPSB7fSwgaWQgPSBudWxsKSB7XG4gICAgdmFyIGxmbyA9IGN0b3Iob3B0aW9ucyk7XG4gICAgdmFyIG5leHROb2RlID0gbmV3IE5vZGUodGhpcy5ncmFwaCwgbGZvKTtcblxuICAgIHRoaXMubGZvLmFkZChsZm8pOyAvLyBhZGQgdG8gb3BlcmF0b3JzXG4gICAgdGhpcy5ncmFwaC5hZGQodGhpcywgbmV4dE5vZGUsIGlkKTsgLy8gYWRkIHRvIGdyYXBoOiBwYXJlbnQsIGNoaWxkLCBpZFxuXG4gICAgcmV0dXJuIG5leHROb2RlO1xuICB9XG5cbiAgcmVtb3ZlKCl7XG4gICAgdGhpcy5ncmFwaC5yZW1vdmUodGhpcyk7XG4gICAgdGhpcy5sZm8ucmVtb3ZlKHRoaXMpO1xuICB9XG59XG5cblxuY2xhc3MgTGZwR3JhcGgge1xuXG4gIGNvbnN0cnVjdG9yKGN0b3IsIG9wdGlvbnMgPSB7fSwgaWQgPSBudWxsKSB7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIExmcEdyYXBoKSkgcmV0dXJuIG5ldyBMZnBHcmFwaChjdG9yLCBvcHRpb25zLCBpZCk7XG5cbiAgICB0aGlzLm5vZGVzID0ge307XG4gICAgdGhpcy50eXBlQ291bnQgPSB7fTtcbiAgICB0aGlzLnJvb3ROb2RlID0gbnVsbDtcblxuICAgIHZhciBub2RlID0gbmV3IE5vZGUodGhpcywgY3RvcihvcHRpb25zKSk7XG5cbiAgICB0aGlzLmFkZChudWxsLCBub2RlLCBpZCk7XG4gIH1cblxuICAvLyBhZGRzIGEgbm9kZSB0byB0aGUgc3RydWN0dXJlXG4gIGFkZChwYXJlbnQsIG5vZGUsIGlkID0gbnVsbCkge1xuICAgIGlkID0gaWQgfHwgbm9kZS5sZm8udHlwZTtcbiAgICB0aGlzLnR5cGVDb3VudFtpZF0gPSB0aGlzLnR5cGVDb3VudFtpZF0gKzEgfHwgMDtcbiAgICBpZCA9ICh0aGlzLnR5cGVDb3VudFtpZF0gPT09IDApPyBpZCA6IGAke2lkfS0ke3RoaXMudHlwZUNvdW50W2lkXX1gO1xuICAgIG5vZGUuaWQgPSBpZDsgLy8gdG8gcmVtb3ZlIHRoZSBub2RlIGxhdGVyXG5cbiAgICBpZihwYXJlbnQpeyAvLyAmJiB0aGlzLm5vZGVzW3BhcmVudC5pZF0pIHtcbiAgICAgIC8vIGRlYnVnZ2luZ1xuICAgICAgaWYoIXRoaXMubm9kZXNbcGFyZW50LmlkXSkgY29uc29sZS5lcnJvcignUGFyZW50IGRpZG50IHJlZ2lzdGVyIGNvcnJlY3RseScpO1xuXG4gICAgICAvLyBmZXRjaCBwYXJlbnQgbm9kZVxuICAgICAgdmFyIHAgPSB0aGlzLmdldChwYXJlbnQuaWQpO1xuXG4gICAgICAvLyBhZGQgbm9kZSBhcyBub2RlcyBpbiB0aGUgZ3JhcGhcbiAgICAgIHAubm9kZXMucHVzaChub2RlLmlkKTtcblxuICAgICAgLy8gcmVtb3ZpbmcgbG9naWMsIGNsZWFuIHVwIHdoZW4gY29kZSBpcyByZWFkeVxuICAgICAgLy8gbm9kZS5wYXJlbnQgPSBwLmxmbzsgLy8gYmluZCB0aGUgcGFybnQgZm9yIHJlbW92aW5nIGxhdGVyXG4gICAgICAvLyBub2RlLmluZGV4ID0gaWR4OyAvLyBuZWNlc3Nhcnk/XG5cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yb290Tm9kZSA9IGlkO1xuICAgIH1cblxuICAgIHRoaXMubm9kZXNbbm9kZS5pZF0gPSBub2RlO1xuXG4gICAgLy8gY29uc29sZS5sb2codGhpcy5ub2Rlcyk7XG4gICAgcmV0dXJuIGlkO1xuICB9XG5cbiAgLy8gcmVtb3ZlcyBhIG5vZGUgZnJvbSB0aGUgc3RydWN0dXJlXG4gIHJlbW92ZShpdGVtKSB7XG5cbiAgICAvLyBjbGVhciBub2RlcyBub2RlcyBmcm9tIHRoZSBub2RlXG4gICAgLy8gcmVtb3ZlIG5vZGVzIGZyb20gdGhlIGdyYXBoXG5cbiAgICAvLyBvbmx5IGlmIGl0IGhhcyBub2Rlc1xuICAgIGlmKGl0ZW0ubm9kZXMubGVuZ3RoID4gMCkge1xuXG4gICAgICAvLyBzdWJub2Rlc1xuICAgICAgaXRlbS5ub2Rlcy5mb3JFYWNoKGlkID0+IHtcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzLmdldChpZCk7XG4gICAgICAgIHRoaXMucmVtb3ZlKG5vZGUpOyAvLyByZW1vdmUgc3Vibm9kZXNcbiAgICAgICAgZGVsZXRlIHRoaXMubm9kZXNbaWRdO1xuICAgICAgfSk7XG5cbiAgICAgIGl0ZW0ubm9kZXMgPSBbXTsgLy8gcmVzZXQgbm9kZXMgY29udGFpbmVyXG4gICAgfVxuICB9XG5cbiAgLy8gZ3JhcGggcGlwZSwgb25seSBhZGRzIG5vZGVzIGludG8gdGhlIHJvb3ROb2RlXG4gIHBpcGUoY3Rvciwgb3B0aW9ucyA9IHt9LCBpZCA9IG51bGwpIHtcbiAgICB2YXIgbGZvID0gY3RvcihvcHRpb25zKTtcbiAgICB2YXIgbm9kZSA9IG5ldyBOb2RlKHRoaXMsIGxmbyk7XG5cbiAgICB2YXIgcGFyZW50ID0gdGhpcy5nZXQodGhpcy5yb290Tm9kZSk7XG4gICAgcGFyZW50Lmxmby5hZGQobGZvKTtcbiAgICB0aGlzLmFkZChwYXJlbnQsIG5vZGUsIGlkKTtcblxuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgc3RhcnQoKXtcbiAgICBmb3IobGV0IGtleSBpbiB0aGlzLm5vZGVzKSB7XG4gICAgICB2YXIgbm9kZSA9IHRoaXMubm9kZXNba2V5XS5sZm87XG4gICAgICBpZiAoJ3N0YXJ0JyBpbiBub2RlKSBub2RlLnN0YXJ0KCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0KGlkKSB7XG4gICAgcmV0dXJuIHRoaXMubm9kZXNbaWRdO1xuICB9XG5cbiAgdG9TdHJpbmcoKXtcbiAgICByZXR1cm4gdGhpcy5ub2RlcztcbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gTGZwR3JhcGg7Il19