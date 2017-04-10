import * as lfo from 'waves-lfo/client';

// source part of the application (mobile)
function initSource() {
  const eventIn = new lfo.source.EventIn({
    frameType: 'vector',
    frameSize: 2,
    frameRate: 1,
  });

  const socketSend = new lfo.sink.SocketSend({
    port: 3000
  });

  const loggerSend = new lfo.sink.Logger({
    time: true,
    data: true,
  });

  eventIn.connect(socketSend);
  eventIn.connect(loggerSend);

  eventIn.init().then(() => {
    console.log('initialized \\o/');
    eventIn.start();

    let time = 0;

    (function send() {
      const frame = {
        time: time,
        data: [Math.random(), Math.random()],
        metadata: { test: true },
      };

      eventIn.processFrame(frame);
      time += 1;

      setTimeout(send, 1000);
    }());
  });
}

// sink part of the application
function initSink() {
  // back from server
  const socketReceive = new lfo.source.SocketReceive({
    port: 8000,
  });

  const loggerReceive = new lfo.sink.Logger({
    data: true,
    time: true,
  });

  socketReceive.connect(loggerReceive);
}

window.addEventListener('load', () => {
  const hash = window.location.hash;

  if (hash === '#source')
    initSource();
  else
    initSink();
});
