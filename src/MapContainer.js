import map from 'lodash/map';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import noop from 'lodash/noop';
import isEqual from 'lodash/isEqual';
import filter from 'lodash/filter';
import debounce from 'lodash/debounce';
import reduce from 'lodash/reduce';
import cloneDeep from 'lodash/cloneDeep';
import reverse from 'lodash/reverse';
import merge from 'lodash/merge';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import L from 'leaflet';
import React from 'react';
import { ReactScriptLoader, ReactScriptLoaderMixin } from 'react-script-loader';
import MapComponent from './MapComponent';
import {
  generateIcon,
  generateCircleApprox,
  indexByKey,
  areaAccumulator,
  area,
  polygonArrayToProp,
} from './MapHelpers';
import cleanPoly from './cleanPoly';
import addArea from './addArea';
import './main.css';
import getBounds from './getBounds';
import defaultIcon from './defaultIcon';

const validCoordsArray = (arr) =>
  arr &&
  arr.length &&
  arr.length === 2 &&
  arr[0] < 180 &&
  arr[0] > -180 &&
  arr[1] < 90 &&
  arr[1] > -90;

const validLatlngObject = (c) => typeof c.lat === 'number' && typeof c.lng === 'number';
const validGeoJSONPoint = (c) => c.type === 'Point' && validCoordsArray(c.coordinates);
const validGeoJSONPointFeature = (c) => c.type === 'Feature' && validGeoJSONPoint(c.geometry);

export const makePoint = (cee) => {
  const c = cloneDeep(cee);
  if (!c) return { type: 'Point', coordinates: [-85.751528, 38.257222] };
  if (validCoordsArray(c)) return { type: 'Point', coordinates: reverse(c) };
  if (validLatlngObject(c)) return { type: 'Point', coordinates: [c.lng, c.lat] };
  if (validGeoJSONPoint(c)) return c;
  if (validGeoJSONPointFeature(c)) return c.geometry;
  return { type: 'Point', coordinates: [-85.751528, 38.257222] };
};

export const makePoints = (arr) => map(arr, makePoint);

// input a geoJSON point geometry
export const makeCenterLeaflet = (c) => L.latLng(c.coordinates[1], c.coordinates[0]);

const defaultCenter = makeCenterLeaflet({
  type: 'Point',
  coordinates: [-85.751528, 38.257222]
});

