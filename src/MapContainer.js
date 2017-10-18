import includes from 'lodash/includes';
import map from 'lodash/map';
import hasIn from 'lodash/hasIn';
import extend from 'lodash/extend';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import isEqual from 'lodash/isEqual';
import filter from 'lodash/filter';
import noop from 'lodash/noop';
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
import { makeGeoJSON } from './ConvertPoly';
import {
  generateIcon,
  expandPolys,
  generateCircleApprox,
  indexByKey,
  areaAccumulator,
  area,
  polygonArrayToProp,
  cleanPoly,
} from './MapHelpers';
import './main.css';
import getCenter from './getCenter';
import convertPoint from './convertPoint';

const makeCenter = (c) => {
  if (c.length === 2) {
    return { lat: c[0], lng: c[1] };
  }
  return c;
};

class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      update: uuid.v4(),
      polygons: [],
      points: [],
      rectangles: [],
      circles: [],
      drawn: {
        polys: [],
        lines: [],
        rects: [],
        circles: [],
        markers: [],
      },
      googleAPILoaded: false,
      edit: false,
      markerIcon: generateIcon(props.iconHTML),
      zipRadiusCenter: [],
      totalArea: 0,
    };
    this.debouncedOnChange = debounce(this.props.onChange, 100);
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
  mapPropsToState(props) {
    const maxArea = this.props.maxArea || Number.MAX_VALUE;
    const unit = this.props.unit || 'miles';
    // Expand any poly collections (FeatureCollections or Google map objects
    // into individual features
    let expandedPolys = [];
    map(props.polygons, (poly) => { expandedPolys = expandedPolys.concat(expandPolys(poly)); });

    // Convert each polygon into GeoJSON with area, then
    // add 'tooLarge' if necc. and add unique key
    const polys = map(expandedPolys, (poly, index) => {
      const out = makeGeoJSON(poly);
      out.properties.key = uuid.v4();
      if (area(unit, out.properties.area) > maxArea) out.properties.tooLarge = true;
      return out;
    });

    // Convert points to GeoJSON, then add polygons for any points
    // that have 'radius' (indicating 'draw a circle around me')
    const points = map(this.props.points, convertPoint);
    map(points, (point) => {
      if (point.properties.radius) {
        const { radius, _unit } = point.properties;
        const center = point.geometry.coordinates;
        const circApprox = (generateCircleApprox(radius, _unit, reverse(center), 24));
        // Do same polygon processing from above to the generated poly
        circApprox.properties.key = uuid.v4();
        if (area(unit, circApprox.properties.area) > maxArea) circApprox.properties.tooLarge = true;
        polys.push(circApprox);
      }
    });


    // Apply changes to state
    this.setState({
      unit,
      legendProps: this.props.legendProps,
      maxArea,
      polygons: polys,
      points,
      rectangles: this.props.rectangles,
      circles: this.props.circles,
      edit: this.props.edit,
      totalArea: area(unit, reduce(polys, areaAccumulator, 0)),
    }, this.zoomToShapes);
  }

  // updateShapes called by onCreated callback in Leaflet map
  // e.layer represents the newly created vector layer
  updateShapes(e) {
    const state = cloneDeep(this.state);
    const { unit, maxArea } = state;
    const geoJson = e.layer.toGeoJSON();
    let gJWithArea = {};
    switch (e.layerType) {
    case 'polygon':
      gJWithArea = makeGeoJSON(geoJson);
      if (area(unit, gJWithArea.properties.area) > maxArea) gJWithArea.properties.tooLarge = true;
      gJWithArea.properties.key = uuid.v4();
      gJWithArea.properties.editable = false;
      state.polygons.push(gJWithArea);
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
    state.totalArea = area(this.state.unit, reduce(state.polygons, areaAccumulator, 0));
    state.edit = false;
    this.debouncedOnChange(state, (err, res) => {
      const s = cloneDeep(state);
      s.legendProps = merge(res, state);
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
    // Actually, don't. onChange will be called when polygons/points are added
    // or removed
  }

  // Sometimes clicking a polygon opens/closes for editing, sometimes it
  // deletes the poly
  clickPoly(e) {
    if (!this.state.edit) return;
    if (this.state.remove) {
      const key = e.layer.options.uuid;
      const polygons = filter(this.state.polygons, (poly) => key !== poly.properties.key);
      this.debouncedOnChange(this.state, (err, res) => {
        const s = cloneDeep(this.state);
        s.polygons = polygons;
        s.totalArea = area(this.state.unit, reduce(polygons, areaAccumulator, 0));
        s.legendProps = omit(merge(res, s), 'legendProps');
        this.setState(s);
      });
      return;
    }
    const key = e.layer.options.uuid;
    const polygons = this.state.polygons;
    const index = indexByKey(polygons, key);
    const editable = polygons[index].properties.editable || false;
    console.log(editable)
    console.log(polygons)
    if (editable) polygons[index] = cleanPoly(e.layer.toGeoJSON());
    polygons[index].properties.editable = !editable;
    this.debouncedOnChange(this.state, (err, res) => {
      const s = cloneDeep(this.state);
      s.polygons = polygons;
      s.totalArea = area(this.state.unit, reduce(polygons, areaAccumulator, 0));
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
  handleSubmit(e) {
    if (!this.props.handleSubmit) return null;
    if (this.props.maxArea && this.state.totalArea > this.props.maxArea.max) return null;
    this.props.handleSubmit(this.state);
    return true;
  }
  onLocationSelect(loc) {
    this.setState({ center: { lat: loc.location.lat, lng: loc.location.lng } });
  }
  radiusChange(e) {
    if (isNaN(e.target.value)) return;
    this.setState({ newCircleRadius: e.target.value });
  }
  makeCircle() {
    const polygons = this.state.polygons;
    const circApprox = (generateCircleApprox(
      this.state.newCircleRadius,
      this.state.unit,
      this.state.newCircleCenter,
      24,
    ));
    circApprox.properties.key = uuid.v4();
    if (area(this.state.unit, circApprox.properties.area) > this.state.maxArea.max) {
      circApprox.properties.tooLarge = true;
    }
    polygons.push(circApprox);
    this.setState({ polygons, makeCircleOn: false });
  }
  turnOffCircleApprox() {
    this.setState({ makeCircleOn: false });
  }
  setCenterAndZoom(e) {
    this.setState({ center: e.center, zoom: e.zoom });
  }
  zoomToShapes() {
    let center;
    const polys = this.state.polygons;
    const points = this.state.points;
    if (polys.length > 0 || points.length > 1) {
      const bounds = getCenter(polys, points);
      this.leafletMap.leafletElement.fitBounds(bounds);
    } else {
      center = makeCenter(this.props.center);
      this.setState({ center });
    }
  }
  render() {
    const {
      tooltipOptions,
    } = this.props;
    const passThroughProps = pick(this.props, [
      'heatmap',
      'height',
      'legendComponent',
      'style',
      'includeZipRadius',
      'tileLayerProps',
      'tooltipOptions',
      'submitButton',
      'update',
    ]);
    return (
      <MapComponent
        bindPoint={this}
        bounds={this.state.bounds}
        circles={this.state.circles}
        clickPoly={this.clickPoly.bind(this)}
        clickPoint={this.clickPoint.bind(this)}
        edit={this.state.edit}
        googleAPILoaded={this.state.googleAPILoaded}
        handleSubmit={this.handleSubmit.bind(this)}
        legendProps={this.state.legendProps}
        makeCircle={this.makeCircle.bind(this)}
        makeCircleOn={this.state.makeCircleOn}
        markerIcon={this.state.markerIcon}
        maxArea={this.state.maxArea || Number.MAX_VALUE}
        onCreated={this.updateShapes.bind(this)}
        onLocationSelect={this.onLocationSelect.bind(this)}
        points={this.state.points}
        polygons={polygonArrayToProp(this.state.polygons)}
        radiusChange={this.radiusChange.bind(this)}
        rectangles={this.state.rectangles}
        refresh={this.state.refresh}
        remove={this.state.remove}
        showLocationSelect={this.state.googleAPILoaded}
        setCenterAndZoom={this.setCenterAndZoom.bind(this)}
        viewport={this.state.viewport}
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
  circles: PropTypes.arrayOf(PropTypes.object),
  edit: PropTypes.bool,
  handleSubmit: PropTypes.func,
  heatmap: PropTypes.array,
  height: PropTypes.number,
  iconHTML: PropTypes.string,
  legendComponent: PropTypes.func,
  maxArea: PropTypes.object,
  onChange: PropTypes.func,
  points: PropTypes.arrayOf(PropTypes.array),
  polygons: PropTypes.arrayOf(PropTypes.object),
  rectangles: PropTypes.arrayOf(PropTypes.object),
  remove: PropTypes.bool,
  style: PropTypes.object,
  submitButton: PropTypes.object,
  tileLayerProps: PropTypes.object,
  tooltipOptions: PropTypes.object,
  zoom: PropTypes.number,
};

MapContainer.defaultProps = {
  onChange: (a, cb) => { cb(); },
  center: { lat: 38.257143, lng: -85.751428 },
};

export default MapContainer;

