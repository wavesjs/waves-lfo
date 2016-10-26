'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _BaseLfo2 = require('../core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var definitions = {
  state: {
    type: 'enum',
    default: 'on',
    list: ['on', 'off'],
    metas: { kind: 'dynamic' }
  }
};

/**
 * The OnOff operator allows to stop the propagation of the stream in a
 * subgraph. When "on", frames are propagated, when "off" the propagation is
 * stopped.
 *
 * The `streamParams` propagation is never bypassed so the subsequent subgraph
 * is always ready for incomming frames.
 *
 * @memberof module:common.operator
 *
 * @param {Object} options - Override default parameters.
 * @param {String} [options.state='on'] - Default state.
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * const frames = [
 *   { time: 0, data: [1, 2] },
 *   { time: 1, data: [3, 4] },
 *   { time: 2, data: [5, 6] },
 * ];
 *
 * const eventIn = new EventIn({
 *   frameSize: 2,
 *   frameRate: 0,
 *   frameType: 'vector',
 * });
 *
 * const onOff = new OnOff();
 *
 * const logger = new Logger({ data: true });
 *
 * eventIn.connect(onOff);
 * onOff.connect(logger);
 *
 * eventIn.start();
 *
 * eventIn.processFrame(frames[0]);
 * > [0, 1]
 *
 * // bypass subgraph
 * onOff.setState('off');
 * eventIn.processFrame(frames[1]);
 *
 * // re-open subgraph
 * onOff.setState('on');
 * eventIn.processFrame(frames[2]);
 * > [5, 6]
 */

var OnOff = function (_BaseLfo) {
  (0, _inherits3.default)(OnOff, _BaseLfo);

  function OnOff() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, OnOff);

    var _this = (0, _possibleConstructorReturn3.default)(this, (OnOff.__proto__ || (0, _getPrototypeOf2.default)(OnOff)).call(this, definitions, options));

    _this.state = _this.params.get('state');
    return _this;
  }

  /**
   * Set the state of the `OnOff`.
   *
   * @param {String} state - New state of the operator (`on` or `off`)
   */


  (0, _createClass3.default)(OnOff, [{
    key: 'setState',
    value: function setState(state) {
      if (definitions.state.list.indexOf(state) === -1) throw new Error('Invalid switch state value "' + state + '" [valid values: "on"/"off"]');

      this.state = state;
    }

    // define all possible stream API
    /** @private */

  }, {
    key: 'processScalar',
    value: function processScalar() {}
    /** @private */

  }, {
    key: 'processVector',
    value: function processVector() {}
    /** @private */

  }, {
    key: 'processSignal',
    value: function processSignal() {}

    /** @private */

  }, {
    key: 'processFrame',
    value: function processFrame(frame) {
      if (this.state === 'on') {
        this.prepareFrame();

        this.frame.time = frame.time;
        this.frame.metadata = frame.metadata;
        this.frame.data = frame.data;

        this.propagateFrame();
      }
    }
  }]);
  return OnOff;
}(_BaseLfo3.default);

