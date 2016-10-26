import BaseLfo from './BaseLfo';

class BaseLfoSegmentDescriptor extends BaseLfo {
  constructor(definitions, options) {
    super(definitions, options);

    this.segmentMode = false;
    this.segmentStartTime = null;
    this.segmentStopTime = null;
    this.inSegment = false;
  }

  processSegmentStart(time) {
    this.segmentStartTime = time;
  }

  processSegmentStop(time) {
    this.segmentStopTime = time;
  }

  processFrame(frame) {
    this.prepareFrame();
    this.processFunction(frame);

    if (this.segmentMode === false)
      this.propagateFrame();
  }
}

export default BaseLfoSegmentDescriptor;
