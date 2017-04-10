import * as ws from 'uws';

export const WebSocket = ws;

// dictionnary of opened servers
const wsServers = new Map();

export function wsServerFactory(config) {
  const wsConfig = {};
  let key;

  if (config.server !== null) {
    wsConfig.server = config.server;
    key = config.server;
  } else {
    wsConfig.port = config.port;
    key = config.port;
  }

  if (!wsServers.has(key)) {
    const wss = new ws.Server(wsConfig);
    wsServers.set(key, wss);
  }

  return wsServers.get(key);
}