exports.default = OnOff;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk9uT2ZmLmpzIl0sIm5hbWVzIjpbImRlZmluaXRpb25zIiwic3RhdGUiLCJ0eXBlIiwiZGVmYXVsdCIsImxpc3QiLCJtZXRhcyIsImtpbmQiLCJPbk9mZiIsIm9wdGlvbnMiLCJwYXJhbXMiLCJnZXQiLCJpbmRleE9mIiwiRXJyb3IiLCJmcmFtZSIsInByZXBhcmVGcmFtZSIsInRpbWUiLCJtZXRhZGF0YSIsImRhdGEiLCJwcm9wYWdhdGVGcmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBRUEsSUFBTUEsY0FBYztBQUNsQkMsU0FBTztBQUNMQyxVQUFNLE1BREQ7QUFFTEMsYUFBUyxJQUZKO0FBR0xDLFVBQU0sQ0FBQyxJQUFELEVBQU8sS0FBUCxDQUhEO0FBSUxDLFdBQU8sRUFBRUMsTUFBTSxTQUFSO0FBSkY7QUFEVyxDQUFwQjs7QUFTQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFpRE1DLEs7OztBQUNKLG1CQUEwQjtBQUFBLFFBQWRDLE9BQWMsdUVBQUosRUFBSTtBQUFBOztBQUFBLG9JQUNsQlIsV0FEa0IsRUFDTFEsT0FESzs7QUFHeEIsVUFBS1AsS0FBTCxHQUFhLE1BQUtRLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixPQUFoQixDQUFiO0FBSHdCO0FBSXpCOztBQUVEOzs7Ozs7Ozs7NkJBS1NULEssRUFBTztBQUNkLFVBQUlELFlBQVlDLEtBQVosQ0FBa0JHLElBQWxCLENBQXVCTyxPQUF2QixDQUErQlYsS0FBL0IsTUFBMEMsQ0FBQyxDQUEvQyxFQUNFLE1BQU0sSUFBSVcsS0FBSixrQ0FBeUNYLEtBQXpDLGtDQUFOOztBQUVGLFdBQUtBLEtBQUwsR0FBYUEsS0FBYjtBQUNEOztBQUVEO0FBQ0E7Ozs7b0NBQ2dCLENBQUU7QUFDbEI7Ozs7b0NBQ2dCLENBQUU7QUFDbEI7Ozs7b0NBQ2dCLENBQUU7O0FBRWxCOzs7O2lDQUNhWSxLLEVBQU87QUFDbEIsVUFBSSxLQUFLWixLQUFMLEtBQWUsSUFBbkIsRUFBeUI7QUFDdkIsYUFBS2EsWUFBTDs7QUFFQSxhQUFLRCxLQUFMLENBQVdFLElBQVgsR0FBa0JGLE1BQU1FLElBQXhCO0FBQ0EsYUFBS0YsS0FBTCxDQUFXRyxRQUFYLEdBQXNCSCxNQUFNRyxRQUE1QjtBQUNBLGFBQUtILEtBQUwsQ0FBV0ksSUFBWCxHQUFrQkosTUFBTUksSUFBeEI7O0FBRUEsYUFBS0MsY0FBTDtBQUNEO0FBQ0Y7Ozs7O2tCQUdZWCxLIiwiZmlsZSI6Ik9uT2ZmLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vY29yZS9CYXNlTGZvJztcblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIHN0YXRlOiB7XG4gICAgdHlwZTogJ2VudW0nLFxuICAgIGRlZmF1bHQ6ICdvbicsXG4gICAgbGlzdDogWydvbicsICdvZmYnXSxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfSxcbn07XG5cbi8qKlxuICogVGhlIE9uT2ZmIG9wZXJhdG9yIGFsbG93cyB0byBzdG9wIHRoZSBwcm9wYWdhdGlvbiBvZiB0aGUgc3RyZWFtIGluIGFcbiAqIHN1YmdyYXBoLiBXaGVuIFwib25cIiwgZnJhbWVzIGFyZSBwcm9wYWdhdGVkLCB3aGVuIFwib2ZmXCIgdGhlIHByb3BhZ2F0aW9uIGlzXG4gKiBzdG9wcGVkLlxuICpcbiAqIFRoZSBgc3RyZWFtUGFyYW1zYCBwcm9wYWdhdGlvbiBpcyBuZXZlciBieXBhc3NlZCBzbyB0aGUgc3Vic2VxdWVudCBzdWJncmFwaFxuICogaXMgYWx3YXlzIHJlYWR5IGZvciBpbmNvbW1pbmcgZnJhbWVzLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLm9wZXJhdG9yXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBkZWZhdWx0IHBhcmFtZXRlcnMuXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuc3RhdGU9J29uJ10gLSBEZWZhdWx0IHN0YXRlLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NsaWVudCc7XG4gKlxuICogY29uc3QgZnJhbWVzID0gW1xuICogICB7IHRpbWU6IDAsIGRhdGE6IFsxLCAyXSB9LFxuICogICB7IHRpbWU6IDEsIGRhdGE6IFszLCA0XSB9LFxuICogICB7IHRpbWU6IDIsIGRhdGE6IFs1LCA2XSB9LFxuICogXTtcbiAqXG4gKiBjb25zdCBldmVudEluID0gbmV3IEV2ZW50SW4oe1xuICogICBmcmFtZVNpemU6IDIsXG4gKiAgIGZyYW1lUmF0ZTogMCxcbiAqICAgZnJhbWVUeXBlOiAndmVjdG9yJyxcbiAqIH0pO1xuICpcbiAqIGNvbnN0IG9uT2ZmID0gbmV3IE9uT2ZmKCk7XG4gKlxuICogY29uc3QgbG9nZ2VyID0gbmV3IExvZ2dlcih7IGRhdGE6IHRydWUgfSk7XG4gKlxuICogZXZlbnRJbi5jb25uZWN0KG9uT2ZmKTtcbiAqIG9uT2ZmLmNvbm5lY3QobG9nZ2VyKTtcbiAqXG4gKiBldmVudEluLnN0YXJ0KCk7XG4gKlxuICogZXZlbnRJbi5wcm9jZXNzRnJhbWUoZnJhbWVzWzBdKTtcbiAqID4gWzAsIDFdXG4gKlxuICogLy8gYnlwYXNzIHN1YmdyYXBoXG4gKiBvbk9mZi5zZXRTdGF0ZSgnb2ZmJyk7XG4gKiBldmVudEluLnByb2Nlc3NGcmFtZShmcmFtZXNbMV0pO1xuICpcbiAqIC8vIHJlLW9wZW4gc3ViZ3JhcGhcbiAqIG9uT2ZmLnNldFN0YXRlKCdvbicpO1xuICogZXZlbnRJbi5wcm9jZXNzRnJhbWUoZnJhbWVzWzJdKTtcbiAqID4gWzUsIDZdXG4gKi9cbmNsYXNzIE9uT2ZmIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMuc3RhdGUgPSB0aGlzLnBhcmFtcy5nZXQoJ3N0YXRlJyk7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBzdGF0ZSBvZiB0aGUgYE9uT2ZmYC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0YXRlIC0gTmV3IHN0YXRlIG9mIHRoZSBvcGVyYXRvciAoYG9uYCBvciBgb2ZmYClcbiAgICovXG4gIHNldFN0YXRlKHN0YXRlKSB7XG4gICAgaWYgKGRlZmluaXRpb25zLnN0YXRlLmxpc3QuaW5kZXhPZihzdGF0ZSkgPT09IC0xKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHN3aXRjaCBzdGF0ZSB2YWx1ZSBcIiR7c3RhdGV9XCIgW3ZhbGlkIHZhbHVlczogXCJvblwiL1wib2ZmXCJdYCk7XG5cbiAgICB0aGlzLnN0YXRlID0gc3RhdGU7XG4gIH1cblxuICAvLyBkZWZpbmUgYWxsIHBvc3NpYmxlIHN0cmVhbSBBUElcbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTY2FsYXIoKSB7fVxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1ZlY3RvcigpIHt9XG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU2lnbmFsKCkge31cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc0ZyYW1lKGZyYW1lKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUgPT09ICdvbicpIHtcbiAgICAgIHRoaXMucHJlcGFyZUZyYW1lKCk7XG5cbiAgICAgIHRoaXMuZnJhbWUudGltZSA9IGZyYW1lLnRpbWU7XG4gICAgICB0aGlzLmZyYW1lLm1ldGFkYXRhID0gZnJhbWUubWV0YWRhdGE7XG4gICAgICB0aGlzLmZyYW1lLmRhdGEgPSBmcmFtZS5kYXRhO1xuXG4gICAgICB0aGlzLnByb3BhZ2F0ZUZyYW1lKCk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE9uT2ZmO1xuIl19