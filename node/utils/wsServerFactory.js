'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WebSocket = undefined;

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

exports.wsServerFactory = wsServerFactory;

var _uws = require('uws');

var ws = _interopRequireWildcard(_uws);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WebSocket = exports.WebSocket = ws;

// dictionnary of opened servers
var wsServers = new _map2.default();

function wsServerFactory(config) {
  var wsConfig = {};
  var key = void 0;

  if (config.server !== null) {
    wsConfig.server = config.server;
    key = config.server;
  } else {
    wsConfig.port = config.port;
    key = config.port;
  }

  if (!wsServers.has(key)) {
    var wss = new ws.Server(wsConfig);
    wsServers.set(key, wss);
  }

  return wsServers.get(key);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndzU2VydmVyRmFjdG9yeS5qcyJdLCJuYW1lcyI6WyJ3c1NlcnZlckZhY3RvcnkiLCJ3cyIsIldlYlNvY2tldCIsIndzU2VydmVycyIsImNvbmZpZyIsIndzQ29uZmlnIiwia2V5Iiwic2VydmVyIiwicG9ydCIsImhhcyIsIndzcyIsIlNlcnZlciIsInNldCIsImdldCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7UUFPZ0JBLGUsR0FBQUEsZTs7QUFQaEI7O0lBQVlDLEU7Ozs7OztBQUVMLElBQU1DLGdDQUFZRCxFQUFsQjs7QUFFUDtBQUNBLElBQU1FLFlBQVksbUJBQWxCOztBQUVPLFNBQVNILGVBQVQsQ0FBeUJJLE1BQXpCLEVBQWlDO0FBQ3RDLE1BQU1DLFdBQVcsRUFBakI7QUFDQSxNQUFJQyxZQUFKOztBQUVBLE1BQUlGLE9BQU9HLE1BQVAsS0FBa0IsSUFBdEIsRUFBNEI7QUFDMUJGLGFBQVNFLE1BQVQsR0FBa0JILE9BQU9HLE1BQXpCO0FBQ0FELFVBQU1GLE9BQU9HLE1BQWI7QUFDRCxHQUhELE1BR087QUFDTEYsYUFBU0csSUFBVCxHQUFnQkosT0FBT0ksSUFBdkI7QUFDQUYsVUFBTUYsT0FBT0ksSUFBYjtBQUNEOztBQUVELE1BQUksQ0FBQ0wsVUFBVU0sR0FBVixDQUFjSCxHQUFkLENBQUwsRUFBeUI7QUFDdkIsUUFBTUksTUFBTSxJQUFJVCxHQUFHVSxNQUFQLENBQWNOLFFBQWQsQ0FBWjtBQUNBRixjQUFVUyxHQUFWLENBQWNOLEdBQWQsRUFBbUJJLEdBQW5CO0FBQ0Q7O0FBRUQsU0FBT1AsVUFBVVUsR0FBVixDQUFjUCxHQUFkLENBQVA7QUFDRCIsImZpbGUiOiJ3c1NlcnZlckZhY3RvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB3cyBmcm9tICd1d3MnO1xuXG5leHBvcnQgY29uc3QgV2ViU29ja2V0ID0gd3M7XG5cbi8vIGRpY3Rpb25uYXJ5IG9mIG9wZW5lZCBzZXJ2ZXJzXG5jb25zdCB3c1NlcnZlcnMgPSBuZXcgTWFwKCk7XG5cbmV4cG9ydCBmdW5jdGlvbiB3c1NlcnZlckZhY3RvcnkoY29uZmlnKSB7XG4gIGNvbnN0IHdzQ29uZmlnID0ge307XG4gIGxldCBrZXk7XG5cbiAgaWYgKGNvbmZpZy5zZXJ2ZXIgIT09IG51bGwpIHtcbiAgICB3c0NvbmZpZy5zZXJ2ZXIgPSBjb25maWcuc2VydmVyO1xuICAgIGtleSA9IGNvbmZpZy5zZXJ2ZXI7XG4gIH0gZWxzZSB7XG4gICAgd3NDb25maWcucG9ydCA9IGNvbmZpZy5wb3J0O1xuICAgIGtleSA9IGNvbmZpZy5wb3J0O1xuICB9XG5cbiAgaWYgKCF3c1NlcnZlcnMuaGFzKGtleSkpIHtcbiAgICBjb25zdCB3c3MgPSBuZXcgd3MuU2VydmVyKHdzQ29uZmlnKTtcbiAgICB3c1NlcnZlcnMuc2V0KGtleSwgd3NzKTtcbiAgfVxuXG4gIHJldHVybiB3c1NlcnZlcnMuZ2V0KGtleSk7XG59XG4iXX0=