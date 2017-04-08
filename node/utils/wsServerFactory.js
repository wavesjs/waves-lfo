'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

exports.wsServerFactory = wsServerFactory;

var _uws = require('uws');

var ws = _interopRequireWildcard(_uws);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var wsServers = new _map2.default();

function wsServerFactory(port) {
  if (!wsServers.has(port)) {
    var wss = new ws.Server({ port: port });
    wsServers.set(port, wss);
  }

  return wsServers.get(port);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndzU2VydmVyRmFjdG9yeS5qcyJdLCJuYW1lcyI6WyJ3c1NlcnZlckZhY3RvcnkiLCJ3cyIsIndzU2VydmVycyIsInBvcnQiLCJoYXMiLCJ3c3MiLCJTZXJ2ZXIiLCJzZXQiLCJnZXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7UUFJZ0JBLGUsR0FBQUEsZTs7QUFKaEI7O0lBQVlDLEU7Ozs7OztBQUVaLElBQU1DLFlBQVksbUJBQWxCOztBQUVPLFNBQVNGLGVBQVQsQ0FBeUJHLElBQXpCLEVBQStCO0FBQ3BDLE1BQUksQ0FBQ0QsVUFBVUUsR0FBVixDQUFjRCxJQUFkLENBQUwsRUFBMEI7QUFDeEIsUUFBTUUsTUFBTSxJQUFJSixHQUFHSyxNQUFQLENBQWMsRUFBRUgsTUFBTUEsSUFBUixFQUFkLENBQVo7QUFDQUQsY0FBVUssR0FBVixDQUFjSixJQUFkLEVBQW9CRSxHQUFwQjtBQUNEOztBQUVELFNBQU9ILFVBQVVNLEdBQVYsQ0FBY0wsSUFBZCxDQUFQO0FBQ0QiLCJmaWxlIjoid3NTZXJ2ZXJGYWN0b3J5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgd3MgZnJvbSAndXdzJztcblxuY29uc3Qgd3NTZXJ2ZXJzID0gbmV3IE1hcDtcblxuZXhwb3J0IGZ1bmN0aW9uIHdzU2VydmVyRmFjdG9yeShwb3J0KSB7XG4gIGlmICghd3NTZXJ2ZXJzLmhhcyhwb3J0KSkge1xuICAgIGNvbnN0IHdzcyA9IG5ldyB3cy5TZXJ2ZXIoeyBwb3J0OiBwb3J0IH0pO1xuICAgIHdzU2VydmVycy5zZXQocG9ydCwgd3NzKTtcbiAgfVxuXG4gIHJldHVybiB3c1NlcnZlcnMuZ2V0KHBvcnQpO1xufVxuIl19