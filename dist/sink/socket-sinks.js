"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _core = require("babel-runtime/core-js")["default"];

var Lfo = require("../core/lfo-base");

var _require = require("../utils/socket-utils");

var encodeMessage = _require.encodeMessage;
var decodeMessage = _require.decodeMessage;

var SocketSynk = (function () {
  function SocketSynk() {
    _classCallCheck(this, SocketSynk);
  }

  _createClass(SocketSynk, {
    formatMessage: {

      // prepare the buffer to send over the network

      value: function formatMessage() {}
    },
    routeMessage: {

      // onmessage callback
      // dispatch handchecks and data message

      value: function routeMessage() {}
    }
  });

  return SocketSynk;
})();

// send an Lfo stream from the browser over the network
// throught a WebSocket - should be paired with a SocketSourceServer
// @NOTE: does it need to implement some ping process to maintain connection ?

var SocketSyncClient = (function (_Lfo) {
  function SocketSyncClient(previous, options) {
    _classCallCheck(this, SocketSyncClient);

    var defaults = {
      port: 3030,
      address: window.location.hostname
    };

    _get(_core.Object.getPrototypeOf(SocketSyncClient.prototype), "constructor", this).call(this, previous, options, defaults);

    this.socket = null;
    this.initConnection();
  }

  _inherits(SocketSyncClient, _Lfo);

  _createClass(SocketSyncClient, {
    initConnection: {
      value: function initConnection() {
        var _this = this;

        var socketAddr = "ws://" + this.params.address + ":" + this.params.port;
        this.socket = new WebSocket(socketAddr);
        this.socket.binaryType = "arraybuffer";

        this.socket.onopen = function () {
          _this.isReady = true;
        };

        this.socket.onclose = function () {};

        this.socket.onmessage = function () {};
      }
    },
    process: {
      value: function process(time, frame, metaData) {
        var buffer = encodeMessage(time, frame, metaData);
        this.socket.send(buffer);
      }
    }
  });

  return SocketSyncClient;
})(Lfo);

var SocketSyncServer = (function (_Lfo2) {
  function SocketSyncServer() {
    _classCallCheck(this, SocketSyncServer);

    if (_Lfo2 != null) {
      _Lfo2.apply(this, arguments);
    }
  }

  _inherits(SocketSyncServer, _Lfo2);

  return SocketSyncServer;
})(Lfo);

