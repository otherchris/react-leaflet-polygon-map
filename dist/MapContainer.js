'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extend = require('lodash/extend');

var _extend2 = _interopRequireDefault(_extend);

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mapExample = require('map-example');

var _mapExample2 = _interopRequireDefault(_mapExample);

var _transformToGeojson = require('transform-to-geojson');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MapContainer = function (_React$Component) {
  _inherits(MapContainer, _React$Component);

  function MapContainer(props) {
    _classCallCheck(this, MapContainer);

    var _this = _possibleConstructorReturn(this, (MapContainer.__proto__ || Object.getPrototypeOf(MapContainer)).call(this, props));

    _this.state = { polys: [] };
    _this.mapPropsToState = _this.mapPropsToState.bind(_this);
    return _this;
  }

  _createClass(MapContainer, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.mapPropsToState(this.props);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.mapPropsToState(nextProps);
    }

    // transform whatever we get from props into internal component state
    // this is bascially a "cache" of the tranformed data

  }, {
    key: 'mapPropsToState',
    value: function mapPropsToState(props) {
      // TODO take whatever inputs, and construct valid geojson
      // NOTE this can be better done outside of React components, perhaps a utility library
      // eg: extend(geojson, transformPolygonsIntoGeojson(props.polygons))
      if (this.props.geozips.every(function (entry) {
        return entry.path;
      })) {
        var geojsons = _lodash2.default.map(this.props.geozips, function (geozip) {
          var result = (0, _transformToGeojson.transformEncodedIntoGeojson)(geozip.path);
          result.properties.zip = geozip.zip;
          return result;
        });

        if (!(0, _isEqual2.default)(geojsons, this.state.geojsons)) {
          this.setState({ geojsons: geojsons });
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_mapExample2.default, { geojsons: this.state.geojsons });
    }
  }]);

  return MapContainer;
}(_react2.default.Component);

MapContainer.propTypes = {
  geozips: _propTypes2.default.arrayOf(_propTypes2.default.object)
};

exports.default = MapContainer;