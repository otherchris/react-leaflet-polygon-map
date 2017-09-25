import includes from 'lodash/includes';
import map from 'lodash/map';
import hasIn from 'lodash/hasIn';
import extend from 'lodash/extend';
import pick from 'lodash/pick';
import isEqual from 'lodash/isEqual';
import noop from 'lodash/noop';
import debounce from 'lodash/debounce';
import reduce from 'lodash/reduce';
import PropTypes from 'prop-types';
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

const SubmitButton = (props) => {
  const { handleSubmit, text } = props;
  return (
    <button onClick={handleSubmit}>{text}</button>
  );
};

SubmitButton.propTypes = {
  handleSubmit: PropTypes.func,
  text: PropTypes.string,
};

const areaAccumulator = (sum, val) => sum + val.properties.area;

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
    const polys = map(props.polygons, makeGeoJSON);
    this.setState({
      polygons: polys,
      points: this.props.points,
      rectangles: this.props.rectangles,
      circles: this.props.circles,
      edit: this.props.edit,
      totalArea: reduce(polys, areaAccumulator, 0),
    });
  }
  updateShapes(e) {
    const state = this.state;
    state.polygons = map(this.state.polygons, getArea);
    state.edit = false;
    const geoJson = e.layer.toGeoJSON();
    const gJWithArea = getArea(geoJson);
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
    state.totalArea = reduce(state.polygons, areaAccumulator, 0);
    this.setState(state);
    this.setState({
      edit: true,
    });
  }
  clickPoly(e) {
    if (!this.state.edit) return;
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
      totalArea: reduce(polygons, areaAccumulator, 0),
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
        chooseCenter={this.chooseCenter.bind(this)}
        circles={this.state.circles}
        clickPoly={this.clickPoly.bind(this)}
        edit={this.state.edit}
        handleSubmit={this.props.handleSubmit ? this.handleSubmit.bind(this) : null}
        markerIcon={this.state.markerIcon}
        onCreated={this.updateShapes.bind(this)}
        points={this.state.points}
        polygons={this.state.polygons}
        rectangles={this.state.rectangles}
        tileLayerProps={{ url: tileUrl }}
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

