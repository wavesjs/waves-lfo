import BaseDraw from './base-draw';
import { getRandomColor } from '../utils/draw-utils';

export default class Bpf extends BaseDraw {
  constructor(options) {
    super({
      trigger: false,
      radius: 0,
      line: true
    }, options);

    // for loop mode
    this.currentXPosition = 0;
  }

  initialize(inStreamParams) {
    super.initialize(inStreamParams);

    // create an array of colors according to the `outFrame` size
    if (!this.params.colors) {
      this.params.colors = [];

      for (let i = 0, l = this.streamParams.frameSize; i < l; i++)
        this.params.colors.push(getRandomColor());
    }
  }

  // allow to witch easily between the 2 modes
  setTrigger(bool) {
    this.params.trigger = bool;
    // clear canvas and cache
    this.ctx.clearRect(0, 0, this.params.width, this.params.height);
    this.cachedCtx.clearRect(0, 0, this.params.width, this.params.height);
    // reset currentXPosition
    this.currentXPosition = 0;
    this.lastShiftError = 0;
  }

  executeDraw(time, frame) {
    if (this.params.trigger)
      this.triggerModeDraw(time, frame);
    else
      this.scrollModeDraw(time, frame);

    super.process(time, frame);
  }

  /**
   * Alternative drawing mode.
   * Draw from left to right, go back to left when > width
   */
  triggerModeDraw(time, frame) {
    const width  = this.params.width;
    const height = this.params.height;
    const duration = this.params.duration;
    const ctx = this.ctx;

    const dt = time - this.previousTime;
    const fShift = (dt / duration) * width - this.lastShiftError; // px
    const iShift = Math.round(fShift);
    this.lastShiftError = iShift - fShift;

    this.currentXPosition += iShift;

    // draw the right part
    ctx.save();
    ctx.translate(this.currentXPosition, 0);
    ctx.clearRect(-iShift, 0, iShift, height);
    this.drawCurve(frame, iShift);
    ctx.restore();

    // go back to the left of the canvas and redraw the same thing
    if (this.currentXPosition > width) {
      // go back to start
      this.currentXPosition -= width;

      ctx.save();
      ctx.translate(this.currentXPosition, 0);
      ctx.clearRect(-iShift, 0, iShift, height);
      this.drawCurve(frame, this.previousFrame, iShift);
      ctx.restore();
    }
  }

  drawCurve(frame, prevFrame, iShift) {
    const colors = this.params.colors;
    const ctx = this.ctx;
    const radius = this.params.radius;

    for (var i = 0, l = frame.length; i < l; i++) {
      ctx.save();
      // color should bechosen according to index
      ctx.fillStyle = colors[i];
      ctx.strokeStyle = colors[i];

      const posY = this.getYPosition(frame[i]);
      // as an options ? radius ?
      if (radius > 0) {
        ctx.beginPath();
        ctx.arc(0, posY, radius, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();
      }

      if (prevFrame && this.params.line) {
        const lastPosY = this.getYPosition(prevFrame[i]);
        // draw line
        ctx.beginPath();
        ctx.moveTo(-iShift, lastPosY);
        ctx.lineTo(0, posY);
        ctx.stroke();
        ctx.closePath();
      }

      ctx.restore();
    }
  }
}
