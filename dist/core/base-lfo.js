'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var id = 0;

var BaseLfo = function () {
  /**
   * @todo - reverse arguments order, is weird
   */

  function BaseLfo() {
    var defaults = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    (0, _classCallCheck3.default)(this, BaseLfo);

    this.cid = id++;
    this.params = {};

    this.streamParams = {
      frameSize: 1,
      frameRate: 0,
      sourceSampleRate: 0
    };

    this.params = (0, _assign2.default)({}, defaults, options);
    this.children = [];

    // stream data
    this.time = 0;
    this.outFrame = null;
    this.metaData = {};
  }

  // WebAudioAPI `connect` like method


  (0, _createClass3.default)(BaseLfo, [{
    key: 'connect',
    value: function connect(child) {
      if (this.streamParams === null) {
        throw new Error('cannot connect to a dead lfo node');
      }

      this.children.push(child);
      child.parent = this;
    }

    // define if suffiscient

  }, {
    key: 'disconnect',
    value: function disconnect() {
      // remove itself from parent children
      var index = this.parent.children.indexOf(this);
      this.parent.children.splice(index, 1);
      // this.parent = null;
      // this.children = null;
    }

    // initialize the current node stream and propagate to it's children

  }, {
    key: 'initialize',
    value: function initialize() {
      var inStreamParams = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var outStreamParams = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      (0, _assign2.default)(this.streamParams, inStreamParams, outStreamParams);

      // create the `outFrame` arrayBuffer
      this.setupStream();

      // propagate initialization in lfo chain
      for (var i = 0, l = this.children.length; i < l; i++) {
        this.children[i].initialize(this.streamParams);
      }
    }

    /**
     * create the outputFrame according to the `streamParams`
     */

  }, {
    key: 'setupStream',
    value: function setupStream() {
      var frameSize = this.streamParams.frameSize;

      if (frameSize > 0) this.outFrame = new Float32Array(frameSize);
    }

    // reset `outFrame` and call reset on children

  }, {
    key: 'reset',
    value: function reset() {
      for (var i = 0, l = this.children.length; i < l; i++) {
        this.children[i].reset();
      }

      // sinks have no `outFrame`
      if (!this.outFrame) {
        return;
      }

      // this.outFrame.fill(0); // probably better but doesn't work yet
      for (var _i = 0, _l = this.outFrame.length; _i < _l; _i++) {
        this.outFrame[_i] = 0;
      }
    }

    // finalize stream

  }, {
    key: 'finalize',
    value: function finalize(endTime) {
      for (var i = 0, l = this.children.length; i < l; i++) {
        this.children[i].finalize(endTime);
      }
    }

    // forward the current state (time, frame, metaData) to all the children

  }, {
    key: 'output',
    value: function output() {
      var time = arguments.length <= 0 || arguments[0] === undefined ? this.time : arguments[0];
      var outFrame = arguments.length <= 1 || arguments[1] === undefined ? this.outFrame : arguments[1];
      var metaData = arguments.length <= 2 || arguments[2] === undefined ? this.metaData : arguments[2];

      for (var i = 0, l = this.children.length; i < l; i++) {
        this.children[i].process(time, outFrame, metaData);
      }
    }

    // main function to override, defaults to noop

  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      this.time = time;
      this.outFrame = frame;
      this.metaData = metaData;

      this.output();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      // call `destroy` in all it's children
      var index = this.children.length;

      while (index--) {
        this.children[index].destroy();
      }

      // delete itself from the parent node
      if (this.parent) {
        var _index = this.parent.children.indexOf(this);
        this.parent.children.splice(_index, 1);
      }

      // cannot use a dead object as parent
      this.streamParams = null;

      // clean it's own references / disconnect audio nodes if needed
    }
  }]);
  return BaseLfo;
}();

