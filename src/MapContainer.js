import extend from 'lodash/extend';
import isEqual from 'lodash/isEqual';
import _ from 'lodash';
import React from 'react';
import MapExample from 'map-example';
import { transformEncodedIntoGeoJSON } from 'transform-to-geojson';
import PropTypes from 'prop-types';

class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { polys: [] };
    this.mapPropsToState = this.mapPropsToState.bind(this);
  }

  componentWillMount() {
    this.mapPropsToState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.mapPropsToState(nextProps);
  }

  mapPropsToState(props) {
    if (this.props.polys.every(entry => (entry.path))) {
      const polys = _.map(this.props.geoZips, (geoZip) => {
        const result = transformEncodedIntoGeoJSON(geoZip.path);
        result.properties.zip = geoZip.zip;
        return result;
      });

      if (!isEqual(polys, this.state.polys)) {
        this.setState({ polys });
      }
    }
  }

  render() {
    return (
      <MapExample polys={this.state.polys} />
    );
  }
}

MapContainer.propTypes = {
  geozips: PropTypes.arrayOf(PropTypes.object),
};

export default MapContainer;
