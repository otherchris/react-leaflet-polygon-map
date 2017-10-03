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
} from './MapHelpers';
import './main.css';
import getArea from './getArea';
import getCenter from './getCenter';

const indexByUuid = (arr, _uuid) => {
  let index = -1;
  map(arr, (val, ind) => {
    if (val.properties && (val.properties.uuid === _uuid)) index = ind;
  });
  return index;
};

const areaAccumulator = (sum, val) => sum + val.properties.area;
const area = (unit, _area) => {
  let result = _area;
  switch (unit) {
  case 'miles':
    result *= 0.000000386102;
    break;
  default:
    break;
  }
  return result;
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
  componentDidMount() {
    this.mapPropsToState(this.props);
    if (this.props.includeZipRadius) {
      this.setState({
        edit: false,
      });
    }
    ReactScriptLoader.componentDidMount(this.getScriptLoaderID(), this, this.getScriptUrl());
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
  componentDidUpdate() {
    if (this.state.edit) {
      const removeButton = document.getElementsByClassName('leaflet-draw-edit-remove')[0];
      removeButton.onclick = () => {
        const curr = this.state.remove;
        this.setState({ remove: !curr });
      };
      removeButton.className = ('leaflet-draw-edit-remove');
    }
    this.debouncedOnChange(this.state);
  }
  mapPropsToState(props) {
    const { unit, max } = this.props.maxArea || { unit: 'meters', max: Number.MAX_VALUE };
    let expandedPolys = [];
    map(props.polygons, (poly) => { expandedPolys = expandedPolys.concat(expandPolys(poly)); });
    console.log(expandedPolys);
    const polys = map(expandedPolys, (poly, index) => {
      const out = makeGeoJSON(poly);
      out.properties.uuid = uuid.v4();
      out.properties.key = index + 1;
      if (area(unit, out.properties.area) > max) out.properties.tooLarge = true;
      return out;
    });
    const c = getCenter(polys);
    const center = L.latLng(c[0], c[1]);
    this.setState({
      unit,
      center,
      maxArea: max,
      polygons: polys,
      points: this.props.points,
      rectangles: this.props.rectangles,
      circles: this.props.circles,
      edit: this.props.edit,
      totalArea: area(unit, reduce(polys, areaAccumulator, 0)),
    });
  }
  updateShapes(e) {
    const state = cloneDeep(this.state);
    const { unit, maxArea } = state;
    state.edit = false;
    const geoJson = e.layer.toGeoJSON();
    console.log(geoJson);
    let gJWithArea = {};
    if (e.layerType === 'polygon') {
      gJWithArea = getArea(geoJson);
      if (area(unit, gJWithArea.properties.area) > maxArea) gJWithArea.properties.tooLarge = true;
      gJWithArea.properties.uuid = uuid.v4();
      gJWithArea.properties.editable = false;
      gJWithArea.properties.key = this.state.polygons.length + 1;
    }
    switch (e.layerType) {
    case 'polygon':
      state.polygons.push(gJWithArea);
      break;
    case 'marker':
      if (!state.points) state.points = [];
      state.points.push(geoJson);
      break;
    default:
      break;
    }
    state.totalArea = area(this.state.unit, reduce(state.polygons, areaAccumulator, 0));
    this.setState(state);
    this.setState({
      edit: true,
    });
  }
  clickPoly(e) {
    if (!this.state.edit) return;
    if (this.state.remove) {
      const _uuid = e.layer.options.uuid;
      const polygons = filter(this.state.polygons, (poly) => _uuid !== poly.properties.uuid);
      this.setState({ polygons });
      return;
    }
    const _uuid = e.target.options.uuid;
    const polygons = this.state.polygons;
    const index = indexByUuid(polygons, _uuid);
    if (polygons[index] && polygons[index].properties) {
      const editable = polygons[index].properties.editable;
      polygons[index] = getArea(e.layer.toGeoJSON());
      polygons[index].properties.editable = !editable;
      polygons[index].properties.key = -1 * (index + 1);
    }
    this.setState({
      polygons,
      totalArea: area(this.state.unit, reduce(polygons, areaAccumulator, 0)),
    });
  }
  zipRadiusChange(e) {
    const radius = parseFloat(e.target.value);
    if (!isNaN(radius)) {
      this.setState({
        zipRadius: parseFloat(e.target.value),
      });
    } else {
      this.setState({
        zipRadius: 'NaN',
      });
    }
  }
  chooseCenter(e) {
    this.setState({
      zipRadiusCenter: e.layer.toGeoJSON().geometry.coordinates,
    });
  }
  handleSubmit(e) {
    if (this.props.maxArea && this.state.totalArea > this.props.maxArea.max) return;
    this.props.handleSubmit(this.state);
  }
  onLocationSelect(loc) {
    console.log('onLocationSelect', loc);
    this.setState({ center: L.latLng(loc.location.lat, loc.location.lng) });
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
    ]);
    const tileUrl = getTilesUrl(tiles);

    return (
      <MapComponent
        center={this.state.center || L.latLng(35, -83)}
        chooseCenter={this.chooseCenter.bind(this)}
        circles={this.state.circles}
        clickPoly={this.clickPoly.bind(this)}
        edit={this.state.edit}
        googleAPILoaded={this.state.googleAPILoaded}
        handleSubmit={this.props.handleSubmit ? this.handleSubmit.bind(this) : null}
        markerIcon={this.state.markerIcon}
        maxArea={this.state.maxArea}
        onCreated={this.updateShapes.bind(this)}
        onLocationSelect={this.onLocationSelect.bind(this)}
        points={this.state.points}
        polygons={this.state.polygons}
        rectangles={this.state.rectangles}
        remove={this.state.remove}
        tileLayerProps={{ url: tileUrl }}
        unit={this.state.unit}
        zipRadiusCenter={
          this.state.zipRadiusCenter ||
          this.props.zipRadiusCenter ||
          this.state.center
        }
        zipRadiusChange={this.zipRadiusChange.bind(this)}
        zipRadiusClick={''}
        {...passThroughProps}
      />
    );
  }
}

MapContainer.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number),
  circles: PropTypes.arrayOf(PropTypes.object),
  edit: PropTypes.boolean,
  encoding: PropTypes.string,
  handleSubmit: PropTypes.func,
  height: PropTypes.number,
  iconHTML: PropTypes.string,
  includeZipRadius: PropTypes.boolean,
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
  width: PropTypes.number,
  zipRadiusCenter: PropTypes.arrayOf(PropTypes.number),
  zoom: PropTypes.number,
};

MapContainer.defaultProps = {
  onChange: noop,
};

export default MapContainer;

