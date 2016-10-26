
![logo](https://rawgit.com/wavesjs/waves-lfo/develop/resources/logo.png)

# _Low Frequency Operators_

The `lfo` library provides a simple and efficient graph-based javascript API primarily designed for real-time processing and analysis of arbitrary signal and event data streams such as audio, audio descriptors and motion sensors. A `graph` of `lfo` modules can process data streams online (i.e. processing data from audio inputs or event sources) as well as offline (i.e. iterating over recorded data or synthesizing data) depending on the used `source` and `sink` modules. Many of the operator modules provided by the library (e.g. filters, signal statistics) can also be used for processing data without the `lfo` formalism using an alternative API.

The library is divided into two parts: `waves-lfo/client` and `waves-lfo/node`, respectively providing modules to be used in a browser on in a node.js environment. This allows for adapting the library to virtually any context by providing platform adequate `source` and `sink` modules.

The library provides three namespaces:
- **`source`** modules are responsible for acquiring streams and their properties (`frameType`, `frameRate`, `frameSize`, `sampleRate`).
- **`sink`** modules are endpoints of the graph such as recorders and visualizers.
- **`operator`** modules process an incoming stream and propagate the result of the processing to the next operators.

A `graph` is a combination of at least a `source` and a `sink` with any number of `operator` modules in between:

![scheme](https://dl.dropboxusercontent.com/u/606131/lfo.png)

## Documentation

[http://wavesjs.github.io/waves-lfo](http://wavesjs.github.io/waves-lfo)

_Note: in the documentation, all nodes in the `common` namespace are platform independent._

## Usage

### Install

```sh
$ npm install [--save] wavesjs/waves-lfo
```

### Import the library

```js
// in browser
import * as lfo from 'waves-lfo/client';

// in node
import * as lfo from 'waves-lfo/node';
```

### Create a graph

```js
import * as lfo from 'waves-lfo/client';

const eventIn = new lfo.source.EventIn({
  frameType: 'vector'
  frameSize: 3,
  frameRate: 1,
});

const rms = new lfo.operator.RMS();
const logger = new lfo.sinks.Logger({ data: true });

eventIn.connect(rms);
rms.connect(logger);

eventIn.start();
eventIn.process(0, [2, 1, 3]);
// > [2.16024689947]
```

## Terminology

The `lfo` modules produce and consume data streams composed of _frames_. This is the terminology used by the library.

- __stream__ - a succession of _frames_ defined by _stream parameters_
- __frame__ - an element of a stream that associates a `data` element with a `time` and optional `metadata`
- __data__ - a generic term to designate the _payload_ of a frame which can be a `vector`, a `signal` or a `scalar`
- __vector__ - an array of values that correspond to different dimensions such as _[x y z]_ or _[mean stddev min max]_
- __signal__ - an array of time-domain values corresponding to a fragment of a signal
- __scalar__ - a single value that can be arbitrarily considered as a one-dimensional `vector` or one sample of a `signal`
- __time__ - a timestamp associating each frame in a stream to a point in time regarding an arbitrary reference common to all modules in a graph
- __metadata__ - additional description data associated to a frame by a module
- __stream parameters__ - parameters defining the nature of a stream at the output of a module (attribute `streamParams`) that may depend on the stream parameters of the incoming stream
  - `frameSize`: number of values in the frame data
  - `frameRate`: number of frames per seconds for regularly sampled streams, `0` otherwise
  - `frameType`: type of frame data (`vector`, `signal` or `scalar`)
  - `sourceSampleRate`: number of frames per seconds output by the graph's `source`
  - `sourceSampleCount`: number of consecutive discrete time values contained in the data frame output by the graph's `source` (e.g. the signal block size of an audio source or 1 for streams of sensor data vectors)
  - `description`: an array of strings describing the output dimensions of `vector` or `scalar` frames (e.g. `['mean', 'stddev', 'min', 'max']`)

## Available nodes and examples

#### common

_core:_

* [BaseLfo](http://wavesjs.github.io/waves-lfo/module-common.core.BaseLfo.html)

_operators:_

* [Biquad](http://wavesjs.github.io/waves-lfo/module-common.operator.Biquad.html) - 
  [_example 1_](https://rawgit.com/wavesjs/waves-lfo/waves-lfo/examples/operator-biquad-signal/index.html), [_example 2_](https://rawgit.com/wavesjs/waves-lfo/waves-lfo/examples/operator-biquad-vector/index.html)
* [DCT]() 
* [FFT]() - 
  [_example_](mosaicking)
* [Magnitude]()
* [MeanStddev]()
* [Mel]()
* [MFCC]() -
  [_example_](mosaicking)
* [MinMax]() -
  [example](sink-waveform-display)
* [MovingAverage]() -
  [_example (graphical)_](sink-bridge)
* [MovingMedian]()
* [OnOff]()
  [_example_](sink-vu-meter-display)
* [RMS]() 
* [Segmenter]() 
  [_example_](sink-vu-meter-display)
* [Select]() 
* [Slicer]() 
* [Yin]() - 
  [_example_](operator-yin)

_sources:_

* [EventIn]() -
  [_example_](sink-bridge)

_sinks:_

* [Bridge]() -
  [_example 1_](sink-bridge), [_example 2_](sink-marker-display)
* [DataRecorder]() -
  [_example_](mosaicking)
* [Logger]()
* [SignalRecorder]() -
  [_example_](sink-signal-recorder)


#### client only

_sources:_

* [AudioInBuffer]()
* [AudioInNode]() -
  [_example_](source-audio-in-node)

_sinks:_

* [BaseDisplay]()
* [BpfDisplay]() -
  [_example_](sink-bpf-examples)
* [MarkerDisplay]() -
  [_example_](sink-marker-display)
* [SignalDisplay]() -
  [_example_](sink-signal-display)
* [SpectrumDisplay]() -
  [_example_](sink-spectrum-display)
* [TraceDisplay]() -
  [_example_](sink-trace-display)
* [VuMeterDisplay]() -
  [_example 1_]((sink-vu-meter-display), [_example 2_](sink-signal-recorder)
* [WaveformDisplay]() -
  [_example_](sink-waveform-display)

#### node only

_sources:_

* [AudioInFile]()

_sinks:_

* [DataToFile]()


## Standalone usage

Most of the operators can be used in a `standalone` mode which allow to consume the implemented algorithm without the burden of creating a whole graph.

```js
import * as lfo from 'waves-lfo/client';

const rms = new lfo.operator.RMS();
rms.initStream({ frameType: 'signal', frameSize: 1000 });

const results = rms.inputSignal([...values]);
```

<!--
## `SegmentProducer` and `SegmentDescriptor`

@todo
-->

## Implementation of an `lfo` operator

```js
// define class parameters
const parameters = {
  factor: {
    type: 'integer',
    default: 1,
  },
};

class Multiplier extends lfo.core.BaseLfo {
  constructor(options) {
    // set the parameters and options of the node
    super(parameters, options);
  }

  // implementing this method allow the node to handle incomming
  // `vector` frames
  processVector(frame) {
    const frameSize = this.streamParams.frameSize;
    const factor = this.getParam('factor');

    // transfert data from `frame` (output of previous node)
    // to the current node, data of the incomming frame should
    // never be modifed
    for (let i = 0; i < frameSize; i++)
      this.frame.data[i] = frame.data[i] * factor;
  }
}

const multiplier = new Multiplier({ factor: 4 });
```

## `PiPo` and `lfo`

The library is heavily based on the concepts implemented in PiPo and try to stay close to the class and parameter names whenever possible.

<hr />
## License

This module is released under the BSD-3-Clause license.

<!--
Acknowledgments

This code has been developed in the framework of the WAVE and CoSiMa research projects, funded by the French National Research Agency (ANR).
-->
