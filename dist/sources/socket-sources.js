"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var Lfo = require("../core/lfo-base");
var WebSocketServer = require("ws").Server;

var _require = require("../utils/socket-utils");

var encodeMessage = _require.encodeMessage;
var decodeMessage = _require.decodeMessage;

var SocketSourceServer = (function () {
  function SocketSourceServer(options) {
    _classCallCheck(this, SocketSourceServer);

    var defaults = {
      port: 3030
    };

    _get(_core.Object.getPrototypeOf(SocketSourceServer.prototype), "constructor", this).call(this, null, options, defaults);

    this.initServer();
  }

  _createClass(SocketSourceServer, {
    initServer: {
      value: function initServer() {
        var _this = this;

        this.server = new WebSocketServer({ port: this.params.port });

        this.server.on("connection", function (socket) {
          _this.clients.push(socket);
        });
      }
    },
    process: {
      value: function process(buffer) {
        var message = decodeMessage(buffer);

        this.time = message.time;
        this.frame = message.frame;
        this.metaData = message.metaData;

        this.output();
      }
    }
  });

  return SocketSourceServer;
})();

module.exports = {
  SocketSourceServer: SocketSourceServer
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL3NvY2tldC1zb3VyY2VzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFFQSxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUN0QyxJQUFJLGVBQWUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDOztlQUNKLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQzs7SUFBakUsYUFBYSxZQUFiLGFBQWE7SUFBRSxhQUFhLFlBQWIsYUFBYTs7SUFFNUIsa0JBQWtCO0FBQ1gsV0FEUCxrQkFBa0IsQ0FDVixPQUFPLEVBQUU7MEJBRGpCLGtCQUFrQjs7QUFFcEIsUUFBSSxRQUFRLEdBQUc7QUFDYixVQUFJLEVBQUUsSUFBSTtLQUNYLENBQUM7O0FBRUYscUNBTkUsa0JBQWtCLDZDQU1kLElBQUksRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFOztBQUUvQixRQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7R0FDbkI7O2VBVEcsa0JBQWtCO0FBV3RCLGNBQVU7YUFBQSxzQkFBRzs7O0FBQ1gsWUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGVBQWUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7O0FBRTlELFlBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxVQUFBLE1BQU0sRUFBSTtBQUNyQyxnQkFBSyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzNCLENBQUMsQ0FBQztPQUNKOztBQUVELFdBQU87YUFBQSxpQkFBQyxNQUFNLEVBQUU7QUFDZCxZQUFJLE9BQU8sR0FBRyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRXBDLFlBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztBQUN6QixZQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7QUFDM0IsWUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDOztBQUVqQyxZQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7T0FDZjs7OztTQTNCRyxrQkFBa0I7OztBQThCeEIsTUFBTSxDQUFDLE9BQU8sR0FBRztBQUNmLG9CQUFrQixFQUFFLGtCQUFrQjtDQUN2QyxDQUFDIiwiZmlsZSI6ImVzNi9zb3VyY2VzL3NvY2tldC1zb3VyY2VzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgTGZvID0gcmVxdWlyZSgnLi4vY29yZS9sZm8tYmFzZScpO1xudmFyIFdlYlNvY2tldFNlcnZlciA9IHJlcXVpcmUoJ3dzJykuU2VydmVyO1xudmFyIHsgZW5jb2RlTWVzc2FnZSwgZGVjb2RlTWVzc2FnZSB9ID0gcmVxdWlyZSgnLi4vdXRpbHMvc29ja2V0LXV0aWxzJyk7XG5cbmNsYXNzIFNvY2tldFNvdXJjZVNlcnZlciB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICBwb3J0OiAzMDMwXG4gICAgfTtcblxuICAgIHN1cGVyKG51bGwsIG9wdGlvbnMsIGRlZmF1bHRzKTtcblxuICAgIHRoaXMuaW5pdFNlcnZlcigpO1xuICB9XG5cbiAgaW5pdFNlcnZlcigpIHtcbiAgICB0aGlzLnNlcnZlciA9IG5ldyBXZWJTb2NrZXRTZXJ2ZXIoeyBwb3J0OiB0aGlzLnBhcmFtcy5wb3J0IH0pO1xuXG4gICAgdGhpcy5zZXJ2ZXIub24oJ2Nvbm5lY3Rpb24nLCBzb2NrZXQgPT4ge1xuICAgICAgdGhpcy5jbGllbnRzLnB1c2goc29ja2V0KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByb2Nlc3MoYnVmZmVyKSB7XG4gICAgdmFyIG1lc3NhZ2UgPSBkZWNvZGVNZXNzYWdlKGJ1ZmZlcik7XG5cbiAgICB0aGlzLnRpbWUgPSBtZXNzYWdlLnRpbWU7XG4gICAgdGhpcy5mcmFtZSA9IG1lc3NhZ2UuZnJhbWU7XG4gICAgdGhpcy5tZXRhRGF0YSA9IG1lc3NhZ2UubWV0YURhdGE7XG5cbiAgICB0aGlzLm91dHB1dCgpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBTb2NrZXRTb3VyY2VTZXJ2ZXI6IFNvY2tldFNvdXJjZVNlcnZlclxufTsiXX0=