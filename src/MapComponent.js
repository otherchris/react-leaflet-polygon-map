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
import {
  tooltipMessage,
  circleTooltip,
  rectTooltip,
  pointsTooltip,
  tooltipClass,
} from './tooltipHelpers';
import EditTools from './EditTools';
import MapSubmitButton from './MapSubmitButton';
import './main.css';
import getArea from './getArea';

const style = {
  color: 'red',
  fill: true,
  fillColor: 'red',
  fillOpacity: 0.45,
};
const hoveredStyle = {
  color: 'blue',
  fill: true,
  fillColor: 'blue',
  fillOpacity: 0.45,
};

const RemovePolyBanner = (
  <div className="remove-poly-banner">
    Click a shape to remove.
  </div>
);


const Legend = (LegendComponent, props) => (
  <div className="map-legend">
    <LegendComponent {...props} />
  </div>
);

const MapComponent = (props) => {
  const { zoom, tileLayerProps, center, height, includeZipRadius, tooltipOptions } = props;
  merge(style, props.style);
  merge(hoveredStyle, props.hoveredStyle);
  const polygons = map(props.polygons, (result, index) => {
    const p = result.properties;
    return (
      <GeoJSON
        style={style}
        data={result}
        key={result.key || uuid.v4()}
        uuid={result.properties.uuid || 'none'}
        editable={!!(result.properties && result.properties.editable)}
        onClick={props.clickPoly}
        onMouseOut={(e) => {
          e.layer.setStyle(style);
        }}
        onMouseOver={(e) => {
          e.layer.setStyle(hoveredStyle);
        }}
      >
        <Tooltip className={tooltipClass(tooltipOptions)}>
          <span>
            {props.edit && props.remove ?
              'CLICK TO DELETE' :
              `${tooltipMessage(p, props.tooltipOptions)}`}
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
      <Circle
        {...style}
        data={result}
        key={index}
        center={result.center}
        radius={result.radius}
        area={result.area}
        onMouseOut={(e) => {
          e.target.setStyle(style);
        }}
        onMouseOver={(e) => {
          e.target.setStyle(hoveredStyle);
        }}
      >
        <Tooltip className={tooltipClass(tooltipOptions)}>
          <span>
            {props.edit && props.remove ?
              'CLICK TO DELETE' :
              `${circleTooltip(result, props.tooltipOptions)}`}
          </span>
        </Tooltip>
      </Circle>
    );
  });
  const rectangles = map(props.rectangles, (result, index) => {
    const p = result.properties;
    return (
      <Rectangle
        {...style}
        data={result}
        key={index}
        bounds={result.bounds}
        area={result.area}
        onMouseOut={(e) => {
          e.target.setStyle(style);
        }}
        onMouseOver={(e) => {
          e.target.setStyle(hoveredStyle);
        }}
      >
        <Tooltip className={tooltipClass(tooltipOptions)}>
          <span>
            {props.edit && props.remove ?
              'CLICK TO DELETE' :
              `${rectTooltip(result, props.tooltipOptions)}`}
          </span>
        </Tooltip>
      </Rectangle>
    );
  });
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
        <EditTools {...props} />
        {polygons}
        {points}
        {circles}
        {rectangles}
      </Map>
      <div className="below-map">
        {zipRadiusControl}
        {legend}
        <MapSubmitButton {...props} />
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
  hoveredStyle: PropTypes.object,
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
