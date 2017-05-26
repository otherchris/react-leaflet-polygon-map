import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer, GeoJSON } from 'react-leaflet';

import L from 'leaflet';

import Polyline from 'polyline';
import PropTypes from 'prop-types';
import _ from 'lodash';
import 'leaflet/dist/leaflet.css';
import './main.css';

class MapExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 38.195,
      lng: -85.752,
      zoom: 8,
    };
  }

  render() {
    const height = this.props.height ? this.props.height : 400;
    const polys = _.map(this.props.polys, (result, index) => (
      <GeoJSON data={polys} key={ index }/>
    ));
    return (
        <Map style={{ height }} ref='map' center={[this.state.lat, this.state.lng]} minZoom = {3} maxZoom = {19} zoom={this.state.zoom}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          />
          {polys}
        </Map>
    );
  }
}

MapExample.propTypes = {
  polys: PropTypes.arrayOf(PropTypes.string),
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  centerLat: PropTypes.number.isRequired,
  centerLong: PropTypes.number.isRequired,
};

export default MapExample;
