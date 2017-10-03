import React, { Component } from 'react';
import L from 'leaflet';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import map from 'lodash/map';
import reverse from 'lodash/reverse';
import 'leaflet/dist/leaflet.css';
import uuid from 'uuid';
import Geosuggest from 'react-geosuggest';
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

const RemovePolyBanner = (
  <div className="remove-poly-banner">
    Click a shape to remove.
  </div>
);

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
const tooltipMessage = (polyProps, tooltipOptions) => {
  if (tooltipOptions && tooltipOptions.includeArea) {
    const unitName = tooltipOptions.units.name ? `Sq ${tooltipOptions.units.name}` : 'Sq Meters';
    const convertedArea = tooltipOptions.units.conversion ?
      polyProps.area * tooltipOptions.units.conversion :
      polyProps.area;
    const areaWithUnit = `${convertedArea.toFixed(4)} ${unitName}`;
    const text = tooltipOptions.text ? tooltipOptions.text : '';
    const tipMessage = `${text} ${areaWithUnit}`;
    return tipMessage;
  }
  if (tooltipOptions && tooltipOptions.includeArea && !tooltipOptions.units) {
    const area = polyProps.area;
    const text = tooltipOptions.text ? tooltipOptions.text : '';
    const tipMessage = `${text} ${area.toFixed(4)} Sq Meters`;
    return tipMessage;
  }
  if (tooltipOptions && !(tooltipOptions.includeArea)) {
    const text = tooltipOptions && tooltipOptions.text ? tooltipOptions.text : '';
    const tipMessage = text;
    return tipMessage;
  }
  const tipMessage = `${polyProps.area.toFixed(4)} Sq Meters`;
  return tipMessage;
};

const circleTooltip = (circleProps, tooltipOptions) => {
  if (tooltipOptions && tooltipOptions.includeArea && tooltipOptions.units) {
    const unitName = tooltipOptions.units.name ? `Sq ${tooltipOptions.units.name}` : 'Sq Meters';
    const convertedArea = tooltipOptions.units.conversion ?
      circleProps.area * tooltipOptions.units.conversion : circleProps.area;
    const areaWithUnit = `${convertedArea.toFixed(4)} ${unitName}`;
    const text = tooltipOptions.text ? tooltipOptions.text : '';
    const tipMessage = `${text} ${areaWithUnit}`;
    return tipMessage;
  }
  if (tooltipOptions && tooltipOptions.includeArea && !tooltipOptions.units) {
    const area = circleProps.area;
    const text = tooltipOptions.text ? tooltipOptions.text : '';
    const tipMessage = `${text} ${area.toFixed(4)} Sq Meters`;
    return tipMessage;
  }
  if (tooltipOptions && !(tooltipOptions.includeArea)) {
    const text = tooltipOptions && tooltipOptions.text ? tooltipOptions.text : '';
    const tipMessage = text;
    return tipMessage;
  }
  const tipMessage = `${circleProps.area.toFixed(4)} Sq Meters`;
  return tipMessage;
};
const rectTooltip = (rectProps, tooltipOptions) => {
  if (tooltipOptions && tooltipOptions.includeArea) {
    const noArea = 'Area cannot be calculated on rectangle';
    const text = tooltipOptions.text ? tooltipOptions.text : '';
    const tipMessage = `${text} ${noArea}`;
    return tipMessage;
  }
  if (tooltipOptions && !(tooltipOptions.includeArea)) {
    const text = tooltipOptions && tooltipOptions.text ? tooltipOptions.text : '';
    const tipMessage = text;
    return tipMessage;
  }
  const tipMessage = 'Area cannot be calculated on rectangle';
  return tipMessage;
};
const pointsTooltip = (point, tooltipOptions) => {
  const coords = point.geometry.coordinates;
  if (tooltipOptions && tooltipOptions.marker && tooltipOptions.marker.includeLocation) {
    const latLng = `${coords[1].toFixed(4)}, ${coords[0].toFixed(4)}`;
    const text = tooltipOptions.marker.text ? tooltipOptions.marker.text : '';
    const tipOpts = `${latLng} ${text}`;
    return tipOpts;
  }
  if (tooltipOptions && tooltipOptions.marker && !(tooltipOptions.marker.includeLocation)) {
    const text = tooltipOptions.marker.text ? tooltipOptions.marker.text : '';
    const tipOpts = `${text}`;
    return tipOpts;
  }
  const latLng = `${coords[1].toFixed(4)}, ${coords[0].toFixed(4)}`;
  return latLng;
};
const tooltipClass = (tooltipOptions) => {
  if (tooltipOptions && tooltipOptions.className) {
    const tipClass = tooltipOptions.className ? `${tooltipOptions.className}` : '';
    return tipClass;
  }
  return 'tooltipClass';
};
const MapComponent = (props) => {
  const { zoom, tileLayerProps, center, height, includeZipRadius, tooltipOptions } = props;
  merge(style, props.style);
  const polyWithArea = map(props.polygons, getArea);
  const polygons = map(polyWithArea, (result, index) => {
    const p = result.properties;
    return (
      <GeoJSON
        style={style}
        data={result}
        key={result.key || uuid.v4()}
        uuid={result.properties.uuid || 'none'}
        editable={!!(result.properties && result.properties.editable)}
        onClick={props.clickPoly}
      >
        <Tooltip className={tooltipClass(tooltipOptions)}>
          <span>
            {tooltipMessage(p, props.tooltipOptions)}
          </span>
        </Tooltip>
      </GeoJSON>
    );
  });
  const points = map(props.points, (result, index) => (
    <Marker position={reverse(result.geometry.coordinates)} key={index} icon={props.markerIcon}>
      <Tooltip className={tooltipClass(tooltipOptions)}>
        <span>{pointsTooltip(result, tooltipOptions)}</span>
      </Tooltip>
    </Marker>
  ));
  const circles = map(props.circles, (result, index) => {
    const p = result.properties;
    return (
      <Circle {...style} data={result} key={index} center={result.center}
        radius={result.radius} area={result.area}>
        <Tooltip className={tooltipClass(tooltipOptions)}>
          <span>
            {circleTooltip(result, props.tooltipOptions)}
          </span>
        </Tooltip>
      </Circle>
    );
  });
  const rectangles = map(props.rectangles, (result, index) => {
    const p = result.properties;
    return (
      <Rectangle {...style} data={result} key={index} bounds={result.bounds} area={result.area}>
        <Tooltip className={tooltipClass(tooltipOptions)}>
          <span>
            {rectTooltip(result, props.tooltipOptions)}
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
    ? MapSubmitButton(props.handleSubmit, props.maxArea > props.totalArea ?
      'Submit' : 'Area too large')
    : '';
  const removePolyBanner = props.edit && props.remove
    ? RemovePolyBanner
    : '';
  return (
    <div>
      <Geosuggest onSuggestSelect={props.onLocationSelect} />
      {removePolyBanner}
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
  clickPoly: PropTypes.func,
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
  remove: PropTypes.bool,
  setCenter: PropTypes.arrayOf(PropTypes.number),
  style: PropTypes.object,
  submitText: PropTypes.string,
  tileLayerProps: PropTypes.shape({
    attribution: PropTypes.string,
    url: PropTypes.string.isRequired,
  }),
  tooltipOptions: PropTypes.object,
  totalArea: PropTypes.number,
  unit: PropTypes.string,
  zipRadiusChange: PropTypes.function,
  zoom: PropTypes.number,
};

MapComponent.defaultProps = {
  height: 400,
  zoom: 11,
};
export default MapComponent;
