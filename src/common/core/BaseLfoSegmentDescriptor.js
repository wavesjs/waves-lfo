import BaseLfo from './BaseLfo';

class BaseLfoSegmentDescriptor extends BaseLfo {
  constructor(definitions, options) {
    super(definitions, options);

    this.segmentMode = false;
    this.segmentStartTime = null;
    this.segmentStopTime = null;
    this.isInSegment = false;
  }

  processSegmentStart(time) {
    this.segmentStartTime = time;
  }

  processSegmentStop(time) {
    this.segmentStopTime = time;
  }

  processFrame(frame) {
    this.prepareFrame();

    // // frameTime and frameMetadata defaults to identity
    // this.frame.time = frame.time;
    // this.frame.metadata = frame.metadata;

    this.processFunction(frame);

    if (this.segmentMode === false)
      this.propagateFrame();
  }
}

export default BaseLfoSegmentDescriptor;
