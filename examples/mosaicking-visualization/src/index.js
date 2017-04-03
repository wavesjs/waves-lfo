import * as lfo from 'waves-lfo/client';
import * as loaders from 'waves-loaders';
import * as controllers from 'basic-controllers';
import * as audio from 'waves-audio';
import createKDTree from 'static-kdtree';
import analyzer from './analyzer';
import config from '../config.json';
import Synth from './Synth';
import WaveformTrack from './WaveformTrack';

// globals
const audioContext = audio.audioContext;
const sampleRate = audioContext.sampleRate;
const scheduler = audio.getScheduler();
const hopSize = config.hopSize;
const frameSize = config.frameSize;

// init application
// audio
const loader = new loaders.SuperLoader();
const assets = loader.load([
  './assets/animals.mp3',
  `assets/animals-mfcc-${config.maxFreq}.json`,
]);

let audioStream;

try {
  audioStream = navigator.mediaDevices.getUserMedia({ audio: true });
} catch (err) {
  const msg = `This navigator doesn't support getUserMedia or implement a deprecated API`;
  alert(msg);
  throw new Error(msg);
}

const rand = Math.random;

Promise.all([assets, audioStream])
  .then(init)
  .catch((err) => console.error(err.stack));

function getSearchSpace(description) {
  // transpose sourceDescription for kdTree use
  const length = description.length;
  const domain = new Array(length);
  const range = new Array(length);

  for (let i = 0; i < length; i++) {
    domain[i] = description[i].data;
    range[i] = description[i].time;
  }

  // create kdTree (seach take ~2ms)
  const kdTree = createKDTree(domain);

  return [kdTree, range];
}

function init([loaded, stream]) {
  const audioSourceBuffer = loaded[0];
  const sourceDescription = loaded[1];
  let currentBuffer = null;

  let [kdTree, range] = getSearchSpace(sourceDescription);

  // synth
  const grainPeriod = hopSize / sampleRate;
  const grainDuration = frameSize / sampleRate;
  const synth = new Synth(grainPeriod, grainDuration, scheduler);
  synth.setSearchSpace(kdTree, range);
  synth.setBuffer(audioSourceBuffer);

  // visualizations
  const targetWaveform = new WaveformTrack('#track-1');
  targetWaveform.setAudioBuffer(audioSourceBuffer);

  const sourceWaveform = new WaveformTrack('#track-2');

  synth.setStartCallback((grainDuration) => {
    targetWaveform.initSegment(grainDuration);
    sourceWaveform.initSegment(grainDuration);
  });

  synth.setAdvanceCallback((sourceTime, targetTime) => {
    targetWaveform.updateSegment(targetTime);
    sourceWaveform.updateSegment(sourceTime);
  });

  synth.setClearCallback(() => {
    targetWaveform.clearSegment();
    sourceWaveform.clearSegment();
  });

  // enable record
  const source = audioContext.createMediaStreamSource(stream);

  const audioInNode = new lfo.source.AudioInNode({
    sourceNode: source,
    audioContext: audioContext,
  });

  const recorder = new lfo.sink.SignalRecorder({
    duration: Infinity,
    retrieveAudioBuffer: true, // should be false
    audioContext: audioContext,
    callback: (buffer) => {
      currentBuffer = buffer; // store buffer for replay
      // display
      sourceWaveform.setAudioBuffer(buffer);

      const audioInBuffer = new lfo.source.AudioInBuffer({
        audioBuffer: buffer,
      });

      analyzer.init(config, audioInBuffer);
      analyzer.run()
        .then((normFrames) => {
          synth.setModel(normFrames);
          synth.start();
        })
        .catch((err) => console.error(err.stack));
    }
  });

  audioInNode.connect(recorder);

  // gui
  const $controllers = document.querySelector('#controllers');

  new controllers.TriggerButtons({
    label: '',
    options: ['record', 'stop'],
    container: $controllers,
    callback: (value) => {
      if (value === 'record') {
        if (!recorder.isRecording) {
          audioInNode.start();
          recorder.start();
        } else {
          console.log('already recording');
        }
      } else {
        audioInNode.stop();
      }
    }
  });

  // replay source
  new controllers.TriggerButtons({
    label: '',
    options: ['replay recording'],
    container: $controllers,
    callback: () => {
      if (currentBuffer) {
        const source = audioContext.createBufferSource();
        source.connect(audioContext.destination);
        source.buffer = currentBuffer;
        source.start();
      }
    }
  });

  // replay source
  new controllers.TriggerButtons({
    label: '',
    options: ['replay synth'],
    container: $controllers,
    callback: () => synth.start(),
  });

  // drag and drop a new file
  const $drop = document.querySelector('#drop');

  $drop.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  });

  $drop.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();

    var file = e.dataTransfer.files[0];
    // console.log(file.type.match(/^audio/));
    if (file.type.match(/^audio/)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        $drop.classList.add('process');

        audioContext
          .decodeAudioData(e.target.result)
          .then((buffer) => {
            targetWaveform.setAudioBuffer(buffer);

            const audioInBuffer = new lfo.source.AudioInBuffer({
              audioBuffer: buffer,
            });

            analyzer.init(config, audioInBuffer);
            analyzer.run()
              .then((description) => {
                $drop.classList.remove('process');

                [kdTree, range] = getSearchSpace(description);
                synth.setSearchSpace(kdTree, range);
                synth.setBuffer(buffer);
                synth.start();
              });
          });
      }

      reader.readAsArrayBuffer(file);
    }
  });

  // trigger with space bar
  document.addEventListener('keypress', (e) => {
    if (e.charCode === 32)
      synth.start();
  });
}
