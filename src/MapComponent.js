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
import getArea from './getArea';

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
          edit={{
            edit: false,
            remove: false,
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
          edit={{
            edit: false,
            remove: false,
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

const MapSubmitButton = (submitFunc, text, disable) => (
  <div className="map-submit-button">
    <button
      onClick={submitFunc}
      className={disable ? 'button-disable' : ''}
    >
      {text}
    </button>
  </div>
);

MapSubmitButton.propTypes = {
  handleSubmit: PropTypes.func,
  text: PropTypes.string,
};

const MapComponent = (props) => {
  const { zoom, tileLayerProps, center, height, includeZipRadius } = props;
  merge(style, props.style);
  const polyWithArea = map(props.polygons, getArea);
  const polygons = map(polyWithArea, (result, index) => {
    const p = result.properties;
    return (
      <GeoJSON
        uuid={p.uuid}
        index={index}
        style={style}
        data={result}
        key={result.key || index + 1}
        k_key={result.key || index + 1}
        editable={!!(result.properties && result.properties.editable)}
        onClick={props.clickPoly}
      >
        <Tooltip>
          <span>
            {Math.ceil(p.area)} sq. {props.unit} {p.tooLarge ? 'TOO LARGE!' : ''}
          </span>
        </Tooltip>
      </GeoJSON>
    );
  });
  const points = map(props.points, (result, index) => (
    <Marker position={result} key={index} icon={props.markerIcon}>
      <Tooltip>
        <span>{`(${result[1].toFixed(4)}, ${result[0].toFixed(4)})`}</span>
      </Tooltip>
    </Marker>
  ));
  const circles = map(props.circles, (result, index) => {
    const p = result.properties;
    return (
      <Circle {...style} data={result} key={index} center={result.center} radius={result.radius}>
        <Tooltip>
          <span>
            {Math.ceil(p.area)} sq. {props.unit} {p.tooLarge ? 'TOO LARGE!' : ''}
          </span>
        </Tooltip>
      </Circle>
    );
  });
  const rectangles = map(props.rectangles, (result, index) => {
    const p = result.properties;
    return (
      <Rectangle {...style} data={result} key={index} center={result.center} radius={result.radius}>
        <Tooltip>
          <span>
            {Math.ceil(p.area)} sq. {props.unit} {p.tooLarge ? 'TOO LARGE!' : ''}
          </span>
        </Tooltip>
      </Rectangle>
    );
  });
  const editComponent = editTools(props);
  const zipRadiusControl = includeZipRadius ? (
    <ZipRadiusControl
      center={props.setCenter || 'Choose a center'}
      zipRadiusChange={props.zipRadiusChange}
    />
  ) : <div></div>;
  const legend = props.legendComponent ? Legend(props.legendComponent, props.legendProps) : '';
  const submit = props.handleSubmit
    ? MapSubmitButton(props.handleSubmit, props.maxArea > props.totalArea ? 'Submit' : 'Area too large')
    : '';
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
        {submit}
      </div>
    </div>
  );
};

MapComponent.propTypes = {
  center: PropTypes.number,
  circles: PropTypes.arrayOf(PropTypes.object),
  edit: PropTypes.boolean,
  handleSubmit: PropTypes.func,
  height: PropTypes.number,
  includeZipRadius: PropTypes.boolean,
  markerIcon: PropTypes.object,
  legendComponent: PropTypes.function,
  legendProps: PropTypes.object,
  maxArea: PropTypes.number,
  onCreated: PropTypes.function,
  points: PropTypes.arrayOf(PropTypes.object),
  polygons: PropTypes.arrayOf(PropTypes.string),
  rectangles: PropTypes.arrayOf(PropTypes.object),
  setCenter: PropTypes.arrayOf(PropTypes.number),
  style: PropTypes.object,
  submitText: PropTypes.string,
  tileLayerProps: PropTypes.shape({
    attribution: PropTypes.string,
    url: PropTypes.string.isRequired,
  }),
  totalArea: PropTypes.number,
  unit: PropTypes.string,
  zipRadiusChange: PropTypes.function,
  zoom: PropTypes.number,
};

MapComponent.defaultProps = {
  height: 400,
  center: [38.19, -85.76],
  zoom: 11,
};
export default MapComponent;
