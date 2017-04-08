import * as ws from 'uws';

const wsServers = new Map;

export function wsServerFactory(port) {
  if (!wsServers.has(port)) {
    const wss = new ws.Server({ port: port });
    wsServers.set(port, wss);
  }

  return wsServers.get(port);
}
