import BaseLfo from './BaseLfo';
import BaseLfoSegmentDescriptor from './BaseLfoSegmentDescriptor';

class BaseLfoSegmentProducer extends BaseLfo {
  constructor(definitions, options) {
    super(definitions, options);
  }

  connect(next) {
    super(next);

    if (next instanceof BaseLfoSegmentDescriptor)
      next.segmentMode = true;
  }

  propagateSegmentStart(time) {
    for (let i = 0; i < this.nextOps.length; i++)
      this.nextOps[i].segmentStart(time);
  }

  propagateSegmentStop(time) {
    for (let i = 0; i < this.nextOps.length; i++)
      this.nextOps[i].segmentStop(time);
  }

  propagateFrame() {}
}

export default BaseLfoSegmentProducer;
