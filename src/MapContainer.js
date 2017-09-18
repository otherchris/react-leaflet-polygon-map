import includes from 'lodash/includes';
import map from 'lodash/map';
import hasIn from 'lodash/hasIn';
import extend from 'lodash/extend';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import L from 'leaflet';
import React from 'react';
import MapComponent from './MapComponent';
import {
  displayPoly,
  getTilesUrl,
  generateIcon,
} from './MapHelpers';
import './main.css';


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
  }
  mapPropsToState(props) {
    const polys = map(props.polygons, displayPoly);
    this.setState({
      polygons: polys,
      points: this.props.points,
      rectangles: this.props.rectangles,
      circles: this.props.circles,
      edit: this.props.edit,
    });
  }
  updateShapes(e) {
    console.log(e.layer.toGeoJSON());
    const state = this.state;
    state.edit = false;
    switch (e.layerType) {
    case 'polygon':
      state.polygons.push(e.layer.toGeoJSON());
      break;
    case 'circle':
      state.circles.push(e.layer.toGeoJSON());
      break;
    case 'rectangle':
      state.rectangles.push(e.layer.toGeoJSON());
      break;
    case 'marker':
      state.points.push(e.layer.toGeoJSON());
      break;
    default:
      break;
    }
    this.setState(state);
    this.setState({
      edit: true,
    });
  }
  render() {
    const { tileLayerProps, width, height, zoom, center, tiles } = this.props;
    const tileUrl = getTilesUrl(tiles);
    return (
      <MapComponent
        polygons={this.state.polygons}
        points={this.state.points}
        rectangles={this.state.rectangles}
        circles={this.state.circles}
        tileLayerProps={{ url: tileUrl }}
        height={height}
        zoom={zoom}
        center={center}
        edit={this.state.edit}
        onCreated={this.updateShapes.bind(this)}
        style={this.props.style}
        markerIcon={this.state.markerIcon}
        zipRadius={this.props.zipRadius}
        setCenter={this.state.setCenter || this.props.setCenter || this.state.center}
      />
    );
  }
}

MapContainer.propTypes = {
  polygons: PropTypes.arrayOf(PropTypes.object),
  points: PropTypes.arrayOf(PropTypes.array),
  rectangles: PropTypes.arrayOf(PropTypes.object),
  circles: PropTypes.arrayOf(PropTypes.object),
  tiles: PropTypes.string,
  height: PropTypes.number,
  encoding: PropTypes.string,
  iconHTML: PropTypes.string,
  edit: PropTypes.boolean,
  tileLayerProps: PropTypes.object,
  width: PropTypes.number,
  zoom: PropTypes.number,
  center: PropTypes.arrayOf(PropTypes.number),
  setCenter: PropTypes.arrayOf(PropTypes.number),
  style: PropTypes.object,
  zipRadius: PropTypes.boolean,
};

MapContainer.defaultProps = {
  tiles: 'default',
  iconHTML:
    `<svg width="50" height="50">
      <circle cx="25" cy="25" r="20" stroke="black" stroke-width="1" fill="red" />
    </svg>`,
};

export default MapContainer;

