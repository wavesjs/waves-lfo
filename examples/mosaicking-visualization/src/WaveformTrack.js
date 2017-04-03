import * as ui from 'waves-ui';

class WaveformTrack {
  constructor(sel) {
    const $container = document.querySelector(sel);
    const boudingClientRect = $container.getBoundingClientRect();

    this.width = boudingClientRect.width;
    this.height = boudingClientRect.height;

    this.timeline = new ui.core.Timeline(1, this.width);
    this.timeline.createTrack($container, this.height, 'default');

    this.segmentData = [{
      x: 0,
      width: 0,
      color: 'orange',
    }];

    this.segment = new ui.helpers.SegmentLayer(this.segmentData, {
      height: this.height,
      hittable: false,
      displayHandlers: false,
      opacity: 0.7,
    });

    const timeContext = new ui.core.LayerTimeContext(this.timeline.timeContext)
    this.segment.setTimeContext(timeContext);

    this.waveform = null;
  }

  setAudioBuffer(audioBuffer) {
    if (this.waveform !== null) {
      this.timeline.removeLayer(this.waveform);
      this.waveform.destroy();
    }

    this.timeline.pixelsPerSecond = this.width / audioBuffer.duration;

    this.waveform = new ui.helpers.WaveformLayer(audioBuffer, {
      height: this.height,
      hittable: false,
    });

    this.timeline.addLayer(this.waveform, 'default');
  }

  initSegment(duration) {
    this.segmentData[0].width = duration;

    const track = this.timeline.getTrackById('default');
    track.add(this.segment);

    this.segment.update();
  }

  updateSegment(time) {
    this.segmentData[0].x = time;
    this.segment.updateShapes();
    this.segment.render();
  }

  clearSegment() {
    this.timeline.removeLayer(this.segment);
  }
}

export default WaveformTrack;
