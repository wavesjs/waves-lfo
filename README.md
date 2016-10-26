
![logo](https://rawgit.com/wavesjs/waves-lfo/develop/resources/logo.png)

# _Low Frequency Operators_

`lfo` *is an simple and efficient javascript library implementing a graph-based API primarily designed for real-time processing and analysis of arbitrary streams (audio, sensors, etc.). It can as well be used offline and support a standalone mode on most of its `operator`s.*

The library expose two entry points: `waves-lfo/client` and 
`waves-lfo/node`. This architecture allows to consume the library on virtually any environment by simply providing platform specific `sources` and `sinks`.

`lfo` nodes are separated in 3 categories:

- **`sources`** are responsible for acquering streams and their properties (`frameType`, `frameRate`, `frameSize`, `sampleRate`).
- **`sinks`** are endpoints of the graph. Such nodes can be recorders, visualizers, etc.
- **`operators`** process the input stream and propagate results to the next(s) operator(s).

A `graph` is a combination of at least a `source`, a `sink` and zero to many `operator`(s) in between:


![scheme](https://dl.dropboxusercontent.com/u/606131/lfo.png)

## Documentation

[http://wavesjs.github.io/waves-lfo](http://wavesjs.github.io/waves-lfo)

_Note: in the documentation, all nodes in the `common` namespace are platform independant._

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

__Scalar__ - Single value, can be considered as a `vector` as well as a `signal`

__Vector__ - Array of values in different dimensions, each dimension is 
bound to a specific index in each frame

__Signal__ - Array of values in time domain, fragment of a signal

__Data__ - Generic term to designate a `vector` a `signal` or a `scalar`

__Frame__ - Object associating a time tag, data, and optionnal metadatas.

__Stream__ - Succession of frames, the state of the stream at each node is defined in the `streamParams` attribute. The `streamParams` object contains the following properties:
- `frameSize`: number of values in the frame at the output of the node
- `frameRate`: number of frame per seconds at the output of the node (if `0`, no frame rate)
- `frameType`: define if the output of the node should be considered as a `signal`, a `vector` or a `scalar` by the next(s) operator(s).
- `sourceSampleRate`: number of frames per seconds as defined by the source of the graph
- `description`: array of strings describing the output dimensions when `frameType` is `vector` or `scalar`.

## Available nodes and examples

#### common

__core:__
* [BaseLfo]()
* [BaseLfoSegmentDescriptor]()
* [BaseLfoSegmentProducer]()

__operators:__
* [Biquad]() - 
  [_example_](operator-biquad)
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
* [Select]() 
* [Slicer]() 
* [Yin]() - 
  [_example_](operator-yin)

__sources:__
* [EventIn]() - 
  [_example_](sink-bridge)

__sinks:__
* [Bridge]() - 
  [_example 1_](sink-bridge), [_example 2_](sink-marker-display)
* [DataRecorder]() - 
  [_example_](mosaicking)
* [Logger]() 
* [SignalRecorder]() - 
  [_example_](sink-signal-recorder)


#### client only

__sources:__
* [AudioInBuffer]()
* [AudioInNode]() - 
  [_example_](source-audio-in-node)

__sinks:__
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

__sources:__
* [AudioInFile]()

__sinks:__
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
