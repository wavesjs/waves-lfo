NOTES
===========================================

general notes

- is the time tag of a frame at the begining or at the middle of the frame (cf. Norbert) ?

### lfo to create
  sink:
    [multi-]wave => uses min max
    [multi-]bpf  => uses vector of any size, draw one bpf per index
    trace        => mubu like visualisation, use a vector of [mean, range, color]

  operators:
    framer
    min-max
    fft...

    splitter / merger ?
      @NOTE will probably need to override `output` method

  sources
    event-in     => frame size must be one

# CORE

## lfo-base [extends `eventEmitter`]

### constructor(previous, options, defaults)

  define parameters of the lfo

  default streamParams {
    frameSize: 1, // only one vector per frame
    frameRate: 0  // no frame rate, atomic event
  }

  if `previous` is given, setup it's own `streamParams` according to its parent
  `streamParams`
  
### setupStream(opts = {})
  override `streamParams` acoording to given options
  create the `outFrame` sized with the `streamParams.frameSize`

### add
  register child node `process` on this `frame event`


### output(time = null)
  define `time` if not defined    
  emit the `frame` event to trigger `process` method of registered childs

    @NOTE 
      - what is `this.time` ?

### remove
  remove children listeners on the `frame` event

### process(time, data[, metadata])
  main processing function to implement in class which extend lfo-base

    @TODO 
      - add the `metadata` argument

### destroy
  stop listening its parent

    @NOTES
      - if any children to this node, their listener to this are still active, so nobody will garbage collected

@TODO
  LfoBase should implement `reset` and `finalize` methods

  `reset` should empty the current `outFrame` and call `reset` on its children
  @PROBLEM: nodes only know their `previous` nodes, not their childrens

  `finalize` should fill the current `outFrame` with 0, output it and then call `reset`
  @PROBLEM: the event based system (async) for frame output could produce that the `reset`
            could be called before `finalize` in some child 


# OPERATORS

## Biquad

  @NOTE 
    - no way to choose between the `biquadArrayDf1` and the `biquadArrayDf2`

## Magnitude

  process magnitude of a given frame
  if `normalize` is set to `true`, acts as a rms

  @NOTE
    - seems to be an error in the algorithm, the `for` loop uses the `streamParams.frameSize` instead of the input `frame` length // fixed (check with Norbert)

    - is the input time in the middle of the frame or not ?
    do we need to compute the outputTime according to the frame Size and sampleRate ?
    if yes, where do we find the sampleRate ?


## Framer
  - should be an `operator`
  - extract `reset` and `finalize` to be in `baseLfo`
      
    @NOTE
      - these methods should call their child methods recursively
      => a parent should know its children


# SOURCES

## eventSource
  can forward
    - relativeTime (according to it's start() method)
    - absoluteTime (audioContex time)
    - input time

  methods
    - `start()` -> call `reset()`
    - `stop()`  -> call `finalize()`

## AudioInBuffer

  

## AudioInNode

  consume a buffer an create a stream, offline


`reset` and `finalize` should be in `baseLfo`

# SINKS

  - base-draw

  duration => how much time the given pixel size represent
  scale    => 
  canvas   => see how this behaves if several draw modules share the same canvas

  renderedDuration => duration / scale

  - wave
    display waveform
  - multi-bpf
    display vectors of any size -> 1 bpf === 1 index
  - trace
    display vector of [mean, range, color]


  

