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
      p.newCircleCenter = geoJSON;
      p.newCircleRadius = 0.1;
      p.makeCircleOn = true;
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
      const props = cloneDeep(this.props)
      const features = props.features;
      const index = indexByKey(features, key);
      const editable = features[index].properties.editable || false;
      if (editable) features[index] = cleanPoly(e.layer.toGeoJSON(), this.props.maxAreaEach, this.props.featureValidator);
      features[index].properties.editable = !editable;
      props.openFeature = !editable;
      props.features = features;
      props.totalArea = reduce(features, areaAccumulator, 0);
      props.legendProps = omit(props, 'legendProps');
      cleanProps(props, this.debouncedOnChange, noop)
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
    if (!this.props.newCircleRadius || !this.props.newCircleCenter) return;
    const features = cloneDeep(this.props.features);
    const circApprox = (generateCircleApprox(
      this.props.newCircleRadius,
      this.props.unit,
      this.props.newCircleCenter,
      24,
    ));
    if (circApprox.properties.area > this.props.maxAreaEach) {
      circApprox.properties.tooLarge = true;
    }
    const props = cloneDeep(this.props);
    props.features.push(circApprox);
    props.totalArea = reduce(features, areaAccumulator, 0);
    props.makeCircleOn = false;
    props.newCircleRadius = 0.1;
    console.log('with cricle props', props)
    cleanProps(props, this.debouncedOnChange, noop);
  }
  turnOffCircleApprox() {
    const p = cloneDeep(this.props)
    p.makeCircleOn = false;
    cleanProps(p, this.debouncedOnChange, noop);
  }
  setCenterAndZoom() {
    if (this.leafletMap) {
      console.log('leafletmap', this.leafletMap)
      const ctr = cloneDeep(this.leafletMap.leafletElement.getCenter());
      const p = cloneDeep(this.props);
      p.center = {
          type: 'Point',
          coordinates: [ctr.lng, ctr.lat],
      };
      p.zoom = this.leafletMap.leafletElement.getZoom();
    }
  }
  zoomToShapes() {
    console.log('zoomin')
    const feats = this.props.features;
    const points = this.props.points;
    if (feats.length > 0 || points.length > 0) {
      const bounds = getBounds(feats, points);
      this.leafletMap.leafletElement.fitBounds(bounds);
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
        bounds={this.props.bounds}
        center={makeCenterLeaflet(this.props.center)}
        clickFeature={this.clickFeature.bind(this)}
        clickPoint={this.clickPoint.bind(this)}
        googleAPILoaded={this.state.googleAPILoaded}
        legendProps={this.state.legendProps}
        makeCircle={this.makeCircle.bind(this)}
        makeCircleOn={this.props.makeCircleOn}
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
        zoom={this.props.zoom}
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

