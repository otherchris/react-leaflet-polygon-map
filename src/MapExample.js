import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer, GeoJSON } from 'react-leaflet';

import L from 'leaflet';

import Polyline from 'polyline';
import PropTypes from 'prop-types';
import _ from 'lodash';

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
    const polys = _.map(this.props.zips, (result, index) => (
      <GeoJSON data={polys} key={ index }/>
    ));
    return (
      <Map ref='map' center={[this.state.lat, this.state.lng]} minZoom = {3} maxZoom = {19} zoom={this.state.zoom}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        />
        {polys}
        <Marker position={[this.state.lat, this.state.lng]}>
          <Popup>
             <span>You are here.</span>
          </Popup>
       </Marker>
     </Map>
    );
  }
}

MapExample.propTypes = {
  polys: PropTypes.arrayOf(PropTypes.string),
};

export default MapExample;
