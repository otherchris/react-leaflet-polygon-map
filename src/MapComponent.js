import React from 'react';
import L from 'leaflet';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import Geosuggest from 'react-geosuggest';
import merge from 'lodash/merge';
import map from 'lodash/map';
import reverse from 'lodash/reverse';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import noop from 'lodash/noop';
import 'react-leaflet-fullscreen/dist/styles.css';
import FullscreenControl from 'react-leaflet-fullscreen';
import {
  Map,
  Marker,
  TileLayer,
  GeoJSON,
  Tooltip,
} from 'react-leaflet';
import './leaflet.css';
import './leaflet.draw.css';
import {
  tooltipMessage,
  pointsTooltip,
  tooltipClass,
} from './tooltipHelpers';
import EditTools from './EditTools';
import CircleApprox from './CircleApprox';
import { clickFeature, clickPoint } from './clickShape';
import onTileSet from './onTileSet';
import {
  makeCenterLeaflet,
  removeAllFeatures,
  removeHandler,
  generateIcon,
  polygonArrayToProp,
  zoomToShapes,
} from './MapHelpers';
import defaultIcon from './defaultIcon';
import cleanProps from './cleanProps';
import makeCircle from './makeCircle';
import './main.css';

const defaultCenter ={
  type: 'Point',
  coordinates: [-85.751528, 38.257222],
};

const style = {
  color: 'green',
  fill: true,
  fillColor: 'green',
  fillOpacity: 0.45,
};
const deleteStyle = {
  color: 'red',
  fill: true,
  fillColor: 'red',
  fillOpacity: 0.45,
};
const errorStyle = {
  color: 'red',
  fillColor: 'red',
  dashArray: '1,5',
  fillOpacity: '0.1',
};
const hoveredStyle = {
  color: 'blue',
  fill: true,
  fillOpacity: 0.45,
};

const RemovePolyBanner = (
  <div className="alert alert-info" role="alert">
    Click a shape to remove.
  </div>
);

const Legend = (LegendComponent, props) => (
  <div className="map-legend">
    <LegendComponent {...props} />
  </div>
);

