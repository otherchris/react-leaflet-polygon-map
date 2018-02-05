import map from 'lodash/map';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
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
  cleanPoly,
} from './MapHelpers';
import addArea from './addArea';
import './main.css';
import getBounds from './getBounds';

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
      edit: !!props.edit,
      markerIcon: generateIcon(props.iconHTML),
      totalArea: 0,
      newCircleRadius: 0.1,
    };
    if (typeof props.onShapeChange === 'function') {
      this.debouncedOnChange = debounce(props.onShapeChange, 100);
    }
  }
  getScriptLoaderID() {
    return ReactScriptLoaderMixin.__getScriptLoaderID();
  }
  getScriptUrl() {
    const keyparam = this.props.apikey ? `key=${this.props.apikey}` : '';
    return `https://maps.googleapis.com/maps/api/js?${keyparam}&libraries=places`;
  }
  onScriptLoaded() {
    this.setState({ googleAPILoaded: true });
  }
  onScriptError() {
    this.setState({ googleAPIError: true });
  }
  componentDidMount() {
    this.mapPropsToState(this.props);
    ReactScriptLoader.componentDidMount(this.getScriptLoaderID(), this, this.getScriptUrl());
  }
  componentWillReceiveProps(nextProps) {
    if (
      !isEqual(this.props.features, nextProps.features) ||
      !isEqual(this.props.points, nextProps.points)
    ) {
      this.mapPropsToStateLite(nextProps);
    }
  }
  validateShape(_feature) {
    const feature = cloneDeep(_feature);
    const newErrors = this.props.featureValidator(feature);
    if (newErrors.length > 0) feature.properties.errors = newErrors;
    else delete feature.properties.errors;
    return feature;
  }
  mapPropsToStateLite(props) {
    const center = props.center ? makeCenterLeaflet(makePoint(props.center)) : this.state.center
    const maxAreaEach = props.maxAreaEach || Number.MAX_VALUE;
    const unit = props.unit || 'miles';
    const features = props.features || [];
    const feats = map(features, (feat) => {
      const f = addArea(feat);
      if(f.properties.area > maxAreaEach) {
        f.properties.tooLarge = true;
      }
      feat.properties.key = uuid.v4();
      feat.properties.unit = unit;
      return this.validateShape(feat);
    });
    this.setState({
      features: feats,
      points,
      center,
      totalArea: area(unit, reduce(feats, areaAccumulator, 0)),
    });
  }
  mapPropsToState(props) {
    const center = makeCenterLeaflet(makePoint(props.center))
    const maxAreaEach = props.maxAreaEach || Number.MAX_VALUE;
    const unit = props.unit || 'miles';
    const features = props.features || [];
    // Convert each polygon into GeoJSON with area, then
    // add 'tooLarge' if necc. and add unique key
    const feats = map(features, (feat) => {
      const f = addArea(feat);
      if(f.properties.area > maxAreaEach) {
        f.properties.tooLarge = true;
      }
      feat.properties.key = uuid.v4();
      feat.properties.unit = unit;
      return this.validateShape(feat);
    });
    const zoom = this.props.zoom || null;

    // Apply changes to state
    this.debouncedOnChange(this.state, (err, res) => {
      const old = cloneDeep(this.state);
      const s = merge(old, {
        unit,
        legendProps: this.props.legendProps,
        tileLayerProps: this.props.tileLayerProps,
        maxAreaEach,
        features: feats,
        center,
        zoom,
        edit: this.props.edit,
        totalArea: area(unit, reduce(feats, areaAccumulator, 0)),
      });
      s.legendProps = merge(res, this.state);
      if (this.props.maxAreaEach && (s.totalArea > s.maxAreaEach)) return;
      this.setState(s, this.maybeZoomToShapes);
    });
  }

  // updateShapes called by onCreated callback in Leaflet map
  // e.layer represents the newly created vector layer
  updateShapes(e) {
    const state = cloneDeep(this.state);
    const { unit, maxAreaEach } = state;
    const geoJson = e.layer.toGeoJSON();
    let gJWithArea = {};
    switch (e.layerType) {
    case 'polygon':
      gJWithArea = makeGeoJSON(geoJson);
      if (area(unit, gJWithArea.properties.area) > maxAreaEach) gJWithArea.properties.tooLarge = true;
      gJWithArea.properties.key = uuid.v4();
      gJWithArea.properties.editable = false;
      gJWithArea.properties.unit = unit;
      state.features.push(this.validateShape(gJWithArea));
      break;
    case 'rectangle':
      gJWithArea = makeGeoJSON(geoJson);
      if (area(unit, gJWithArea.properties.area) > maxAreaEach) gJWithArea.properties.tooLarge = true;
      gJWithArea.properties.key = uuid.v4();
      gJWithArea.properties.editable = false;
      gJWithArea.properties.unit = unit;
      state.features.push(this.validateShape(gJWithArea));
      break;
    case 'marker':
      geoJson.properties.key = uuid.v4();
      if (!state.points) state.points = [];
      state.points.push(geoJson);
      state.newCircleCenter = reverse(cloneDeep(geoJson.geometry.coordinates));
      state.makeCircleOn = true;
      break;
    default:
      break;
    }
    state.totalArea = area(this.state.unit, reduce(state.features, areaAccumulator, 0));
    state.edit = false;
    this.debouncedOnChange(state, (err, res) => {
      const s = cloneDeep(state);
      s.legendProps = merge(res, state);
      if (this.props.maxAreaEach && (s.totalArea > s.maxAreaEach)) return;
      this.setState(s);
      this.setState({ edit: true });
    });
  }
  componentDidUpdate() {
    if (this.state.edit) {
      const removeButton = document.getElementsByClassName('leaflet-draw-edit-remove')[0];
      removeButton.onclick = () => {
        const curr = this.state.remove;
        this.setState({ remove: !curr });
      };
      removeButton.className = ('leaflet-draw-edit-remove');
    }
    // Call the debounced version of the onChange prop
    // Actually, don't. onChange will be called when features/points are added
    // or removed
  }

  // Sometimes clicking a polygon opens/closes for editing, sometimes it
  // deletes the poly
  clickFeature(e) {
    if (!this.state.edit) return;
    if (this.state.remove) {
      const key = e.layer.options.uuid;
      const features = filter(this.state.features, (feat) => key !== feat.properties.key);
      const s = cloneDeep(this.state);
      s.features = features;
      this.debouncedOnChange(s, (err, res) => {
        s.totalArea = area(this.state.unit, reduce(features, areaAccumulator, 0));
        s.legendProps = omit(merge(res, s), 'legendProps');
        s.remove = false;
        this.setState(s);
      });
      return;
    }
    const key = e.layer.options.uuid;
    const features = this.state.features;
    const index = indexByKey(features, key);
    const editable = features[index].properties.editable || false;
    if (editable) features[index] = this.validateShape(cleanPoly(e.layer.toGeoJSON()));
    features[index].properties.editable = !editable;
    this.debouncedOnChange(this.state, (err, res) => {
      const s = cloneDeep(this.state);
      s.openFeature = !editable;
      s.features = features;
      s.totalArea = area(this.state.unit, reduce(features, areaAccumulator, 0));
      s.legendProps = omit(merge(res, s), 'legendProps');
      this.setState(s);
    });
  }
  clickPoint(e) {
    if (!this.state.edit) return;
    if (this.state.remove) {
      const key = e.target.options.uuid;
      const points = filter(this.state.points, (point) => key !== point.properties.key);
      this.debouncedOnChange(this.state, (err, res) => {
        const s = cloneDeep(this.state);
        s.points = points;
        s.legendProps = omit(merge(res, s), 'legendProps');
        s.remove = false;
        this.setState(s);
      });
    } else {
      const makeCircle = !!this.state.makeCircleOn;
      if (!makeCircle) {
        const geoJSON = e.target.toGeoJSON();
        const newCircleCenter = reverse(cloneDeep(geoJSON.geometry.coordinates));
        this.setState({ makeCircleOn: !makeCircle, newCircleCenter });
      }
      this.setState({ makeCircleOn: !makeCircle });
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
    const cA = (generateCircleApprox(
      this.state.newCircleRadius,
      this.state.unit,
      this.state.newCircleCenter,
      24,
    ));
    const circApprox = makeGeoJSON(cA);
    circApprox.properties.key = uuid.v4();
    if (area(this.state.unit, circApprox.properties.area) > this.state.maxAreaEach.max) {
      circApprox.properties.tooLarge = true;
    }
    features.push(this.validateShape(circApprox));
    const state = cloneDeep(this.state);
    state.features = features;
    this.debouncedOnChange(state, (err, res) => {
      const s = cloneDeep(state);
      s.features = features;
      s.totalArea = area(state.unit, reduce(features, areaAccumulator, 0));
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
    let center;
    const feats = this.state.features;
    const points = this.state.points;
    if (feats.length > 0 || points.length > 1) {
      const bounds = getBounds(feats, points);
      this.leafletMap.leafletElement.fitBounds(bounds);
    } else {
      center = makePoint(this.props.center);
      this.setState({ center });
    }
  }
  maybeZoomToShapes() {
    if (!this.state.center.lat) this.zoomToShapes();
  }
  removeAllFeatures() {
    const state = cloneDeep(this.state);
    this.debouncedOnChange(state, (err, res) => {
      const s = cloneDeep(state);
      s.features = [];
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
    const {
      tooltipOptions,
    } = this.props;
    const passThroughProps = pick(this.props, [
      'height',
      'legendComponent',
      'style',
      'tooltipOptions',
      'submitButton',
      'update',
    ]);
    return (
      <MapComponent
        bindPoint={this}
        bounds={this.state.bounds}
        center={this.state.center}
        clickFeature={this.clickFeature.bind(this)}
        clickPoint={this.clickPoint.bind(this)}
        edit={this.state.edit}
        googleAPILoaded={this.state.googleAPILoaded}
        legendProps={this.state.legendProps}
        makeCircle={this.makeCircle.bind(this)}
        makeCircleOn={this.state.makeCircleOn}
        markerIcon={this.state.markerIcon}
        maxAreaEach={this.state.maxAreaEach || Number.MAX_VALUE}
        onCreated={this.updateShapes.bind(this)}
        onLocationSelect={this.onLocationSelect.bind(this)}
        onTileSet={this.onTileSet.bind(this)}
        openFeature={this.state.openFeature}
        points={this.state.points}
        features={polygonArrayToProp(this.state.features)}
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
  featureValidator: PropTypes.func,
  height: PropTypes.number,
  iconHTML: PropTypes.string,
  legendComponent: PropTypes.func,
  legendProps: PropTypes.object,
  maxAreaEach: PropTypes.number,
  onShapeChange: PropTypes.func,
  points: PropTypes.array,
  features: PropTypes.arrayOf(PropTypes.object),
  featureValidator: PropTypes.func,
  rectangles: PropTypes.arrayOf(PropTypes.object),
  remove: PropTypes.bool,
  style: PropTypes.object,
  submitButton: PropTypes.object,
  tileLayerProps: PropTypes.object,
  tooltipOptions: PropTypes.object,
  unit: PropTypes.string,
  zoom: PropTypes.number,
};

MapContainer.defaultProps = {
  onShapeChange: (a, cb) => { cb(null, a); },
  featureValidator: () => [],
};

export default MapContainer;

