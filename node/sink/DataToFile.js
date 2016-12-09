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

var _BaseLfo2 = require('../../core/BaseLfo');

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRhdGFUb0ZpbGUuanMiXSwibmFtZXMiOlsiZGVmaW5pdGlvbnMiLCJmaWxlbmFtZSIsInR5cGUiLCJkZWZhdWx0IiwiY29uc3RhbnQiLCJmb3JtYXQiLCJsaXN0IiwiRGF0YVRvRmlsZSIsIm9wdGlvbnMiLCJmaXJzdFJvdyIsInByZXZTdHJlYW1QYXJhbXMiLCJwcmVwYXJlU3RyZWFtUGFyYW1zIiwicGFyYW1zIiwiZ2V0IiwiZmlsZSIsImNyZWF0ZVdyaXRlU3RyZWFtIiwid3JpdGUiLCJzdHJlYW1QYXJhbXMiLCJkZXNjcmlwdGlvbiIsImZyYW1lU2l6ZSIsImhlYWRlciIsImxlbmd0aCIsImpvaW4iLCJpIiwiZW5kVGltZSIsImZyYW1lIiwic3RyIiwiZGF0YSIsInRpbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsY0FBYztBQUNsQkMsWUFBVTtBQUNSQyxVQUFNLFFBREU7QUFFUkMsYUFBUyxJQUZEO0FBR1JDLGNBQVU7QUFIRixHQURRO0FBTWxCQyxVQUFRO0FBQ05ILFVBQU0sTUFEQTtBQUVOQyxhQUFTLEtBRkg7QUFHTkcsVUFBTSxDQUFDLEtBQUQsRUFBUSxNQUFSLEVBQWdCLEtBQWhCO0FBSEE7QUFOVSxDQUFwQjs7QUFrQkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUF5RE1DLFU7OztBQUNKLHdCQUEwQjtBQUFBLFFBQWRDLE9BQWMsdUVBQUosRUFBSTtBQUFBOztBQUFBLDhJQUNsQlIsV0FEa0IsRUFDTFEsT0FESzs7QUFHeEIsVUFBS0MsUUFBTCxHQUFnQixJQUFoQjtBQUh3QjtBQUl6Qjs7QUFFRDs7Ozs7d0NBQ29CQyxnQixFQUFrQjtBQUNwQyxXQUFLQyxtQkFBTCxDQUF5QkQsZ0JBQXpCOztBQUVBLFVBQU1ULFdBQVcsS0FBS1csTUFBTCxDQUFZQyxHQUFaLENBQWdCLFVBQWhCLENBQWpCO0FBQ0EsV0FBS0MsSUFBTCxHQUFZLGFBQUdDLGlCQUFILENBQXFCZCxRQUFyQixDQUFaOztBQUVBLFVBQU1JLFNBQVMsS0FBS08sTUFBTCxDQUFZQyxHQUFaLENBQWdCLFFBQWhCLENBQWY7O0FBRUEsY0FBUVIsTUFBUjtBQUNFLGFBQUssS0FBTDtBQUNFO0FBQ0YsYUFBSyxNQUFMO0FBQ0UsZUFBS1MsSUFBTCxDQUFVRSxLQUFWLENBQWdCLEtBQWhCO0FBQ0E7QUFDRixhQUFLLEtBQUw7QUFBQSw4QkFDcUMsS0FBS0MsWUFEMUM7QUFBQSxjQUNVQyxXQURWLGlCQUNVQSxXQURWO0FBQUEsY0FDdUJDLFNBRHZCLGlCQUN1QkEsU0FEdkI7OztBQUdFLGNBQUlDLFNBQVMsTUFBYjs7QUFFQSxjQUFJRixnQkFBZ0IsSUFBaEIsSUFBd0JBLFlBQVlHLE1BQXhDLEVBQWdEO0FBQzlDRCxzQkFBVSxNQUFNRixZQUFZSSxJQUFaLENBQWlCLEdBQWpCLENBQWhCO0FBQ0QsV0FGRCxNQUVPO0FBQ0wsaUJBQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJSixTQUFwQixFQUErQkksR0FBL0I7QUFDRUgsd0JBQVUsVUFBVUcsQ0FBcEI7QUFERjtBQUVEOztBQUVESCxvQkFBVSxJQUFWOztBQUVBLGVBQUtOLElBQUwsQ0FBVUUsS0FBVixDQUFnQkksTUFBaEI7QUFDQTtBQXJCSjtBQXVCRDs7QUFFRDs7OzttQ0FDZUksTyxFQUFTO0FBQ3RCLFVBQU1uQixTQUFTLEtBQUtPLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixRQUFoQixDQUFmOztBQUVBLGNBQVFSLE1BQVI7QUFDRSxhQUFLLEtBQUw7QUFDRTtBQUNGLGFBQUssTUFBTDtBQUNFLGVBQUtTLElBQUwsQ0FBVUUsS0FBVixDQUFnQixLQUFoQjtBQUNBO0FBQ0EsYUFBSyxLQUFMO0FBQ0E7QUFDQTtBQVJKO0FBVUQ7O0FBRUQ7QUFDQTs7OztvQ0FDZ0IsQ0FBRTtBQUNsQjs7OztvQ0FDZ0IsQ0FBRTtBQUNsQjs7OztvQ0FDZ0IsQ0FBRTs7QUFFbEI7Ozs7aUNBQ2FTLEssRUFBTztBQUNsQixVQUFNcEIsU0FBUyxLQUFLTyxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsUUFBaEIsQ0FBZjtBQUNBLFVBQUlhLFlBQUo7O0FBRUEsY0FBUXJCLE1BQVI7QUFDRSxhQUFLLEtBQUw7QUFDRXFCLGdCQUFNLGVBQUtyQixNQUFMLENBQVksTUFBWixFQUFvQm9CLE1BQU1FLElBQTFCLENBQU47QUFDQTtBQUNGLGFBQUssTUFBTDtBQUNFRixnQkFBTUUsSUFBTixHQUFhLG9CQUFXRixNQUFNRSxJQUFqQixDQUFiO0FBQ0FELGdCQUFNLHlCQUFlRCxLQUFmLENBQU47O0FBRUEsY0FBSSxDQUFDLEtBQUtoQixRQUFWLEVBQ0VpQixNQUFNLFFBQVFBLEdBQWQ7O0FBRUYsZUFBS2pCLFFBQUwsR0FBZ0IsS0FBaEI7QUFDQTtBQUNGLGFBQUssS0FBTDtBQUNFaUIsZ0JBQU1ELE1BQU1HLElBQU4sR0FBYSxHQUFuQjtBQUNBRixpQkFBTyxlQUFLckIsTUFBTCxDQUFZLE1BQVosRUFBb0JvQixNQUFNRSxJQUExQixDQUFQO0FBQ0E7QUFoQko7O0FBbUJBLFdBQUtiLElBQUwsQ0FBVUUsS0FBVixDQUFnQlUsR0FBaEI7QUFDRDs7Ozs7a0JBR1luQixVIiwiZmlsZSI6IkRhdGFUb0ZpbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi8uLi9jb3JlL0Jhc2VMZm8nO1xuaW1wb3J0IGZzZSBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHV0aWwgZnJvbSAndXRpbCc7XG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBmaWxlbmFtZToge1xuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIGZvcm1hdDoge1xuICAgIHR5cGU6ICdlbnVtJyxcbiAgICBkZWZhdWx0OiAndHh0JyxcbiAgICBsaXN0OiBbJ3R4dCcsICdqc29uJywgJ2NzdiddLFxuICB9LFxuICAvLyBoZWFkZXI6IHtcbiAgLy8gICB0eXBlOiAnYm9vbGVhbicsXG4gIC8vICAgZGVmYXVsdDogZmFsc2UsXG4gIC8vIH0sXG59O1xuXG5cbi8qKlxuICogUmVjb3JkIGlucHV0IGZyYW1lcyBpbnRvIGEgZmlsZS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHQgcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5maWxlbmFtZT1udWxsXSAtIFBhdGggb2YgdGhlIG91dHB1dCBmaWxlLlxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmZvcm1hdD0ndHh0J10gLSBGb3JtYXQgaW4gd2hpY2ggdGhlIGRhdGEgc2hvdWxkXG4gKiAgYmUgc3RvcmVkLiBBdmFpbGFibGUgb3B0aW9uczogJ3R4dCcsICdqc29uJyBvciAnY3N2Jy5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOm5vZGUuc2lua1xuICpcbiAqIEB0b2RvIC0gYWRkIG9wdGlvbnMgdG8gc3RvcmUgc3RyZWFtUGFyYW1zIChraW5kIG9mIGhlYWRlcilcbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG4gKiBpbXBvcnQgRXZlbnRJbiBmcm9tICcuLi9zcmMvY29tbW9uL3NvdXJjZS9FdmVudEluJztcbiAqIGltcG9ydCBMb2dnZXIgZnJvbSAnLi4vc3JjL2NvbW1vbi9zaW5rL0xvZ2dlcic7XG4gKiBpbXBvcnQgRGF0YVRvRmlsZSBmcm9tICcuLi9zcmMvbm9kZS9zaW5rL0RhdGFUb0ZpbGUnO1xuICpcbiAqIC8vIGNvbnNvbGUubG9nKHByb2Nlc3MuY3dkKCksIGxmbyk7XG4gKiAvLyBwcm9jZXNzLmV4aXQoKTtcbiAqXG4gKiBjb25zdCBldmVudEluID0gbmV3IEV2ZW50SW4oe1xuICogICBmcmFtZVNpemU6IDIsXG4gKiAgIGZyYW1lUmF0ZTogMSxcbiAqICAgZnJhbWVUeXBlOiAndmVjdG9yJyxcbiAqIH0pO1xuICpcbiAqIGNvbnN0IGRhdGFUb0ZpbGUgPSBuZXcgRGF0YVRvRmlsZSh7XG4gKiAgIGZpbGVuYW1lOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi9ub2RlX3NpbmsuRGF0YVRvRmlsZS50ZXN0Lmpzb24nKSxcbiAqICAgZm9ybWF0OiAnanNvbicsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBsb2dnZXIgPSBuZXcgTG9nZ2VyKHtcbiAqICAgZGF0YTogdHJ1ZSxcbiAqIH0pO1xuICpcbiAqIGV2ZW50SW4uY29ubmVjdChsb2dnZXIpO1xuICogZXZlbnRJbi5jb25uZWN0KGRhdGFUb0ZpbGUpO1xuICogZXZlbnRJbi5zdGFydCgpO1xuICpcbiAqIGxldCB0aW1lID0gMDtcbiAqIGNvbnN0IHBlcmlvZCA9IDE7XG4gKlxuICogKGZ1bmN0aW9uIGxvb3AoKXtcbiAqICAgY29uc3QgZGF0YSA9IFtNYXRoLnJhbmRvbSgpLCBNYXRoLnJhbmRvbSgpXTtcbiAqICAgZXZlbnRJbi5wcm9jZXNzKHRpbWUsIGRhdGEpO1xuICpcbiAqICAgdGltZSArPSBwZXJpb2Q7XG4gKlxuICogICBpZiAodGltZSA8IDIwKVxuICogICAgIHNldFRpbWVvdXQobG9vcCwgMzAwKTtcbiAqICAgZWxzZSB7XG4gKiAgICAgY29uc29sZS5sb2coJz8/PycpO1xuICogICAgIGV2ZW50SW4uc3RvcCgpO1xuICogICB9XG4gKiB9KCkpO1xuICovXG5jbGFzcyBEYXRhVG9GaWxlIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMuZmlyc3RSb3cgPSB0cnVlO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcykge1xuICAgIHRoaXMucHJlcGFyZVN0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKTtcblxuICAgIGNvbnN0IGZpbGVuYW1lID0gdGhpcy5wYXJhbXMuZ2V0KCdmaWxlbmFtZScpO1xuICAgIHRoaXMuZmlsZSA9IGZzLmNyZWF0ZVdyaXRlU3RyZWFtKGZpbGVuYW1lKTtcblxuICAgIGNvbnN0IGZvcm1hdCA9IHRoaXMucGFyYW1zLmdldCgnZm9ybWF0Jyk7XG5cbiAgICBzd2l0Y2ggKGZvcm1hdCkge1xuICAgICAgY2FzZSAndHh0JzpcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdqc29uJzpcbiAgICAgICAgdGhpcy5maWxlLndyaXRlKCdbXFxuJyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY3N2JzpcbiAgICAgICAgY29uc3QgeyBkZXNjcmlwdGlvbiwgZnJhbWVTaXplwqB9ID0gdGhpcy5zdHJlYW1QYXJhbXM7XG5cbiAgICAgICAgbGV0IGhlYWRlciA9ICd0aW1lJztcblxuICAgICAgICBpZiAoZGVzY3JpcHRpb24gIT09IG51bGwgJiYgZGVzY3JpcHRpb24ubGVuZ3RoKSB7XG4gICAgICAgICAgaGVhZGVyICs9ICcsJyArIGRlc2NyaXB0aW9uLmpvaW4oJywnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZyYW1lU2l6ZTsgaSsrKVxuICAgICAgICAgICAgaGVhZGVyICs9ICcscm93LScgKyBpO1xuICAgICAgICB9XG5cbiAgICAgICAgaGVhZGVyICs9ICdcXG4nO1xuXG4gICAgICAgIHRoaXMuZmlsZS53cml0ZShoZWFkZXIpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgZmluYWxpemVTdHJlYW0oZW5kVGltZSkge1xuICAgIGNvbnN0IGZvcm1hdCA9IHRoaXMucGFyYW1zLmdldCgnZm9ybWF0Jyk7XG5cbiAgICBzd2l0Y2ggKGZvcm1hdCkge1xuICAgICAgY2FzZSAndHh0JzpcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdqc29uJzpcbiAgICAgICAgdGhpcy5maWxlLndyaXRlKCdcXG5dJyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdjc3YnOlxuICAgICAgICAvLyB0aGlzLmZpbGUud3JpdGUoZW5kVGltZS50b1N0cmluZygpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLy8gcHJvY2VzcyBhbnkga2luZCBvZiBzdHJlYW1cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTaWduYWwoKSB7fVxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1ZlY3RvcigpIHt9XG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU2NhbGFyKCkge31cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc0ZyYW1lKGZyYW1lKSB7XG4gICAgY29uc3QgZm9ybWF0ID0gdGhpcy5wYXJhbXMuZ2V0KCdmb3JtYXQnKTtcbiAgICBsZXQgc3RyO1xuXG4gICAgc3dpdGNoIChmb3JtYXQpIHtcbiAgICAgIGNhc2UgJ3R4dCc6XG4gICAgICAgIHN0ciA9IHV0aWwuZm9ybWF0KCclc1xcbicsIGZyYW1lLmRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2pzb24nOlxuICAgICAgICBmcmFtZS5kYXRhID0gQXJyYXkuZnJvbShmcmFtZS5kYXRhKTtcbiAgICAgICAgc3RyID0gSlNPTi5zdHJpbmdpZnkoZnJhbWUpO1xuXG4gICAgICAgIGlmICghdGhpcy5maXJzdFJvdylcbiAgICAgICAgICBzdHIgPSAnLFxcbicgKyBzdHI7XG5cbiAgICAgICAgdGhpcy5maXJzdFJvdyA9IGZhbHNlO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2Nzdic6XG4gICAgICAgIHN0ciA9IGZyYW1lLnRpbWUgKyAnLCc7XG4gICAgICAgIHN0ciArPSB1dGlsLmZvcm1hdCgnJXNcXG4nLCBmcmFtZS5kYXRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgdGhpcy5maWxlLndyaXRlKHN0cik7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRGF0YVRvRmlsZTtcbiJdfQ==