const MapComponent = (props) => {
  const {
    tileLayerProps, height, tooltipOptions = {},
  } = props;
  merge(style, props.style);
  merge(hoveredStyle, props.hoveredStyle);

  // Create Leaflet GeoJSON components from features in container state
  const features = map(polygonArrayToProp(props.features), (result) => {
    const p = cloneDeep(result.properties);
    const thisStyle = cloneDeep(style);
    const thisTooltipOptions = cloneDeep(tooltipOptions);
    if (p.errors && p.errors.length && p.errors.length > 0) {
      merge(thisStyle, errorStyle);
      merge(thisTooltipOptions, {
        tipMessage: p.errors.join(', '),
      });
    }
    if (props.edit && props.remove) {
      merge(thisStyle, deleteStyle);
    }
    return (
      <GeoJSON
        style={thisStyle}
        data={result}
        key={uuid.v4()}
        uuid={p.key || uuid.v4()}
        editable={p.editable}
        onClick={clickFeature.bind(this, props)}
        onMouseOut={(e) => { e.layer.setStyle(thisStyle); }}
        onMouseOver={(e) => { e.layer.setStyle(hoveredStyle); }}
      >
        <Tooltip className={tooltipClass(thisTooltipOptions)}>
          <span>
            {props.edit && props.remove ?
              'CLICK TO DELETE' :
              `${tooltipMessage(p, thisTooltipOptions)}`}
          </span>
        </Tooltip>
      </GeoJSON>
    );
  });
  const points = map(props.points, (result) => {
    const p = result.properties;
    const position = cloneDeep(result.geometry.coordinates);
    reverse(position);
    return (
      <Marker
        key={uuid.v4()}
        uuid={p.key || uuid.v4()}
        position={position}
        icon={props.markerIcon}
        onClick={clickPoint.bind(this, props)}
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
  const geosuggest = props.geolocate ?
    <Geosuggest
      className="geosuggest"
      onSuggestSelect={props.onLocationSelect}
      onClick={(e) => { e.stopPropagation(); }}
      style={{
        input: {
          width: '20rem',
        },
        suggests: {
          listStyle: 'none',
          width: '20rem',
          overflow: 'hidden',
          backgroundColor: 'rgba(247, 247, 247, .8)',
        },
      }}
    />
    : '';
  const legend = props.legendComponent ? Legend(props.legendComponent, props.legendProps) : '';
  const removePolyBanner = props.edit && props.remove
    ? RemovePolyBanner
    : '';
  const makeCircleApprox = props.makeCircleOn ? (
    <CircleApprox
      makeCircle={makeCircle.bind(this, props)}
      {...props}
    />
  ) : '';
  const zoomButton = props.features.length > 0 || props.points.length > 0 ? (
    <button type="button" className="zoom-button btn btn-secondary btn-sm"
      onClick={zoomToShapes.bind(this, props, props.bindPoint.leafletMap)}
    >
      Zoom to shapes
    </button>
  ) : '';
  const removeAllButton = ((props.features.length > 0 || props.points.length > 0) && props.edit) ? (
    <button type="button" className="btn btn-danger btn-sm" onClick={removeAllFeatures.bind(this, props)}>
      Remove all shapes
    </button>
  ) : '';
  const satButton = (
    <button type="button" className="btn btn-secondary btn-sm maps-tiles"
      id="sat" onClick={onTileSet.bind(this, props)}
    >
     Satellite View
    </button>
  );
  const streetButton = (
    <button type="button" className="btn btn-secondary btn-sm maps-tiles"
      id="street" onClick={onTileSet.bind(this, props)}
    >
     Street View
    </button>
  );
  const openFeatureMessage = (props.openFeature) ? (
    <div>
      Click the polygon again to finish editing
    </div>
  ) : '';
  const rH = () => { removeHandler(props); };
  if (props.bindPoint &&
    props.bindPoint.leafletMap &&
    isEqual(props.center, defaultCenter)) {
    zoomToShapes(props, props.bindPoint.leafletMap);
  }
  cleanProps(props, props.onShapeChange, noop);
  return (
    <div>
      {openFeatureMessage}
      <Map
        ref={m => { props.bindPoint.leafletMap = m; setTimeout(props.zoomToShapes, 100); }}
        style={{ height }}
        minZoom = {3}
        maxZoom = {18}
        center = {makeCenterLeaflet(props.center)}
        zoom = {props.zoom || 9}
      >
        {geosuggest}
        {removePolyBanner}
        <TileLayer
          url={tileLayerProps.url}
          attribution={tileLayerProps.attribution}
          subdomains= {tileLayerProps.subdomains}
        />
        <FullscreenControl position="topright" />
        <EditTools {...props} removeHandler={rH}/>
        {features}
        {points}
        <div className="map-btn-group btn-group">
          {zoomButton}
          {removeAllButton}
          {props.tileLayerProps.url === 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}' ?
            satButton :
            streetButton
          }
        </div>
        <div className="map-remove-poly-banner">
          {removePolyBanner}
        </div>
      </Map>
      <div className="map-below-map">
        {legend}
        {props.maxArea < props.totalArea ? 'Area too large, cannot save' : ''}
        {makeCircleApprox}
      </div>
    </div>
  );
};

MapComponent.propTypes = {
  bindPoint: PropTypes.object,
  bounds: PropTypes.array,
  center: PropTypes.object,
  clickPoly: PropTypes.func,
  edit: PropTypes.bool,
  geolocate: PropTypes.bool,
  handleSubmit: PropTypes.func,
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
  onTileSet: PropTypes.func,
  openFeature: PropTypes.bool,
  points: PropTypes.arrayOf(PropTypes.object),
  features: PropTypes.arrayOf(PropTypes.object),
  radiusChange: PropTypes.func,
  refresh: PropTypes.string,
  remove: PropTypes.bool,
  removeAllFeatures: PropTypes.func,
  setCenter: PropTypes.arrayOf(PropTypes.number),
  setCenterAndZoom: PropTypes.func,
  style: PropTypes.object,
  submitText: PropTypes.string,
  tileLayerProps: PropTypes.object,
  tooltipOptions: PropTypes.object,
  totalArea: PropTypes.number,
  unit: PropTypes.string,
  update: PropTypes.string,
  zipRadiusChange: PropTypes.func,
  zoom: PropTypes.number,
  zoomToShapes: PropTypes.func,
};

MapComponent.defaultProps = {
  bindPoint: {},
  center: defaultCenter,
  features: [],
  featureValidator: () => [],
  height: 400,
  makeCircleOn: false,
  markerIcon: generateIcon(defaultIcon),
  onShapeChange: (a, cb) => { cb(null, a); },
  points: [],
  remove: false,
  tileLayerProps: {
    url: 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  },
  zoom: 9,
};
export default MapComponent;