class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      center: defaultCenter,
      features: props.features || [],
      points: props.points || [],
      googleAPILoaded: false,
      totalArea: 0,
      newCircleRadius: 0.1,
      zoom: props.zoom || 12,
    };
    if (typeof props.onShapeChange === 'function') {
      this.debouncedOnChange = debounce(props.onShapeChange, 100);
    }
  }

  componentDidMount() {
    //this.cleanProps(this.props, noop);
    //ReactScriptLoader.componentDidMount(this.getScriptLoaderID(), this, this.getScriptUrl());
  }
  /*
  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps, this.props)) this.cleanProps(nextProps);
  }
  */
  validateShape(_feature) {
    const feature = cloneDeep(_feature);
    const newErrors = this.props.featureValidator(feature);
    if (newErrors.length > 0) feature.properties.errors = newErrors;
    else delete feature.properties.errors;
    return feature;
  }
  cleanProps(props, cb) {
    const p = cloneDeep(p);
    const center = makeCenterLeaflet(makePoint(props.center))
    const maxAreaEach = props.maxAreaEach || Number.MAX_VALUE;
    const features = props.features || [];
    const feats = map(features, (x) => cleanPoly(x, this.props.maxAreaEach, this.props.featureValidator));
    const ess = merge(p, {
      features: feats,
      center,
      points: props.points || [],
      totalArea: reduce(feats, areaAccumulator, 0),
      edit: this.props.edit,
    });
    this.debouncedOnChange(ess, cb);
    this.maybeZoomToShapes();
  }

  // updateShapes called by onCreated callback in Leaflet map
  // e.layer represents the newly created vector layer
  updateShapes(e) {
    console.log('updateShapes with: ', e.layer)
    const p = cloneDeep(this.props)
    const geoJSON = e.layer.toGeoJSON();
    switch (geoJSON.geometry.type) {
    case 'Polygon':
      console.log("the polygon: ", geoJSON)
      p.features.push(geoJSON)
      this.leafletMap.leafletElement.removeLayer(e.layer);
      break;
    case 'Point':
      p.points.push(geoJSON)
      this.leafletMap.leafletElement.removeLayer(e.layer);
      break;
    default:
      break;
    }
    p.edit = false;
    console.log('cleaning these props: ', p);
    this.cleanProps(p, noop);
  }

  // Sometimes clicking a polygon opens/closes for editing, sometimes it
  // deletes the poly
  clickFeature(e) {
    if (!this.props.edit) return;
    if (this.props.remove) {
      const key = e.layer.options.uuid;
      const features = filter(this.props.features, (feat) => key !== feat.properties.key);
      const s = cloneDeep(this.props);
      s.features = features;
      this.cleanProps(s, noop);
    }

    const key = e.layer.options.uuid;
    const features = this.props.features;
    const index = indexByKey(features, key);
    const editable = features[index].properties.editable || false;
    if (editable) features[index] = cleanPoly(e.layer.toGeoJSON(), this.props.maxAreaEach, this.props.featureValidator);
    features[index].properties.editable = !editable;
    const s = cloneDeep(this.props);
    s.openFeature = !editable;
    s.features = cloneDeep(features);
    s.totalArea = reduce(features, areaAccumulator, 0);
    s.legendProps = omit(s, 'legendProps');
    this.cleanProps(s, noop)
  }

  clickPoint(e) {
    if (!this.state.edit) return;
    if (this.state.remove) {
      const key = e.target.options.uuid;
      const points = filter(this.props.points, (point) => key !== point.properties.key);
      const s = cloneDeep(this.props);
      s.points = points;
      s.legendProps = omit(s, 'legendProps');
      s.remove = false;
      this.cleanProps(s, noop);
    } else {
    }
  }
  onLocationSelect(loc) {
    const { b, f } = loc.gmaps.geometry.viewport;
    this.setState({ center: { type: 'Point', coordinates: [loc.location.lng, loc.location.lat] } });
    const b1 = L.latLng(f.b, b.b);
    const b2 = L.latLng(f.f, b.f);
    this.leafletMap.leafletElement.fitBounds(L.latLngBounds(b1, b2));
  }
  radiusChange(e) {
    this.setState({ newCircleRadius: e });
  }
  makeCircle() {
    if (!this.state.newCircleRadius || !this.state.newCircleCenter) return;
    const features = this.state.features;
    const circApprox = (generateCircleApprox(
      this.state.newCircleRadius,
      this.state.unit,
      this.state.newCircleCenter,
      24,
    ));
    circApprox.properties.key = uuid.v4();
    if (circApprox.properties.area > this.state.maxAreaEach.max) {
      circApprox.properties.tooLarge = true;
    }
    features.push(this.validateShape(circApprox));
    const state = cloneDeep(this.state);
    state.features = features;
    this.debouncedOnChange(state, (err, res) => {
      const s = cloneDeep(state);
      s.features = features;
      s.totalArea = state.unit, reduce(features, areaAccumulator, 0);
      s.makeCircleOn = false;
      s.legendProps = omit(merge(res, s), 'legendProps');
      s.newCircleRadius = 0.1;
      this.setState(s);
    });
  }
  turnOffCircleApprox() {
    this.setState({ makeCircleOn: false });
  }
  setCenterAndZoom() {
    if (this.leafletMap) {
      const ctr = cloneDeep(this.leafletMap.leafletElement.getCenter());
      this.setState({
        center: {
          type: 'Point',
          coordinates: [ctr.lng, ctr.lat],
        },
        zoom: this.leafletMap.leafletElement.getZoom(),
      });
    }
  }
  zoomToShapes() {
    const feats = this.state.features;
    const points = this.state.points;
    if (feats.length > 0 || points.length > 0) {
      const bounds = getBounds(feats, points);
      this.leafletMap.leafletElement.fitBounds(bounds);
      this.forceUpdate();
    } else {
      this.setState({ center: defaultCenter });
    }
  }
  maybeZoomToShapes() {
    if (!this.props.center) this.zoomToShapes();
  }
  removeAllFeatures() {
    const state = cloneDeep(this.state);
    this.debouncedOnChange(state, (err, res) => {
      const s = cloneDeep(state);
      s.features = [];
      s.points = [];
      s.totalArea = 0;
      s.legendProps = {}; // omit(merge(res, s), 'legendProps');
      this.setState(s);
    });
  }
  onTileSet(e) {
    const tiles = e.target.id;
    if (tiles === 'street')
      this.setState({
        tileLayerProps: {
          url: 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        }
      });
    else {
      this.setState({
        tileLayerProps: {
          url: 'https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        }
      });
    }
  }
  render() {
    this.cleanProps(this.props, noop);
    const {
      tooltipOptions,
    } = this.props;
    const passThroughProps = pick(this.props, [
      'edit',
      'geolocate',
      'height',
      'legendComponent',
      'style',
      'tooltipOptions',
      'submitButton',
      'update',
    ]);
    /*
    console.log('doin layers')
    if (this.leafletMap && this.leafletMap.leafletElement) {
      this.leafletMap.leafletElement.eachLayer((layer) => {
        if (layer._bounds && !(layer.options && layer.options.uuid)) {
          console.log("LAYER REMOVED: ", layer)
          this.leafletMap.leafletElement.removeLayer(layer);
        } else {
          console.log("LAYER NOT REMOVED: ", layer)
        }
      });
    }
    */
    return (
      <MapComponent
        bindPoint={this}
        bounds={this.state.bounds}
        center={this.state.center}
        clickFeature={this.clickFeature.bind(this)}
        clickPoint={this.clickPoint.bind(this)}
        googleAPILoaded={this.state.googleAPILoaded}
        legendProps={this.state.legendProps}
        makeCircle={this.makeCircle.bind(this)}
        makeCircleOn={this.state.makeCircleOn}
        markerIcon={generateIcon(defaultIcon)}
        maxAreaEach={this.state.maxAreaEach || Number.MAX_VALUE}
        onCreated={this.updateShapes.bind(this)}
        onLocationSelect={this.onLocationSelect.bind(this)}
        onTileSet={this.onTileSet.bind(this)}
        openFeature={this.state.openFeature}
        points={this.props.points}
        features={polygonArrayToProp(this.props.features)}
        radiusChange={this.radiusChange.bind(this)}
        refresh={this.state.refresh}
        remove={this.state.remove}
        removeAllFeatures={this.removeAllFeatures.bind(this)}
        showLocationSelect={this.state.googleAPILoaded}
        setCenterAndZoom={this.setCenterAndZoom.bind(this)}
        viewport={this.state.viewport}
        tileLayerProps={this.state.tileLayerProps}
        totalArea={this.state.totalArea}
        turnOffCircleApprox={this.turnOffCircleApprox.bind(this)}
        unit={this.state.unit}
        zoom={this.state.zoom}
        zoomToShapes={this.zoomToShapes.bind(this)}
        {...passThroughProps}
      />
    );
  }
}

MapContainer.propTypes = {
  apikey: PropTypes.string,
  center: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.object,
  ]),
  edit: PropTypes.bool,
  features: PropTypes.arrayOf(PropTypes.object),
  featureValidator: PropTypes.func,
  geolocate: PropTypes.bool,
  height: PropTypes.number,
  legendComponent: PropTypes.func,
  legendProps: PropTypes.object,
  maxAreaEach: PropTypes.number,
  onShapeChange: PropTypes.func,
  points: PropTypes.array,
  remove: PropTypes.bool,
  style: PropTypes.object,
  submitButton: PropTypes.object,
  tileLayerProps: PropTypes.object,
  tooltipOptions: PropTypes.object,
  unit: PropTypes.string,
  zoom: PropTypes.number,
};

MapContainer.defaultProps = {
  center: defaultCenter,
  onShapeChange: (a, cb) => { cb(null, a); },
  features: [],
  points: [],
  featureValidator: () => [],
  zoom: 9,
};

export default MapContainer;

