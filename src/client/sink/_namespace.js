// common
import Bridge from '../../common/sink/Bridge';
import Logger from '../../common/sink/Logger';
import DataRecorder from '../../common/sink/DataRecorder';
import SignalRecorder from '../../common/sink/SignalRecorder';

// client only
import BaseDisplay from './BaseDisplay';
import BpfDisplay from './BpfDisplay';
import MarkerDisplay from './MarkerDisplay';
import SignalDisplay from './SignalDisplay';
import SocketSend from './SocketSend';
import SpectrumDisplay from './SpectrumDisplay';
import TraceDisplay from './TraceDisplay';
import VuMeterDisplay from './VuMeterDisplay';
import WaveformDisplay from './WaveformDisplay';

export default {
  Bridge,
  Logger,
  DataRecorder,
  SignalRecorder,

  BaseDisplay,
  BpfDisplay,
  MarkerDisplay,
  SignalDisplay,
  SocketSend,
  SpectrumDisplay,
  TraceDisplay,
  VuMeterDisplay,
  WaveformDisplay,
};
