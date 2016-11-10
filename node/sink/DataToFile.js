'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _BaseLfo2 = require('../../common/core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var definitions = {
  filename: {
    type: 'string',
    default: null,
    constant: true
  },
  format: {
    type: 'enum',
    default: 'txt',
    list: ['txt', 'json', 'csv']
  }
};

/**
 * Record input frames into a file.
 *
 * @param {Object} options - Override default parameters.
 * @param {String} [options.filename=null] - Path of the output file.
 * @param {String} [options.format='txt'] - Format in which the data should
 *  be stored. Available options: 'txt', 'json' or 'csv'.
 *
 * @memberof module:node.sink
 *
 * @todo - add options to store streamParams (kind of header)
 *
 * @example
 * import path from 'path';
 * import EventIn from '../src/common/source/EventIn';
 * import Logger from '../src/common/sink/Logger';
 * import DataToFile from '../src/node/sink/DataToFile';
 *
 * // console.log(process.cwd(), lfo);
 * // process.exit();
 *
 * const eventIn = new EventIn({
 *   frameSize: 2,
 *   frameRate: 1,
 *   frameType: 'vector',
 * });
 *
 * const dataToFile = new DataToFile({
 *   filename: path.join(__dirname, './node_sink.DataToFile.test.json'),
 *   format: 'json',
 * });
 *
 * const logger = new Logger({
 *   data: true,
 * });
 *
 * eventIn.connect(logger);
 * eventIn.connect(dataToFile);
 * eventIn.start();
 *
 * let time = 0;
 * const period = 1;
 *
 * (function loop(){
 *   const data = [Math.random(), Math.random()];
 *   eventIn.process(time, data);
 *
 *   time += period;
 *
 *   if (time < 20)
 *     setTimeout(loop, 300);
 *   else {
 *     console.log('???');
 *     eventIn.stop();
 *   }
 * }());
 */

var DataToFile = function (_BaseLfo) {
  (0, _inherits3.default)(DataToFile, _BaseLfo);

  function DataToFile() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, DataToFile);

    var _this = (0, _possibleConstructorReturn3.default)(this, (DataToFile.__proto__ || (0, _getPrototypeOf2.default)(DataToFile)).call(this, definitions, options));

    _this.firstRow = true;
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(DataToFile, [{
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      this.prepareStreamParams(prevStreamParams);

      var filename = this.params.get('filename');
      this.file = _fs2.default.createWriteStream(filename);

      var format = this.params.get('format');

      switch (format) {
        case 'txt':
          break;
        case 'json':
          this.file.write('[\n');
          break;
        case 'csv':
          var _streamParams = this.streamParams,
              description = _streamParams.description,
              frameSize = _streamParams.frameSize;


          var header = 'time';

          if (description !== null && description.length) {
            header += ',' + description.join(',');
          } else {
            for (var i = 0; i < frameSize; i++) {
              header += ',row-' + i;
            }
          }

          header += '\n';

          this.file.write(header);
          break;
      }
    }

    /** @private */

  }, {
    key: 'finalizeStream',
    value: function finalizeStream(endTime) {
      var format = this.params.get('format');

      switch (format) {
        case 'txt':
          break;
        case 'json':
          this.file.write('\n]');
          break;
        case 'csv':
          // this.file.write(endTime.toString());
          break;
      }
    }

    // process any kind of stream
    /** @private */

  }, {
    key: 'processSignal',
    value: function processSignal() {}
    /** @private */

  }, {
    key: 'processVector',
    value: function processVector() {}
    /** @private */

  }, {
    key: 'processScalar',
    value: function processScalar() {}

    /** @private */

  }, {
    key: 'processFrame',
    value: function processFrame(frame) {
      var format = this.params.get('format');
      var str = void 0;

      switch (format) {
        case 'txt':
          str = _util2.default.format('%s\n', frame.data);
          break;
        case 'json':
          frame.data = (0, _from2.default)(frame.data);
          str = (0, _stringify2.default)(frame);

          if (!this.firstRow) str = ',\n' + str;

          this.firstRow = false;
          break;
        case 'csv':
          str = frame.time + ',';
          str += _util2.default.format('%s\n', frame.data);
          break;
      }

      this.file.write(str);
    }
  }]);
  return DataToFile;
}(_BaseLfo3.default);

