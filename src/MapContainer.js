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
import L from 'leaflet';
import React from 'react';
// an example to try out
import MapComponent from './MapComponent';
import convertPoly from './ConvertPoly';
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
      edit: false,
      },
      markerIcon: this.generateIcon(props.iconHTML),
    };
  }
  componentDidMount() {
    this.mapPropsToState(this.props);
  }
  mapPropsToState(props) {
    // const polys = map(props.polygons, (poly) => convertPoly(poly, { encoding: this.props.encoding }))
    const polys = map(props.polygons, convertPoly);
    console.log(polys)
    const circs = map(props.circles, convertPoly);
    const rect = map(props.rectangles, convertPoly);
    this.setState({
      polygons: polys,
      points: this.props.points,
      rectangles: rect,
      circles: circs,
      edit: this.props.edit,
    });
  }
  generateIcon(string) {
    return new L.divIcon({
      className: 'my-div-icon',
      html: this.props.iconHTML,
    });
  }
  updateShapes(e) {
    console.log(e.layer.toGeoJSON())
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
    }
    this.setState(state);
    this.setState({
      edit: true,
    })
  }
//  convertPoly(poly) {
//    const encoding = this.encoding || 'base64';
//    if (hasIn(poly, 'features')) return poly;
//    if (includes(poly, 'POLYGON')) return {
//      "type": "FeatureCollection",
//      "features": [{
//        "type": "Feature",
//        "properties": {},
//        "geometry": wkx.Geometry.parse(poly).toGeoJSON()
//      }]
//    }
//    try {
//      const buf = Buffer.from(poly, encoding);
//      return {
//        "type": "FeatureCollection",
//        "features": [{
//          "type": "Feature",
//          "properties": {},
//          "geometry": wkx.Geometry.parse(buf).toGeoJSON()
//        }]
//      }
//    } catch (e) {
//      return polyline.toGeoJSON(poly);
//    }
//  }
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
};

MapContainer.defaultProps = {
  tiles: 'default',
  iconHTML:
    `<svg width="50" height="50">
      <circle cx="25" cy="25" r="20" stroke="black" stroke-width="1" fill="red" />
    </svg>`,
}

export default MapContainer;

