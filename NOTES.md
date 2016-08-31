# NOTES / QUESTIONS / TODOS

## Parameters

When a dynamic parameter is updated, what is the better/safer strategy to adopt:
1. directly call `initialize` on the node ?
2. setting a flag that will be checked in `process` and call `initialize` if needed ?

=> solution 2 looks better to me (update only when needed, etc.)
=> but does it solve problem that could occur with async operations ?
=> add the burden of manually checkin in each `process` implementation


## Naming ? (would be more clear in the doc...)

this.time       ==> this.streamTime
this.outFrame   ==> this streamBuffer
this.metaData   ==> this.streamData

## Signal vs Vector

To deal properly with the `signal` vs `vector` (time vs dimension) problem, could we add a `streamParam` describing which type of input/output we are dealing with ? 

This would allow to:

- check if the input has the proper format according to the node (ex. does it mean something to use the `Segmenter`, `Framer`, `FFT` on a vector with several dimensions ?), and  throw an error if the input doesn't have the proper type.
- improve comprehension and memory of what each node does (ex. input of the `Segmenter` is a signal while it's output is a vector) 
- facilitate implementation of the graph (if a signal is given to a node that accept only a vector and then throw an error, it's easy to think about introducing a `Framer`)

And eventually:

- generalize the `description` field introduced in the `Segmenter` to describe the node vector output fields
- define the operation done on the input according to its type (ex. `movingAverage`, `movingMedian`, `minMax`)
- extend this notion of stream type to introduce matrices later


### Proposed Formalism

operators:
- biquad            in: signal    out: signal
- framer            in: signal    out: signal
- segmenter         in: signal    out: vector
- fft               in: signal    out: vector
- min-max           in: signal    out: vector     note: is this usefull for something else than displaying a waveform (if not, hide into sink.waveform ?)

- magnitude         in: vector    out: vector
- min               in: vector    out: vector     note: add an order attribute
- max               in: vector    out: vector     note: add an order attribute
- moving-average    in: vector    out: vector
- moving-median     in: vector    out: vector   

sinks:
- audio-recorder    in: signal                    note: rename to signal-recorder ?
- waveform          in: vector (signal ?)         note: in becomes signal if merged with min-max

- bpf               in: vector
- data-recorder     in: vector
- marker            in: vector
- trace             in: vector
- spectrogram       in: vector                    note: keep that ?
- bridge            in: inherit from parent       note: allow to change from push to pull paradigm

sources:
- audio-in-buffer   out: signal
- audio-in-node     out: signal
- event-in          out: user defined

## New operators

- zero-crossing
- rms
- Resampler or only a Decimator ?
- MFCC
- Yin

## TODOS

- Check bridge with Meyda
- Integrate Parameters
- Generalize `processArray` and `processValue` methods, in order to use a node inside another node
- Review everything
- Create examples
- Write tests

## Meyda

- FFT is automatically processed on each frame

While it looks possible to extract some function out of their code that
could be use by them and in lfo, some problem remains :

- there is no notion of `time` tags or `frameRate` in their code.
- all the features are extracted from the audio blocks supplied by a `scriptProcessor`,
in the lfo case, if we generalize the processing based on a vector approach, will need
at least a phase of initialization in a certain number of case to init ring buffers, etc.
- their code doesn't look very clean / efficient, and would have to be rewritten anyway
- 





























