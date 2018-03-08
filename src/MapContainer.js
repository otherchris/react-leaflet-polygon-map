import pick from 'lodash/pick';
import noop from 'lodash/noop';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';
import reduce from 'lodash/reduce';
import cloneDeep from 'lodash/cloneDeep';
import PropTypes from 'prop-types';
import L from 'leaflet';
import React from 'react';
import MapComponent from './MapComponent';
import {
  generateIcon,
  generateCircleApprox,
  areaAccumulator,
  makeCenterLeaflet,
  polygonArrayToProp,
} from './MapHelpers';
import './main.css';
import getBounds from './getBounds';
import defaultIcon from './defaultIcon';
import cleanProps from './cleanProps';

const defaultCenter = makeCenterLeaflet({
  type: 'Point',
  coordinates: [-85.751528, 38.257222],
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
    cleanProps(props, this.debouncedOnChange, noop);
  }
  turnOffCircleApprox() {
    const p = cloneDeep(this.props);
    p.makeCircleOn = false;
    cleanProps(p, this.debouncedOnChange, noop);
  }
  setCenterAndZoom() {
    if (this.leafletMap) {
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
    const { features, points } = this.props;
    if (features.length > 0 || points.length > 0) {
      const bounds = getBounds(features, points);
      this.leafletMap.leafletElement.fitBounds(bounds);
    }
  }
  maybeZoomToShapes() {
    if (isEqual(this.props.center, defaultCenter)) this.zoomToShapes();
  }
  onTileSet(e) {
    const tiles = e.target.id;
    if (tiles === 'street') {
      this.setState({
        tileLayerProps: {
          url: 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        },
      });
    } else {
      this.setState({
        tileLayerProps: {
          url: 'https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        },
      });
    }
  }
  render() {
    cleanProps(this.props, this.debouncedOnChange, noop);
    const passThroughProps = pick(this.props, [
      'bounds',
      'center',
      'edit',
      'featureValidator',
      'force',
      'geolocate',
      'height',
      'legendComponent',
      'legendProps',
      'makeCircleOn',
      'onShapeChange',
      'points',
      'remove',
      'style',
      'tileLayerProps',
      'tooltipOptions',
      'submitButton',
      'zoom',
    ]);
    return (
      <MapComponent
        bindPoint={this}
        makeCircle={this.makeCircle.bind(this)}
        markerIcon={generateIcon(defaultIcon)}
        maxAreaEach={this.state.maxAreaEach || Number.MAX_VALUE}
        onLocationSelect={this.onLocationSelect.bind(this)}
        onTileSet={this.onTileSet.bind(this)}
        openFeature={this.state.openFeature}
        features={polygonArrayToProp(this.props.features)}
        radiusChange={this.radiusChange.bind(this)}
        removeHandler={() => {
          const p = cloneDeep(this.props);
          p.remove = !this.props.remove;
          cleanProps(p, this.props.onShapeChange, noop);
        }}
        showLocationSelect={this.state.googleAPILoaded}
        setCenterAndZoom={this.setCenterAndZoom.bind(this)}
        viewport={this.state.viewport}
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

