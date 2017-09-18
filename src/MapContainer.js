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
        center={center}
        circles={this.state.circles}
        edit={this.state.edit}
        height={height}
        markerIcon={this.state.markerIcon}
        onCreated={this.updateShapes.bind(this)}
        points={this.state.points}
        polygons={this.state.polygons}
        rectangles={this.state.rectangles}
        style={this.props.style}
        tileLayerProps={{ url: tileUrl }}
        zipRadius={this.props.zipRadius}
        zipRadiusCenter={
          this.state.zipRadiusCenter ||
          this.props.zipRadiusCenter ||
          this.state.center
        }
        zoom={zoom}
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
  points: PropTypes.arrayOf(PropTypes.array),
  polygons: PropTypes.arrayOf(PropTypes.object),
  rectangles: PropTypes.arrayOf(PropTypes.object),
  style: PropTypes.object,
  tileLayerProps: PropTypes.object,
  tiles: PropTypes.string,
  width: PropTypes.number,
  zipRadius: PropTypes.boolean,
  zipRadiusCenter: PropTypes.arrayOf(PropTypes.number),
  zoom: PropTypes.number,
};

MapContainer.defaultProps = {
  tiles: 'default',
  iconHTML:
    `<svg width="50" height="50">
      <circle cx="25" cy="25" r="20" stroke="black" stroke-width="1" fill="red" />
    </svg>`,
};

export default MapContainer;

