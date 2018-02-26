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
  makeCenterLeaflet,
  polygonArrayToProp,
} from './MapHelpers';
import { cleanPoly, cleanPoint } from './clean';
import addArea from './addArea';
import './main.css';
import getBounds from './getBounds';
import defaultIcon from './defaultIcon';
import cleanProps from './cleanProps';

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

  removeListener() {
    const p = cloneDeep(this.props)
    p.remove = !p.remove
    cleanProps(p, this.debouncedOnChange, noop)
  }
  componentDidMount() {
    //cleanProps(this.props, noop);
    //ReactScriptLoader.componentDidMount(this.getScriptLoaderID(), this, this.getScriptUrl());
  }
  /*
  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps, this.props)) cleanProps(nextProps);
  }
  */
  validateShape(_feature) {
    const feature = cloneDeep(_feature);
    const newErrors = this.props.featureValidator(feature);
    if (newErrors.length > 0) feature.properties.errors = newErrors;
    else delete feature.properties.errors;
    return feature;
  }
  // updateShapes called by onCreated callback in Leaflet map
  //
  // e.layer represents the newly created vector layer
  updateShapes(e) {
    console.log("updating shapes", e)
    const p = cloneDeep(this.props)
    const geoJSON = e.layer.toGeoJSON();
    switch (geoJSON.geometry.type) {
    case 'Polygon':
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
    cleanProps(p, this.debouncedOnChange, noop);
  }

  // Sometimes clicking a polygon opens/closes for editing, sometimes it
  // deletes the poly
  clickFeature(e) {
    if (!this.props.edit) return;
    if (this.props.remove) {
      const s = cloneDeep(this.props);
      const key = e.layer.options.uuid;
      const features = filter(s.features, (feat) => key !== feat.properties.key);
      s.features = features;
      cleanProps(s, this.debouncedOnChange, noop);
    } else {
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
      cleanProps(s, this.debouncedOnChange, noop)
    }
  }

  clickPoint(e) {
    const props = cloneDeep(this.props);
    if (!this.props.edit) return;
    if (this.props.remove) {
      const key = e.target.options.uuid;
      const points = filter(this.props.points, (point) => key !== point.properties.key);
      const s = cloneDeep(this.props);
      s.points = points;
      s.legendProps = omit(s, 'legendProps');
      s.remove = false;
      cleanProps(s, this.debouncedOnChange, noop);
    } else {
      const makeCircle = !!this.props.makeCircleOn;
      if (!makeCircle) {
        const newCircleCenter = e.target.toGeoJSON();
        props.makeCircleOn = !makeCircle
        props.newCircleCenter = newCircleCenter
        cleanProps(props, this.debouncedOnChange, noop)
        props.makeCircleOn = !!makeCircle
        cleanProps(props, this.debouncedOnChange, noop)
      }
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
    console.log('zoomin')
    const feats = this.props.features;
    const points = this.props.points;
    if (feats.length > 0 || points.length > 0) {
      const bounds = getBounds(feats, points);
      this.leafletMap.leafletElement.fitBounds(bounds);
      //this.forceUpdate();
    }
  }
  maybeZoomToShapes() {
    console.log(this.props.center)
    console.log(defaultCenter)
    if (isEqual(this.props.center, defaultCenter)) this.zoomToShapes();
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
    cleanProps(this.props, this.debouncedOnChange, noop);
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
        remove={this.props.remove}
        removeAllFeatures={this.removeAllFeatures.bind(this)}
        removeListener={this.removeListener.bind(this)}
        showLocationSelect={this.state.googleAPILoaded}
        setCenterAndZoom={this.setCenterAndZoom.bind(this)}
        viewport={this.state.viewport}
        tileLayerProps={this.state.tileLayerProps}
        totalArea={this.state.totalArea}
        turnOffCircleApprox={this.turnOffCircleApprox.bind(this)}
        unit={this.state.unit}
        zoom={this.state.zoom}
        zoomToShapes={this.maybeZoomToShapes.bind(this)}
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
  makeCircleOn: PropTypes.bool,
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
  makeCircleOn: false,
  zoom: 9,
  remove: false,
};

export default MapContainer;

