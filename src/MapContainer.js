import includes from 'lodash/includes';
import map from 'lodash/map';
import hasIn from 'lodash/hasIn';
import extend from 'lodash/extend';
import pick from 'lodash/pick';
import isEqual from 'lodash/isEqual';
import filter from 'lodash/filter';
import noop from 'lodash/noop';
import debounce from 'lodash/debounce';
import reduce from 'lodash/reduce';
import cloneDeep from 'lodash/cloneDeep';
import reverse from 'lodash/reverse';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import L from 'leaflet';
import React from 'react';
import { ReactScriptLoader, ReactScriptLoaderMixin } from 'react-script-loader';
import MapComponent from './MapComponent';
import { makeGeoJSON } from './ConvertPoly';
import {
  getTilesUrl,
  generateIcon,
  expandPolys,
  generateCircleApprox,
  indexByKey,
  areaAccumulator,
  area,
  polygonArrayToProp,
} from './MapHelpers';
import './main.css';
import getArea from './getArea';
import getCenter from './getCenter';
import convertPoint from './convertPoint';

const makeCenter = (c) => {
  if (c.length === 2) {
    return L.latLng(c[0], c[1]);
  }
  return L.latLng(c.lat, c.lng);
};

class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
    const { unit, max } = this.props.maxArea || { unit: 'meters', max: Number.MAX_VALUE };

    // Expand any poly collections (FeatureCollections or Google map objects
    // into individual features
    let expandedPolys = [];
    map(props.polygons, (poly) => { expandedPolys = expandedPolys.concat(expandPolys(poly)); });

    // Convert each polygon into GeoJSON with area, then
    // add 'tooLarge' if necc. and add unique key
    const polys = map(expandedPolys, (poly, index) => {
      const out = makeGeoJSON(poly);
      out.properties.key = uuid.v4();
      if (area(unit, out.properties.area) > max) out.properties.tooLarge = true;
      return out;
    });

    // Convert points to GeoJSON, then add polygons for any points
    // that have 'radius' (indicating 'draw a circle around me')
    const points = map(this.props.points, convertPoint);
    map(points, (point) => {
      if (point.properties.radius) {
        const { radius, _unit, sides } = point.properties;
        const center = point.geometry.coordinates;
        const circApprox = (generateCircleApprox(radius, _unit, reverse(center), sides));
        // Do same polygon processing from above to the generated poly
        circApprox.properties.key = uuid.v4();
        if (area(unit, circApprox.properties.area) > max) circApprox.properties.tooLarge = true;
        polys.push(circApprox);
      }
    });

    // Set the center to the center of all polys
    let center;
    if (polys.length > 0) {
      const c = getCenter(polys);
      center = L.latLng(c[0], c[1]);
    } else {
      center = makeCenter(this.props.center);
    }

    // Apply changes to state
    this.setState({
      unit,
      center,
      maxArea: max,
      polygons: polys,
      points,
      rectangles: this.props.rectangles,
      circles: this.props.circles,
      edit: this.props.edit,
      totalArea: area(unit, reduce(polys, areaAccumulator, 0)),
    });
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
      gJWithArea = getArea(geoJson);
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
    this.setState(state);
    this.setState({
      edit: true,
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
    this.debouncedOnChange(this.state);
  }

  // Sometimes clicking a polygon opens/closes for editing, sometimes it
  // deletes the poly
  clickPoly(e) {
    if (!this.state.edit) return;
    if (this.state.remove) {
      const key = e.layer.options.uuid;
      const polygons = filter(this.state.polygons, (poly) => key !== poly.properties.key);
      this.setState({ polygons });
      return;
    }
    const key = e.layer.options.uuid;
    const polygons = this.state.polygons;
    const index = indexByKey(polygons, key);
    const editable = polygons[index].properties.editable || false;
    if (editable) polygons[index] = getArea(e.layer.toGeoJSON());
    polygons[index].properties.editable = !editable;
    this.setState({
      polygons,
      totalArea: area(this.state.unit, reduce(polygons, areaAccumulator, 0)),
      edit: true,
      refresh: uuid.v4(),
    });
  }
  clickPoint(e) {
    if (!this.state.edit) return;
    if (this.state.remove) {
      const key = e.target.options.uuid;
      const points = filter(this.state.points, (point) => key !== point.properties.key);
      this.setState({ points });
    }
  }

  handleSubmit(e) {
    if (this.props.maxArea && this.state.totalArea > this.props.maxArea.max) return;
    this.props.handleSubmit(this.state);
  }
  onLocationSelect(loc) {
    this.setState({ center: L.latLng(loc.location.lat, loc.location.lng) });
  }
  radiusChange(e) {
    if (isNaN(e.target.value)) return;
    this.setState({ newCircleRadius: e.target.value });
  }
  sidesChange(e) {
    if (isNaN(e.target.value)) return;
    this.setState({ newCircleSides: e.target.value });
  }
  makeCircle() {
    const polygons = this.state.polygons;
    const circApprox = (generateCircleApprox(
      this.state.newCircleRadius,
      this.state.unit,
      this.state.newCircleCenter,
      this.state.newCircleSides,
    ));
    circApprox.properties.key = uuid.v4();
    if (area(this.state.unit, circApprox.properties.area) > this.state.maxArea.max) {
      circApprox.properties.tooLarge = true;
    }
    polygons.push(circApprox);
    console.log(polygons);
    this.setState({ polygons, makeCircleOn: false });
  }
  render() {
    const {
      tooltipOptions,
      tileLayerProps,
      width,
      tiles,
    } = this.props;
    const passThroughProps = pick(this.props, [
      'legendComponent',
      'height',
      'center',
      'style',
      'includeZipRadius',
      'zoom',
      'tooltipOptions',
      'heatmap',
    ]);
    const tileUrl = getTilesUrl(tiles);
    return (
      <MapComponent
        center={this.state.center || L.latLng(35, -83)}
        circles={this.state.circles}
        clickPoly={this.clickPoly.bind(this)}
        clickPoint={this.clickPoint.bind(this)}
        edit={this.state.edit}
        googleAPILoaded={this.state.googleAPILoaded}
        handleSubmit={this.props.handleSubmit ? this.handleSubmit.bind(this) : null}
        makeCircle={this.makeCircle.bind(this)}
        makeCircleOn={this.state.makeCircleOn}
        markerIcon={this.state.markerIcon}
        maxArea={this.state.maxArea}
        onCreated={this.updateShapes.bind(this)}
        onLocationSelect={this.onLocationSelect.bind(this)}
        points={this.state.points}
        polygons={polygonArrayToProp(this.state.polygons)}
        radiusChange={this.radiusChange.bind(this)}
        rectangles={this.state.rectangles}
        refresh={this.state.refresh}
        remove={this.state.remove}
        sidesChange={this.sidesChange.bind(this)}
        tileLayerProps={{ url: tileUrl }}
        totalArea={this.state.totalArea}
        unit={this.state.unit}
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
  encoding: PropTypes.string,
  handleSubmit: PropTypes.func,
  heatmap: PropTypes.object,
  height: PropTypes.number,
  iconHTML: PropTypes.string,
  includeZipRadius: PropTypes.bool,
  legendComponent: PropTypes.func,
  maxArea: PropTypes.object,
  onChange: PropTypes.func,
  points: PropTypes.arrayOf(PropTypes.array),
  polygons: PropTypes.arrayOf(PropTypes.object),
  rectangles: PropTypes.arrayOf(PropTypes.object),
  remove: PropTypes.bool,
  style: PropTypes.object,
  tileLayerProps: PropTypes.object,
  tiles: PropTypes.string,
  tooltipOptions: PropTypes.object,
  width: PropTypes.number,
  zipRadiusCenter: PropTypes.arrayOf(PropTypes.number),
  zoom: PropTypes.number,
};

MapContainer.defaultProps = {
  onChange: noop,
  center: { lat: 38.257143, lng: -85.751428 },
};

export default MapContainer;

