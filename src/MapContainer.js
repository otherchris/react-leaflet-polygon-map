import wkx from 'wkx';
import includes from 'lodash/includes';
import map from 'lodash/map';
import hasIn from 'lodash/hasIn';
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
    const polys = map(props.polygons, this.convertPoly.bind(props));
    console.log(polys)
    this.setState({
      polygons: polys,
      points: this.props.points,
    });
  }
  convertPoly(poly) {
    const encoding = this.encoding || 'base64';
    console.log('poly', poly)
    if (hasIn(poly, 'features')) return poly;
    if (includes(poly, 'POLYGON')) return {
      "type": "FeatureCollection",
      "features": [{
        "type": "Feature",
        "properties": {},
        "geometry": wkx.Geometry.parse(poly).toGeoJSON()
      }]
    }
    try {
      console.log('enc: ', encoding)
      const buf = Buffer.from(poly, encoding);
      return {
        "type": "FeatureCollection",
        "features": [{
          "type": "Feature",
          "properties": {},
          "geometry": wkx.Geometry.parse(buf).toGeoJSON()
        }]
      }
    } catch (e) {
      console.log('ERRED', e)
      return polyline.toGeoJSON(poly);
    }
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
  encoding: PropTypes.string,
};

MapContainer.defaultProps = {
  tiles: 'default',
}
export default MapContainer;

