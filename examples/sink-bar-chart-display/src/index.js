import * as lfo from 'waves-lfo/client';

const frameSize = 5;
const dt = 0.02;

const eventIn = new lfo.source.EventIn({
  frameSize: frameSize,
  frameRate: 1 / dt,
  frameType: 'vector',
});

const barChart = new lfo.sink.BarChartDisplay({
  canvas: '#bar-chart',
});

eventIn.connect(barChart);
eventIn.start();

const data = [0, 0.2, 0.4, 0.6, 0.8];

(function generateData() {
  for (let i = 0; i < frameSize; i++)
    data[i] = (data[i] + 0.001) % 1;

  eventIn.process(null, data);

  setTimeout(generateData, dt * 1000);
}());
