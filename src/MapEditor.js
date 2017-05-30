import PropTypes from 'prop-types';
import React from 'react';
import MapContainer from './MapContainer';

class MapEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      polygons: [],
    };
  }

  render() {
    return (
      <MapContainer polygons={this.state.polys} />
    );
  }
}

export default MapEditor;