exports.default = DataToFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRhdGFUb0ZpbGUuanMiXSwibmFtZXMiOlsiZGVmaW5pdGlvbnMiLCJmaWxlbmFtZSIsInR5cGUiLCJkZWZhdWx0IiwiY29uc3RhbnQiLCJmb3JtYXQiLCJsaXN0IiwiRGF0YVRvRmlsZSIsIm9wdGlvbnMiLCJmaXJzdFJvdyIsInByZXZTdHJlYW1QYXJhbXMiLCJwcmVwYXJlU3RyZWFtUGFyYW1zIiwicGFyYW1zIiwiZ2V0IiwiZmlsZSIsImNyZWF0ZVdyaXRlU3RyZWFtIiwid3JpdGUiLCJzdHJlYW1QYXJhbXMiLCJkZXNjcmlwdGlvbiIsImZyYW1lU2l6ZSIsImhlYWRlciIsImxlbmd0aCIsImpvaW4iLCJpIiwiZW5kVGltZSIsImZyYW1lIiwic3RyIiwiZGF0YSIsInRpbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsY0FBYztBQUNsQkMsWUFBVTtBQUNSQyxVQUFNLFFBREU7QUFFUkMsYUFBUyxJQUZEO0FBR1JDLGNBQVU7QUFIRixHQURRO0FBTWxCQyxVQUFRO0FBQ05ILFVBQU0sTUFEQTtBQUVOQyxhQUFTLEtBRkg7QUFHTkcsVUFBTSxDQUFDLEtBQUQsRUFBUSxNQUFSLEVBQWdCLEtBQWhCO0FBSEE7QUFOVSxDQUFwQjs7QUFrQkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUF5RE1DLFU7OztBQUNKLHdCQUEwQjtBQUFBLFFBQWRDLE9BQWMsdUVBQUosRUFBSTtBQUFBOztBQUFBLDhJQUNsQlIsV0FEa0IsRUFDTFEsT0FESzs7QUFHeEIsVUFBS0MsUUFBTCxHQUFnQixJQUFoQjtBQUh3QjtBQUl6Qjs7QUFFRDs7Ozs7d0NBQ29CQyxnQixFQUFrQjtBQUNwQyxXQUFLQyxtQkFBTCxDQUF5QkQsZ0JBQXpCOztBQUVBLFVBQU1ULFdBQVcsS0FBS1csTUFBTCxDQUFZQyxHQUFaLENBQWdCLFVBQWhCLENBQWpCO0FBQ0EsV0FBS0MsSUFBTCxHQUFZLGFBQUdDLGlCQUFILENBQXFCZCxRQUFyQixDQUFaOztBQUVBLFVBQU1JLFNBQVMsS0FBS08sTUFBTCxDQUFZQyxHQUFaLENBQWdCLFFBQWhCLENBQWY7O0FBRUEsY0FBUVIsTUFBUjtBQUNFLGFBQUssS0FBTDtBQUNFO0FBQ0YsYUFBSyxNQUFMO0FBQ0UsZUFBS1MsSUFBTCxDQUFVRSxLQUFWLENBQWdCLEtBQWhCO0FBQ0E7QUFDRixhQUFLLEtBQUw7QUFBQSw4QkFDcUMsS0FBS0MsWUFEMUM7QUFBQSxjQUNVQyxXQURWLGlCQUNVQSxXQURWO0FBQUEsY0FDdUJDLFNBRHZCLGlCQUN1QkEsU0FEdkI7OztBQUdFLGNBQUlDLFNBQVMsTUFBYjs7QUFFQSxjQUFJRixnQkFBZ0IsSUFBaEIsSUFBd0JBLFlBQVlHLE1BQXhDLEVBQWdEO0FBQzlDRCxzQkFBVSxNQUFNRixZQUFZSSxJQUFaLENBQWlCLEdBQWpCLENBQWhCO0FBQ0QsV0FGRCxNQUVPO0FBQ0wsaUJBQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJSixTQUFwQixFQUErQkksR0FBL0I7QUFDRUgsd0JBQVUsVUFBVUcsQ0FBcEI7QUFERjtBQUVEOztBQUVESCxvQkFBVSxJQUFWOztBQUVBLGVBQUtOLElBQUwsQ0FBVUUsS0FBVixDQUFnQkksTUFBaEI7QUFDQTtBQXJCSjtBQXVCRDs7QUFFRDs7OzttQ0FDZUksTyxFQUFTO0FBQ3RCLFVBQU1uQixTQUFTLEtBQUtPLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixRQUFoQixDQUFmOztBQUVBLGNBQVFSLE1BQVI7QUFDRSxhQUFLLEtBQUw7QUFDRTtBQUNGLGFBQUssTUFBTDtBQUNFLGVBQUtTLElBQUwsQ0FBVUUsS0FBVixDQUFnQixLQUFoQjtBQUNBO0FBQ0EsYUFBSyxLQUFMO0FBQ0E7QUFDQTtBQVJKO0FBVUQ7O0FBRUQ7QUFDQTs7OztvQ0FDZ0IsQ0FBRTtBQUNsQjs7OztvQ0FDZ0IsQ0FBRTtBQUNsQjs7OztvQ0FDZ0IsQ0FBRTs7QUFFbEI7Ozs7aUNBQ2FTLEssRUFBTztBQUNsQixVQUFNcEIsU0FBUyxLQUFLTyxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsUUFBaEIsQ0FBZjtBQUNBLFVBQUlhLFlBQUo7O0FBRUEsY0FBUXJCLE1BQVI7QUFDRSxhQUFLLEtBQUw7QUFDRXFCLGdCQUFNLGVBQUtyQixNQUFMLENBQVksTUFBWixFQUFvQm9CLE1BQU1FLElBQTFCLENBQU47QUFDQTtBQUNGLGFBQUssTUFBTDtBQUNFRixnQkFBTUUsSUFBTixHQUFhLG9CQUFXRixNQUFNRSxJQUFqQixDQUFiO0FBQ0FELGdCQUFNLHlCQUFlRCxLQUFmLENBQU47O0FBRUEsY0FBSSxDQUFDLEtBQUtoQixRQUFWLEVBQ0VpQixNQUFNLFFBQVFBLEdBQWQ7O0FBRUYsZUFBS2pCLFFBQUwsR0FBZ0IsS0FBaEI7QUFDQTtBQUNGLGFBQUssS0FBTDtBQUNFaUIsZ0JBQU1ELE1BQU1HLElBQU4sR0FBYSxHQUFuQjtBQUNBRixpQkFBTyxlQUFLckIsTUFBTCxDQUFZLE1BQVosRUFBb0JvQixNQUFNRSxJQUExQixDQUFQO0FBQ0E7QUFoQko7O0FBbUJBLFdBQUtiLElBQUwsQ0FBVUUsS0FBVixDQUFnQlUsR0FBaEI7QUFDRDs7Ozs7a0JBR1luQixVIiwiZmlsZSI6IkRhdGFUb0ZpbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi8uLi9jb21tb24vY29yZS9CYXNlTGZvJztcbmltcG9ydCBmc2UgZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCB1dGlsIGZyb20gJ3V0aWwnO1xuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgZmlsZW5hbWU6IHtcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICBmb3JtYXQ6IHtcbiAgICB0eXBlOiAnZW51bScsXG4gICAgZGVmYXVsdDogJ3R4dCcsXG4gICAgbGlzdDogWyd0eHQnLCAnanNvbicsICdjc3YnXSxcbiAgfSxcbiAgLy8gaGVhZGVyOiB7XG4gIC8vICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAvLyAgIGRlZmF1bHQ6IGZhbHNlLFxuICAvLyB9LFxufTtcblxuXG4vKipcbiAqIFJlY29yZCBpbnB1dCBmcmFtZXMgaW50byBhIGZpbGUuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBkZWZhdWx0IHBhcmFtZXRlcnMuXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuZmlsZW5hbWU9bnVsbF0gLSBQYXRoIG9mIHRoZSBvdXRwdXQgZmlsZS5cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5mb3JtYXQ9J3R4dCddIC0gRm9ybWF0IGluIHdoaWNoIHRoZSBkYXRhIHNob3VsZFxuICogIGJlIHN0b3JlZC4gQXZhaWxhYmxlIG9wdGlvbnM6ICd0eHQnLCAnanNvbicgb3IgJ2NzdicuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpub2RlLnNpbmtcbiAqXG4gKiBAdG9kbyAtIGFkZCBvcHRpb25zIHRvIHN0b3JlIHN0cmVhbVBhcmFtcyAoa2luZCBvZiBoZWFkZXIpXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuICogaW1wb3J0IEV2ZW50SW4gZnJvbSAnLi4vc3JjL2NvbW1vbi9zb3VyY2UvRXZlbnRJbic7XG4gKiBpbXBvcnQgTG9nZ2VyIGZyb20gJy4uL3NyYy9jb21tb24vc2luay9Mb2dnZXInO1xuICogaW1wb3J0IERhdGFUb0ZpbGUgZnJvbSAnLi4vc3JjL25vZGUvc2luay9EYXRhVG9GaWxlJztcbiAqXG4gKiAvLyBjb25zb2xlLmxvZyhwcm9jZXNzLmN3ZCgpLCBsZm8pO1xuICogLy8gcHJvY2Vzcy5leGl0KCk7XG4gKlxuICogY29uc3QgZXZlbnRJbiA9IG5ldyBFdmVudEluKHtcbiAqICAgZnJhbWVTaXplOiAyLFxuICogICBmcmFtZVJhdGU6IDEsXG4gKiAgIGZyYW1lVHlwZTogJ3ZlY3RvcicsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBkYXRhVG9GaWxlID0gbmV3IERhdGFUb0ZpbGUoe1xuICogICBmaWxlbmFtZTogcGF0aC5qb2luKF9fZGlybmFtZSwgJy4vbm9kZV9zaW5rLkRhdGFUb0ZpbGUudGVzdC5qc29uJyksXG4gKiAgIGZvcm1hdDogJ2pzb24nLFxuICogfSk7XG4gKlxuICogY29uc3QgbG9nZ2VyID0gbmV3IExvZ2dlcih7XG4gKiAgIGRhdGE6IHRydWUsXG4gKiB9KTtcbiAqXG4gKiBldmVudEluLmNvbm5lY3QobG9nZ2VyKTtcbiAqIGV2ZW50SW4uY29ubmVjdChkYXRhVG9GaWxlKTtcbiAqIGV2ZW50SW4uc3RhcnQoKTtcbiAqXG4gKiBsZXQgdGltZSA9IDA7XG4gKiBjb25zdCBwZXJpb2QgPSAxO1xuICpcbiAqIChmdW5jdGlvbiBsb29wKCl7XG4gKiAgIGNvbnN0IGRhdGEgPSBbTWF0aC5yYW5kb20oKSwgTWF0aC5yYW5kb20oKV07XG4gKiAgIGV2ZW50SW4ucHJvY2Vzcyh0aW1lLCBkYXRhKTtcbiAqXG4gKiAgIHRpbWUgKz0gcGVyaW9kO1xuICpcbiAqICAgaWYgKHRpbWUgPCAyMClcbiAqICAgICBzZXRUaW1lb3V0KGxvb3AsIDMwMCk7XG4gKiAgIGVsc2Uge1xuICogICAgIGNvbnNvbGUubG9nKCc/Pz8nKTtcbiAqICAgICBldmVudEluLnN0b3AoKTtcbiAqICAgfVxuICogfSgpKTtcbiAqL1xuY2xhc3MgRGF0YVRvRmlsZSBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmZpcnN0Um93ID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpIHtcbiAgICB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG5cbiAgICBjb25zdCBmaWxlbmFtZSA9IHRoaXMucGFyYW1zLmdldCgnZmlsZW5hbWUnKTtcbiAgICB0aGlzLmZpbGUgPSBmcy5jcmVhdGVXcml0ZVN0cmVhbShmaWxlbmFtZSk7XG5cbiAgICBjb25zdCBmb3JtYXQgPSB0aGlzLnBhcmFtcy5nZXQoJ2Zvcm1hdCcpO1xuXG4gICAgc3dpdGNoIChmb3JtYXQpIHtcbiAgICAgIGNhc2UgJ3R4dCc6XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnanNvbic6XG4gICAgICAgIHRoaXMuZmlsZS53cml0ZSgnW1xcbicpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2Nzdic6XG4gICAgICAgIGNvbnN0IHsgZGVzY3JpcHRpb24sIGZyYW1lU2l6ZcKgfSA9IHRoaXMuc3RyZWFtUGFyYW1zO1xuXG4gICAgICAgIGxldCBoZWFkZXIgPSAndGltZSc7XG5cbiAgICAgICAgaWYgKGRlc2NyaXB0aW9uICE9PSBudWxsICYmIGRlc2NyaXB0aW9uLmxlbmd0aCkge1xuICAgICAgICAgIGhlYWRlciArPSAnLCcgKyBkZXNjcmlwdGlvbi5qb2luKCcsJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZVNpemU7IGkrKylcbiAgICAgICAgICAgIGhlYWRlciArPSAnLHJvdy0nICsgaTtcbiAgICAgICAgfVxuXG4gICAgICAgIGhlYWRlciArPSAnXFxuJztcblxuICAgICAgICB0aGlzLmZpbGUud3JpdGUoaGVhZGVyKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGZpbmFsaXplU3RyZWFtKGVuZFRpbWUpIHtcbiAgICBjb25zdCBmb3JtYXQgPSB0aGlzLnBhcmFtcy5nZXQoJ2Zvcm1hdCcpO1xuXG4gICAgc3dpdGNoIChmb3JtYXQpIHtcbiAgICAgIGNhc2UgJ3R4dCc6XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnanNvbic6XG4gICAgICAgIHRoaXMuZmlsZS53cml0ZSgnXFxuXScpO1xuICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnY3N2JzpcbiAgICAgICAgLy8gdGhpcy5maWxlLndyaXRlKGVuZFRpbWUudG9TdHJpbmcoKSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8vIHByb2Nlc3MgYW55IGtpbmQgb2Ygc3RyZWFtXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU2lnbmFsKCkge31cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NWZWN0b3IoKSB7fVxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1NjYWxhcigpIHt9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NGcmFtZShmcmFtZSkge1xuICAgIGNvbnN0IGZvcm1hdCA9IHRoaXMucGFyYW1zLmdldCgnZm9ybWF0Jyk7XG4gICAgbGV0IHN0cjtcblxuICAgIHN3aXRjaCAoZm9ybWF0KSB7XG4gICAgICBjYXNlICd0eHQnOlxuICAgICAgICBzdHIgPSB1dGlsLmZvcm1hdCgnJXNcXG4nLCBmcmFtZS5kYXRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdqc29uJzpcbiAgICAgICAgZnJhbWUuZGF0YSA9IEFycmF5LmZyb20oZnJhbWUuZGF0YSk7XG4gICAgICAgIHN0ciA9IEpTT04uc3RyaW5naWZ5KGZyYW1lKTtcblxuICAgICAgICBpZiAoIXRoaXMuZmlyc3RSb3cpXG4gICAgICAgICAgc3RyID0gJyxcXG4nICsgc3RyO1xuXG4gICAgICAgIHRoaXMuZmlyc3RSb3cgPSBmYWxzZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjc3YnOlxuICAgICAgICBzdHIgPSBmcmFtZS50aW1lICsgJywnO1xuICAgICAgICBzdHIgKz0gdXRpbC5mb3JtYXQoJyVzXFxuJywgZnJhbWUuZGF0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHRoaXMuZmlsZS53cml0ZShzdHIpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERhdGFUb0ZpbGU7XG4iXX0=