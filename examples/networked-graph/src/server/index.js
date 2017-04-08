import 'source-map-support/register';
import http from 'http';
import uws from 'uws';
import connect from 'connect';
import portfinder from 'portfinder';
import serveStatic from 'serve-static';
import serveFavicon from 'serve-favicon';
import * as lfo from 'waves-lfo/node';

const app = connect();
const SocketServer = uws.Server;

app.use(serveFavicon('./public/favicon.ico'));
app.use(serveStatic('./public', { index: ['index.html'] }));

portfinder.basePort = 3000;
portfinder.getPort((err, port) => {
  if (err)
    console.log(err.message);

  const server = http.createServer(app).listen(port, () => {
    console.log(`Server started: http://127.0.0.1:${port}`);
  });

  const socket = new lfo.source.WebSocket({ port: 8000 });

  const bridge = new lfo.sink.Bridge({
    processStreamParams: (streamParams) => console.log(streamParams),
    processFrame: (streamParams) => console.log(streamParams),
    finalizeStream: () => console.log('finalizeStream'),
  });

  socket.connect(bridge);
});
