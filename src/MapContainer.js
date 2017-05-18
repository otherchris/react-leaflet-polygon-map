/**
 * High Order Component - transform data into valid geojson
 *
 * - [ ] accept incomming geojson
 * - [ ] compose merged "polygons" into "FeatureCollection"
 * - [x] accept google maps encoded polygons
 * - [ ] accept google maps polygons (coordinates)
 * - [ ] accept wkbs
 * - [ ] accept wkts
 * - [ ] auto-extract center (if not exist)
 * - [ ] auto-extract zoom (if not exist)
 */
import extend from 'lodash/extend';
import isEqual from 'lodash/isEqual';
import _ from 'lodash';
import React from 'react';
import MapExample from 'map-example';
import { transformEncodedIntoGeojson } from 'transform-to-geojson';
import PropTypes from 'prop-types';

/*export default function Geojsonify(Component) {
  const klass =
*/
class MapContainer extends React.Component {
    constructor(props) {
      super(props);
      // we want to output geojson (if the props translate to it)
      // sometims this is kindof expensive, so we can cache in state
      // but we don't HAVE to
      this.state = { geojsons: null };
      this.mapPropsToState = this.mapPropsToState.bind(this);
    }

    componentWillMount() {
      this.mapPropsToState(this.props);
    }

    componentWillReceiveProps(nextProps) {
      this.mapPropsToState(nextProps);
    }

    // transform whatever we get from props into internal component state
    // this is bascially a "cache" of the tranformed data
    mapPropsToState(props) {
      // TODO take whatever inputs, and construct valid geojson
      // NOTE this can be better done outside of React components, perhaps a utility library
      // eg: extend(geojson, transformPolygonsIntoGeojson(props.polygons))
      if(this.props.geozips.every(entry => (entry.path)))
      {
        const geojsons = _.map(this.props.geozips, (geozip) => {
            const result = transformEncodedIntoGeojson(geozip.path);
            result.properties.zip = geozip.zip;
            return result;
          });

        if (!isEqual(geojsons, this.state.geojsons)) {
          this.setState({ geojsons });
        }
      }
      //if (Object.keys(geojson).length !== 0) {
        // this is kinda expensive, only do this if changes found
        // if (!isEqual(geojsons, this.state.geojsons)) {
        //   this.setState({ geojson: geojsons });
        // }
      // }
    }

    render() {
      return (
        <MapExample geojsons={this.state.geojsons} />
      );
    }
};
  // klass.displayName = `geojsonify(${Component.name})`;
  // return klass;
MapContainer.propTypes = {
    geozips: PropTypes.arrayOf(PropTypes.object)
};

export default MapContainer;
