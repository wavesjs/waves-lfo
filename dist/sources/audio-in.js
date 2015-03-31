"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var Lfo = require("../core/lfo-base");
var audioContext; // for lazy audioContext creation

var AudioIn = (function (_Lfo) {
  function AudioIn() {
    var options = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, AudioIn);

    // this.type = 'audio-in';

    // defaults
    var defaults = {
      frameSize: 512,
      // blockSize: 2048,
      // hopSize: 512,
      channel: 0
    };

    _get(_core.Object.getPrototypeOf(AudioIn.prototype), "constructor", this).call(this, options, defaults);

    // private
    if (!this.params.ctx) {
      audioContext = new AudioContext();
      this.ctx = audioContext;
    } else {
      this.ctx = this.params.ctx;
    }

    this.src = this.params.src;
    this.time = 0;
    this.metaData = {};
  }

  _inherits(AudioIn, _Lfo);

  _createClass(AudioIn, {
    start: {

      // configureStream() {

      // }

      value: function start() {}
    },
    stop: {
      value: function stop() {}
    }
  });

  return AudioIn;
})(Lfo);

module.exports = AudioIn;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL2F1ZGlvLWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUdBLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ3RDLElBQUksWUFBWSxDQUFDOztJQUVYLE9BQU87QUFFQSxXQUZQLE9BQU8sR0FFZTtRQUFkLE9BQU8sZ0NBQUcsRUFBRTs7MEJBRnBCLE9BQU87Ozs7O0FBTVQsUUFBSSxRQUFRLEdBQUc7QUFDYixlQUFTLEVBQUUsR0FBRzs7O0FBR2QsYUFBTyxFQUFFLENBQUM7S0FDWCxDQUFDOztBQUVGLHFDQWJFLE9BQU8sNkNBYUgsT0FBTyxFQUFFLFFBQVEsRUFBRTs7O0FBR3pCLFFBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRTtBQUNwQixrQkFBWSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7QUFDbEMsVUFBSSxDQUFDLEdBQUcsR0FBRyxZQUFZLENBQUM7S0FDekIsTUFBTTtBQUNMLFVBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7S0FDNUI7O0FBRUQsUUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztBQUMzQixRQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztBQUNkLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0dBQ3BCOztZQTFCRyxPQUFPOztlQUFQLE9BQU87QUFnQ1gsU0FBSzs7Ozs7O2FBQUEsaUJBQUcsRUFBRTs7QUFDVixRQUFJO2FBQUEsZ0JBQUcsRUFBRTs7OztTQWpDTCxPQUFPO0dBQVMsR0FBRzs7QUFvQ3pCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDIiwiZmlsZSI6ImVzNi9zb3VyY2VzL2F1ZGlvLWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIExmbyA9IHJlcXVpcmUoJy4uL2NvcmUvbGZvLWJhc2UnKTtcbnZhciBhdWRpb0NvbnRleHQ7IC8vIGZvciBsYXp5IGF1ZGlvQ29udGV4dCBjcmVhdGlvblxuXG5jbGFzcyBBdWRpb0luIGV4dGVuZHMgTGZvIHtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAvLyB0aGlzLnR5cGUgPSAnYXVkaW8taW4nO1xuXG4gICAgLy8gZGVmYXVsdHNcbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICBmcmFtZVNpemU6IDUxMixcbiAgICAgIC8vIGJsb2NrU2l6ZTogMjA0OCxcbiAgICAgIC8vIGhvcFNpemU6IDUxMixcbiAgICAgIGNoYW5uZWw6IDBcbiAgICB9O1xuXG4gICAgc3VwZXIob3B0aW9ucywgZGVmYXVsdHMpO1xuXG4gICAgLy8gcHJpdmF0ZVxuICAgIGlmICghdGhpcy5wYXJhbXMuY3R4KSB7XG4gICAgICBhdWRpb0NvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KCk7XG4gICAgICB0aGlzLmN0eCA9IGF1ZGlvQ29udGV4dDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jdHggPSB0aGlzLnBhcmFtcy5jdHg7XG4gICAgfVxuXG4gICAgdGhpcy5zcmMgPSB0aGlzLnBhcmFtcy5zcmM7XG4gICAgdGhpcy50aW1lID0gMDtcbiAgICB0aGlzLm1ldGFEYXRhID0ge307XG4gIH1cblxuICAvLyBjb25maWd1cmVTdHJlYW0oKSB7XG5cbiAgLy8gfVxuXG4gIHN0YXJ0KCkge31cbiAgc3RvcCgpIHt9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQXVkaW9JbjtcbiJdfQ==