exports.default = BaseLfo;
//# sourceMappingURL=data:application/json;base64,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QUF0RDs7Ozs7Ozs2QkFNMkU7VUFBdEUsNkRBQU8sS0FBSyxJQUFMLGdCQUErRDtVQUFwRCxpRUFBVyxLQUFLLFFBQUwsZ0JBQXlDO1VBQTFCLGlFQUFXLEtBQUssUUFBTCxnQkFBZTs7QUFDM0UsV0FBSyxJQUFJLElBQUksQ0FBSixFQUFPLElBQUksS0FBSyxRQUFMLENBQWMsTUFBZCxFQUFzQixJQUFJLENBQUosRUFBTyxHQUFqRCxFQUFzRDtBQUNwRCxhQUFLLFFBQUwsQ0FBYyxDQUFkLEVBQWlCLE9BQWpCLENBQXlCLElBQXpCLEVBQStCLFFBQS9CLEVBQXlDLFFBQXpDLEVBRG9EO09BQXREOzs7Ozs7OzRCQU1NLE1BQU0sT0FBTyxVQUFVO0FBQzdCLFdBQUssSUFBTCxHQUFZLElBQVosQ0FENkI7QUFFN0IsV0FBSyxRQUFMLEdBQWdCLEtBQWhCLENBRjZCO0FBRzdCLFdBQUssUUFBTCxHQUFnQixRQUFoQixDQUg2Qjs7QUFLN0IsV0FBSyxNQUFMLEdBTDZCOzs7OzhCQVFyQjs7QUFFUixVQUFJLFFBQVEsS0FBSyxRQUFMLENBQWMsTUFBZCxDQUZKOztBQUlSLGFBQU8sT0FBUCxFQUFnQjtBQUNkLGFBQUssUUFBTCxDQUFjLEtBQWQsRUFBcUIsT0FBckIsR0FEYztPQUFoQjs7O0FBSlEsVUFTSixLQUFLLE1BQUwsRUFBYTtBQUNmLFlBQU0sU0FBUyxLQUFLLE1BQUwsQ0FBWSxRQUFaLENBQXFCLE9BQXJCLENBQTZCLElBQTdCLENBQVQsQ0FEUztBQUVmLGFBQUssTUFBTCxDQUFZLFFBQVosQ0FBcUIsTUFBckIsQ0FBNEIsTUFBNUIsRUFBbUMsQ0FBbkMsRUFGZTtPQUFqQjs7O0FBVFEsVUFlUixDQUFLLFlBQUwsR0FBb0IsSUFBcEI7OztBQWZROztTQXZHUyIsImZpbGUiOiJiYXNlLWxmby5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBpZCA9IDA7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VMZm8ge1xuICAvKipcbiAgICogQHRvZG8gLSByZXZlcnNlIGFyZ3VtZW50cyBvcmRlciwgaXMgd2VpcmRcbiAgICovXG4gIGNvbnN0cnVjdG9yKGRlZmF1bHRzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuY2lkID0gaWQrKztcbiAgICB0aGlzLnBhcmFtcyA9IHt9O1xuXG4gICAgdGhpcy5zdHJlYW1QYXJhbXMgPSB7XG4gICAgICBmcmFtZVNpemU6IDEsXG4gICAgICBmcmFtZVJhdGU6IDAsXG4gICAgICBzb3VyY2VTYW1wbGVSYXRlOiAwXG4gICAgfTtcblxuICAgIHRoaXMucGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcblxuICAgIC8vIHN0cmVhbSBkYXRhXG4gICAgdGhpcy50aW1lID0gMDtcbiAgICB0aGlzLm91dEZyYW1lID0gbnVsbDtcbiAgICB0aGlzLm1ldGFEYXRhID0ge307XG4gIH1cblxuICAvLyBXZWJBdWRpb0FQSSBgY29ubmVjdGAgbGlrZSBtZXRob2RcbiAgY29ubmVjdChjaGlsZCkge1xuICAgIGlmICh0aGlzLnN0cmVhbVBhcmFtcyA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdjYW5ub3QgY29ubmVjdCB0byBhIGRlYWQgbGZvIG5vZGUnKTtcbiAgICB9XG5cbiAgICB0aGlzLmNoaWxkcmVuLnB1c2goY2hpbGQpO1xuICAgIGNoaWxkLnBhcmVudCA9IHRoaXM7XG4gIH1cblxuICAvLyBkZWZpbmUgaWYgc3VmZmlzY2llbnRcbiAgZGlzY29ubmVjdCgpIHtcbiAgICAvLyByZW1vdmUgaXRzZWxmIGZyb20gcGFyZW50IGNoaWxkcmVuXG4gICAgY29uc3QgaW5kZXggPSB0aGlzLnBhcmVudC5jaGlsZHJlbi5pbmRleE9mKHRoaXMpO1xuICAgIHRoaXMucGFyZW50LmNoaWxkcmVuLnNwbGljZShpbmRleCwgMSk7XG4gICAgLy8gdGhpcy5wYXJlbnQgPSBudWxsO1xuICAgIC8vIHRoaXMuY2hpbGRyZW4gPSBudWxsO1xuICB9XG5cbiAgLy8gaW5pdGlhbGl6ZSB0aGUgY3VycmVudCBub2RlIHN0cmVhbSBhbmQgcHJvcGFnYXRlIHRvIGl0J3MgY2hpbGRyZW5cbiAgaW5pdGlhbGl6ZShpblN0cmVhbVBhcmFtcyA9IHt9LCBvdXRTdHJlYW1QYXJhbXMgPSB7fSkge1xuICAgIE9iamVjdC5hc3NpZ24odGhpcy5zdHJlYW1QYXJhbXMsIGluU3RyZWFtUGFyYW1zLCBvdXRTdHJlYW1QYXJhbXMpO1xuXG4gICAgLy8gY3JlYXRlIHRoZSBgb3V0RnJhbWVgIGFycmF5QnVmZmVyXG4gICAgdGhpcy5zZXR1cFN0cmVhbSgpO1xuXG4gICAgLy8gcHJvcGFnYXRlIGluaXRpYWxpemF0aW9uIGluIGxmbyBjaGFpblxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHRoaXMuY2hpbGRyZW5baV0uaW5pdGlhbGl6ZSh0aGlzLnN0cmVhbVBhcmFtcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIGNyZWF0ZSB0aGUgb3V0cHV0RnJhbWUgYWNjb3JkaW5nIHRvIHRoZSBgc3RyZWFtUGFyYW1zYFxuICAgKi9cbiAgc2V0dXBTdHJlYW0oKSB7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuXG4gICAgaWYoZnJhbWVTaXplID4gMClcbiAgICAgIHRoaXMub3V0RnJhbWUgPSBuZXcgRmxvYXQzMkFycmF5KGZyYW1lU2l6ZSk7XG4gIH1cblxuICAvLyByZXNldCBgb3V0RnJhbWVgIGFuZCBjYWxsIHJlc2V0IG9uIGNoaWxkcmVuXG4gIHJlc2V0KCkge1xuICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHRoaXMuY2hpbGRyZW5baV0ucmVzZXQoKTtcbiAgICB9XG5cbiAgICAvLyBzaW5rcyBoYXZlIG5vIGBvdXRGcmFtZWBcbiAgICBpZiAoIXRoaXMub3V0RnJhbWUpIHsgcmV0dXJuIH1cblxuICAgIC8vIHRoaXMub3V0RnJhbWUuZmlsbCgwKTsgLy8gcHJvYmFibHkgYmV0dGVyIGJ1dCBkb2Vzbid0IHdvcmsgeWV0XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLm91dEZyYW1lLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdGhpcy5vdXRGcmFtZVtpXSA9IDA7XG4gICAgfVxuICB9XG5cbiAgLy8gZmluYWxpemUgc3RyZWFtXG4gIGZpbmFsaXplKGVuZFRpbWUpIHtcbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB0aGlzLmNoaWxkcmVuW2ldLmZpbmFsaXplKGVuZFRpbWUpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGZvcndhcmQgdGhlIGN1cnJlbnQgc3RhdGUgKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkgdG8gYWxsIHRoZSBjaGlsZHJlblxuICBvdXRwdXQodGltZSA9IHRoaXMudGltZSwgb3V0RnJhbWUgPSB0aGlzLm91dEZyYW1lLCBtZXRhRGF0YSA9IHRoaXMubWV0YURhdGEpIHtcbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB0aGlzLmNoaWxkcmVuW2ldLnByb2Nlc3ModGltZSwgb3V0RnJhbWUsIG1ldGFEYXRhKTtcbiAgICB9XG4gIH1cblxuICAvLyBtYWluIGZ1bmN0aW9uIHRvIG92ZXJyaWRlLCBkZWZhdWx0cyB0byBub29wXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgdGhpcy50aW1lID0gdGltZTtcbiAgICB0aGlzLm91dEZyYW1lID0gZnJhbWU7XG4gICAgdGhpcy5tZXRhRGF0YSA9IG1ldGFEYXRhO1xuXG4gICAgdGhpcy5vdXRwdXQoKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgLy8gY2FsbCBgZGVzdHJveWAgaW4gYWxsIGl0J3MgY2hpbGRyZW5cbiAgICBsZXQgaW5kZXggPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDtcblxuICAgIHdoaWxlIChpbmRleC0tKSB7XG4gICAgICB0aGlzLmNoaWxkcmVuW2luZGV4XS5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgLy8gZGVsZXRlIGl0c2VsZiBmcm9tIHRoZSBwYXJlbnQgbm9kZVxuICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgY29uc3QgaW5kZXggPSAgdGhpcy5wYXJlbnQuY2hpbGRyZW4uaW5kZXhPZih0aGlzKTtcbiAgICAgIHRoaXMucGFyZW50LmNoaWxkcmVuLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuXG4gICAgLy8gY2Fubm90IHVzZSBhIGRlYWQgb2JqZWN0IGFzIHBhcmVudFxuICAgIHRoaXMuc3RyZWFtUGFyYW1zID0gbnVsbDtcblxuICAgIC8vIGNsZWFuIGl0J3Mgb3duIHJlZmVyZW5jZXMgLyBkaXNjb25uZWN0IGF1ZGlvIG5vZGVzIGlmIG5lZWRlZFxuICB9XG59XG4iXX0=