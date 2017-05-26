import extend from 'lodash/extend';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
// import { transformEncodedIntoGeoJSON } from 'transform-to-geojson';
import polyline from 'polyline';
import _ from 'lodash';
import React from 'react';
// an example to try out
import MapExample from './MapExample';

class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { polys: [] };
  }
  componentDidMount() {
    this.mapPropsToState(this.props);
  }
  mapPropsToState(props) {
    this.setState({
      polys: _.map(props.polys, poly => polyline.toGeoJSON(poly)),
    });
  }
  render() {
    const { tileLayerProps, width, height, zoom, centerLat, centerLong } = this.props;
    return (
      <MapExample
        polys={this.state.polys}
        tileLayerProps={tileLayerProps}
        width={width}
        height={height}
        zoom={zoom}
        centerLat={centerLat}
        centerLong={centerLong}
      />
    );
  }
}

MapContainer.propTypes = {
  polys: PropTypes.arrayOf(PropTypes.object),
  height: PropTypes.number,
  width: PropTypes.number,
};

export default MapContainer;

