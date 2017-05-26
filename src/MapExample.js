import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer, GeoJSON } from 'react-leaflet';

import L from 'leaflet';

import PropTypes from 'prop-types';
import _ from 'lodash';
import 'leaflet/dist/leaflet.css';
import './main.css';

class MapExample extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.polys);
    const height = this.props.height ? this.props.height : 400;
    const { centerLat, centerLong, zoom } = this.props;
    const polys = _.map(this.props.polys, (result, index) => (
      <GeoJSON style={{ color: 'red', fill: true, fillColor: 'red', fillOpacity: 0.45 }} data={result} key={ index }/>
    ));
    return (
        <Map style={{ height }} ref='map' center={[centerLat, centerLong]} minZoom = {3} maxZoom = {19} zoom={zoom}>
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
