import BaseLfo from '../core/base-lfo';


/**
 * Utility sink to log the time, frame, metadata and/or `streamAttributes`
 *
 *
 */
class Logger extends BaseLfo {
  constructor(options) {
    super({
      time: true,
      outFrame: true,
      metadata: true,
      streamParams: true,
    }, options);

    this.addBooleanParam('time', 'static');
    this.addBooleanParam('outFrame', 'static');
    this.addBooleanParam('metadata', 'static');
    this.addBooleanParam('streamParams', 'static');
  }

  initialize(inStreamParams) {
    super.initialize(inStreamParams);

    console.log(inStreamParams);
  }

  process(time, frame, metadata) {
    if (this.getParam('time') === true)
      console.log(time);

    if (this.getParam('outFrame') === true)
      console.log(frame);

    if (this.getParam('metadata') === true)
      console.log(metadata);
  }
}

export default Logger;
