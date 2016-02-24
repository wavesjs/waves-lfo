import BaseDraw from './base-draw';


export default class Marker extends BaseDraw {
  constructor(options) {
    const defaults = {
      frameSize: 1,
      color: '#ffffff',
      threshold: 0,
    };

    super(options, defaults);

    console.log(this.params.color, options);
  }

  process(time, frame, metaData) {
    this.scrollModeDraw(time, frame);
    super.process(time, frame, metaData);
  }

  drawCurve(frame, prevFrame, iShift) {
    const color = this.params.color;
    const ctx = this.ctx;
    const height = ctx.height;

    const value = frame[0];

    if (value > this.params.threshold) {
      ctx.save();
      ctx.strokeStyle = this.params.color;
      ctx.beginPath();
      ctx.moveTo(-iShift, this.getYPosition(this.params.min));
      ctx.lineTo(-iShift, this.getYPosition(this.params.max));
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
    }
  }
}
