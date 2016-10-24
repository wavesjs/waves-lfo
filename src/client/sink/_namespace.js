import Bridge from '../../common/sink/Bridge';
import Logger from '../../common/sink/Logger';
import DataRecorder from '../../common/sink/DataRecorder';

import BaseDisplay from './BaseDisplay';
import BpfDisplay from './BpfDisplay';
import MarkerDisplay from './MarkerDisplay';
import SignalRecorder from './SignalRecorder';
import SignalDisplay from './SignalDisplay';
import SpectrumDisplay from './SpectrumDisplay';
import TraceDisplay from './TraceDisplay';
import VuMeterDisplay from './VuMeterDisplay';
import WaveformDisplay from './WaveformDisplay';

export default {
  Bridge,
  Logger,
  DataRecorder,

  BaseDisplay,
  BpfDisplay,
  MarkerDisplay,
  SignalDisplay,
  SignalRecorder,
  SpectrumDisplay,
  TraceDisplay,
  VuMeterDisplay,
  WaveformDisplay,
};
