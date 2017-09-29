import React, { Component } from 'react';
// eslint-disable-next-line max-len
import L from 'leaflet';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import map from 'lodash/map';
import 'leaflet/dist/leaflet.css';
import uuid from 'uuid';
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
    console.log('polyProps', polyProps);
    console.log('tooltipOptions', tooltipOptions);
  if (tooltipOptions && tooltipOptions.includeArea) {
    const unitName = tooltipOptions.units.name ? `Sq ${tooltipOptions.units.name}` : 'Sq Meters';
    const convertedArea = tooltipOptions.units.conversion ? polyProps.area * tooltipOptions.units.conversion : polyProps.area;
    const areaWithUnit = `${convertedArea} ${unitName}`;
    const text = tooltipOptions.text ? tooltipOptions.text : '';
    const tipMessage = `${text} ${areaWithUnit}`;
    return tipMessage;
  }
  if (tooltipOptions && !(tooltipOptions.includeArea)) {
    const text = tooltipOptions && tooltipOptions.text ? tooltipOptions.text : '';
    const tipMessage = text; 
    return tipMessage;
  }
  if (!(tooltipOptions)) {
    const tipMessage = `${polyProps.area} Sq Meters`;
    return tipMessage;
  }
};
const pointsTooltip = (pointProps, tooltipOptions) => {
  if (tooltipOptions && tooltipOptions.marker && tooltipOptions.marker.includeLocation) {
    const latLng = `${pointProps[1].toFixed(4)}, ${pointProps[0].toFixed(4)}`;
    const text = tooltipOptions.marker.text ? tooltipOptions.marker.text : '';
    const tipOpts = `${latLng} ${text}`;
    return tipOpts;
  }
  if (tooltipOptions && tooltipOptions.marker && !(tooltipOptions.marker.includeLocation)) {
    const text = tooltipOptions.marker.text ? tooltipOptions.marker.text : '';
    const tipOpts = `${text}`;
    return tipOpts;
  }
};
const tooltipClass = (tooltipOptions) => {
  if (tooltipOptions && tooltipOptions.className) {
    const tipClass = tooltipOptions.className ? `${tooltipOptions.className}` : '';
    return tipClass;
  }
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
    <Marker position={result} key={index} icon={props.markerIcon}>
      <Tooltip className={tooltipClass(tooltipOptions)}>
        <span>{pointsTooltip(result, tooltipOptions)}</span>
      </Tooltip>
    </Marker>
  ));
  const circles = map(props.circles, (result, index) => {
    const p = result.properties;
    return (
      <Circle {...style} data={result} key={index} center={result.center} radius={result.radius}>
        <Tooltip className={tooltipClass(tooltipOptions)}>
          <span>
            {tooltipMessage(p, props.tooltipOptions)}
          </span>
        </Tooltip>
      </Circle>
    );
  });
  const rectangles = map(props.rectangles, (result, index) => {
    const p = result.properties;
    return (
      <Rectangle {...style} data={result} key={index} center={result.center} radius={result.radius}>
        <Tooltip className={tooltipClass(tooltipOptions)}>
          <span>
            {tooltipMessage(p, props.tooltipOptions)}
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
  const removePolyBanner = props.edit && props.remove
    ? RemovePolyBanner
    : '';
  return (
    <div>
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
