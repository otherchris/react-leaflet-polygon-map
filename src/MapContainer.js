import includes from 'lodash/includes';
import map from 'lodash/map';
import hasIn from 'lodash/hasIn';
import extend from 'lodash/extend';
import pick from 'lodash/pick';
import isEqual from 'lodash/isEqual';
import filter from 'lodash/filter';
import noop from 'lodash/noop';
import debounce from 'lodash/debounce';
import reduce from 'lodash/reduce';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import L from 'leaflet';
import React from 'react';
import MapComponent from './MapComponent';
import { makeGeoJSON } from './ConvertPoly';
import {
  getTilesUrl,
  generateIcon,
} from './MapHelpers';
import './main.css';
import getArea from './getArea';
import getCenter from './getCenter';

const areaAccumulator = (sum, val) => sum + val.properties.area;
const area = (unit, _area) => {
  let result = _area;
  switch (unit) {
  case 'miles':
    result *= 0.000000386102;
    break;
  default:
    break;
  }
  return result;
};

class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      polygons: [],
      points: [],
      rectangles: [],
      circles: [],
      drawn: {
        polys: [],
        lines: [],
        rects: [],
        circles: [],
        markers: [],
      },
      edit: false,
      markerIcon: generateIcon(props.iconHTML),
      zipRadiusCenter: [],
      totalArea: 0,
      remove: true,
    };
    this.debouncedOnChange = debounce(this.props.onChange, 100);
  }
  componentDidMount() {
    this.mapPropsToState(this.props);
    if (this.props.includeZipRadius) {
      this.setState({
        edit: false,
      });
    }
  }
  componentDidUpdate() {
    this.debouncedOnChange(this.state);
  }
  mapPropsToState(props) {
    const { unit, max } = this.props.maxArea || { unit: 'meters', max: Number.MAX_VALUE };
    const polys = map(props.polygons, (poly) => {
      const out = makeGeoJSON(poly);
      out.properties.uuid = uuid.v4();
      if (area(unit, out.properties.area) > max) out.properties.tooLarge = true;
      return out;
    });
    const c = getCenter(polys);
    const center = L.latLng(c[0], c[1]);
    this.setState({
      unit,
      center,
      maxArea: max,
      polygons: polys,
      points: this.props.points,
      rectangles: this.props.rectangles,
      circles: this.props.circles,
      edit: this.props.edit,
      totalArea: area(unit, reduce(polys, areaAccumulator, 0)),
    });
  }
  updateShapes(e) {
    const state = this.state;
    const { unit, maxArea } = state;
    state.polygons = map(this.state.polygons, (poly) => {
      const out = getArea(poly);
      if (area(unit, poly.properties.area) > maxArea) out.properties.tooLarge = true;
      return out;
    });
    state.edit = false;
    const geoJson = e.layer.toGeoJSON();
    const gJWithArea = getArea(geoJson);
    gJWithArea.properties.uuid = uuid.v4();
    geoJson.properties.editable = false;
    switch (e.layerType) {
    case 'polygon':
      state.polygons.push(gJWithArea);
      break;
    case 'circle':
      state.circles.push(geoJson);
      break;
    case 'rectangle':
      state.rectangles.push(geoJson);
      break;
    case 'marker':
      state.points.push(geoJson);
      break;
    default:
      break;
    }
    state.totalArea = area(this.state.unit, reduce(state.polygons, areaAccumulator, 0));
    this.setState(state);
    this.setState({
      edit: true,
    });
  }
  clickPoly(e) {
    console.log(e.layer.options);
    if (!this.state.edit) return;
    if (this.state.remove) {
      const _uuid = e.layer.options.uuid;
      const polygons = filter(this.state.polygons, (poly) => _uuid !== poly.properties.uuid);
      this.setState({ polygons });
      return;
    }
    const key = e.target.options.k_key;
    const index = Math.abs(key) - 1;
    const polygons = this.state.polygons;
    if (polygons[index] && polygons[index].properties) {
      polygons[index].properties.editable = !polygons[index].properties.editable;
      polygons[index].key = -1 * key;
      polygons[index] = getArea(e.layer.toGeoJSON());
    }
    this.setState({
      polygons,
      totalArea: area(this.state.unit, reduce(polygons, areaAccumulator, 0)),
    });
  }
  zipRadiusChange(e) {
    const radius = parseFloat(e.target.value);
    if (!isNaN(radius)) {
      this.setState({
        zipRadius: parseFloat(e.target.value),
      });
    } else {
      this.setState({
        zipRadius: 'NaN',
      });
    }
  }
  chooseCenter(e) {
    this.setState({
      zipRadiusCenter: e.layer.toGeoJSON().geometry.coordinates,
    });
  }
  handleSubmit(e) {
    if (this.props.maxArea && this.state.totalArea > this.props.maxArea.max) return;
    this.props.handleSubmit(this.state);
  }
  render() {
    const {
      tileLayerProps,
      width,
      tiles,
    } = this.props;
    const passThroughProps = pick(this.props, [
      'legendComponent',
      'height',
      'center',
      'style',
      'includeZipRadius',
      'zoom',
    ]);
    const tileUrl = getTilesUrl(tiles);

    return (
      <MapComponent
        center={this.state.center || L.latLng(-83, 35)}
        chooseCenter={this.chooseCenter.bind(this)}
        circles={this.state.circles}
        clickPoly={this.clickPoly.bind(this)}
        edit={this.state.edit}
        handleSubmit={this.props.handleSubmit ? this.handleSubmit.bind(this) : null}
        markerIcon={this.state.markerIcon}
        maxArea={this.state.maxArea}
        onCreated={this.updateShapes.bind(this)}
        points={this.state.points}
        polygons={this.state.polygons}
        rectangles={this.state.rectangles}
        tileLayerProps={{ url: tileUrl }}
        unit={this.state.unit}
        zipRadiusCenter={
          this.state.zipRadiusCenter ||
          this.props.zipRadiusCenter ||
          this.state.center
        }
        zipRadiusChange={this.zipRadiusChange.bind(this)}
        zipRadiusClick={''}
        {...passThroughProps}
      />
    );
  }
}

MapContainer.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number),
  circles: PropTypes.arrayOf(PropTypes.object),
  edit: PropTypes.boolean,
  encoding: PropTypes.string,
  handleSubmit: PropTypes.func,
  height: PropTypes.number,
  iconHTML: PropTypes.string,
  includeZipRadius: PropTypes.boolean,
  legendComponent: PropTypes.func,
  maxArea: PropTypes.object,
  onChange: PropTypes.func,
  points: PropTypes.arrayOf(PropTypes.array),
  polygons: PropTypes.arrayOf(PropTypes.object),
  rectangles: PropTypes.arrayOf(PropTypes.object),
  style: PropTypes.object,
  tileLayerProps: PropTypes.object,
  tiles: PropTypes.string,
  width: PropTypes.number,
  zipRadiusCenter: PropTypes.arrayOf(PropTypes.number),
  zoom: PropTypes.number,
};

MapContainer.defaultProps = {
  onChange: noop,
};

export default MapContainer;

