import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer, GeoJSON } from 'react-leaflet';

import L from 'leaflet';

import PropTypes from 'prop-types';
import _ from 'lodash';
import 'leaflet/dist/leaflet.css';

const MapExample = (props) => {
  let { zoom, tileLayerProps, center, height } = props;
  if (!center) center = [38.19, -85.76];
  const polygons = _.map(props.polygons, (result, index) => (
    <GeoJSON style={{ color: 'red', fill: true, fillColor: 'red', fillOpacity: 0.45 }} data={result} key={ index }/>
  ));
  return (
    <Map
      style={{ height }}
      center={center}
      minZoom = {3}
      maxZoom = {19}
      zoom={zoom}
    >
      <TileLayer
        attribution={tileLayerProps.attribution}
        url={tileLayerProps.url}
      />
      {polygons}
    </Map>
  );
};

MapExample.propTypes = {
  polys: PropTypes.arrayOf(PropTypes.string),
  height: PropTypes.number,
  center: PropTypes.number,
  tileLayerProps: PropTypes.shape({
    attribution: PropTypes.string,
    url: PropTypes.string.isRequired,
  }),
};

MapExample.defaultProps = {
  height: 400,
  center: [38.19, -85.76],
  zoom: 8,
  tileLayerProps: {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
  },
};
export default MapExample;
