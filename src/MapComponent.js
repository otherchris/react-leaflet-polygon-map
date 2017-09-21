import React, { Component } from 'react';
// eslint-disable-next-line max-len
import L from 'leaflet';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import map from 'lodash/map';
import 'leaflet/dist/leaflet.css';
import {
  Map,
  Marker,
  Popup,
  TileLayer,
  GeoJSON,
  FeatureGroup,
  Circle,
  Rectangle,
  Tooltip,
} from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import ZipRadiusControl from './ZipRadiusControl';
import './main.css';

const style = {
  color: 'red',
  fill: true,
  fillColor: 'red',
  fillOpacity: 0.45,
};

const editTools = (p) => {
  if (p.includeZipRadius) {
    return (
      <FeatureGroup>
        <EditControl
          position='topright'
          draw={{
            polyline: false,
            polygon: false,
            rectangle: false,
            circle: false,
            marker: {
              icon: p.markerIcon,
            },
          }}
          onCreated={p.chooseCenter}
        />
      </FeatureGroup>
    );
  } else if (p.edit) {
    return (
      <FeatureGroup>
        <EditControl
          position='topright'
          draw={{
            polyline: false,
            rectangle: false,
            circle: false,
            marker: {
              icon: p.markerIcon,
            },
          }}
          onCreated={p.onCreated}
        />
      </FeatureGroup>
    );
  }
  return null;
};

const Legend = (LegendComponent, props) => (
  <div className="map-legend">
    <LegendComponent {...props} />
  </div>
);

const MapComponent = (props) => {
  const { zoom, tileLayerProps, center, height, includeZipRadius } = props;
  merge(style, props.style);
  const polygons = map(props.polygons, (result, index) => (
    <GeoJSON
      style={style}
      data={result}
      key={result.key || index + 1}
      k_key={result.key || index + 1}
      editable={!!(result.properties && result.properties.editable)}
      onClick={props.clickPoly}
    >
      <Tooltip>
        <span>{result.area}</span>
      </Tooltip>
    </GeoJSON>
  ));
  const points = map(props.points, (result, index) => (
    <Marker position={result} key={index} icon={props.markerIcon} />
  ));
  const circles = map(props.circles, (result, index) => (
    <Circle {...style} data={result} key={index} center={result.center} radius={result.radius} >
      <Tooltip>
        <span>{result.area}</span>
      </Tooltip>
    </Circle>
  ));
  const rectangles = map(props.rectangles, (result, index) => (
    <Rectangle {...style} data={result} key={index} bounds={result.bounds} >
      <Tooltip>
        <span>{result.area}</span>
      </Tooltip>
    </Rectangle>
  ));
  const editComponent = editTools(props);
  const zipRadiusControl = includeZipRadius ? (
    <ZipRadiusControl
      center={props.setCenter || 'Choose a center'}
      zipRadiusChange={props.zipRadiusChange}
    />
  ) : <div></div>;
  const legend = props.legendComponent ? Legend(props.legendComponent, props.legendProps) : '';
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
        {editComponent}
        {polygons}
        {points}
        {circles}
        {rectangles}
      </Map>
      <div className="below-map">
        {zipRadiusControl}
        {legend}
      </div>
    </div>
  );
};

MapComponent.propTypes = {
  center: PropTypes.number,
  circles: PropTypes.arrayOf(PropTypes.object),
  edit: PropTypes.boolean,
  height: PropTypes.number,
  includeZipRadius: PropTypes.boolean,
  markerIcon: PropTypes.object,
  legendComponent: PropTypes.function,
  legendProps: PropTypes.object,
  onCreated: PropTypes.function,
  points: PropTypes.arrayOf(PropTypes.object),
  polygons: PropTypes.arrayOf(PropTypes.string),
  rectangles: PropTypes.arrayOf(PropTypes.object),
  setCenter: PropTypes.arrayOf(PropTypes.number),
  style: PropTypes.object,
  tileLayerProps: PropTypes.shape({
    attribution: PropTypes.string,
    url: PropTypes.string.isRequired,
  }),
  zipRadiusChange: PropTypes.function,
  zoom: PropTypes.number,
};

MapComponent.defaultProps = {
  height: 400,
  center: [38.19, -85.76],
  zoom: 11,
};
export default MapComponent;
