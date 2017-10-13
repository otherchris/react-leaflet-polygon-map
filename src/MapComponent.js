import React, { Component } from 'react';
import L from 'leaflet';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import Geosuggest from 'react-geosuggest';
import merge from 'lodash/merge';
import map from 'lodash/map';
import reverse from 'lodash/reverse';
import cloneDeep from 'lodash/cloneDeep';
import { EditControl } from 'react-leaflet-draw';
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
import './leaflet.css';
import './leaflet.draw.css';
import {
  tooltipMessage,
  circleTooltip,
  rectTooltip,
  pointsTooltip,
  tooltipClass,
} from './tooltipHelpers';
import EditTools from './EditTools';
import MapSubmitButton from './MapSubmitButton';
import CircleApprox from './CircleApprox';
import './main.css';
import getArea from './getArea';
import Heatmap from './Heatmap';

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

  // Create Leaflet GeoJSON components from polygons in container state
  const polygons = map(props.polygons, (result, index) => {
    const p = result.properties;
    return (
      <GeoJSON
        style={style}
        data={result}
        key={uuid.v4()}
        uuid={p.key || uuid.v4()}
        editable={p.editable}
        onClick={props.clickPoly}
        onMouseOut={(e) => { e.layer.setStyle(style); }}
        onMouseOver={(e) => { e.layer.setStyle(hoveredStyle); }}
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
  const points = map(props.points, (result, index) => {
    const p = result.properties;
    return (
      <Marker
        key={uuid.v4()}
        uuid={p.key || uuid.v4()}
        position={reverse(cloneDeep(result.geometry.coordinates))}
        icon={props.markerIcon}
        onClick={props.clickPoint}
      >
        <Tooltip className={tooltipClass(tooltipOptions)}>
          <span>
            {props.edit && props.remove ?
              'CLICK TO DELETE' :
              `${pointsTooltip(result, props.tooltipOptions)}`
            }
          </span>
        </Tooltip>
      </Marker>
    );
  });
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
  const heatmap = props.heatmap ? (<Heatmap heatmap={props.heatmap} />) : '';
  const geosuggest = props.showLocationSelect ?
    <Geosuggest onSuggestSelect={props.onLocationSelect} />
    : '';
  const legend = props.legendComponent ? Legend(props.legendComponent, props.legendProps) : '';
  const removePolyBanner = props.edit && props.remove
    ? RemovePolyBanner
    : '';
  const makeCircleApprox = props.makeCircleOn ? (
    <CircleApprox
      radiusChange={props.radiusChange}
      sidesChange={props.sidesChange}
      makeCircle={props.makeCircle}
      turnOff={props.turnOffCircleApprox}
    />
  ) : '';
  return (
    <div>
      {geosuggest}
      {makeCircleApprox}
      {removePolyBanner}
      <Map
        style={{ height }}
        center={center}
        minZoom = {3}
        maxZoom = {19}
        zoom={zoom}
      >
        <TileLayer
          url={tileLayerProps.url}
          attribution={tileLayerProps.attribution}
        />
        <EditTools {...props} />
        {heatmap}
        {polygons}
        {points}
        {circles}
        {rectangles}
      </Map>
      <div className="below-map">
        {legend}
        <MapSubmitButton {...props} />
      </div>
    </div>
  );
};

MapComponent.propTypes = {
  center: PropTypes.object,
  circles: PropTypes.arrayOf(PropTypes.object),
  clickPoly: PropTypes.func,
  edit: PropTypes.bool,
  handleSubmit: PropTypes.func,
  heatmap: PropTypes.object,
  height: PropTypes.number,
  hoveredStyle: PropTypes.object,
  includeZipRadius: PropTypes.bool,
  markerIcon: PropTypes.object,
  legendComponent: PropTypes.func,
  legendProps: PropTypes.object,
  makeCircle: PropTypes.func,
  makeCircleOn: PropTypes.bool,
  maxArea: PropTypes.number,
  onCreated: PropTypes.func,
  onLocationSelect: PropTypes.func,
  points: PropTypes.arrayOf(PropTypes.object),
  polygons: PropTypes.arrayOf(PropTypes.string),
  radiusChange: PropTypes.func,
  rectangles: PropTypes.arrayOf(PropTypes.object),
  refresh: PropTypes.string,
  remove: PropTypes.bool,
  setCenter: PropTypes.arrayOf(PropTypes.number),
  showLocationSelect: PropTypes.bool,
  sidesChange: PropTypes.func,
  style: PropTypes.object,
  submitText: PropTypes.string,
  tileLayerProps: PropTypes.object,
  tooltipOptions: PropTypes.object,
  totalArea: PropTypes.number,
  turnOffCircleApprox: PropTypes.func,
  unit: PropTypes.string,
  zipRadiusChange: PropTypes.func,
  zoom: PropTypes.number,
};

MapComponent.defaultProps = {
  height: 400,
  zoom: 11,
  tileLayerProps: {
    url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
  },
};
export default MapComponent;
