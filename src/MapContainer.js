import extend from 'lodash/extend';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
// import { transformEncodedIntoGeoJSON } from 'transform-to-geojson';
import polyline from 'polyline';
import _ from 'lodash';
import React from 'react';
// an example to try out
import MapExample from './MapExample';

class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { polygons: [] };
  }
  componentDidMount() {
    this.mapPropsToState(this.props);
  }
  mapPropsToState(props) {
    this.setState({
      polygons: _.map(props.polygons, poly => polyline.toGeoJSON(poly)),
      points: this.props.points,
    });
  }
  getTilesUrl(str) {
    const tileUrls = {
      default: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      minimal_light: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
      minimal_dark: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
    };
    return tileUrls[str];
  }
  render() {
    const { tileLayerProps, width, height, zoom, center, tiles } = this.props;
    const tileUrl= this.getTilesUrl(tiles);
    return (
      <MapExample
        polygons={this.state.polygons}
        points={this.state.points}
        tileLayerProps={{ url: tileUrl }}
        height={height}
        zoom={zoom}
        center={center}
      />
    );
  }
}

MapContainer.propTypes = {
  polygons: PropTypes.arrayOf(PropTypes.object),
  polygons: PropTypes.arrayOf(PropTypes.array),
  tiles: PropTypes.string,
  height: PropTypes.number,
};

MapContainer.defaultProps = {
  tiles: 'default',
}
export default MapContainer;

