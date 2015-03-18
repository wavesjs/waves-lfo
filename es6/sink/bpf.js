'use strict';

var BaseDraw = require('./base-draw');
var { getRandomColor } = require('./draw-utils');

class Bpf extends BaseDraw {
  constructor(previous, options) {
    var extendDefaults = {
      trigger: false,
      radius: 0,
      line: true
    };

    super(previous, options, extendDefaults);
    // for loop mode
    this.currentXPosition = 0;
    // create an array of colors according to the
    if (!this.params.colors) {
      this.params.colors = [];
      for (var i = 0, l = this.streamParams.frameSize; i < l; i++) {
        this.params.colors.push(getRandomColor());
      }
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

  process(time, frame) {
    // @TODO: compare dt - if dt < fps return;
    if (this.params.trigger) {
      this.triggerModeDraw(time, frame);
    } else {
      this.scrollModeDraw(time, frame);
    }

    super.process(time, frame);
  }

  // add an alternative drawing mode
  // draw from left to right, go back to left when > width
  triggerModeDraw(time, frame) {
    var width  = this.params.width;
    var height = this.params.height;
    var duration = this.params.duration;
    var ctx = this.ctx;

    var dt = time - this.previousTime;
    var fShift = (dt / duration) * width - this.lastShiftError; // px
    var iShift = Math.round(fShift);
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

  // implements drawCurve
  drawCurve(frame, prevFrame, iShift) {
    var colors = this.params.colors;
    var ctx = this.ctx;
    var radius = this.params.radius;
    // @TODO this can and should be abstracted
    for (var i = 0, l = frame.length; i < l; i++) {
      ctx.save();
      // color should bechosen according to index
      ctx.fillStyle = colors[i];
      ctx.strokeStyle = colors[i];

      var posY = this.getYPosition(frame[i]);
      // as an options ? radius ?
      if (radius > 0) {
        ctx.beginPath();
        ctx.arc(0, posY, radius, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();
      }

      if (prevFrame && this.params.line) {
        var lastPosY = this.getYPosition(prevFrame[i]);
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

module.exports = Bpf;
