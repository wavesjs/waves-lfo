
![logo](https://cdn.rawgit.com/wavesjs/waves-lfo/master/resources/logo.png)

# _Low Frequency Operators_

The `lfo` library provides a simple and efficient graph-based javascript API primarily designed for the processing and analysis of signal and event data streams such as audio, audio descriptors and motion sensor data.

A `graph` of `lfo` modules can process data streams online (i.e. processing data from audio inputs or event sources) as well as offline (e.g. iterating over recorded data) depending on the used `source` and `sink` modules. Many of the operator modules provided by the library (e.g. filters, signal statistics) can also be used for processing data using an alternative API without the `lfo` formalism.

The library exposes two main entry points, `waves-lfo/client` and `waves-lfo/node`, that respectively provide modules to be used in a browser or in a _Node.js_ environment. This architecture allows for adapting the library to virtually any context and platform by only providing adequate `source` and `sink` modules.

The library provides three namespaces:
- **`source`** modules produce streams and propagate their properties (i.e. `frameRate`, `frameType`, etc.) through the graph.
- **`sink`** modules are endpoints of the graph such as recorders and visualizers.
- **`operator`** modules process an incoming stream and propagate the resulting stream to the next operators.

A `graph` is a combination of at least a `source` and a `sink` with any number of `operator` modules in between:

![scheme](https://cdn.rawgit.com/wavesjs/waves-lfo/master/resources/graph.png)

## Documentation

[http://wavesjs.github.io/waves-lfo](http://wavesjs.github.io/waves-lfo)

_**Important**: in the documentation, all nodes in the `common` and `core` namespaces are platform independent and can be used client-side as well as in node (aka from entry points `waves-lfo/client` and `waves-lfo/node`)._

## Usage

### Install

```sh
$ npm install [--save] waves-lfo
```

### Import the library

To use the library in browser or in node, import the corresponding entry point. These different access allow to use sources and sinks specific to the platform:

```js
// in browser
import * as lfo from 'waves-lfo/client';

// in node
import * as lfo from 'waves-lfo/node';
```

To create a script that targets any possible environnements (i.e. if no platform specific `source` or `sink` is used), the `common` entry point can be used: 

```js
import * as lfo from 'waves-lfo/common';
```

### Create a graph

```js
import * as lfo from 'waves-lfo/common';

const eventIn = new lfo.source.EventIn({
  frameType: 'vector'
  frameSize: 3,
  frameRate: 1,
});

const rms = new lfo.operator.Rms();
const logger = new lfo.sink.Logger({ data: true });

eventIn.connect(rms);
rms.connect(logger);

eventIn.start();
eventIn.process(0, [2, 1, 3]);
// > [2.16024689947]
```

## Terminology

The `lfo` modules produce and consume data streams composed of _frames_. This is the terminology used by the library.

- __stream__ - a succession of _frames_ described by a set of _stream parameters_
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
  [_example 1_](https://cdn.rawgit.com/wavesjs/waves-lfo/master/examples/operator-biquad-signal/index.html), [_example 2_](https://cdn.rawgit.com/wavesjs/waves-lfo/master/examples/operator-biquad-vector/index.html)
* [Dct](http://wavesjs.github.io/waves-lfo/module-common.operator.Dct.html)
* [Fft](http://wavesjs.github.io/waves-lfo/module-common.operator.Fft.html)
* [Magnitude](http://wavesjs.github.io/waves-lfo/module-common.operator.Magnitude.html)
* [MeanStddev](http://wavesjs.github.io/waves-lfo/module-common.operator.MeanStddev.html)
* [Mel](http://wavesjs.github.io/waves-lfo/module-common.operator.Mel.html)
* [Mfcc](http://wavesjs.github.io/waves-lfo/module-common.operator.Mfcc.html) -
  [_example_](https://cdn.rawgit.com/wavesjs/waves-lfo/master/examples/mosaicking/index.html)
* [MinMax](http://wavesjs.github.io/waves-lfo/module-common.operator.MinMax.html) -
  [example](https://cdn.rawgit.com/wavesjs/waves-lfo/master/examples/sink-waveform-display/index.html)
* [MovingAverage](http://wavesjs.github.io/waves-lfo/module-common.operator.MovingAverage.html) -
  [_example (graphical)_](https://cdn.rawgit.com/wavesjs/waves-lfo/master/examples/sink-bridge/index.html)
* [MovingMedian](http://wavesjs.github.io/waves-lfo/module-common.operator.MovingMedian.html)
* [OnOff](http://wavesjs.github.io/waves-lfo/module-common.operator.OnOff.html) -
  [_example_](https://cdn.rawgit.com/wavesjs/waves-lfo/master/examples/sink-vu-meter-display/index.html)
* [Rms](http://wavesjs.github.io/waves-lfo/module-common.operator.Rms.html)
* [Segmenter](http://wavesjs.github.io/waves-lfo/module-common.operator.Segmenter.html) -
  [_example_](https://cdn.rawgit.com/wavesjs/waves-lfo/master/examples/operator-segmenter/index.html)
* [Select](http://wavesjs.github.io/waves-lfo/module-common.operator.Select.html)
* [Slicer](http://wavesjs.github.io/waves-lfo/module-common.operator.Slicer.html)
* [Yin](http://wavesjs.github.io/waves-lfo/module-common.operator.Yin.html) -
  [_example_](https://cdn.rawgit.com/wavesjs/waves-lfo/master/examples/operator-yin/index.html)

_sources:_

* [EventIn](http://wavesjs.github.io/waves-lfo/module-common.source.EventIn.html) -
  [_example_](https://cdn.rawgit.com/wavesjs/waves-lfo/master/examples/sink-bridge/index.html)

_sinks:_

* [Bridge](http://wavesjs.github.io/waves-lfo/module-common.sink.Bridge.html) -
  [_example 1_](https://cdn.rawgit.com/wavesjs/waves-lfo/master/examples/sink-bridge/index.html), [_example 2_](https://cdn.rawgit.com/wavesjs/waves-lfo/master/examples/sink-marker-display/index.html)
* [DataRecorder](http://wavesjs.github.io/waves-lfo/module-common.sink.DataRecorder.html) -
  [_example_](https://cdn.rawgit.com/wavesjs/waves-lfo/master/examples/mosaicking/index.html)
* [Logger](http://wavesjs.github.io/waves-lfo/module-common.sink.Logger.html)
* [SignalRecorder](http://wavesjs.github.io/waves-lfo/module-common.sink.SignalRecorder.html) -
  [_example_](https://cdn.rawgit.com/wavesjs/waves-lfo/master/examples/sink-signal-recorder/index.html)


#### client only

_sources:_

* [AudioInBuffer](http://wavesjs.github.io/waves-lfo/module-client.source.AudioInBuffer.html)
* [AudioInNode](http://wavesjs.github.io/waves-lfo/module-client.source.AudioInNode.html) -
  [_example_](https://cdn.rawgit.com/wavesjs/waves-lfo/master/examples/source-audio-in-node/index.html)

_sinks:_

* [BaseDisplay](http://wavesjs.github.io/waves-lfo/module-client.sink.BaseDisplay.html)
* [BpfDisplay](http://wavesjs.github.io/waves-lfo/module-client.sink.BpfDisplay.html) -
  [_example_](https://cdn.rawgit.com/wavesjs/waves-lfo/master/examples/sink-bpf-display/index.html)
* [MarkerDisplay](http://wavesjs.github.io/waves-lfo/module-client.sink.MarkerDisplay.html) -
  [_example_](https://cdn.rawgit.com/wavesjs/waves-lfo/master/examples/sink-marker-display/index.html)
* [SignalDisplay](http://wavesjs.github.io/waves-lfo/module-client.sink.SignalDisplay.html) -
  [_example_](https://cdn.rawgit.com/wavesjs/waves-lfo/master/examples/sink-signal-display/index.html)
* [SpectrumDisplay](http://wavesjs.github.io/waves-lfo/module-client.sink.SpectrumDisplay.html) -
  [_example_](https://cdn.rawgit.com/wavesjs/waves-lfo/master/examples/sink-spectrum-display/index.html)
* [TraceDisplay](http://wavesjs.github.io/waves-lfo/module-client.sink.TraceDisplay.html) -
  [_example_](https://cdn.rawgit.com/wavesjs/waves-lfo/master/examples/sink-trace-display/index.html)
* [VuMeterDisplay](http://wavesjs.github.io/waves-lfo/module-client.sink.VuMeterDisplay.html) -
  [_example_](https://cdn.rawgit.com/wavesjs/waves-lfo/master/examples/sink-vu-meter-display/index.html)
* [WaveformDisplay](http://wavesjs.github.io/waves-lfo/module-client.sink.WaveformDisplay.html) -
  [_example_](https://cdn.rawgit.com/wavesjs/waves-lfo/master/examples/sink-waveform-display/index.html)

#### node only

_sources:_

* [AudioInFile](http://wavesjs.github.io/waves-lfo/module-node.source.AudioInFile.html)

_sinks:_

* [DataToFile](http://wavesjs.github.io/waves-lfo/module-node.sink.DataToFile.html)

## Standalone usage

Most of the operators can be used in a `standalone` mode which allow to consume the implemented algorithm without the burden of creating a whole graph.

```js
import * as lfo from 'waves-lfo/common';

const rms = new lfo.operator.Rms();
rms.initStream({ frameType: 'signal', frameSize: 1000 });

const results = rms.inputSignal([...values]);
```

<!--
## `SegmentProducer` and `SegmentDescriptor`

@todo
-->

## Implementation of an `lfo` operator

To create a new operator, the `BaseLfo` must be extended, the class is available in the `waves-lfo/core` entry point.

```js
import { BaseLfo } from 'waves-lfo/core';
// define class parameters
const parameters = {
  factor: {
    type: 'integer',
    default: 1,
  },
};

class Multiplier extends BaseLfo {
  constructor(options = {}) {
    // set the parameters and options of the node
    super(parameters, options);
  }

  // allow the node to handle incoming `vector` frames
  processVector(frame) {
    const frameSize = this.streamParams.frameSize;
    const factor = this.params.get('factor');

    // transfer data from `frame` (output of previous node)
    // to the current node's frame, data from the incoming frame 
    // should never be modified
    for (let i = 0; i < frameSize; i++)
      this.frame.data[i] = frame.data[i] * factor;
  }
}

const multiplier = new Multiplier({ factor: 4 });
```

## Creating plugins

To contribute and distribute a new `lfo` module, a good pratice is that the module should not directly depend on `lfo` (i.e. `wavesjs/waves-lfo` shouldn't be found in the `package.json` of the module or as a `devDependency`). The final application should be responsible for importing the \lfo library as well as the plugin.

This practice should allow to create an ecosystem of module that, in the final application, would all point to the same instance of `lfo` and thus enforce inter-compatibilies.

If need, all entry points expose a `VERSION` property that allows a plugin to test the loaded `lfo` version.

A example of plugin can be found at [https://github.com/Ircam-RnD/xmm-lfo](https://github.com/Ircam-RnD/xmm-lfo)

## `lfo` and `PiPo`

The `lfo` library is based on the same concepts and very similar formalisms as [PiPo](http://ismm.ircam.fr/pipo/).
However, the APIs of `lfo` and `PiPo` defer in many details due to the very different constraints of the Javascript and C/C++ development and runtime environments.

<hr />

## Credits and License

The `lfo` library has been developed at [Ircam – Centre Pompidou](http://www.ircam.fr) and is released under the BSD-3-Clause license.

The formalisms and API of the library has been designed in the framework of the EU H2020 project Rapid-Mix by Norbert Schnell and Benjamin Matuszewski.

The library has been developed by Benjamin Matuszewski in the framework of the CoSiMa research project funded by the French National Research Agency (ANR).

A first version of the library has been developed by Victor Saiz in the framework of the WAVE ANR research project coordinated by Samuel Goldszmidt.

