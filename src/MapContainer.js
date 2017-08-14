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
    this.state = { polygons: [] };
  }
  componentDidMount() {
    this.mapPropsToState(this.props);
  }
  mapPropsToState(props) {
    console.log('props', props)
    this.setState({
      polygons: _.map(props.polygons, poly => polyline.toGeoJSON(poly)),
      points: this.props.points,
    });
  }
  render() {
    const { tileLayerProps, width, height, zoom, center } = this.props;
    console.log("polygons: ", this.state.polygons)
    return (
      <MapExample
        polygons={this.state.polygons}
        points={this.state.points}
        tileLayerProps={tileLayerProps}
        height={height}
        zoom={zoom}
        center={center}
      />
    );
  }
}

MapContainer.propTypes = {
  polygons: PropTypes.arrayOf(PropTypes.object),
  height: PropTypes.number,
};
export default MapContainer;