// should not receive messages
// maybe handshakes form the server ?
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaW5rL3NvY2tldC1zaW5rcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQzs7ZUFDQyxPQUFPLENBQUMsdUJBQXVCLENBQUM7O0lBQWpFLGFBQWEsWUFBYixhQUFhO0lBQUUsYUFBYSxZQUFiLGFBQWE7O0lBRTVCLFVBQVU7QUFDSCxXQURQLFVBQVUsR0FDQTswQkFEVixVQUFVO0dBR2I7O2VBSEcsVUFBVTtBQU1kLGlCQUFhOzs7O2FBQUEseUJBQUcsRUFFZjs7QUFJRCxnQkFBWTs7Ozs7YUFBQSx3QkFBRyxFQUVkOzs7O1NBZEcsVUFBVTs7Ozs7OztJQXFCVixnQkFBZ0I7QUFDVCxXQURQLGdCQUFnQixDQUNSLFFBQVEsRUFBRSxPQUFPLEVBQUU7MEJBRDNCLGdCQUFnQjs7QUFFbEIsUUFBSSxRQUFRLEdBQUc7QUFDYixVQUFJLEVBQUUsSUFBSTtBQUNWLGFBQU8sRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVE7S0FDbEMsQ0FBQTs7QUFFRCxxQ0FQRSxnQkFBZ0IsNkNBT1osUUFBUSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7O0FBRW5DLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ25CLFFBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztHQUN2Qjs7WUFYRyxnQkFBZ0I7O2VBQWhCLGdCQUFnQjtBQWFwQixrQkFBYzthQUFBLDBCQUFHOzs7QUFDZixZQUFJLFVBQVUsR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ3hFLFlBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDeEMsWUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsYUFBYSxDQUFDOztBQUV2QyxZQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxZQUFNO0FBQ3pCLGdCQUFLLE9BQU8sR0FBRyxJQUFJLENBQUM7U0FDckIsQ0FBQTs7QUFFRCxZQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxZQUFNLEVBRTNCLENBQUE7O0FBRUQsWUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEdBQUcsWUFBTSxFQUc3QixDQUFBO09BQ0Y7O0FBRUQsV0FBTzthQUFBLGlCQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO0FBQzdCLFlBQUksTUFBTSxHQUFHLGFBQWEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ2xELFlBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO09BQzFCOzs7O1NBbkNHLGdCQUFnQjtHQUFTLEdBQUc7O0lBc0M1QixnQkFBZ0I7V0FBaEIsZ0JBQWdCOzBCQUFoQixnQkFBZ0I7Ozs7Ozs7WUFBaEIsZ0JBQWdCOztTQUFoQixnQkFBZ0I7R0FBUyxHQUFHIiwiZmlsZSI6ImVzNi9zaW5rL3NvY2tldC1zaW5rcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIExmbyA9IHJlcXVpcmUoJy4uL2NvcmUvbGZvLWJhc2UnKTtcbnZhciB7IGVuY29kZU1lc3NhZ2UsIGRlY29kZU1lc3NhZ2UgfSA9IHJlcXVpcmUoJy4uL3V0aWxzL3NvY2tldC11dGlscycpO1xuXG5jbGFzcyBTb2NrZXRTeW5rIHtcbiAgY29uc3RydWN0b3IoKSB7XG5cbiAgfVxuXG4gIC8vIHByZXBhcmUgdGhlIGJ1ZmZlciB0byBzZW5kIG92ZXIgdGhlIG5ldHdvcmtcbiAgZm9ybWF0TWVzc2FnZSgpIHtcblxuICB9XG5cbiAgLy8gb25tZXNzYWdlIGNhbGxiYWNrXG4gIC8vIGRpc3BhdGNoIGhhbmRjaGVja3MgYW5kIGRhdGEgbWVzc2FnZVxuICByb3V0ZU1lc3NhZ2UoKSB7XG5cbiAgfVxufVxuXG5cbi8vIHNlbmQgYW4gTGZvIHN0cmVhbSBmcm9tIHRoZSBicm93c2VyIG92ZXIgdGhlIG5ldHdvcmtcbi8vIHRocm91Z2h0IGEgV2ViU29ja2V0IC0gc2hvdWxkIGJlIHBhaXJlZCB3aXRoIGEgU29ja2V0U291cmNlU2VydmVyXG4vLyBATk9URTogZG9lcyBpdCBuZWVkIHRvIGltcGxlbWVudCBzb21lIHBpbmcgcHJvY2VzcyB0byBtYWludGFpbiBjb25uZWN0aW9uID9cbmNsYXNzIFNvY2tldFN5bmNDbGllbnQgZXh0ZW5kcyBMZm8ge1xuICBjb25zdHJ1Y3RvcihwcmV2aW91cywgb3B0aW9ucykge1xuICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgIHBvcnQ6IDMwMzAsXG4gICAgICBhZGRyZXNzOiB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWVcbiAgICB9XG5cbiAgICBzdXBlcihwcmV2aW91cywgb3B0aW9ucywgZGVmYXVsdHMpO1xuXG4gICAgdGhpcy5zb2NrZXQgPSBudWxsO1xuICAgIHRoaXMuaW5pdENvbm5lY3Rpb24oKTtcbiAgfVxuXG4gIGluaXRDb25uZWN0aW9uKCkge1xuICAgIHZhciBzb2NrZXRBZGRyID0gJ3dzOi8vJyArIHRoaXMucGFyYW1zLmFkZHJlc3MgKyAnOicgKyB0aGlzLnBhcmFtcy5wb3J0O1xuICAgIHRoaXMuc29ja2V0ID0gbmV3IFdlYlNvY2tldChzb2NrZXRBZGRyKTtcbiAgICB0aGlzLnNvY2tldC5iaW5hcnlUeXBlID0gJ2FycmF5YnVmZmVyJztcblxuICAgIHRoaXMuc29ja2V0Lm9ub3BlbiA9ICgpID0+IHtcbiAgICAgIHRoaXMuaXNSZWFkeSA9IHRydWU7XG4gICAgfVxuXG4gICAgdGhpcy5zb2NrZXQub25jbG9zZSA9ICgpID0+IHtcblxuICAgIH1cblxuICAgIHRoaXMuc29ja2V0Lm9ubWVzc2FnZSA9ICgpID0+IHtcbiAgICAgIC8vIHNob3VsZCBub3QgcmVjZWl2ZSBtZXNzYWdlc1xuICAgICAgLy8gbWF5YmUgaGFuZHNoYWtlcyBmb3JtIHRoZSBzZXJ2ZXIgP1xuICAgIH1cbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgdmFyIGJ1ZmZlciA9IGVuY29kZU1lc3NhZ2UodGltZSwgZnJhbWUsIG1ldGFEYXRhKTtcbiAgICB0aGlzLnNvY2tldC5zZW5kKGJ1ZmZlcik7XG4gIH1cbn1cblxuY2xhc3MgU29ja2V0U3luY1NlcnZlciBleHRlbmRzIExmbyB7XG5cbn1cblxuXG5cblxuXG4iXX0=