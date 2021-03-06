import Bridge from '../../common/sink/Bridge';
import Logger from '../../common/sink/Logger';
import DataRecorder from '../../common/sink/DataRecorder';
import SignalRecorder from '../../common/sink/SignalRecorder';

import DataToFile from './DataToFile';
import SocketSend from './SocketSend';

export default {
  Bridge,
  Logger,
  DataRecorder,
  SignalRecorder,

  DataToFile,
  SocketSend,
};
