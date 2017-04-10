import * as lfo from 'waves-lfo/client';
import motionInput from 'motion-input';

const $container = document.querySelector('#container');

// source part of the application (mobile)
function initSource(inputModule) {

  const eventIn = new lfo.source.EventIn({
    frameType: 'vector',
    frameSize: 3,
    frameRate: 1,
  });

  const socketSend = new lfo.sink.SocketSend({
    port: 3000
  });

  const template = (frame) => {
    return `
      <p>time: ${frame.time}</p>
      <ul>
        <li>alpha: ${frame.data[0]}</li>
        <li>beta: ${frame.data[1]}</li>
        <li>gamma: ${frame.data[2]}</li>
      </ul>
    `;
  }

  const bridge = new lfo.sink.Bridge({
    processFrame: (frame) => {
      const html = template(frame);
      $container.innerHTML = html;
    }
  });

  eventIn.connect(socketSend);
  eventIn.connect(bridge);

  eventIn.init().then(() => {
    eventIn.start();

    inputModule.addListener((data) => {
      const now = window.performance.now() / 1000;
      eventIn.process(now, data);
    });
  });
}

// sink part of the application (laptop)
function initSink() {
  // back from server
  const socketReceive = new lfo.source.SocketReceive({
    port: 8000,
  });

  const bpfDisplay = new lfo.sink.BpfDisplay({
    width: 600,
    height: 400,
    container: $container,
    duration: 6,
    min: -180,
    max: 360,
  });

  // const loggerReceive = new lfo.sink.Logger({
  //   data: true,
  //   time: true,
  // });

  // socketReceive.connect(loggerReceive);
  socketReceive.connect(bpfDisplay);
}

window.addEventListener('load', () => {
  const hash = window.location.hash;

  if (hash === '#source') {
    motionInput
      .init(['orientation'])
      .then(([inputModule]) => {
        if (inputModule.isValid)
          initSource(inputModule);
        else
          alert('This client should be run on: a mobile device');
      });
  } else {
    initSink();
  }
});
