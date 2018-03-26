import React from 'react';
import MapComponent from './MapComponent';

class MapContainer extends React.Component {
  render() {
    return (
      <MapComponent {...this.props} />
    );
  }
}

export default MapContainer;
