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

  // lfo graph
  const socketReceive = new lfo.source.SocketReceive({ server });
  const socketSend = new lfo.sink.SocketSend({ port: 8000 });

  // const logger = new lfo.sink.Logger({
  //   streamParams: true,
  //   time: true,
  //   data: true,
  // });

  // socketReceive.connect(logger);
  socketReceive.connect(socketSend);
});

