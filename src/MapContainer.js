import includes from 'lodash/includes';
import map from 'lodash/map';
import hasIn from 'lodash/hasIn';
import extend from 'lodash/extend';
import pick from 'lodash/pick';
import isEqual from 'lodash/isEqual';
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
    };
  }
  componentDidMount() {
    this.mapPropsToState(this.props);
    if (this.props.includeZipRadius) {
      this.setState({
        edit: false,
      });
    }
  }
  mapPropsToState(props) {
    const polys = map(props.polygons, makeGeoJSON);
    this.setState({
      polygons: polys,
      points: this.props.points,
      rectangles: this.props.rectangles,
      circles: this.props.circles,
      edit: this.props.edit,
    });
  }
  updateShapes(e) {
    const state = this.state;
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
    this.setState(state);
    this.setState({
      edit: true,
    });
  }
  clickPoly(e) {
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
  height: PropTypes.number,
  iconHTML: PropTypes.string,
  includeZipRadius: PropTypes.boolean,
  legendComponent: PropTypes.function,
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
  tiles: 'default',
};

export default MapContainer;

