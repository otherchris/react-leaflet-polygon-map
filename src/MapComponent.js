import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer, GeoJSON, FeatureGroup, Circle, Rectangle } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw";
import ZipRadiusControl from './ZipRadiusControl';

import L from 'leaflet';

import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import 'leaflet/dist/leaflet.css';
import './main.css';

const style = {
  color: 'red',
  fill: true,
  fillColor: 'red',
  fillOpacity: 0.45,
}

const MapComponent = (props) => {
  const  { zoom, tileLayerProps, center, height, radius } = props;
  merge(style, props.style)
  const polygons = _.map(props.polygons, (result, index) => (
    <GeoJSON style={style} data={result} key={ index }/>
  ));
  const points = _.map(props.points, (result, index) => (
    <Marker position={result} key={index} icon={props.markerIcon} />
  ));
  const circles = _.map(props.circles, (result, index) => (
    <Circle style={style} data={result} key={index} center={result.center} radius={result.radius} />
  ));
  const rectangles = _.map(props.rectangles, (result, index) => (
    <Rectangle style={style} data={result} key={index} bounds={result.bounds} />
  ));
  const editTools = props.edit ?
      <FeatureGroup>
        <EditControl
          position='topright'
          draw={{
            rectangle: false,
            circle: false,
          }}
          onCreated={props.onCreated}
        />
      </FeatureGroup>
      : null
  return (
    <div>
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
        {editTools}
        {polygons}
        {points}
        {circles}
        {rectangles}
      </Map>
      <ZipRadiusControl center={props.center || "Choose a center"}/>
    </div>
  );
};

MapComponent.propTypes = {
  onCreated: PropTypes.function,
  polys: PropTypes.arrayOf(PropTypes.string),
  points: PropTypes.arrayOf(PropTypes.object),
  circles: PropTypes.arrayOf(PropTypes.object),
  height: PropTypes.number,
  center: PropTypes.number,
  tileLayerProps: PropTypes.shape({
    attribution: PropTypes.string,
    url: PropTypes.string.isRequired,
  }),
  markerIcon: PropTypes.object,
};

MapComponent.defaultProps = {
  height: 400,
  center: [38.19, -85.76],
  zoom: 11,
};
export default MapComponent;
